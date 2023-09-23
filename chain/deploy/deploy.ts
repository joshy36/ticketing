import { Database } from './../../database.types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { createClient } from '@supabase/supabase-js';
import { ethers } from 'hardhat';
import { parseEther } from 'ethers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const ALCHEMY_API_KEY = process.env.ALCHEMY_DEV_API_KEY!;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  // id of event to deploy contract for
  const id = '38560cee-7240-4fc6-a030-9df0eea3ad9a';

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

  const numberOfTickets = data.tickets_remaining;

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

  // MINT TOKENS
  //   const contract = new ethers.Contract(etherscanLink, deployment.abi);

  //   const url = 'https://mainnet.base.org';
  // const provider = new ethers.providers.JsonRpcProvider(url);

  //   // const provider = new AlchemyProvider(null, ALCHEMY_API_KEY);

  //   const transaction = await contract.safeMint('asdfsda');
  //   await transaction.wait();

  console.log(`Event with name ${name} deployed`);
};
export default func;
func.tags = ['Event'];
