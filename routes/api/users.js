const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/index");
// const ctrl = require('../../controllers/transactions/index')
const {
  userJoiSchema,
  updatebalanceJoiSchema,
  userJoiSchemaLogin,
} = require("../../models");
const { validation, ctrlWrap } = require("../../middlewares");

router.post("/signup", validation(userJoiSchema), controllers.signUp);
router.post("/login", validation(userJoiSchemaLogin), controllers.logIn);
router.post("/logout", controllers.logout);
router.post(
  "/",
  validation(updatebalanceJoiSchema),
  controllers.userBalanceUpdate
);
router.get("/", controllers.getUserBalance);
router.get("/current", controllers.getCurrent);
router.get("/google", ctrlWrap(controllers.googleAuth));
router.get("/google-redirect", ctrlWrap(controllers.googleRedirect));

module.exports = router;
