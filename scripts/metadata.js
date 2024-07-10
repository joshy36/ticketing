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

// const items = [
//   { name: 'Item 65', id: '0b446b80-c5c4-413d-bbc0-44fb10b98316' },
//   { name: 'Item 66', id: '496c1cdb-f27d-4be7-a121-cbf99b096804' },
//   { name: 'Item 67', id: '69672c70-9c2e-47b8-ac49-c1321f84c25d' },
//   { name: 'Item 68', id: '491a5632-e1ad-4b4e-bc1b-970b9bef3166' },
//   { name: 'Item 69', id: '527343c8-c975-4e44-8f0f-33e3c221b651' },
//   { name: 'Item 70', id: 'e4c516d0-2eff-4803-87e8-92a70eff7028' },
//   { name: 'Item 71', id: '154e1104-c194-4763-b2ec-e04f763916aa' },
//   { name: 'Item 72', id: '76cc4ed2-f065-4718-90e4-039da1efbed9' },
//   { name: 'Item 73', id: 'ce1d6082-e3f4-430a-8d30-e2a62d8a401e' },
//   { name: 'Item 74', id: '4757ea1a-72e9-4df3-a1e2-ba858acce4e6' },
//   { name: 'Item 1', id: 'e8e08bc5-2327-42a4-9d85-592c5177acbe' },
//   { name: 'Item 2', id: 'cde80971-6618-4da7-b97f-0b4113cb8353' },
//   { name: 'Item 3', id: '3fb4fdb6-0677-413e-a067-3562d0fb6c2a' },
//   { name: 'Item 4', id: '271b4ab7-a18d-4dea-8707-ea5f632cd587' },
//   { name: 'Item 5', id: '49a173b0-5510-47f2-a8dd-b3c4860a4c8e' },
//   { name: 'Item 6', id: '2eab6551-cbce-4d1f-8258-7251b252249a' },
//   { name: 'Item 7', id: '286b1d9c-b925-4dc0-a4b4-af6b233e5b55' },
//   { name: 'Item 8', id: '4c856134-3aaf-40bb-b6e7-fb512890ca5c' },
//   { name: 'Item 9', id: 'd938d0df-d024-4d04-93e8-99c1670447c9' },
//   { name: 'Item 10', id: 'f9d84f81-0d61-4a3e-8e54-502ce909f726' },
//   { name: 'Item 11', id: '474db67e-dc9a-40f8-8464-91d18cc91eac' },
//   { name: 'Item 12', id: '2bc597bf-d57d-44a0-b9ef-cc3c43c3e5b3' },
//   { name: 'Item 13', id: 'f66f51da-3824-414b-9e53-9692e0f03e74' },
//   { name: 'Item 14', id: 'ff64dee7-2d4c-45d6-af01-34d2bace9d69' },
//   { name: 'Item 15', id: '2e2efbb6-db71-440c-8a7b-a6bb3dc3638b' },
//   { name: 'Item 16', id: '69dc3e15-7dfc-48de-97a4-b3339b679151' },
//   { name: 'Item 17', id: 'ca05f09c-3d8d-4c28-9392-ace204691219' },
//   { name: 'Item 18', id: '553e6b30-f8f5-49ff-ad38-1699485716bb' },
//   { name: 'Item 19', id: '4c19eead-382d-48ef-ad93-e7f03525e880' },
//   { name: 'Item 20', id: '294346d3-00da-4346-bcbd-dab5dfe915b7' },
//   { name: 'Item 21', id: 'f1758da6-3bc2-47e8-840c-c7aaea1959d2' },
//   { name: 'Item 22', id: '34e68f86-c151-486c-abd4-8cb662155ba4' },
//   { name: 'Item 23', id: '2a48d8e2-a7f0-4849-9fa6-f2be7ee53b34' },
//   { name: 'Item 24', id: '387dbbee-eb0a-494c-85cd-ca93254a97e6' },
//   { name: 'Item 25', id: '3edeb118-f6a3-4809-b644-33f2ab4a0346' },
//   { name: 'Item 26', id: '16ea669f-2f80-4e61-923c-c7c1272a6bd2' },
//   { name: 'Item 27', id: '5be19e45-846f-4402-a180-f2c42c17a24c' },
//   { name: 'Item 28', id: '7c28e6b3-675a-48ac-925b-481d2ab32b5c' },
//   { name: 'Item 29', id: 'd5a71f38-3c30-45c1-9822-069f99032e9f' },
//   { name: 'Item 30', id: '090a52ca-c0b8-4a90-b7c6-2ca9fb3c191d' },
//   { name: 'Item 31', id: 'fc46a9a9-5a8c-4e86-85ca-b1b2245547f9' },
//   { name: 'Item 32', id: '94b955b7-43dd-4a17-baee-ba8848a730df' },
//   { name: 'Item 33', id: '6650034e-3756-407b-b09a-fc542a0fa66b' },
//   { name: 'Item 34', id: '8fbf0531-ed92-4f3a-a20f-88804ff24ca4' },
//   { name: 'Item 35', id: '720a13d7-d81b-4729-adef-e650106a534b' },
//   { name: 'Item 36', id: 'a2853058-ee8f-4f94-8c23-89c5789ac295' },
//   { name: 'Item 37', id: '064b447d-659a-45f5-9751-9f857c5dec8c' },
//   { name: 'Item 38', id: '66c6057d-80c2-4e63-99a6-30f70d3f96f0' },
//   { name: 'Item 39', id: 'f75528f3-4ce9-4b48-83bf-676a761e73fe' },
//   { name: 'Item 40', id: 'b5765eb9-c54d-4b61-972e-81dfed65b19b' },
//   { name: 'Item 41', id: '054483cf-0345-4508-abea-4f8ce87a35a2' },
//   { name: 'Item 42', id: 'f40e900e-be7f-4d59-accf-b89fffab9c47' },
//   { name: 'Item 43', id: '3198d9f5-6a77-4e43-a355-213a44d81e8a' },
//   { name: 'Item 44', id: '0090ab43-1d5a-42d6-8944-3f2061071a39' },
//   { name: 'Item 45', id: '2df68455-f88c-4bd7-8735-6c0ef376d5c3' },
//   { name: 'Item 46', id: '70276911-37e5-4708-88a4-a3e994f9ac37' },
//   { name: 'Item 47', id: '7ca6cbe8-3479-46d9-aab6-71b6a2d46682' },
//   { name: 'Item 48', id: '764253aa-f605-4a26-8ff6-6a443708cbd5' },
//   { name: 'Item 49', id: '199f3685-d246-4266-84c0-a7182543dcaa' },
//   { name: 'Item 50', id: 'ff140dd7-16c0-475c-b789-91c15e91f1b9' },
//   { name: 'Item 51', id: '3fc06600-95fd-477b-a4aa-e5a5b73862c5' },
//   { name: 'Item 52', id: '203f1907-3543-423e-b11c-4bb11f29dbd1' },
//   { name: 'Item 53', id: '28e9da08-b16c-4d03-8d49-6eb7ba0bfd00' },
//   { name: 'Item 54', id: '38ee8654-8d6e-4c69-85f9-c3669e8e2cbe' },
//   { name: 'Item 55', id: 'abba1af7-568e-4fd9-8206-fb50d945e794' },
//   { name: 'Item 56', id: '80e35519-10f5-4543-b587-534b9dfb5579' },
//   { name: 'Item 57', id: 'a559fb4d-1f99-4654-ad10-241d8b839004' },
//   { name: 'Item 58', id: '11b98472-777a-4138-809f-15046d95ccf2' },
//   { name: 'Item 59', id: '90099ef0-74d7-41d6-a6c9-b75fee478219' },
//   { name: 'Item 60', id: 'be21e97a-05af-4308-8c7d-3e126c489179' },
//   { name: 'Item 61', id: 'f5f1d8bf-6b6f-4478-b3a6-c6dda02a6aa5' },
//   { name: 'Item 62', id: '89e4a67d-9180-48dd-902f-a0506a2216e3' },
//   { name: 'Item 63', id: '215ca513-9bdf-4cb1-97df-6dc51703e7e1' },
//   { name: 'Item 64', id: '30fe2a31-b106-4741-b4bf-e8672d580f37' },
//   { name: 'Item 75', id: '4a2f1cf1-95fe-44ee-9ed5-9c5db0c105e4' },
//   { name: 'Item 76', id: 'bd894ce2-f230-4d52-8fdb-a99b93a3fdeb' },
//   { name: 'Item 77', id: 'd79fda47-f9ae-4d11-941e-7ab49e8f1765' },
//   { name: 'Item 78', id: '4daab749-991a-4fc9-bc4c-6f9cc947acb8' },
//   { name: 'Item 79', id: '643499f7-4906-439e-9b49-3c58ba621100' },
//   { name: 'Item 80', id: '35ca2a4b-b57c-4fab-b611-edec11a3842f' },
//   { name: 'Item 81', id: '3a94a258-e689-4e79-8964-0ab76a022459' },
//   { name: 'Item 82', id: 'e6e124bc-05e5-4597-bc74-0f303ce382db' },
//   { name: 'Item 83', id: 'd6062188-e39a-4b13-a996-cc7be363f3e3' },
//   { name: 'Item 84', id: '37448d02-0801-4eed-9bf7-788e1e08544d' },
//   { name: 'Item 85', id: 'd26db5ef-8aa8-4892-8191-9e29d23bc0e7' },
//   { name: 'Item 86', id: '8fb11103-ee3e-4ba5-a851-a1484514c601' },
//   { name: 'Item 87', id: '0eca9b9c-0709-4bb6-ab94-6477099b75eb' },
//   { name: 'Item 88', id: 'b44b80df-864d-4468-97e6-38d34bb42cae' },
//   { name: 'Item 89', id: '9994dd18-7cb3-4642-af72-e777c4b224f8' },
//   { name: 'Item 90', id: 'd21e366c-0660-4290-9eaa-14ef7105af53' },
//   { name: 'Item 91', id: 'cc943092-9cfc-4769-9270-9f7bd4666cb2' },
//   { name: 'Item 92', id: '1ca0736d-4b90-46db-80ca-1ab21fcb8f82' },
//   { name: 'Item 93', id: 'ae86dde5-7107-4ade-aee1-7f7911f428f6' },
//   { name: 'Item 94', id: 'a005a28d-1111-4eaf-a6bc-d03265ff619e' },
//   { name: 'Item 95', id: '6bcc5df0-46b3-4272-95e3-3b8c5f819bed' },
//   { name: 'Item 96', id: '2f551db1-1784-4393-9368-6fc8f97d17b3' },
//   { name: 'Item 97', id: '7659ae07-a45e-40be-b14e-5b6268b99d47' },
//   { name: 'Item 98', id: '248dbfa6-7153-4b2b-b54a-9db822c17ee6' },
//   { name: 'Item 99', id: '38e89e15-b93c-4943-a13e-34d50aaf9d8c' },
//   { name: 'Item 100', id: '30cfdc84-fa8f-46e4-a217-777588c33a98' },
//   { name: 'Item 101', id: '26205f2f-df26-47e4-ac6e-095c165634f4' },
//   { name: 'Item 102', id: 'e75ebe2b-2b2f-4fdd-bc35-8008c527ee26' },
//   { name: 'Item 103', id: 'bae16488-108c-4ce7-a81f-bb43136ceaed' },
//   { name: 'Item 104', id: 'a206cf41-4117-4316-855f-5a87ad06a4e6' },
//   { name: 'Item 105', id: 'b8fcc593-090f-463f-8a32-a61827b48c89' },
//   { name: 'Item 106', id: '2dbe4ff4-088e-4cd0-a824-5fceaad32dab' },
//   { name: 'Item 107', id: 'eb9a15de-0c0a-41a0-9190-50a407d3a67b' },
//   { name: 'Item 108', id: '7a19a0f5-a98d-4c80-8653-c4cac385e7d5' },
//   { name: 'Item 109', id: '9c64ede6-3476-43bd-b12e-e6757ffa91bd' },
//   { name: 'Item 110', id: '9ae78344-5742-496b-a037-9a70ea3e6a12' },
//   { name: 'Item 111', id: '48fb5e16-aee8-4eda-8283-ae2603a88a1b' },
//   { name: 'Item 112', id: 'bab72d88-7ed1-413e-a27a-4a785c30d5de' },
//   { name: 'Item 113', id: '1ffad676-eb9d-4b93-ae4a-9872860c8004' },
//   { name: 'Item 114', id: '13e31401-8d01-4372-9c33-ca196584386a' },
//   { name: 'Item 115', id: '501eac33-9951-47ff-abca-85c5543dad3e' },
//   { name: 'Item 116', id: 'e2c9758e-c680-4284-b69c-b561df371a04' },
//   { name: 'Item 117', id: '630f1d10-c87e-4480-bd9e-3b1d190702af' },
//   { name: 'Item 118', id: '9aa9d738-45a4-4bca-a49f-d924160eb3d0' },
//   { name: 'Item 119', id: 'a5a9108f-ab6e-41ae-a61f-f29b934b2cb6' },
//   { name: 'Item 120', id: '3f44175c-93c4-4bee-a8b3-10be191f3271' },
//   { name: 'Item 121', id: '1eb3114e-ee43-4060-9d30-d3be6ff9e362' },
//   { name: 'Item 122', id: 'dcc26bfa-4508-4cae-9615-9cb812a8cfac' },
//   { name: 'Item 123', id: '27b71c66-7f91-4eba-b28f-7ab0f3e0addc' },
//   { name: 'Item 124', id: 'ff577a26-4de8-476e-aea4-8ce7a794dc7f' },
//   { name: 'Item 125', id: '40de20f5-f55d-4a8f-86f7-c1ce1a90a209' },
//   { name: 'Item 126', id: '62b9419e-f881-4e71-bee6-9a102bb1c3f1' },
//   { name: 'Item 127', id: 'a5c5530b-2bea-42c2-b61e-5f38f4d349a5' },
//   { name: 'Item 128', id: '756837da-401c-4187-9920-9465c87f9cea' },
//   { name: 'Item 129', id: 'd215ad9d-284a-42f7-9d97-b469f8f512f3' },
//   { name: 'Item 130', id: '71ac71d2-2e9c-4a5a-863c-4acde263b9ac' },
//   { name: 'Item 131', id: '04a35020-4460-4abc-a962-1f20ba3fde96' },
//   { name: 'Item 132', id: '57fac5be-2076-4d81-a7ba-ca6387872746' },
//   { name: 'Item 133', id: '691cd6ea-7a3e-4b44-95ef-16d533250df6' },
//   { name: 'Item 134', id: '3b1916db-8106-4c47-bdc9-3ec5f06c14f4' },
//   { name: 'Item 135', id: '945fa48c-035a-4d64-8f2b-23a1756d4d67' },
//   { name: 'Item 136', id: '9549cccd-9ab6-4569-9c96-230d1df19fae' },
//   { name: 'Item 137', id: '98b6507b-566b-4295-8738-c42f6d6302fb' },
//   { name: 'Item 138', id: 'c594e68c-9497-4776-b41c-6a3d7eb81d05' },
//   { name: 'Item 139', id: '74d67166-7750-49ef-b911-1a5c48add25b' },
//   { name: 'Item 140', id: '2f60402c-c50f-4b0d-8111-2bd93ec3e269' },
//   { name: 'Item 141', id: 'e030853b-2b39-4fce-aec5-6016f3b96bb8' },
//   { name: 'Item 142', id: 'bbf8a439-9c8f-4d0b-baa2-51c9b878f821' },
//   { name: 'Item 143', id: '97b34a8f-f34b-439f-89bf-e9c64adf4e74' },
//   { name: 'Item 144', id: '0483a3a8-37fd-4777-be76-fb6801e77fd9' },
//   { name: 'Item 145', id: '20cef282-8842-4222-9a84-5f6c1702cc7e' },
//   { name: 'Item 146', id: 'd2d830c2-ebea-45bf-97ef-77bd7600fbae' },
//   { name: 'Item 147', id: '4737d09e-d881-497a-b03e-670258bbbfd0' },
//   { name: 'Item 148', id: 'ca575cf2-4834-4168-b90f-d8b3e91bd365' },
//   { name: 'Item 149', id: '36a2aea4-1999-4b35-826b-8f4d8c35b1f8' },
//   { name: 'Item 150', id: 'e6e9f922-6ae6-4f79-8ca3-b12e65a97258' },
//   { name: 'Item 151', id: '8be6e7f4-4ed5-49c2-b5f1-2df1f8b6c961' },
//   { name: 'Item 152', id: '65ae9f6a-64a2-47ed-8ea1-4333d2941264' },
//   { name: 'Item 153', id: '101e3bd2-655c-4449-9afb-2e7bb16c2ee5' },
//   { name: 'Item 154', id: '47993f52-c739-451a-81ed-5688ea21201e' },
//   { name: 'Item 155', id: 'ed78ab77-aff7-4ca0-8309-484e28c001ca' },
//   { name: 'Item 156', id: 'fea41eb3-468a-41c1-b789-705ef2fd7886' },
//   { name: 'Item 157', id: '8d392d62-0e97-4475-808f-0ee86ff902eb' },
//   { name: 'Item 158', id: '11d56716-3fc8-4246-a3fc-57308f17b1c4' },
//   { name: 'Item 159', id: '6ac519b1-5239-4916-b0a4-a8a11143f03e' },
//   { name: 'Item 160', id: '5e8c73f0-a4c7-4243-8450-9cb8ea82494a' },
//   { name: 'Item 161', id: '1d3d7df3-af27-4aa5-866f-da897e54105c' },
//   { name: 'Item 162', id: '663c7baa-b0f9-473e-91d6-b3ed1d87f073' },
//   { name: 'Item 163', id: 'fc02004a-44a4-47f6-a849-ff24a2735e16' },
//   { name: 'Item 164', id: '58f17a76-1b2a-4a0c-a3fa-604bcc75244b' },
//   { name: 'Item 165', id: '8ccce40e-fecf-4202-a819-66e3554c96ad' },
//   { name: 'Item 166', id: '48ad91e5-c793-42a9-8fb5-b2abfa4d5e86' },
//   { name: 'Item 167', id: 'eb840040-3606-4629-bc7f-bd070c523b2b' },
//   { name: 'Item 168', id: '428d6f8a-b0ee-48c0-b967-ef9ff6f3c53f' },
//   { name: 'Item 169', id: '4c733db8-a010-4823-9f31-4ffe6cc56591' },
//   { name: 'Item 170', id: 'e5787c70-2318-473a-8f02-38b4ad64db79' },
//   { name: 'Item 171', id: 'ca8eb1eb-2c8b-44fe-9175-603e0fb01080' },
//   { name: 'Item 172', id: 'aaa4e297-e8b0-42d3-9754-942dfe298511' },
//   { name: 'Item 173', id: '49db6205-41bc-481e-8590-bb20168b270b' },
//   { name: 'Item 174', id: 'a2cf22c9-8496-4ebd-bc10-0127a59254e1' },
//   { name: 'Item 175', id: 'd8c63e3d-8219-4428-8659-a6a2c2cedb7b' },
//   { name: 'Item 176', id: '6c0c2a13-a96b-4455-9f12-d62f1556e203' },
//   { name: 'Item 177', id: '8f93816a-995c-4aaa-9874-cffd8fa55d86' },
//   { name: 'Item 178', id: 'a15f3fa4-d1f2-410f-a7b4-8ddbfa307c52' },
//   { name: 'Item 179', id: '606f4856-4812-47e9-96c8-41874b6393a9' },
//   { name: 'Item 180', id: '7aa591e4-2f62-4609-80db-d7a8a817e468' },
//   { name: 'Item 181', id: 'e245885f-275f-4c0d-a6c8-dc9a63289252' },
//   { name: 'Item 182', id: '48a8f70f-ffa5-4f49-81f7-17b7bef06d5d' },
//   { name: 'Item 183', id: '4b61fe58-1320-46eb-b0d2-d65e14c21483' },
//   { name: 'Item 184', id: '4810596a-f8ab-45b6-99e7-e2d2d649ab7f' },
//   { name: 'Item 185', id: '113b6ce9-c14a-4b27-80df-ca33f0abd1dd' },
//   { name: 'Item 186', id: '72fdcae4-a768-471c-bdd5-99423ffc8075' },
//   { name: 'Item 187', id: 'c48ddbf4-7009-4a20-a011-e4483b562376' },
//   { name: 'Item 188', id: '049912e2-90b8-44fd-a771-b3f699fdf386' },
//   { name: 'Item 189', id: '641a65dd-f064-44ff-a9c7-18e33b8d85e1' },
//   { name: 'Item 190', id: 'c00793be-45dc-4671-8e55-fca86754198f' },
//   { name: 'Item 191', id: 'b65d552d-52e7-4107-9d1a-57585a0b2823' },
//   { name: 'Item 192', id: '7e9b096d-c9e6-4400-9c24-23c1e75a515d' },
//   { name: 'Item 193', id: 'd1087199-4ffb-4c2f-b083-a9952476e6a2' },
//   { name: 'Item 194', id: '45a796b0-a43d-4977-b95e-71e62910575a' },
//   { name: 'Item 195', id: '62c4091d-9f1f-4c59-b4dd-363cfbb36385' },
//   { name: 'Item 196', id: 'e4aebc13-b10a-477f-b064-7d79696be825' },
//   { name: 'Item 197', id: '5952d5fd-5236-4aa6-abbf-d9d539e9fe92' },
//   { name: 'Item 198', id: '520df1b3-471b-4bed-be0b-fb0147b805f5' },
//   { name: 'Item 199', id: '2dec12b9-f9fa-4874-a18b-040f35a6fad7' },
//   { name: 'Item 200', id: '126d86aa-4d62-44a8-bb20-94fe81271450' },
// ];

// const fetch = require('node-fetch');

// // Function to delete a single item
// async function deleteItem(id, token) {
//   try {
//     const response = await fetch(
//       `https://reverseengineerthissite.com/api/delete-challenge-two-item/${id}`,
//       {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (response.status === 204) {
//       console.log(`Item ${id} deleted successfully`);
//     } else if (response.status === 404) {
//       console.log(`Item ${id} not found`);
//     } else {
//       console.log(`Error deleting item ${id}: ${response.status}`);
//       console.log(await response.text());
//     }
//   } catch (error) {
//     console.error(`Error deleting item ${id}:`, error);
//   }
// }

// // Main function to delete all items
// async function deleteAllItems() {
//   const token = 'ca49af19-4c31-42e0-9ce4-f8b252eb1c55';

//   try {
//     // Delete items one by one
//     for (const item of items) {
//       await deleteItem(item.id, token);
//     }

//     console.log('All items have been processed');
//   } catch (error) {
//     console.error('An error occurred:', error);
//   }
// }

// // Run the script
// deleteAllItems();

// const codes = [
//   {
//     index: 48,
//     encoded: 'OA==',
//   },
//   {
//     index: 41,
//     encoded: 'ZA==',
//   },
//   {
//     index: 47,
//     encoded: 'Nw==',
//   },
//   {
//     index: 119,
//     encoded: 'YQ==',
//   },
//   {
//     index: 133,
//     encoded: 'Mw==',
//   },
//   {
//     index: 162,
//     encoded: 'Yg==',
//   },
//   {
//     index: 108,
//     encoded: 'NA==',
//   },
//   {
//     index: 23,
//     encoded: 'MQ==',
//   },
//   {
//     index: 52,
//     encoded: 'Mg==',
//   },
//   {
//     index: 163,
//     encoded: 'OQ==',
//   },
//   {
//     index: 65,
//     encoded: 'MQ==',
//   },
//   {
//     index: 128,
//     encoded: 'OA==',
//   },
//   {
//     index: 44,
//     encoded: 'NA==',
//   },
//   {
//     index: 68,
//     encoded: 'Nw==',
//   },
//   {
//     index: 67,
//     encoded: 'Nw==',
//   },
//   {
//     index: 177,
//     encoded: 'MA==',
//   },
//   {
//     index: 106,
//     encoded: 'YQ==',
//   },
//   {
//     index: 71,
//     encoded: 'Yg==',
//   },
//   {
//     index: 100,
//     encoded: 'Mg==',
//   },
//   {
//     index: 144,
//     encoded: 'YQ==',
//   },
//   {
//     index: 199,
//     encoded: 'ZA==',
//   },
//   {
//     index: 125,
//     encoded: 'MQ==',
//   },
//   {
//     index: 93,
//     encoded: 'Nw==',
//   },
//   {
//     index: 85,
//     encoded: 'Mw==',
//   },
//   {
//     index: 30,
//     encoded: 'Ng==',
//   },
//   {
//     index: 7,
//     encoded: 'MA==',
//   },
//   {
//     index: 107,
//     encoded: 'OQ==',
//   },
//   {
//     index: 37,
//     encoded: 'NQ==',
//   },
//   {
//     index: 154,
//     encoded: 'MQ==',
//   },
//   {
//     index: 121,
//     encoded: 'Ng==',
//   },
//   {
//     index: 191,
//     encoded: 'OQ==',
//   },
//   {
//     index: 82,
//     encoded: 'ZQ==',
//   },
//   {
//     index: 73,
//     encoded: 'ZA==',
//   },
//   {
//     index: 12,
//     encoded: 'NA==',
//   },
//   {
//     index: 120,
//     encoded: 'YQ==',
//   },
//   {
//     index: 172,
//     encoded: 'NA==',
//   },
//   {
//     index: 155,
//     encoded: 'ZQ==',
//   },
//   {
//     index: 190,
//     encoded: 'Ng==',
//   },
//   {
//     index: 11,
//     encoded: 'Zg==',
//   },
//   {
//     index: 69,
//     encoded: 'ZQ==',
//   },
//   {
//     index: 118,
//     encoded: 'ZA==',
//   },
//   {
//     index: 123,
//     encoded: 'Yg==',
//   },
//   {
//     index: 81,
//     encoded: 'Ng==',
//   },
//   {
//     index: 97,
//     encoded: 'Yg==',
//   },
//   {
//     index: 17,
//     encoded: 'OQ==',
//   },
//   {
//     index: 36,
//     encoded: 'Yg==',
//   },
//   {
//     index: 15,
//     encoded: 'Yw==',
//   },
//   {
//     index: 135,
//     encoded: 'OQ==',
//   },
//   {
//     index: 64,
//     encoded: 'OA==',
//   },
//   {
//     index: 6,
//     encoded: 'Nw==',
//   },
//   {
//     index: 58,
//     encoded: 'OA==',
//   },
//   {
//     index: 101,
//     encoded: 'Yg==',
//   },
//   {
//     index: 116,
//     encoded: 'Zg==',
//   },
//   {
//     index: 63,
//     encoded: 'OQ==',
//   },
//   {
//     index: 78,
//     encoded: 'OA==',
//   },
//   {
//     index: 98,
//     encoded: 'Nw==',
//   },
//   {
//     index: 70,
//     encoded: 'MQ==',
//   },
//   {
//     index: 131,
//     encoded: 'NA==',
//   },
//   {
//     index: 104,
//     encoded: 'Nw==',
//   },
//   {
//     index: 147,
//     encoded: 'Yw==',
//   },
//   {
//     index: 33,
//     encoded: 'Yw==',
//   },
//   {
//     index: 114,
//     encoded: 'OA==',
//   },
//   {
//     index: 164,
//     encoded: 'Yw==',
//   },
//   {
//     index: 112,
//     encoded: 'Yg==',
//   },
//   {
//     index: 113,
//     encoded: 'Nw==',
//   },
//   {
//     index: 130,
//     encoded: 'Zg==',
//   },
//   {
//     index: 86,
//     encoded: 'Mw==',
//   },
//   {
//     index: 2,
//     encoded: 'Mg==',
//   },
//   {
//     index: 185,
//     encoded: 'Mw==',
//   },
//   {
//     index: 31,
//     encoded: 'Mw==',
//   },
//   {
//     index: 160,
//     encoded: 'YQ==',
//   },
//   {
//     index: 89,
//     encoded: 'OQ==',
//   },
//   {
//     index: 54,
//     encoded: 'OQ==',
//   },
//   {
//     index: 156,
//     encoded: 'OQ==',
//   },
//   {
//     index: 88,
//     encoded: 'Ng==',
//   },
//   {
//     index: 182,
//     encoded: 'OQ==',
//   },
//   {
//     index: 42,
//     encoded: 'Mw==',
//   },
//   {
//     index: 1,
//     encoded: 'ZQ==',
//   },
//   {
//     index: 83,
//     encoded: 'Nw==',
//   },
//   {
//     index: 186,
//     encoded: 'OQ==',
//   },
//   {
//     index: 46,
//     encoded: 'Mw==',
//   },
//   {
//     index: 29,
//     encoded: 'ZQ==',
//   },
//   {
//     index: 39,
//     encoded: 'Nw==',
//   },
//   {
//     index: 53,
//     encoded: 'MQ==',
//   },
//   {
//     index: 25,
//     encoded: 'YQ==',
//   },
//   {
//     index: 56,
//     encoded: 'NQ==',
//   },
//   {
//     index: 140,
//     encoded: 'NA==',
//   },
//   {
//     index: 117,
//     encoded: 'Mg==',
//   },
//   {
//     index: 3,
//     encoded: 'Yg==',
//   },
//   {
//     index: 193,
//     encoded: 'Mw==',
//   },
//   {
//     index: 151,
//     encoded: 'ZQ==',
//   },
//   {
//     index: 136,
//     encoded: 'MA==',
//   },
//   {
//     index: 183,
//     encoded: 'MA==',
//   },
//   {
//     index: 170,
//     encoded: 'NA==',
//   },
//   {
//     index: 161,
//     encoded: 'YQ==',
//   },
//   {
//     index: 27,
//     encoded: 'Yw==',
//   },
//   {
//     index: 146,
//     encoded: 'OA==',
//   },
//   {
//     index: 0,
//     encoded: 'Zg==',
//   },
//   {
//     index: 87,
//     encoded: 'Ng==',
//   },
//   {
//     index: 176,
//     encoded: 'OA==',
//   },
//   {
//     index: 26,
//     encoded: 'ZA==',
//   },
//   {
//     index: 24,
//     encoded: 'ZA==',
//   },
//   {
//     index: 13,
//     encoded: 'NA==',
//   },
//   {
//     index: 10,
//     encoded: 'OQ==',
//   },
//   {
//     index: 80,
//     encoded: 'YQ==',
//   },
//   {
//     index: 115,
//     encoded: 'Zg==',
//   },
//   {
//     index: 159,
//     encoded: 'Zg==',
//   },
//   {
//     index: 129,
//     encoded: 'Zg==',
//   },
//   {
//     index: 9,
//     encoded: 'OQ==',
//   },
//   {
//     index: 192,
//     encoded: 'OQ==',
//   },
//   {
//     index: 16,
//     encoded: 'OA==',
//   },
//   {
//     index: 111,
//     encoded: 'NQ==',
//   },
//   {
//     index: 21,
//     encoded: 'NQ==',
//   },
//   {
//     index: 145,
//     encoded: 'Nw==',
//   },
//   {
//     index: 76,
//     encoded: 'NA==',
//   },
//   {
//     index: 5,
//     encoded: 'OA==',
//   },
//   {
//     index: 99,
//     encoded: 'Zg==',
//   },
//   {
//     index: 110,
//     encoded: 'ZQ==',
//   },
//   {
//     index: 142,
//     encoded: 'NQ==',
//   },
//   {
//     index: 124,
//     encoded: 'OQ==',
//   },
//   {
//     index: 126,
//     encoded: 'MA==',
//   },
//   {
//     index: 180,
//     encoded: 'ZA==',
//   },
//   {
//     index: 189,
//     encoded: 'Ng==',
//   },
//   {
//     index: 90,
//     encoded: 'Yw==',
//   },
//   {
//     index: 79,
//     encoded: 'Zg==',
//   },
//   {
//     index: 62,
//     encoded: 'ZQ==',
//   },
//   {
//     index: 57,
//     encoded: 'Mg==',
//   },
//   {
//     index: 149,
//     encoded: 'Yg==',
//   },
//   {
//     index: 194,
//     encoded: 'NQ==',
//   },
//   {
//     index: 75,
//     encoded: 'YQ==',
//   },
//   {
//     index: 49,
//     encoded: 'OA==',
//   },
//   {
//     index: 28,
//     encoded: 'YQ==',
//   },
//   {
//     index: 45,
//     encoded: 'Yg==',
//   },
//   {
//     index: 109,
//     encoded: 'OA==',
//   },
//   {
//     index: 51,
//     encoded: 'MQ==',
//   },
//   {
//     index: 175,
//     encoded: 'OQ==',
//   },
//   {
//     index: 139,
//     encoded: 'YQ==',
//   },
//   {
//     index: 174,
//     encoded: 'Mg==',
//   },
//   {
//     index: 22,
//     encoded: 'OQ==',
//   },
//   {
//     index: 72,
//     encoded: 'OQ==',
//   },
//   {
//     index: 198,
//     encoded: 'Mg==',
//   },
//   {
//     index: 91,
//     encoded: 'Yw==',
//   },
//   {
//     index: 32,
//     encoded: 'YQ==',
//   },
//   {
//     index: 94,
//     encoded: 'Mw==',
//   },
//   {
//     index: 8,
//     encoded: 'Yw==',
//   },
//   {
//     index: 60,
//     encoded: 'MA==',
//   },
//   {
//     index: 165,
//     encoded: 'Zg==',
//   },
//   {
//     index: 148,
//     encoded: 'Mg==',
//   },
//   {
//     index: 59,
//     encoded: 'YQ==',
//   },
//   {
//     index: 181,
//     encoded: 'ZA==',
//   },
//   {
//     index: 157,
//     encoded: 'Mg==',
//   },
//   {
//     index: 188,
//     encoded: 'ZA==',
//   },
//   {
//     index: 169,
//     encoded: 'NA==',
//   },
//   {
//     index: 132,
//     encoded: 'NA==',
//   },
//   {
//     index: 153,
//     encoded: 'NQ==',
//   },
//   {
//     index: 105,
//     encoded: 'MA==',
//   },
//   {
//     index: 196,
//     encoded: 'OA==',
//   },
//   {
//     index: 4,
//     encoded: 'OQ==',
//   },
//   {
//     index: 197,
//     encoded: 'Yw==',
//   },
//   {
//     index: 195,
//     encoded: 'Mg==',
//   },
//   {
//     index: 34,
//     encoded: 'Mw==',
//   },
//   {
//     index: 50,
//     encoded: 'ZQ==',
//   },
//   {
//     index: 96,
//     encoded: 'MQ==',
//   },
//   {
//     index: 141,
//     encoded: 'Yg==',
//   },
//   {
//     index: 137,
//     encoded: 'ZA==',
//   },
//   {
//     index: 138,
//     encoded: 'Yg==',
//   },
//   {
//     index: 168,
//     encoded: 'ZA==',
//   },
//   {
//     index: 166,
//     encoded: 'ZQ==',
//   },
//   {
//     index: 55,
//     encoded: 'Mg==',
//   },
//   {
//     index: 14,
//     encoded: 'OA==',
//   },
//   {
//     index: 66,
//     encoded: 'OQ==',
//   },
//   {
//     index: 20,
//     encoded: 'Mw==',
//   },
//   {
//     index: 150,
//     encoded: 'Ng==',
//   },
//   {
//     index: 95,
//     encoded: 'Mg==',
//   },
//   {
//     index: 84,
//     encoded: 'OQ==',
//   },
//   {
//     index: 61,
//     encoded: 'Zg==',
//   },
//   {
//     index: 40,
//     encoded: 'YQ==',
//   },
//   {
//     index: 134,
//     encoded: 'Mw==',
//   },
//   {
//     index: 92,
//     encoded: 'NQ==',
//   },
//   {
//     index: 127,
//     encoded: 'YQ==',
//   },
//   {
//     index: 74,
//     encoded: 'NQ==',
//   },
//   {
//     index: 35,
//     encoded: 'NA==',
//   },
//   {
//     index: 158,
//     encoded: 'MA==',
//   },
//   {
//     index: 122,
//     encoded: 'Mg==',
//   },
//   {
//     index: 179,
//     encoded: 'ZA==',
//   },
//   {
//     index: 184,
//     encoded: 'YQ==',
//   },
//   {
//     index: 167,
//     encoded: 'OQ==',
//   },
//   {
//     index: 173,
//     encoded: 'ZA==',
//   },
//   {
//     index: 187,
//     encoded: 'OQ==',
//   },
//   {
//     index: 178,
//     encoded: 'Mg==',
//   },
//   {
//     index: 103,
//     encoded: 'NA==',
//   },
//   {
//     index: 77,
//     encoded: 'OQ==',
//   },
//   {
//     index: 171,
//     encoded: 'OA==',
//   },
//   {
//     index: 152,
//     encoded: 'NA==',
//   },
//   {
//     index: 18,
//     encoded: 'Mw==',
//   },
//   {
//     index: 19,
//     encoded: 'OQ==',
//   },
//   {
//     index: 43,
//     encoded: 'NQ==',
//   },
//   {
//     index: 38,
//     encoded: 'Yw==',
//   },
//   {
//     index: 143,
//     encoded: 'Yw==',
//   },
//   {
//     index: 102,
//     encoded: 'Ng==',
//   },
// ];

// function decodeAndConcatenate(codes) {
//   // Sort the codes by index
//   const sortedCodes = codes.sort((a, b) => a.index - b.index);

//   // Decode and concatenate
//   const result = sortedCodes
//     .map((code) => {
//       // Base64 decode
//       const decoded = Buffer.from(code.encoded, 'base64').toString();
//       return decoded;
//     })
//     .join('');

//   return result;
// }

// const finalResult = decodeAndConcatenate(codes);
// console.log(finalResult);
