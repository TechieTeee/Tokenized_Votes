import fs from 'fs';
import * as dotenv from "dotenv";
import { ethers, Contract } from "ethers";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { MyToken } from "../typechain";


dotenv.config();

const PRIVATE_KEY = fs.readFileSync(".secret").toString().trim();

async function main() {

    // Get Wallet Signature
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

   const tokenContractAddress = "0xc67c3826c83A8775EdC22eFD142D242143b1a756"

   // Create the Token Contract
   const tokenContract: MyToken = new Contract(
    tokenContractAddress,
     tokenJson.abi,
     signer

   ) as MyToken
   //address array
   const address = ['',
   "", ""]

    console.log('Delegating');
    const delegateTk = await tokenContract.delegate(
        address[2]
      );
      console.log('Waiting for Confirmation')
      await delegateTk.wait();
     console.log(`The Delegate Hash is ${delegateTk.hash}`);
     console.log('Please Wait, Checking Voting Power');
     const VotePower = await tokenContract.getVotes(
         address[2]
       );
     const formatVotePower = Number(ethers.utils.formatEther(VotePower))

          console.log(VotePower);
          console.log(formatVotePower);
}

 main().catch((error) => {
   console.error(error);
   process.exitCode = 1;
 });
