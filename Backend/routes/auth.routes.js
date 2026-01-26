const { Router } = require("express");
const { loginUser, logoutUser, GoogleLogin } = require("../controllers/auth.controller");

const router = Router();
router.post("/login", loginUser);
router.post("/login/google", GoogleLogin);

router.route("/logout").post(logoutUser);

module.exports = router;
