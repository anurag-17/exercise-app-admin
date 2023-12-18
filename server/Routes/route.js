const express = require("express")
const { addAdmin, adminLogin, addUser, userLogin, deleteUser, updateUser, viewUser, addCategory, deleteCategory, updateCategory, viewCategory, uploadImage, verifyUser, getCategoryById } = require("../Controller/auth")
const router = express.Router()
const multer = require('multer');
// Multer configuration to store the file in memory as a buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/addAdmin").post(addAdmin)
router.route("/adminlogin").post(adminLogin)
router.route("/adduser").post(addUser)
router.route("/userlogin").post(userLogin)
router.route("/deleteUser/:id").delete(deleteUser)
router.route("/updateUser").put(updateUser)
router.route("/viewUser").get(viewUser)
router.route("/addCategory").post(addCategory)
router.route("/deleteCategory/:id").delete(deleteCategory)
router.route("/updateCategory").put(updateCategory)
router.route("/viewCategory").get(viewCategory)
router.route("/uploadImage").post(upload.single('file'),uploadImage)
router.route("/verifyToken/:token").get(verifyUser)
router.route("/getCategory/:id").get(getCategoryById)

module.exports = router;
