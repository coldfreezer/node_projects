// session module for session  creation 
const session = require("express-session")
const express = require("express"); // for express js module
const bodyparser = require("body-parser"); // for getting jason
// const bcrypt = require("bcrypt")// for encrypting pass
const app = express(); // using middleware for the app
let port = 4000;
const path = require("path");
const empcollection = require("./model/model");
const blog = require("./model/blog");
const { Cookie } = require("express-session");
const multer = require("multer");
app.set("view engine", "ejs");

const template_path = path.join(__dirname, "./template/views");
app.set("views", template_path);
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json())
console.log(__dirname);
//for  importing static files like .css
app.use(express.static(path.join(__dirname, "static")));
// for accessing database connectivity
require("./db/db");

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.listen(port, () => {
  console.log(`listeninig to the ${port}`);
});

//=================multer for image upload/storage=================//
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
     cb(null,'uploads')},
  filename: (req, file, cb)=>{
    cb(null, file.fieldname + "-" + Date.now()+".jpg")
  }
});

const upload = multer({ storage:storage }).single("image")
 

//================using for session ids============================//
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  Cookie: { maxAge: 60000 }
}))

//============post api for login page=============================//
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await empcollection.findOne({ email: email });

    if (useremail.password === password) {
      req.session.email = useremail.email
      res.status(201).redirect("main");

    } else {
      res.send("invalid login details");
    }
  } catch (error) {
    res.status(400).end("invalid login details");
  }
});

//==============post api for signup page=========================//
app.post("/signup", upload, async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (password === cpassword) {
      const register = new empcollection({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        image:req.file.filename
      });
      const registered = await register.save();
      console.log("done")
      res.redirect("/");
      // res.send(registered);
    } else {
      res.send("details did not match")
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("details did not matched");
  }
});

//====================post api for main==========================//

app.post("/main", async (req, res) => {


  const data = {
    title: req.body.title,
    description: req.body.description
  }
  await blog.insertMany([data])

  return res.redirect("/")
})

//================get api FOR INDEX/session check=============================//

app.get("/", async (req, res) => {

  let blogs = await blog.find()
  let blogsnum = await blog.countDocuments()
  if (req.session.email) {
    res.render("index", { blogs, blogsnum })
  } else {
    res.render("login")
  }

})

