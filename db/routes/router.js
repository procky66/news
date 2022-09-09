const { getEndpoints } = require("../controllers/endpoints");

const router = require("express").Router();

router.get("/", getEndpoints);

module.exports = router;
