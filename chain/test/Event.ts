// import { ethers } from 'hardhat';
// import { expect } from 'chai';

// describe('Event', function () {
//   async function deployEventFixture() {
//     const name = 'a';
//     const symbol = 'b';
//     const baseUri = 'c';
//     const [owner, otherAccount] = await ethers.getSigners();

//     const Event = await ethers.getContractFactory('Event');
//     const event = await Event.deploy(name, symbol, baseUri);

//     return { event, name, symbol, baseUri, owner, otherAccount };
//   }

//   describe('Deployment', function () {
//     it('should deploy the contract with the correct name, symbol, and base URI', async () => {
//       const { event, name, symbol, baseUri } = await deployEventFixture();

//       expect(await event.name()).to.equal(name);
//       expect(await event.symbol()).to.equal(symbol);
//       expect(await event.baseURI()).to.equal(baseUri);
//     });
//   });

//   describe('Minting', function () {
//     it('should allow the owner to mint tokens', async () => {
//       const { event, owner } = await deployEventFixture();

//       await expect(event.connect(owner).mint(1)).to.emit(event, 'Transfer');
//     });

//     it('should not allow minting from non-owner', async () => {
//       const { event, otherAccount } = await deployEventFixture();

//       await expect(event.connect(otherAccount).mint(1)).to.be.revertedWith(
//         'Ownable: caller is not the owner',
//       );
//     });
//   });

//   describe('Authorization', function () {
//     it('should allow the owner to authorize and revoke addresses', async () => {
//       const { event, owner, otherAccount } = await deployEventFixture();

//       await event.connect(owner).authorizeAddress(otherAccount.address);
//       expect(await event.allowed(otherAccount.address)).to.equal(true);

//       await event.connect(owner).revokeAddress(otherAccount.address);
//       expect(await event.allowed(otherAccount.address)).to.equal(false);
//     });

//     it('should not allow authorization from non-owner', async () => {
//       const { event, otherAccount } = await deployEventFixture();

//       await expect(
//         event.connect(otherAccount).authorizeAddress(otherAccount.address),
//       ).to.be.revertedWith('Ownable: caller is not the owner');
//     });

//     it('should not allow revocation from non-owner', async () => {
//       const { event, otherAccount } = await deployEventFixture();

//       await expect(
//         event.connect(otherAccount).revokeAddress(otherAccount.address),
//       ).to.be.revertedWith('Ownable: caller is not the owner');
//     });
//   });

//   describe('Transfer', function () {
//     it('should allow transfer from authorized address', async () => {
//       const { event, owner, otherAccount } = await deployEventFixture();

//       await event.connect(owner).authorizeAddress(owner.address);
//       await event.connect(owner).mint(1);

//       await expect(
//         event
//           .connect(owner)
//           .transferFrom(owner.address, otherAccount.address, 0),
//       )
//         .to.emit(event, 'Transfer')
//         .withArgs(owner.address, otherAccount.address, 0);
//     });

//     it('should not allow transfer from unauthorized address', async () => {
//       const { event, owner, otherAccount } = await deployEventFixture();

//       await event.connect(owner).mint(1);

//       await expect(
//         event
//           .connect(otherAccount)
//           .transferFrom(owner.address, otherAccount.address, 0),
//       ).to.be.reverted;
//     });
//   });
// });
