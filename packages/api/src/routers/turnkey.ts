import { router, publicProcedure, authedProcedure } from '../trpc';
import { z } from 'zod';
import { TurnkeyApiTypes, TSignedRequest, TurnkeyClient } from '@turnkey/http';
import { TActivityResponse } from '@turnkey/http/dist/shared';
import { createActivityPoller } from '@turnkey/http';
import { ApiKeyStamper } from '@turnkey/api-key-stamper';
import { TRPCError } from '@trpc/server';
import axios from 'axios';

type TAttestation = TurnkeyApiTypes['v1Attestation'];

type CreateSubOrgRequest = {
  subOrgName: string;
  challenge: string;
  attestation: TAttestation;
};

// Default path for the first Ethereum address in a new HD wallet.
// See https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki, paths are in the form:
//     m / purpose' / coin_type' / account' / change / address_index
// - Purpose is a constant set to 44' following the BIP43 recommendation.
// - Coin type is set to 60 (ETH) -- see https://github.com/satoshilabs/slips/blob/master/slip-0044.md
// - Account, Change, and Address Index are set to 0
const ETHEREUM_WALLET_DEFAULT_PATH = "m/44'/60'/0'/0/0";

export const turnkeyRouter = router({
  subOrg: authedProcedure
    .input(
      z.object({
        subOrgName: z.string(),
        challenge: z.string(),
        attestation: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const supabase = ctx.supabase;
      const createSubOrgRequest = input as CreateSubOrgRequest;

      try {
        const turnkeyClient = new TurnkeyClient(
          { baseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL! },
          new ApiKeyStamper({
            apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
            apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
          })
        );

        const activityPoller = createActivityPoller({
          client: turnkeyClient,
          requestFn: turnkeyClient.createSubOrganization,
        });

        const walletName = `Default ETH Wallet`;

        const completedActivity = await activityPoller({
          type: 'ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V4',
          timestampMs: String(Date.now()),
          organizationId: process.env.TURNKEY_ORGANIZATION_ID!,
          parameters: {
            subOrganizationName: createSubOrgRequest.subOrgName,
            rootQuorumThreshold: 1,
            rootUsers: [
              {
                userName: 'New user',
                apiKeys: [],
                authenticators: [
                  {
                    authenticatorName: 'Passkey',
                    challenge: createSubOrgRequest.challenge,
                    attestation: createSubOrgRequest.attestation,
                  },
                ],
              },
            ],
            wallet: {
              walletName: walletName,
              accounts: [
                {
                  curve: 'CURVE_SECP256K1',
                  pathFormat: 'PATH_FORMAT_BIP32',
                  path: ETHEREUM_WALLET_DEFAULT_PATH,
                  addressFormat: 'ADDRESS_FORMAT_ETHEREUM',
                },
              ],
            },
          },
        });

        const subOrgId = refineNonNull(
          completedActivity.result.createSubOrganizationResultV4
            ?.subOrganizationId
        );

        await supabase
          .from('user_profiles')
          .update({
            turnkey_sub_org: subOrgId,
            wallet_address:
              completedActivity.result.createSubOrganizationResultV4?.wallet
                ?.addresses[0],
            turnkey_wallet_id:
              completedActivity.result.createSubOrganizationResultV4?.wallet
                ?.walletId,
          })
          .eq('id', ctx.user?.id);

        return { subOrgId: subOrgId };
      } catch (e) {
        console.error(e);

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong.',
        });
      }
    }),

  createKey: authedProcedure
    .input(
      z.object({
        body: z.string(),
        stamp: z.any(),
        url: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log('turnkeyRouter.createKey');
      const supabase = ctx.supabase;
      let signedRequest = input as TSignedRequest;

      try {
        const activityResponse = await axios.post(
          signedRequest.url,
          signedRequest.body,
          {
            headers: {
              [signedRequest.stamp.stampHeaderName]:
                signedRequest.stamp.stampHeaderValue,
            },
          }
        );

        if (activityResponse.status !== 200) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `expected 200, got ${activityResponse.status}`,
          });
        }

        let response = activityResponse.data as TActivityResponse;
        let attempts = 0;
        while (attempts < 3) {
          if (response.activity.status != 'ACTIVITY_STATUS_COMPLETED') {
            const stamper = new ApiKeyStamper({
              apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
              apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
            });
            const client = new TurnkeyClient(
              { baseUrl: process.env.NEXT_PUBLIC_TURNKEY_API_BASE_URL! },
              stamper
            );
            response = await client.getActivity({
              organizationId: response.activity.organizationId,
              activityId: response.activity.id,
            });

            attempts++;
          } else {
            const privateKeys =
              response.activity.result.createPrivateKeysResultV2?.privateKeys;

            // XXX: sorry for the ugly code! We expect a single key / address returned.
            // If we have more than one key / address returned, or none, this would break.
            const address = privateKeys
              ?.map((pk) => pk.addresses?.map((addr) => addr.address).join(''))
              .join('');
            const privateKeyId = privateKeys
              ?.map((pk) => pk.privateKeyId)
              .join('');

            const t = await supabase
              .from('user_profiles')
              .update({ wallet_address: address })
              .eq('id', ctx.user?.id);

            console.log('turnkeyRouter.createKey.t: ', t);

            console.log('turnkeyRouter.createKey.address: ', address);

            return {
              message: 'successfully created key',
              address: address,
              privateKeyId: privateKeyId,
            };
          }
        }
      } catch (e) {
        console.log('GOTCHA');
        console.error(e);

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Something went wrong, caught error: ${e}`,
        });
      }
    }),
});

function refineNonNull<T>(
  input: T | null | undefined,
  errorMessage?: string
): T {
  if (input == null) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: errorMessage ?? `Unexpected ${JSON.stringify(input)}`,
    });
  }

  return input;
}
