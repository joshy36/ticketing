import { Database } from './../../database.types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const ALCHEMY_API_KEY = process.env.ALCHEMY_DEV_API_KEY!;
const ALCHEMY_GOERLI_URL = process.env.ALCHEMY_GOERLI_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  // id of event to deploy contract for
  const id = '5c94e68b-28e6-4a49-bd97-786a829d05d6';

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data } = await supabase
    .from('events')
    .select()
    .eq('id', id)
    .limit(1)
    .single();

  if (!data?.base_url) {
    console.log('No baseUrl yet!');
    return;
  }

  const numberOfTickets = data.tickets_remaining!;

  const name = data.name;
  const symbol = data.name.substring(0, 2);
  const baseUri = data.base_url;

  const deployment = await deploy('Event', {
    from: deployer!,
    args: [name, symbol, baseUri],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const etherscanLink =
    'https://goerli.basescan.org/address/' + deployment.address;

  const { data: updateData } = await supabase
    .from('events')
    .update({ etherscan_link: etherscanLink })
    .eq('id', id);

  console.log(`Event with name ${name} deployed to ${etherscanLink}`);

  // MINT TOKENS

  // const network = new ethers.Network('base-goerli', 84531);
  // console.log(network.name);
  // const provider = new ethers.AlchemyProvider(network, ALCHEMY_API_KEY);
  const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const eventContract = new ethers.Contract(
    deployment.address,
    deployment.abi,
    signer
  );

  for (let i = 0; i < numberOfTickets; i++) {
    // @ts-ignore
    let tx = await eventContract?.safeMint(signer.address);
    await tx.wait();
    console.log(
      `NFT Minted! Check it out at: https://goerli.basescan.org/tx/${tx.hash}`
    );
  }
};
export default func;
func.tags = ['Event'];
