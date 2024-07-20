import { Router } from "express";
const router = Router();
import { contract } from "../instance.js";

/* GET home page. */
router.get("/", function (req, res) {
  res.send("Hello World!");
});

router.post("/issue", async function (req, res) {
  try {
    const trx = await contract.methods.issue(req.body.id, req.body.name, req.body.course, req.body.grade, req.body.date).send({from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'});
    console.log(trx);
    res.status(201).send(trx.transactionHash);
  }catch(error) {
    res.status(500).json({
      error
    });
  }
});

router.get("/fetch", async function (req, res) {
  try {
    const id = req.query.id;
    const result = await contract.methods.Certificates(id).call({from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'});
    res.status(200).json(result);
  }catch(error) {
    res.status(500).json({
      error
    });
  }
});

export default router;
