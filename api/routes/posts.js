const router = require('express').Router();
const User = require('../models/user');
const Post = require('../models/post');

//create post

router.post('/', async (req, res) => {
   //khoi tao post moi theo body nhan duoc
   const newPost = new Post(req.body);
   try{
      const savePost = await newPost.save();
      res.status(200).json(savePost)
   }
   catch(err){
      res.status(500).json(err)
   }
   
})


//update post
router.put('/:id', async (req, res) => {
   try {
      //kiem tra ton tai post
      const post = await Post.findById(req.params.id);
      if(post.username === req.body.username){
         try {
            //thuc hien update post
            const updatePost = await Post.findByIdAndUpdate(req.params.id,{
               $set:req.body
            },{ new:true })
            res.status(200).json(updatePost)
         } catch (error) {
            res.status(500).json(error)
         }  
      }
      else{
         res.status(401).json('bạn không phải người tạo bài viết này')
      }
   } catch (error) {
      res.status(500).json(error)
   }
})

// delete post 
router.delete('/:id', async (req, res) => {
   try {
      //kiem tra ton tai post
      const post = await Post.findById(req.params.id);
      if(post.username === req.body.username){
         try {
            //thuc hien delate post
            await post.delete()
           
            res.status(200).json('Bài viết đã bị xóa!')
         } catch (error) {
            res.status(500).json(error)
         }  
      }
      else{
         res.status(401).json('Bạn không có quyền xóa khi không phải người tạo bài viết này!')
      }
   } catch (error) {
      res.status(500).json(error)
   }
})

// get post 
router.get('/:id', async (req, res) => {
   try{
      const post = await Post.findById(req.params.id );
      res.status(200).json(post);
   }catch(err){
      res.status(500).json(err)
   }
})

// get list post 

router.get('/', async (req, res) => {
   const username = req.query.user;
   const catName = req.query.cat;

   try {
      let posts;
      if(username){
         posts = await Post.find({username})
      } else if(catName){
         posts = await Post.find({categories:{
            $in:[catName]
         }})
      }  
      else{
         posts = await Post.find()
      }
      res.status(200).json(posts);
   } catch (error) {
      
   }
})

 module.exports = router
