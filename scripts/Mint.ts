import fs from 'fs';
import * as dotenv from "dotenv";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { ethers, Contract } from "ethers";
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";

import { CustomBallot, MyToken } from "../typechain";


dotenv.config();

const PRIVATE_KEY = fs.readFileSync(".secret").toString().trim();

async function main() {

    // Create the Wallet Signer
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

   if (balance < 0.0001) {
     throw new Error("There is not enough Ether in this wallet.");
   }
   // Address for Token Contract
   const tokenContractAddress = "0xc67c3826c83A8775EdC22eFD142D242143b1a756"

   // Create the Token Instance
   const tokenContract: MyToken = new Contract(
    tokenContractAddress,
     tokenJson.abi,
     signer

   ) as MyToken
   //address array
   const address = ["0x90eF275f17A77F9dEdc344873c947D4525B6d9fF", "0x2aEbc3ce972ab94A8F946F0c98f3F43473814486", "0xd3b8f1650d3a565108D2c7ad9672a019D6CD436e"]
   let vote_power = 15


      console.log('Please wait, minting.');
      const Mint = await tokenContract.mint(
        address[3],
        ethers.utils.parseEther(vote_power.toFixed(18))
      );
     await  Mint.wait();
      console.log(`Minting is complete.`);
      console.log(Mint.hash)


}

 main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
 });
