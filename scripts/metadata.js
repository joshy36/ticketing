const path = require('path');
const fs = require('fs');
const { filesFromPaths } = require('files-from-path');
const { createClient } = require('@supabase/supabase-js');
const { NFTStorage } = require('nft.storage');
require('dotenv').config();

// Make sure to update based on environment
const API_KEY = process.env.NFT_STORAGE_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// prod vs local

async function uploadMetadataImage(id) {
  console.log('Starting image ipfs upload...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data } = await supabase
    .from('events')
    .select()
    .eq('id', id)
    .limit(1)
    .single();

  if (!data.image) {
    console.log('No image to upload!');
    return;
  }

  const imageOriginUrl = data?.image;

  const r = await fetch(imageOriginUrl);
  if (!r.ok) {
    console.log(`error fetching image: ${r.status}`);
    return;
  }
  const imageBlob = await r.blob();

  const client = new NFTStorage({ token: API_KEY });
  const image = await client.storeBlob(imageBlob);

  const ipfsUrl = 'https://ipfs.io/ipfs/' + image;

  const { data: upload } = await supabase
    .from('events')
    .update({ ipfs_image: ipfsUrl })
    .eq('id', id);

  console.log('Metadata URI: ', ipfsUrl);
  console.log('Finished uploading image to ipfs!\n');
}

async function uploadFullMetadata(id) {
  await uploadMetadataImage(id);
  console.log('Starting full metadata ipfs upload...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data } = await supabase
    .from('tickets')
    .select()
    .eq('event_id', id)
    .order('seat', { ascending: true });

  const { data: event } = await supabase
    .from('events')
    .select()
    .eq('id', id)
    .limit(1)
    .single();

  if (!event?.ipfs_image) {
    console.error('Need an image on ipfs!');
    return;
  }

  console.log(data);

  // Set token ids in database
  for (let i = 0; i < data.length; i++) {
    const { error } = await supabase
      .from('tickets')
      .update({ token_id: i })
      .eq('id', data[i].id);
  }

  const seats = data.map((x) => x.seat);
  const folder = `eventMetadata/${id}`;

  const localFolderPath = path.join(__dirname, folder);

  if (!fs.existsSync(localFolderPath)) {
    fs.mkdirSync(localFolderPath, { recursive: true });
  }

  for (let i = 0; i < seats.length; i++) {
    const dataToWrite = {
      name: event.name,
      description: event.description,
      image: event.ipfs_image,
      attributes: [{ seat: seats[i] }],
    };

    const jsonData = JSON.stringify(dataToWrite, null, 2);

    fs.writeFileSync(folder + `/${i}`, jsonData);
  }

  const files = await filesFromPaths([folder]);

  console.log(files);

  const storage = new NFTStorage({ token: API_KEY });

  const cid = await storage.storeDirectory(files);

  const status = await storage.status(cid);
  console.log(status);
  const baseUrl = 'https://ipfs.io/ipfs/' + cid;
  console.log('IPFS Base Url: ' + baseUrl);

  const { data: uploadUrlData } = await supabase
    .from('events')
    .update({ base_url: baseUrl })
    .eq('id', id);

  console.log('Finished uploading full metadata to ipfs!');

  /* 
  current flow:
  - create event
  - locally run node metadata.js to generate metadata and put it on IPF
    - this script also updates the db with the correct token ids
  - locally deploy contract
  */
}

const args = process.argv.slice(2); // Remove the first two elements
if (args.length < 1) {
  console.log('Need event id!');
} else {
  uploadFullMetadata(args[0]);
}
