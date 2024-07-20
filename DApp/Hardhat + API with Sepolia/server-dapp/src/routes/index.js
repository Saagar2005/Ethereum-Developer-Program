import { Router } from "express";
import { instance } from "../instance.js";
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

export default router;
