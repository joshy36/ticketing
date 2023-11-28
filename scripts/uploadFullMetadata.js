const path = require('path');
const fs = require('fs');
const { filesFromPaths } = require('files-from-path');

/**
 * Uploads full metadata for an event to IPFS, including ticket information.
 * @async
 * @function uploadFullMetadata
 * @param {number} id - The ID of the event for which full metadata is being uploaded.
 * @param {string} metadataType - The type of metadata being uploaded. Can be 'ticket', 'sbt', or 'collectible'.
 * @param {object} supabase - The Supabase client.
 * @param {object} nftClient - The NFT Storage client.
 * @returns {Promise<void>} A promise that resolves once the upload is complete.
 */
async function uploadFullMetadata(id, metadataType, supabase, nftClient) {
  console.log('Starting full metadata ipfs upload...');
  const { data: tickets } = await supabase
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

  const { data: sbt } = await supabase
    .from('sbts')
    .select()
    .eq('event_id', id)
    .limit(1)
    .single();

  const { data: collectible } = await supabase
    .from('collectibles')
    .select()
    .eq('event_id', id)
    .limit(1)
    .single();

  if (metadataType == 'ticket') {
    if (!event?.ipfs_image) {
      console.error('Need an image on ipfs!');
      return;
    }
  } else if (metadataType == 'sbt') {
    if (!sbt?.ipfs_image) {
      console.error('Need an image on ipfs!');
      return;
    }
  } else if (metadataType == 'collectible') {
    if (!collectible?.ipfs_image) {
      console.error('Need an image on ipfs!');
      return;
    }
  }

  console.log(tickets);
  const seats = tickets.map((x) => x.seat);
  const folder = `eventMetadata/${id}/${metadataType}`;

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
  const cid = await nftClient.storeDirectory(files);
  const status = await nftClient.status(cid);
  console.log(status);
  const baseUrl = 'https://ipfs.io/ipfs/' + cid;
  console.log('IPFS Base Url: ' + baseUrl);

  if (metadataType == 'ticket') {
    await supabase.from('events').update({ base_url: baseUrl }).eq('id', id);
  } else if (metadataType == 'sbt') {
    await supabase
      .from('sbts')
      .update({ base_url: baseUrl })
      .eq('event_id', id);
  } else if (metadataType == 'collectible') {
    await supabase
      .from('collectibles')
      .update({ base_url: baseUrl })
      .eq('event_id', id);
  }

  console.log('Finished uploading full metadata to ipfs!');
}
module.exports = uploadFullMetadata;
