import { Contract, Wallet, JsonRpcProvider } from "ethers";
import Cert from "./Cert.json" assert {type: "json"};

export const address = Cert.contractAddress;
export const abi = Cert.abi;
export const provider = new JsonRpcProvider("http://127.0.0.1:8545");

const privateKey ="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; 

const wallet = new Wallet(privateKey, provider);

console.log(wallet.address);

export const instance = new Contract(Cert.contractAddress, Cert.abi, wallet);

console.log(instance);

