/**
 * Uploads an image to IPFS and updates the metadata in a Supabase table.
 * @async
 * @function uploadMetadataImage
 * @param {number} id - The ID of the event for which the image is being uploaded.
 * @param {string} metadataType - The type of metadata being uploaded. Can be 'ticket', 'sbt', or 'collectible'.
 * @param {object} supabase - The Supabase client.
 * @param {object} objectManager - The ObjectManager from the Filebase SDK.
 * @returns {Promise<void>} A promise that resolves once the upload is complete.
 */
async function uploadMetadataImage(id, metadataType, supabase, objectManager) {
  console.log('Starting image ipfs upload...');
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
  console.log('Image blob:', imageBlob);

  // Upload Object
  const objectName = `image-${id}`;
  const uploadedObject = await objectManager.upload(objectName, imageBlob);
  // Download Object
  const ob = await uploadedObject.download();
  const ipfsRootsValue = ob.headers['x-ipfs-roots'];
  const ipfsUrl = `https://ipfs.io/ipfs/${ipfsRootsValue}`;

  if (metadataType == 'ticket') {
    await supabase.from('events').update({ ipfs_image: ipfsUrl }).eq('id', id);
  } else if (metadataType == 'sbt') {
    const { data: eventMetadata } = await supabase
      .from('events_metadata')
      .select()
      .eq('event_id', id)
      .single();
    if (!eventMetadata) {
      await supabase
        .from('events_metadata')
        .insert({ event_id: id, sbt_ipfs_image: ipfsUrl });
    } else {
      await supabase
        .from('events_metadata')
        .update({ sbt_ipfs_image: ipfsUrl })
        .eq('event_id', id);
    }
  } else if (metadataType == 'collectible') {
    const { data: eventMetadata } = await supabase
      .from('events_metadata')
      .select()
      .eq('event_id', id)
      .single();
    if (!eventMetadata) {
      await supabase
        .from('events_metadata')
        .insert({ event_id: id, collectible_ipfs_image: ipfsUrl });
    } else {
      await supabase
        .from('events_metadata')
        .update({ collectible_ipfs_image: ipfsUrl })
        .eq('event_id', id);
    }
  }

  console.log('Image IPFS Link: ', ipfsUrl);
  console.log('Finished uploading image to IPFS!\n');
}
module.exports = uploadMetadataImage;
