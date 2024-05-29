const { createClient } = require('@supabase/supabase-js');
const uploadMetadataImage = require('./uploadMetadataImage');
const uploadFullMetadata = require('./uploadFullMetadata');
const {
  BucketManager,
  ObjectManager,
  NameManager,
  GatewayManager,
  PinManager,
} = require('@filebase/sdk');
// https://filebase.github.io/filebase-sdk/

require('dotenv').config();

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
    const objectManager = new ObjectManager(
      process.env.S3_KEY,
      process.env.S3_SECRET,
      {
        bucket: 'ticketing-event-metadata',
      }
    );
    await uploadMetadataImage(args[0], args[2], supabase, objectManager);
    await uploadFullMetadata(args[0], args[2], supabase, objectManager);
  }
};

main();
