import { Database } from 'supabase';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';

const ALCHEMY_GOERLI_URL = process.env.ALCHEMY_GOERLI_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  // CHANGE
  const id = '3ff38f66-326f-4b5c-ae8f-c0ea236ac409';
  // CHANGE
  const env: string = 'local';

  let SUPABASE_URL: string;
  let SUPABASE_ANON_KEY: string;
  if (env == 'local') {
    SUPABASE_URL = process.env.LOCAL_NEXT_PUBLIC_SUPABASE_URL!;
    SUPABASE_ANON_KEY = process.env.LOCAL_NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  } else {
    SUPABASE_URL = process.env.PROD_NEXT_PUBLIC_SUPABASE_URL!;
    SUPABASE_ANON_KEY = process.env.PROD_NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  }
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data: event } = await supabase
    .from('events')
    .select()
    .eq('id', id)
    .limit(1)
    .single();

  const { data: sbt } = await supabase
    .from('sbts')
    .select()
    .eq('event_id', id)
    .limit(1)
    .single();

  if (!sbt?.base_url) {
    console.log('No baseUrl yet!');
    return;
  }

  const { count: numberOfTickets } = await supabase
    .from('tickets')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', id);

  const name = event?.name;
  const symbol = event?.name.substring(0, 2);
  const baseUri = event?.base_url;

  const deployment = await deploy('SBT', {
    from: deployer!,
    args: [name, symbol, baseUri],
    log: true,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });

  const etherscanLink =
    'https://goerli.basescan.org/address/' + deployment.address;

  await supabase
    .from('sbts')
    .update({ etherscan_link: etherscanLink })
    .eq('event_id', id);

  console.log(`SBT with name ${name} deployed to ${etherscanLink}`);

  // MINT TOKENS
  const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const eventContract = new ethers.Contract(
    deployment.address,
    deployment.abi,
    signer
  );

  let tx = await eventContract.mint(numberOfTickets);
  await tx.wait();
  console.log(
    `NFTs Minted! Check it out at: https://goerli.basescan.org/tx/${tx.hash}`
  );
};
export default func;
func.tags = ['SBT'];
