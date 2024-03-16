import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { stringToHex } from "viem";

describe("Ensauth", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployEnsauth() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const ensauth = await hre.viem.deployContract("Ensauth");

    const publicClient = await hre.viem.getPublicClient();

    return {
      ensauth,
      owner,
      otherAccount,
      publicClient,
    };
  }

  it ("Should compare the beginning of 2 byte32", async function () {
    const { ensauth } = await loadFixture(deployEnsauth);

    expect(await ensauth.read.startsWith(["0x06" + stringToHex("groups.sample.eth").slice(2), stringToHex("groups")]));
  })

});
