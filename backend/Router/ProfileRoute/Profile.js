const express = require('express');
const multer = require("multer")
const path = require('path')
const ProfileRouter = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './photo')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${path.extname(file.originalname)}`)
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    },
  })
  
  const upload = multer({ storage: storage })

const { getProfile, putEmployeestatus } = require("../../Controller/Profile/Profile")

ProfileRouter.post('/profile/:emailAddress', getProfile)
ProfileRouter.put('/updatestatus',putEmployeestatus);
// ProfileRouter.post('/addprofile', upload.single('profile_photo'),postProfile)

module.exports = ProfileRouter;