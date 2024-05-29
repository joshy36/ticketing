const path = require('path');
const fs = require('fs');

/**
 * Uploads full metadata for an event to IPFS, including ticket information.
 * @async
 * @function uploadFullMetadata
 * @param {number} id - The ID of the event for which full metadata is being uploaded.
 * @param {string} metadataType - The type of metadata being uploaded. Can be 'ticket', 'sbt', or 'collectible'.
 * @param {object} supabase - The Supabase client.
 * @param {object} objectManager - The ObjectManager from the Filebase SDK.
 * @returns {Promise<void>} A promise that resolves once the upload is complete.
 */
async function uploadFullMetadata(id, metadataType, supabase, objectManager) {
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

  const { data: eventMetadata } = await supabase
    .from('events_metadata')
    .select()
    .eq('event_id', id)
    .limit(1)
    .single();

  // if (metadataType == 'ticket') {
  //   if (!event?.ipfs_image) {
  //     console.error('Need an image on ipfs!');
  //     return;
  //   }
  // } else if (metadataType == 'sbt') {
  //   if (!eventMetadata?.sbt_ipfs_image) {
  //     console.error('Need an image on ipfs!');
  //     return;
  //   }
  // } else if (metadataType == 'collectible') {
  //   if (!eventMetadata?.collectible_ipfs_image) {
  //     console.error('Need an image on ipfs!');
  //     return;
  //   }
  // }

  const seats = tickets.map((x) => x.seat);
  const folder = `eventMetadata/${id}/${metadataType}`;
  const filesToUpload = [];

  const localFolderPath = path.join(__dirname, folder);

  if (!fs.existsSync(localFolderPath)) {
    fs.mkdirSync(localFolderPath, { recursive: true });
  }

  for (let i = 0; i < seats.length; i++) {
    const dataToWrite = {
      name: event.name,
      description: event.description,
      image: event.ipfs_image,
      attributes: [{ seat: seats[i], type: metadataType }],
    };
    const jsonData = JSON.stringify(dataToWrite, null, 2);
    const filePath = path.join(localFolderPath, `${i}`);
    const fileContent = Buffer.from(jsonData);

    // Write the file to the file system
    fs.writeFileSync(filePath, fileContent);

    // Write the file to the current directory
    const currentDirFilePath = path.join(__dirname, `${i}`);
    fs.writeFileSync(currentDirFilePath, fileContent);

    // Add the file to the upload array with absolute path
    filesToUpload.push({
      path: `/${i}`,
      content: fileContent,
    });
  }

  // Upload Object
  const objectName = `${metadataType}-${id}`;
  const uploadedObject = await objectManager.upload(objectName, filesToUpload);
  const cid = uploadedObject.cid;
  const ipfsUrl = `https://ipfs.io/ipfs/${cid}`;
  console.log('IPFS Base Url: ' + ipfsUrl);

  for (let i = 0; i < seats.length; i++) {
    const currentDirFilePath = path.join(__dirname, `${i}`);
    fs.unlinkSync(currentDirFilePath);
  }

  if (metadataType == 'ticket') {
    await supabase.from('events').update({ base_url: ipfsUrl }).eq('id', id);
  } else if (metadataType == 'sbt') {
    await supabase
      .from('events_metadata')
      .update({ sbt_base_url: ipfsUrl })
      .eq('event_id', id);
  } else if (metadataType == 'collectible') {
    await supabase
      .from('events_metadata')
      .update({ collectible_base_url: ipfsUrl })
      .eq('event_id', id);
  }

  console.log('Finished uploading full metadata to ipfs!');
}
module.exports = uploadFullMetadata;
