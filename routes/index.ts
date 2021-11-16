import express from "express";
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Node-CSV" });
});

module.exports = router;
