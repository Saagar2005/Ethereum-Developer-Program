import {Contract, WebSocketProvider} from 'ethers';
import Cert from "./Cert.json" assert {type: "json"};

const wsProvider = new WebSocketProvider("ws://127.0.0.1:8545");
const signer = await wsProvider.getSigner("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
const wsInstance = new Contract(Cert.contractAddress, Cert.abi, signer);

(() => {
    console.log("Listening for events...");
    wsInstance.on("Issued", (course, id, grade, event) =>
    {
        console.log("**** EVENT OCCURED ****");
        console.log('course:', course);
        console.log('id:', id);
        console.log('grade:', grade);
        console.log('event:', event);
        console.log('***********************');
    } );
})();