const express = require("express");

const { ctrlWrapper, validation, auth } = require("../../middlewares");
const { auth: ctrl } = require("../../controllers");
const { joiSignUpSchema, joiLogInSchema } = require("../../models/auth");

const router = express.Router();

router.get("/current", auth, ctrlWrapper(ctrl.getCurrent));

router.post("/signup", validation(joiSignUpSchema, "try again"), ctrlWrapper(ctrl.register));

router.post("/login", validation(joiLogInSchema, "try again"), ctrlWrapper(ctrl.login));

router.get("/logout", auth, ctrlWrapper(ctrl.logout));

module.exports = router;
