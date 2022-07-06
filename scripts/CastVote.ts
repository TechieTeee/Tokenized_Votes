import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import fs from 'fs';
import { CustomBallot } from "../typechain";
import * as dotenv from "dotenv";
import { ethers, Contract } from "ethers";


dotenv.config();

// Import Private Key
const PRIVATE_KEY = fs.readFileSync(".secret").toString().trim();

// Connect to Wallet
async function main() {
   const wallet = new ethers.Wallet(PRIVATE_KEY);
   console.log(`Using address ${wallet.address}`);

   // Connect to the Ropsten Network
   const provider = ethers.providers.getDefaultProvider("Ropsten");
   const signer = wallet.connect(provider);
   const balanceBN = await signer.getBalance();
   console.log(signer);

    // Wait for Balance and Signature
   const balance = await Number(ethers.utils.formatEther(balanceBN));
   console.log(`Wallet balance ${balance}`);

   const ballotContractAddress = "0xc67c3826c83A8775EdC22eFD142D242143b1a756"

   const ballotContract: CustomBallot = new Contract(
    ballotContractAddress,
    customBallotJson.abi,
     signer

   ) as CustomBallot

    // Cast Vote
   let amount = 0
    console.log('Please wait, casting vote.');

    const CastVote = await ballotContract.vote(2, ethers.utils.parseEther(amount.toFixed(18)));

    // Wait for Vote to be Cast
    CastVote.wait();

         console.log(`Transaction Hash: ${CastVote.hash}`);

}

 main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
 });
