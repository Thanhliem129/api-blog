const router = require('express').Router();
const User = require('../models/user');
// goi thu vien ma hoa mat khau
const bcrypt = require('bcrypt');

//register

router.post('/register', async (req, res) => {
   try {
      // ma hoa password
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt)
      // khoi tao user moi
      const newUser = new User({
         username : req.body.username,
         email : req.body.email,
         password : hashedPass,
         
      })
      const user = await newUser.save();
      res.status(200).json(user)
   }
   catch(error) {
      res.status(500).json(error)
   }
})

//login 

router.post('/login', async( req, res) => {
   try {
      // tim kiem user
      const user = await User.findOne({username : req.body.username})
      !user && res.status(400).json('Sai ten dang nhap!');
      //giai ma password
      const validated = await bcrypt.compare(req.body.password, user.password)
      !validated && res.status(400).json('Sai mat khau!');
      //thanh cong
      const {password, ...others} = user._doc;
      res.status(200).json(others);
   }
   catch(error) {
      res.status(500).json(error)
   }
})


 module.exports = router
