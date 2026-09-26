const express = require("express");
const { assistant } = require("../controllers/assistantController");

const router = express.Router();

router.post("/assistant", assistant);

module.exports = router;