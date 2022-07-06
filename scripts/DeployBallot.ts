import fs from 'fs';
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import * as dotenv from "dotenv";
import { ethers } from "ethers";


dotenv.config();

const PRIVATE_KEY = fs.readFileSync(".secret").toString().trim();

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

// Deploying the Smart Contracts
async function main() {

   // Create Wallet Signing Instance
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(PRIVATE_KEY);
  console.log(`Using address ${wallet.address}`);
  // connect to rpc network
  const provider = ethers.providers.getDefaultProvider("Ropsten");
  const signer = wallet.connect(provider);
  //check balance
  const balanceBN = await signer.getBalance();
  console.log(signer);
  const balance = await Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.0000001) {
    throw new Error("There is not enough Ether in this wallet.");
  }

  console.log("Deploying Token contract");

   const addr = await signer.getAddress();
   console.log(addr);

  //  Token deployment
  const tokenFactory  = new ethers.ContractFactory(
    tokenJson.abi,
    tokenJson.bytecode,
    signer
  )
  const tokenContract = await tokenFactory.deploy()
  console.log("Awaiting Confirmation");
  await tokenContract.deployed();
  console.log("Completed");
  console.log(`Token Contract is deployed at ${tokenContract.address}`);
  console.log("Deploying the CustomBallot Contract");
  console.log("Proposals: ");

  const proposals = ["Tobechuku Adebimpe", "Sarah Bigsby", "Amir Muhammed"]
  if (proposals.length < 2) throw new Error("Not enough proposals have been provided.");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  // Deploy ballot
  const customBallotFactory = new ethers.ContractFactory(
    customBallotJson.abi,
    customBallotJson.bytecode,
    signer
  );
  const customBallotContract = await customBallotFactory.deploy(
    convertStringArrayToBytes32(proposals),
    tokenContract.address
  );
  console.log("Awaiting Confirmation");
  await customBallotContract.deployed();
  console.log("Completed");
  console.log(`Ballot Contract Deployed at ${customBallotContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
