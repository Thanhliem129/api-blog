const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const router = require('./routes/auth');
const userRouter = require('./routes/users')
const postRouter = require('./routes/posts')
const catRouter = require('./routes/categories');
const multer = require('multer');
const path = require('path');

const app = express();

dotenv.config();
app.use(express.json())

app.use('/images', express.static(path.join(__dirname, "images")))

mongoose.connect(process.env.MONGO_URL,{
   useUnifiedTopology : true,
   useNewUrlParser: true,
   // useCreateIndex : true,
   // useFindAndModify:true
}).then(console.log('connect to mongoDb')).catch((err) => console.log(err) )

const storage = multer.diskStorage({
   destination: (req, file, cb) =>{
      cb(null, ("images"))
   }, 
   filename:(req, file, cb)=>{
      cb(null, req.body.name)
   }
});

const upload = multer({storage:storage})

app.post('/api/upload/', upload.single("file"), (req, res)=>{
   res.status(200).json('File has been uploaded')
});

app.use('/api/auth', router);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/category', catRouter);

app.listen("5000", () => {
   console.log("backend is running")
})