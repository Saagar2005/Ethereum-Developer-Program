import { Router } from "express";
import {id, Interface} from 'ethers';
import { instance, provider, address, abi } from "../instance.js";
const router = Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.send("Hello World!");
});

router.post("/issue", async function (req, res) {
  try {
    const trx = await instance.issue(req.body.id, req.body.name, req.body.course, req.body.grade, req.body.date);
    console.log(trx);
    res.status(201).json(trx);
  }catch(error) {
    res.status(500).json({
      error
    });
  }
});

router.get("/fetch", async function (req, res) {
  try {
    const id = req.query.id;
    const result = await instance.Certificates(id);
    res.status(200).json(result);
  }catch(error) {
    res.status(500).json({
      error
    });
  }
});

router.get("/events", async function(req,res) {
  try {
    const course = req.query.course;
    const eventTopic = id("Issued(string,uint256,string)");
    let eventLogs = [];
    const iface = new Interface(abi);
    BigInt.prototype.toJSON = function () {
      return this.toString();
    }
    await provider.getLogs({
      fromBlock:0,
      toBlock: 'latest',
      address: address,
      topics: [eventTopic]
    })
    .then((logs) => {
      logs.forEach((log) => {
        var x = iface.parseLog(log);
        if(x.args[0] === course)
          eventLogs.push(iface.parseLog(log))});
    });
    res.json(eventLogs);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

export default router;
