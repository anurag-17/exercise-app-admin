const Admin = require("../Model/Admin")
const User = require("../Model/User")
const bcrypt = require('bcrypt');
const { generateToken, verifyToken } = require("../Utils/jwt");
const Category = require("../Model/Category");
const AWS = require('aws-sdk');
const fs = require('fs');
const uploadOnS3 = require("../Utils/awsS3");
const sendEmail = require("../Utils/SendEmail");
const mongoose = require("mongoose")
const HttpStatus = {
  OK: 200,
  INVALID: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
};
const jwt = require("jsonwebtoken");
const WatchTime = require("../Model/WatchTime");
const Feedback = require("../Model/Feedback");
const { log } = require("console");
const StatusMessage = {
  INVALID_CREDENTIALS: "Invalid credentials.",
  INVALID_EMAIL_PASSWORD: "Please provide email and password.",
  USER_NOT_FOUND: "User not found.",
  SERVER_ERROR: "Server error.",
  MISSING_DATA: "Please provide all necessary user details.",
  DUPLICATE_DATA: "Data already exists.",
  DUPLICATE_EMAIL: "Email already exists.",
  DUPLICATE_CONTACT: "Contact number already exists.",
  USER_DELETED: "Deleted successfully.",
  UNAUTHORIZED_ACCESS: "Unauthorized access.",
  USER_UPDATED: "User updated successfully.",
  MISSING_PAGE_PARAMS: "Please provide page number and limit.",
  SAVED_SUCC: "Saved Successfully!",
  NOT_FOUND: "Data not found."
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
    } else {
      return res.status(HttpStatus.OK).json({ message: 'Verification successful' });
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

    // console.log(result); // Log the result for debugging, avoid exposing in production

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
      await Admin.findByIdAndUpdate({_id:admin._id?.toString()},{ activeToken: token}, { new: true })

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
    
      await User.findByIdAndUpdate({_id:user._id?.toString()},{ activeToken: token}, { new: true })
      return res.status(HttpStatus.OK).json({
        message: `Welcome ${user.email}`,
        token: token,
        userID: user._id
      });
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.INVALID_CREDENTIALS);
    }
  } catch (error) {
    console.log(error);
    return res.status(HttpStatus.SERVER_ERROR).json(StatusMessage.SERVER_ERROR);
  }
};
exports.logoutUser = async(req, res)=>{
  try {
    const  authHeader  = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else {
      token = authHeader;
    }
  
    if (!token) {
      return res.status(401).json({ message: "Please login to access this resource" });
    }
    const decodedData = jwt.verify(token, process.env.jwtKey);
     const userData = await User.findOne({ email: decodedData?.email });
     if (userData.activeToken  && userData.activeToken === token) {
       const user = await User.findOneAndUpdate(
         { email: decodedData.email, activeToken: token },
         { $unset: { activeToken: "" } }, // Unset the token
         { new: true }
       );
       if (!user) {
        return res.status(401).json({ message: 'Invalid session or token, please login again' });
      }
      return res.status(HttpStatus.OK).json({
        message: `${userData.email} is Logout Successfully`
      });
    } else {
      return res.status(401).json({ message: 'Token expired, please login again' });
    }

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please login again' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      console.error('Other error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}




exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Accessing the ID from URL params

    if (!userId) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_DATA);
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


    if (!id || !updatedDetails) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_DATA);
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

exports.getUserByID = async(req, res)=>{
  try {
    const _id = req.params.id;
    console.log(_id);
    const userData = await User.findById(_id) 
    if (!userData) {
      return res.status(HttpStatus.INVALID).json(StatusMessage.NOT_FOUND);
    }
     return res.status(HttpStatus.OK).json(userData) 
    
  } catch (error) {
    console.error(error);
    return res.status(HttpStatus.BAD_REQUEST).json("Error fetching users.");
  }
}

exports.viewUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 1000; // Default limit to 10 if not specified
    const search = req.query.search || "";

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
// const s3 = new AWS.S3({
//   accessKeyId: process.env.awsAccessKey,
//   secretAccessKey: process.env.awsSecretkey,
//   region: process.env.awsRegion, 
// });

// exports.uploadImage = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "Invalid request" });
//     }

//     const { originalname, buffer, size } = req.file;

//     const uploadParams = {
//       Bucket: 'exerciseimage',
//       Key: originalname,
//       Body: buffer
//     };

//     // Initiate the multipart upload
//     const uploadData = await s3.createMultipartUpload(uploadParams).promise();
//     const uploadId = uploadData.UploadId;

//     const partSize = 5  1024  1024; // 5MB part size (adjust as needed)
//     const partCount = Math.ceil(size / partSize);
//     const parts = [];

//     for (let i = 0; i < partCount; i++) {
//       const start = i * partSize;
//       const end = Math.min(start + partSize, size);

//       const partParams = {
//         Bucket: 'exerciseimage',
//         Key: originalname,
//         PartNumber: i + 1,
//         UploadId: uploadId,
//         Body: buffer.slice(start, end)
//       };

//       const part = await s3.uploadPart(partParams).promise();
//       parts.push({ PartNumber: i + 1, ETag: part.ETag });
//     }

//     const completeParams = {
//       Bucket: 'exerciseimage',
//       Key: originalname,
//       MultipartUpload: {
//         Parts: parts
//       },
//       UploadId: uploadId
//     };

//     // Complete the multipart upload
//     const data = await s3.completeMultipartUpload(completeParams).promise();

//     return res.status(200).json({ status: true, url: data.Location });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// Handling the file upload with multer middleware
exports.addCategory = async (req, res) => {
  try {

    const { category, file, video } = req.body;

    if (!category || !file || (!Array.isArray(video) || video.length == 0)) {
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
    } else {
      return res.status(HttpStatus.INVALID).json(StatusMessage.SERVER_ERROR);
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
    else {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
    // Handle errors
  }
};




exports.deleteCategory = async (req, res) => {
  try {
    const deleteID = req.params.id;

    if (!deleteID) {
      return res.status(HttpStatus.BAD_REQUEST).json("Missing ID.");
    }

    const deleteCat = await Category.findByIdAndDelete(deleteID)
    if (!deleteCat) {
      return res.status(HttpStatus.INVALID).json(StatusMessage.NOT_FOUND);
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


    if (!id || !updatedDetails) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_DATA);
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updatedDetails, { new: true });

    if (!updatedCategory) {
      return res.status(HttpStatus.INVALID).json(StatusMessage.NOT_FOUND);
    }

    return res.status(HttpStatus.OK).json(StatusMessage.USER_UPDATED);
  } catch (error) {
    console.error(error);

    return res.status(HttpStatus.BAD_REQUEST).json("Error updating category.");
  }
};
exports.getCategoryById = async (req, res) => {
  try {
    const _id = req.params.id;

    const categoryData = await Category.findById(_id);
    if (!categoryData) {
      return res.status(HttpStatus.INVALID).json(StatusMessage.NOT_FOUND);
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
    if (email) {
      user = await Admin.findOne({ email });
    } else {
      user = await Admin.findOne({ contact });
    }
  }
  if (!user) {
    return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.USER_NOT_FOUND);
  }
  const token = generateToken({ email: user.email });
  const mailOptions = {
    from: "mailto:akash.hardia@gmail.com",
    to: user.email,
    subject: "Reset Password Link",
    text: `<h2>Hello! ${user.name} </h2>
    <h3>Please follow the link to reset your password: http://50.17.174.239/resetpassword/${token}</h3>
    <h3>Thanks and regards</h3>
    `
  };

  try {
    const info = await sendEmail(mailOptions);
    console.log("Email sent:", info);
    return res.status(200).json("Reset link sent to registered mail.");
  } catch (error) {
    console.log("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}


exports.resetPassword = async (req, res) => {
  const { password } = req.body
  let hashedPassword
  if (!password) {
    return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_DATA);

  }
  else {
    hashedPassword = await bcrypt.hash(password, 10)
  }
  const authHeader = req.headers.authorization;
  let token = '';
  let user = ''
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = authHeader
  }
  // console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Please login to access this resource" });
  } else {
    const decodedData = verifyToken(token);
    //   console.log(decodedData);
    if (!decodedData) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(StatusMessage.USER_NOT_FOUND);
    }
    user = await User.findOne({ email: decodedData?.email });
    if (user === null) {
      user = await Admin.findOne({ email: decodedData?.email });
    }
    const role = user.role
    const id = user._id?.toString(); // Accessing _id using dot notation
    // console.log(userId);
    console.log(role);
    if (!role) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(StatusMessage.USER_NOT_FOUND);
    }
    if (role === "Admin") {
      try {
        const updatedUser = await Admin.findByIdAndUpdate(
          id, // pass the ID directly
          { password: hashedPassword }, // update only the password field
          { new: true }
        );
        if (!updatedUser) {
          return res.status(HttpStatus.BAD_REQUEST).json("User not found.");
        }

        return res.status(HttpStatus.OK).json(StatusMessage.USER_UPDATED);
      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json("Error updating password.")
      }
    }
    if (role === "User") {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          id, // pass the ID directly
          { password: hashedPassword }, // update only the password field
          { new: true }
        );
        if (!updatedUser) {
          return res.status(HttpStatus.BAD_REQUEST).json("User not found.");
        }

        return res.status(HttpStatus.OK).json(StatusMessage.USER_UPDATED);
      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json("Error updating password.")
      }
    }
    // console.log("user", user._id);
  }
}

exports.changeUserPwd = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  const authHeader = req.headers.authorization;
  let token = '';
  let user = ''



  if (!authHeader || !oldPassword || !newPassword) {
    return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_DATA);
  }
  try {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else {
      token = authHeader
    }
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please login to access this resource" });
    } else {
      const decodedData = jwt.verify(token, process.env.jwtKey);
      //   console.log(decodedData);
      if (!decodedData) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(StatusMessage.USER_NOT_FOUND);
      }
      user = await User.findOne({ email: decodedData?.email });
      if (!user) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(StatusMessage.USER_NOT_FOUND);
      }
    }
    // const user = await Admin.findById(id)
    //  console.log(user._id.toString());
    const id = user._id?.toString()
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (isPasswordMatch) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const changedPwd = await User.findByIdAndUpdate(id, { password: hashedPassword })
      if (!changedPwd) {
        return res.status(HttpStatus.BAD_REQUEST).json("User not found.");
      } else {
        return res.status(HttpStatus.OK).json(StatusMessage.USER_UPDATED);

      }
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.INVALID_CREDENTIALS);
    }


  } catch (error) {
    console.log(error);
    return res.status(HttpStatus.SERVER_ERROR).json(StatusMessage.SERVER_ERROR);

  }
}


exports.changeAdminPwd = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  const authHeader = req.headers.authorization;
  let token = '';
  let user = ''



  if (!authHeader || !oldPassword || !newPassword) {
    return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_DATA);
  }
  try {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else {
      token = authHeader
    }
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please login to access this resource" });
    } else {
      const decodedData = jwt.verify(token, process.env.jwtKey);
      //   console.log(decodedData);
      if (!decodedData) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(StatusMessage.USER_NOT_FOUND);
      }
      user = await Admin.findOne({ email: decodedData?.email });
      if (!user) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json(StatusMessage.USER_NOT_FOUND);
      }
    }
    // const user = await Admin.findById(id)
    //  console.log(user._id.toString());
    const id = user._id?.toString()
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (isPasswordMatch) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const changedPwd = await Admin.findByIdAndUpdate(id, { password: hashedPassword })
      if (!changedPwd) {
        return res.status(HttpStatus.BAD_REQUEST).json("User not found.");
      } else {
        return res.status(HttpStatus.OK).json(StatusMessage.USER_UPDATED);

      }
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json(StatusMessage.INVALID_CREDENTIALS);
    }


  } catch (error) {
    console.log(error);
    return res.status(HttpStatus.SERVER_ERROR).json(StatusMessage.SERVER_ERROR);

  }
}

//////////////////////////////////watchTime//////////////


exports.addWatchTime = async (req, res) => {
  try {
    const { URL, date, userID } = req.body;

    // Check for missing data
    if (!URL || !date || !userID) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_DATA);
    }

    // Check if there is previous data for the same userID and URL
    const isPrevious = await WatchTime.find({ userID, URL });

    if (isPrevious && Array.isArray(isPrevious) && isPrevious.length > 0) {
      return res.status(HttpStatus.OK).json(StatusMessage.DUPLICATE_DATA);
    }

    // Save the new WatchTime entry
    const timeData = new WatchTime({ URL, date, userID });
    const result = await timeData.save();

    if (result) {
      return res.status(HttpStatus.OK).json(StatusMessage.SAVED_SUCC);
    } else {
      return res.status(HttpStatus.INVALID).json(StatusMessage.SERVER_ERROR);
    }
  } catch (error) {
    console.error("addwatch", error);
    return res.status(HttpStatus.SERVER_ERROR).json(StatusMessage.SERVER_ERROR);
  }
};
exports.getWatchByUser = async (req, res) => {
  try {
    const { userID } = req.params
    if (!userID) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_DATA);
    }
    const watchData = await WatchTime.find({ userID })
    // console.log(watchData);
    if (watchData && Array.isArray(watchData) && watchData.length > 0) {
      return res.status(HttpStatus.OK).json({
        watchData
      })
    }
    return res.status(HttpStatus.INVALID).json(StatusMessage.NOT_FOUND)

  } catch (error) {
    console.error("getWatch", error);
    return res.status(HttpStatus.SERVER_ERROR).json(StatusMessage.SERVER_ERROR);
  }
}




/////////////////////feedback//////////////////////

exports.addfeedBack = async (req, res) => {
  try {
    const { name, email, contact, message, userID } = req.body
    if (!name || !email || !contact || !message || !userID) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.MISSING_DATA);
    }
    const feedbackData = new Feedback({ name, email, contact, message, userID })
    const result = await feedbackData.save()
    if (result) {
      try {
        const mailOptions = {
          from: "mailto:akash.hardia@gmail.com",
          to: "mailto:akash.hardia@gmail.com",
          subject: "NOTIFICATION - New Feedback!",
          text: `
            <html>
              <body>
                <h3>Hello,</h3>
                <p>New feedback received, details as follows:</p>
                <ul>
                  <li><strong>Name:</strong> ${name}</li>
                  <li><strong>Email:</strong> ${email}</li>
                  <li><strong>Contact:</strong> ${contact}</li>
                  <li><strong>Message:</strong> ${message}</li>
                </ul>
                <p>Thanks and regards</p>
              </body>
            </html>
          `,
        };
        const info = await sendEmail(mailOptions);
        // console.log("Email sent:", info);
        return res.status(HttpStatus.OK).json(StatusMessage.SAVED_SUCC);
      } catch (error) {
        console.log("Error sending email:", error);
        return res.status(201).json({ error: "Failed to send email" });
      }
      // return res.status(HttpStatus.OK).json(StatusMessage.SAVED_SUCC);
    } else {
      return res.status(HttpStatus.INVALID).json(StatusMessage.SERVER_ERROR);
    }
  } catch (error) {
    console.log(error);
    return res.status(HttpStatus.SERVER_ERROR).json(StatusMessage.SERVER_ERROR)
  }
}

exports.viewAllFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the requested page, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get the requested limit, default to 10

    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;

    const feedbackCount = await Feedback.countDocuments(); // Get total count of feedback

    const totalPages = Math.ceil(feedbackCount / limit); // Calculate total pages

    const feedback = await Feedback.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order or another appropriate field

    return res.status(HttpStatus.OK).json({
      feedback: feedback,
      pagination: {

        totalPages: totalPages,
        currentPage: page,
        totalFeedback: feedbackCount,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(HttpStatus.SERVER_ERROR).json(StatusMessage.SERVER_ERROR);
  }
};
exports.deleteFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is valid or not
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json(StatusMessage.NOT_FOUND);
    }

    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return res.status(HttpStatus.INVALID).json(StatusMessage.NOT_FOUND);
    }

    return res.status(HttpStatus.OK).json(StatusMessage.USER_DELETED);
  } catch (error) {
    console.error(error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(StatusMessage.SERVER_ERROR);
  }
};