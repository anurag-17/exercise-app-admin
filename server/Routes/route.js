const express = require("express")
const { addAdmin, adminLogin, addUser, userLogin, deleteUser, updateUser, viewUser, addCategory, deleteCategory, updateCategory, viewCategory, uploadImage, verifyUser, getCategoryById, forgotPwd, resetPassword, changeUserPwd, changeAdminPwd } = require("../Controller/auth")
const router = express.Router()
const multer = require('multer');
const { authorizeRoles, isAuthJWT } = require("../Utils/jwt");
// Multer configuration to store the file in memory as a buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/addAdmin").post(addAdmin)
router.route("/adminlogin").post(adminLogin)
router.route("/adduser").post(addUser)
router.route("/userlogin").post(userLogin)
router.route("/deleteUser/:id").delete(isAuthJWT,authorizeRoles("Admin"),deleteUser)
router.route("/updateUser").put(updateUser)
router.route("/viewUser").get(isAuthJWT,authorizeRoles("Admin"),viewUser)
router.route("/addCategory").post(isAuthJWT,authorizeRoles("Admin"),addCategory)
router.route("/deleteCategory/:id").delete(isAuthJWT,authorizeRoles("Admin"),deleteCategory)
router.route("/updateCategory").put(isAuthJWT,authorizeRoles("Admin"),updateCategory)
router.route("/viewCategory").get(isAuthJWT,viewCategory)
router.route("/uploadImage").post(isAuthJWT, upload.single('file'),uploadImage)
router.route("/verifyToken/:token").get(verifyUser)
router.route("/getCategory/:id").get(isAuthJWT,getCategoryById)
router.route("/forgotpassword").post(forgotPwd)
router.route("/resetpassword").post(resetPassword)
router.route("/changepasswordUser").post(isAuthJWT,authorizeRoles("User"),changeUserPwd)
router.route("/changepasswordAdmin").post(isAuthJWT,authorizeRoles("Admin"),changeAdminPwd)


module.exports = router;
