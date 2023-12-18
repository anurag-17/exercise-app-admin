const Admin = require("../Model/Admin")
const User = require("../Model/User")
const bcrypt = require('bcrypt');
const { generateToken, verifyToken } = require("../Utils/jwt");
const Category = require("../Model/Category");

const uploadOnS3 = require("../Utils/awsS3");
const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
};

const StatusMessage = {
  INVALID_CREDENTIALS: "Invalid credentials.",
  INVALID_EMAIL_PASSWORD: "Please provide email and password.",
  USER_NOT_FOUND: "Invalid credentials or user not found.",
  SERVER_ERROR: "Server error.",
  MISSING_DATA: "Please provide all necessary user details.",
  DUPLICATE_DATA: "Data already exists.",
  DUPLICATE_EMAIL: "Email already exists.",
  DUPLICATE_CONTACT: "Contact number already exists.",
  USER_DELETED: "User deleted successfully.",
  UNAUTHORIZED_ACCESS: "Unauthorized access.",
  USER_UPDATED: "User updated successfully.",
  MISSING_PAGE_PARAMS: "Please provide page number and limit.",

};
var ObjectId = require('mongodb').ObjectId

exports.verifyUser = async (req, res) => {
  // console.log(req.params);
  const { token } = req.params;
  // console.log(token);
  try {
    if (!verifyToken(token)) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: StatusMessage.UNAUTHORIZED_ACCESS // Include the redirect path in the response
      });
    }else{
      return res.status
    }
    // If verification succeeds, proceed with other actions or return success
    // For example:
    // return res.status(HttpStatus.OK).json({ message: 'Verification successful' });
  } catch (error) {
    console.log(error);
    return res.status(HttpStatus.SERVER_ERROR).json({
      error: StatusMessage.SERVER_ERROR
    });
  }
};
exports.addAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_DATA);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminData = new Admin({ email, password: hashedPassword });

    const result = await adminData.save();

    console.log(result); // Log the result for debugging, avoid exposing in production

    return res.status(HttpStatus.OK).json(result);
  } catch (error) {
    console.error(error); // Log the error for debugging, avoid exposing in production

    if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.DUPLICATE_EMAIL);
    }

    return res.status(HttpStatus.SERVER_ERROR).json(StatusMessage.SERVER_ERROR);
  }
};
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_EMAIL_PASSWORD);
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.USER_NOT_FOUND);
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (isPasswordMatch) {
      const token = generateToken({ email: admin.email });
      return res.status(HttpStatus.OK).json({
        message: `Welcome ${admin.email}`,
        token: token,
      });
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.INVALID_CREDENTIALS);
    }
  } catch (error) {
    return res.status(HttpStatus.SERVER_ERROR).json(StatusMessage.SERVER_ERROR);
  }
};

/////////////////////////////user////////////////

exports.addUser = async (req, res) => {
  try {
    const { name, contact, email, password } = req.body;

    if (!name || !contact || !email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_DATA);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({ name, contact, email, password: hashedPassword });

    const result = await userData.save();

    console.log(result); // Log the result for debugging, avoid exposing in production

    return res.status(HttpStatus.OK).json(result);
  } catch (error) {
    console.error(error); // Log the error for debugging, avoid exposing in production
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.DUPLICATE_EMAIL);
    }
    if (error.code === 11000 && error.keyPattern && error.keyPattern.contact === 1) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.DUPLICATE_CONTACT);
    }
    return res.status(HttpStatus.SERVER_ERROR).json(StatusMessage.SERVER_ERROR);
  }
};
exports.userLogin = async (req, res) => {
  try {
    const { contact, email, password } = req.body;

    if (!(email || contact) || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.INVALID_EMAIL_PASSWORD);
    }

    let user;
    if (email) {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ contact });
    }

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.USER_NOT_FOUND);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      const token = generateToken({ email: user.email });
      return res.status(HttpStatus.OK).json({
        message: `Welcome ${user.email}`,
        token: token,
      });
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.INVALID_CREDENTIALS);
    }
  } catch (error) {
    return res.status(HttpStatus.SERVER_ERROR).json(StatusMessage.SERVER_ERROR);
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Accessing the ID from URL params
    const authHeader = req.headers.authorization;

    if (!userId) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_DATA);
    }

    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Remove 'Bearer ' from the beginning to get the token
      token = authHeader.slice(7);
    } else {
      // Handle cases where the token is not present or not in the expected format
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.UNAUTHORIZED_ACCESS);
    }

    // Verify the token
    if (!verifyToken(token)) {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.UNAUTHORIZED_ACCESS);
    }

    // Token is valid, proceed with user deletion
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(HttpStatus.BAD_REQUEST).json("User not found.");
    }

    return res.status(HttpStatus.OK).json(StatusMessage.USER_DELETED);
  } catch (error) {
    console.error(error);
    return res.status(HttpStatus.BAD_REQUEST).json("Error deleting user.");
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { id, updatedDetails } = req.body;
    const authHeader = req.headers.authorization;

    if (!id || !updatedDetails) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_DATA);
    }

    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.UNAUTHORIZED_ACCESS);
    }

    if (!verifyToken(token)) {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.UNAUTHORIZED_ACCESS);
    }

    if (updatedDetails.password) {
      // Hash the new password before updating
      updatedDetails.password = await bcrypt.hash(updatedDetails.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedDetails, { new: true });

    if (!updatedUser) {
      return res.status(HttpStatus.BAD_REQUEST).json("User not found.");
    }

    return res.status(HttpStatus.OK).json(StatusMessage.USER_UPDATED);
  } catch (error) {
    console.error(error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.DUPLICATE_EMAIL);
    }
    if (error.code === 11000 && error.keyPattern && error.keyPattern.contact === 1) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.DUPLICATE_CONTACT);
    }
    return res.status(HttpStatus.BAD_REQUEST).json("Error updating user.");
  }
};

exports.viewUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 1000; // Default limit to 10 if not specified
    const search = req.query.search || "";
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.UNAUTHORIZED_ACCESS);
    }

    if (!verifyToken(token)) {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.UNAUTHORIZED_ACCESS);
    }
    if (!page || !limit) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_PAGE_PARAMS);
    }

    const startIndex = (page - 1) * limit;

    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query).skip(startIndex).limit(limit);
    const totalUsers = await User.countDocuments(query);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers: totalUsers
    };

    return res.status(HttpStatus.OK).json({ users, pagination });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatus.BAD_REQUEST).json("Error fetching users.");
  }
};

// exports.addCategory = async (req, res) => {
//   try {
//     const { category ,image} = req.body;
//     const authHeader = req.headers.authorization;

//     if (!category) {
//       return res.status(HttpStatus.BAD_REQUEST).json("Missing category.");
//     }

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(HttpStatus.UNAUTHORIZED).json("Unauthorized access.");
//     }

//     const token = authHeader.slice(7); // Extracting the token

//     // Your token validation logic here (verifyToken function)
//     if (!verifyToken(token)) {
//       return res.status(HttpStatus.UNAUTHORIZED).json("Invalid token.");
//     }

//     // Creating the category
//     const categoryData = new Category({ category });
//     const result = await categoryData.save();

//     return res.status(HttpStatus.OK).json("Category added successfully.");
//   } catch (error) {
//     console.error("Error adding category:", error);
//     if (error.code === 11000 && error.keyPattern && error.keyPattern.category === 1) {
//       return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.DUPLICATE_DATA);
//     }
//     return res.status(HttpStatus.BAD_REQUEST).json("Error adding category.");
//   }
// };
exports.uploadImage = async (req, res, next) => {
  // console.log(req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Invalid request" });
    }

    let fileName = req.file.originalname;

    let url = await uploadOnS3(req.file.buffer, fileName); // Assuming req.file.buffer contains the image buffer
    console.log("URL:", url);
    return res.status(200).json({ status: true, url: url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// Handling the file upload with multer middleware
exports.addCategory = async (req, res) => {
  try {

    const { category, file, video } = req.body;
    
    const authHeader = req.headers.authorization;

    if (!category || !file  ||(!Array.isArray(video) || video.length == 0)) {
      return res.status(HttpStatus.BAD_REQUEST).json("Missing some data.");
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HttpStatus.UNAUTHORIZED).json("Unauthorized access.");
    }

    const token = authHeader.slice(7); // Extracting the token

    // Your token validation logic here (verifyToken function)
    if (!verifyToken(token)) {
      return res.status(HttpStatus.UNAUTHORIZED).json("Invalid token.");
    }

    // Creating the category
    const categoryData = new Category({ category, file, video });
    const result = await categoryData.save();

    // If a file exists in the request, upload it to the S3 bucket
    if (result) {

      return res.status(HttpStatus.OK).json("Category added successfully.");
    }

    // ... rest of your code remains the same
    // Ensure you handle file existence, validation, saving to S3, etc.
  } catch (error) {
    console.error("Error adding category:", error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.category === 1) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.DUPLICATE_DATA);
    }
    else if (error.code === 11000 && error.keyPattern && error.keyPattern.file === 1) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.DUPLICATE_DATA);
    }
    else{
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
    // Handle errors
  }
};




exports.deleteCategory = async (req, res) => {
  try {
    const deleteID = req.params.id;
    const authHeader = req.headers.authorization
    if (!deleteID) {
      return res.status(HttpStatus.BAD_REQUEST).json("Missing ID.");
    }
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Remove 'Bearer ' from the beginning to get the token
      token = authHeader.slice(7);
    }
    else {
      if (!authHeader) {

        return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.UNAUTHORIZED_ACCESS);
      } else {
        token = authHeader
      }
      // Handle cases where the token is not present or not in the expected format
    }
    if (!verifyToken(token)) {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.UNAUTHORIZED_ACCESS);
    }
    const deleteCat = await Category.findByIdAndDelete(deleteID)
    if (!deleteCat) {
      return res.status(HttpStatus.BAD_REQUEST).json("Category not found.");
    }
    return res.status(HttpStatus.OK).json("Category deleted successfully.");
  } catch (error) {
    console.error(error);
    return res.status(HttpStatus.BAD_REQUEST).json("Error deleting user.");
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const { id, updatedDetails } = req.body;
    const authHeader = req.headers.authorization;

    if (!id || !updatedDetails) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_DATA);
    }

    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.UNAUTHORIZED_ACCESS);
    }

    if (!verifyToken(token)) {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.UNAUTHORIZED_ACCESS);
    }



    const updatedCategory = await Category.findByIdAndUpdate(id, updatedDetails, { new: true });

    if (!updatedCategory) {
      return res.status(HttpStatus.BAD_REQUEST).json("Category not found.");
    }

    return res.status(HttpStatus.OK).json(StatusMessage.USER_UPDATED);
  } catch (error) {
    console.error(error);

    return res.status(HttpStatus.BAD_REQUEST).json("Error updating category.");
  }
};
exports.getCategoryById = async (req, res) => {
  try {
    const _id  = req.params.id;
    let token = "";

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.UNAUTHORIZED_ACCESS);
    }

    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else {
      token = authHeader;
    }

    if (!verifyToken(token)) {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.UNAUTHORIZED_ACCESS);
    }

    const categoryData = await Category.findById(_id);
    if (!categoryData) {
      return res.status(HttpStatus.BAD_REQUEST).json("Category not found.");
    }

    return res.status(HttpStatus.OK).json(categoryData);
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(StatusMessage.SERVER_ERROR);
  }
};


exports.viewCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 1000; // Default limit to 10 if not specified
    const search = req.query.search || "";
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.UNAUTHORIZED_ACCESS);
    }

    if (!verifyToken(token)) {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.UNAUTHORIZED_ACCESS);
    }
    if (!page || !limit) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_PAGE_PARAMS);
    }
    const startIndex = (page - 1) * limit
    const query = search ? { category: { $regex: `.*${search}.*`, $options: 'i' } } : {};
    const category = await Category.find(query).skip(startIndex).limit(limit);
    const totalCategory = await Category.countDocuments(query);
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalCategory / limit),
      totalCategory: totalCategory
    };

    return res.status(HttpStatus.OK).json({ category, pagination });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatus.BAD_REQUEST).json("Error fetching category.");
  }
}
/////////////////////////forgotpassword/////////////////////

exports.forgotPwd = async (req, res) => {
  const { contact, email } = req.body;
  if (!(email || contact)) {
    return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.INVALID_EMAIL_PASSWORD);
  }
  let user;
  if (email) {
    user = await User.findOne({ email });
  } else {
    user = await User.findOne({ contact });
  }
  if (!user) {
    return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.USER_NOT_FOUND);
  }
  const token = generateToken({ email: user.email });
  
}




