import fs from 'fs';
import * as dotenv from "dotenv";
import { ethers, Contract } from "ethers";
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";

import { CustomBallot } from "../typechain";


const PRIVATE_KEY = fs.readFileSync(".secret").toString().trim();



async function main() {

    //  Create the Wallet Signing Instance
   const wallet = new ethers.Wallet(PRIVATE_KEY);
   console.log(`Using address ${wallet.address}`);

   // Connect to the Ropsten Network
   const provider = ethers.providers.getDefaultProvider("Ropsten");
   const signer = wallet.connect(provider);

   // Check the Wallet Balance
   const balanceBN = await signer.getBalance();
   console.log(signer);
   const balance = await Number(ethers.utils.formatEther(balanceBN));
   console.log(`Wallet balance ${balance}`);

   if (balance < 0.001) {
     throw new Error("There is not enough ether in this wallet.");
   }
   // Ballot Contract Address
   const ballotContract = "0xc67c3826c83A8775EdC22eFD142D242143b1a756"

   // Instantiate Contract Instance
   const customBallot: CustomBallot = new Contract(
       ballotContract,
       customBallotJson.abi,
       signer

   ) as CustomBallot
   const proposalsLength = 3
   let index = 0
   // Search Proposals for Each Ballot
   while (index < proposalsLength) {
    const ballotProposal = await customBallot.proposals(index)
    const byteToString = ethers.utils.parseBytes32String(ballotProposal.name)
    console.log(`proposal ${index} :  ${byteToString}`)
    index ++;
   }


}

 main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
 });
