const router = require('express').Router();
const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcrypt');

//update

router.put('/:id', async (req, res) => {
   if(req.body.userId === req.params.id){
      if(req.body.password ){
         //giai mai password
         const salt = await bcrypt.genSalt(10);
         req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      try {
         const updateUser = await User.findByIdAndUpdate(req.params.id, {
            //nhap vao body
            $set:req.body, 

         },{new:true /* tra lai gia tri moi cap nhat */})
         res.status(200).json(updateUser)
      }
      catch(error) {
         res.status(500).json(error)
      }
   }
   else{
      res.status(401).json('ban chi co the update 1 tai khoan')
   }
   
})

// delete

router.delete('/:id', async (req, res) => {
   if(req.body.userId === req.params.id){
      try {
         const user = User.findById(req.params.id)
         try {
            await Post.deleteMany({ username: user.username })
            await User.findByIdAndDelete(req.params.id,{new:true /* tra lai gia tri moi cap nhat */})
            res.status(200).json('tai khoan nay da bi xoa!')
         }
         catch(err){
            res.status(500).json(err)
         }
         
      }
      catch(error) {
         res.status(404).json('tai khoan khong ton tai')
      }
   }
   else{
      res.status(401).json('ban chi co the xoa 1 tai khoan')
   }
   
})

// get user 

router.get('/:id', async (req, res) => {
   try{
      const user = await User.findById(req.params.id );
      const {password, ...others} = user._doc;
      res.status(200).json(others);
   }catch(err){
      res.status(500).json(err)
   }
})


 module.exports = router
