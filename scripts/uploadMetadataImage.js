/**
 * Uploads an image to IPFS and updates the metadata in a Supabase table.
 * @async
 * @function uploadMetadataImage
 * @param {number} id - The ID of the event for which the image is being uploaded.
 * @param {string} metadataType - The type of metadata being uploaded. Can be 'ticket', 'sbt', or 'collectible'.
 * @param {object} supabase - The Supabase client.
 * @param {object} nftClient - The NFT Storage client.
 * @returns {Promise<void>} A promise that resolves once the upload is complete.
 */
async function uploadMetadataImage(id, metadataType, supabase, nftClient) {
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
  const image = await nftClient.storeBlob(imageBlob);
  const ipfsUrl = 'https://ipfs.io/ipfs/' + image;

  if (metadataType == 'ticket') {
    await supabase.from('events').update({ ipfs_image: ipfsUrl }).eq('id', id);
  } else if (metadataType == 'sbt') {
    await supabase
      .from('sbts')
      .update({ ipfs_image: ipfsUrl })
      .eq('event_id', id);
  } else if (metadataType == 'collectible') {
    await supabase
      .from('collectibles')
      .update({ ipfs_image: ipfsUrl })
      .eq('event_id', id);
  }

  console.log('Metadata URI: ', ipfsUrl);
  console.log('Finished uploading image to ipfs!\n');
}
module.exports = uploadMetadataImage;
