import { Contract, Wallet, JsonRpcProvider } from "ethers";
import Cert from "./Cert.json" assert {type: "json"};

const provider = new JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/L_pqacjj4Xouv9Bq9BhSmzn9-bzIikZV");

const privateKey ="0x4136e289c86cd811eb972adecd4afea90186615ab1afd5bb2b90eef1503fb582"; 

const wallet = new Wallet(privateKey, provider);

console.log(wallet.address);

export const instance = new Contract(Cert.contractAddress, Cert.abi, wallet);

console.log(instance);

