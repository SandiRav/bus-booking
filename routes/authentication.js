const express = require("express");
const multer = require("multer");
const router = express.Router();
const storage = require("../middleware/storage");
const authenticationController = require("../controlers/authentication")
const upload = multer({ storage });

router.get("/users", authenticationController.getUsers);
router.post("/signup", upload.single('file'), authenticationController.signup);
router.post("/login", authenticationController.login);
router.post("/logout", authenticationController.logout);
router.put("/user:id", authenticationController.updateUser);

module.exports = router;
