import Cert from "./Cert.json" assert {type: "json"};
import Web3 from 'web3';
var web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:8545');

export const contract = new web3.eth.Contract(Cert.abi, Cert.contractAddress);