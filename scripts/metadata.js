const { createClient } = require('@supabase/supabase-js');
const { NFTStorage } = require('nft.storage');
const uploadMetadataImage = require('./uploadMetadataImage');
const uploadFullMetadata = require('./uploadFullMetadata');
require('dotenv').config();

const API_KEY = process.env.NFT_STORAGE_API_KEY;
let SUPABASE_URL;
let SUPABASE_ANON_KEY;

/* 
  current flow:
  - create event
  - locally run node metadata.js to generate metadata and put it on IPFS
  - locally deploy contract
  */
const main = async () => {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Need event id!');
  } else if (args.length < 2) {
    console.log('Please specify env!');
    return;
  } else if (
    args.length < 3 ||
    (args[2] != 'ticket' && args[2] != 'sbt' && args[2] != 'collectible')
  ) {
    console.log('Please specify ticket, sbt, or collectible!');
    return;
  } else {
    if (args[1] == 'local') {
      SUPABASE_URL = process.env.LOCAL_NEXT_PUBLIC_SUPABASE_URL;
      SUPABASE_ANON_KEY = process.env.LOCAL_NEXT_PUBLIC_SUPABASE_ANON_KEY;
    } else if (args[1] == 'prod') {
      SUPABASE_URL = process.env.PROD_NEXT_PUBLIC_SUPABASE_URL;
      SUPABASE_ANON_KEY = process.env.PROD_NEXT_PUBLIC_SUPABASE_ANON_KEY;
    } else {
      console.log('Accepted envs: local or prod');
      return;
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const nftClient = new NFTStorage({ token: API_KEY });
    await uploadMetadataImage(args[0], args[2], supabase, nftClient);
    await uploadFullMetadata(args[0], args[2], supabase, nftClient);
  }
};

main();
