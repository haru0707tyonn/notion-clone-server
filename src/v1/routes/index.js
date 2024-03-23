const router = require("express").Router(); // 52

router.use("/auth", require("./auth"));
router.use("/memo", require("./memo")); // 78

module.exports = router;