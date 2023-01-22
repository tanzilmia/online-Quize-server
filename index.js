const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
const mongoUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nz3kcdw.mongodb.net/OnlineQuize?retryWrites=true&w=majority`;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connceted mongoose");
  })
  .catch((e) => console.log(e));

// defining scemmma
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const categroyScema = new mongoose.Schema({
  categoryName: String,
  
});

// quize Scemma
const inserQuizeScema = new mongoose.Schema({
  title: String,
  quizeOptions: Array,
  correctAnswer: String,
  categoryName: String,
});

const allQuize = new mongoose.model("allQuize", inserQuizeScema);
const User = new mongoose.model("User", userSchema);
const category = new mongoose.model("category", categroyScema);

// find all categorys

app.get("/allCategorys", async(req,res)=>{
  
  category.find({}, (err, data) => {
  if (err) {
      
  } else {
      res.send({data})
  }
});
})

// insert category 

app.post("/addcategory", async (req, res) => {
  const categorys = req.body;
  const {categoryName} = categorys;
  const alreadyExist = await category.findOne({ categoryName: categoryName });
  if (alreadyExist) {
    res.send({ message: "exist" });
  } else {
    const NewQuizeCategory = new category(categorys); 
    NewQuizeCategory.save((error)=>{
      if (error) {
        res.send(error);
      } else {
        res.send({ message: "successfull" });
      }
    })
  }
});


// quize  routes

app.post("/insertquize", async (req, res) => {
  const quizedata = req.body;
  const { title, categoryName } = quizedata;
  const alreadyExist = await allQuize.findOne({ title: title });
  if (alreadyExist) {
    res.send({ message: "exist" });
  } else {
    const NewQuizequize = new allQuize(quizedata);
    NewQuizequize.save((error)=>{
      if (error) {
        res.send(error);
      } else {
        res.send({ message: "successfull" });
      }
    })
  }
});

// regiset route

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const encrypetPassword = await bcrypt.hash(password, 10);
  const alredayRegister = await User.findOne({ email: email });

  if (alredayRegister) {
    res.send({ message: "User already registerd" });
  } else {
    const user = new User({
      name,
      email,
      password: encrypetPassword,
    });
    user.save((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send({ message: "Successfully Registered" });
      }
    });
  }
});

app.get("/demo", async (req, res) => {
  res.send("demo file");
});

// login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const matchUser = await User.findOne({ email: email });
  if (matchUser) {
    if (await bcrypt.compare(password, matchUser.password)) {
      const token = jwt.sign(
        { email: matchUser.email },
        `${process.env.JWT_SECRET}`
      );
      res.send({ message: "Successfull", data: token });
    } else {
      res.send({ message: "Password didn't match" });
    }
  } else {
    res.send({ message: "User not registered" });
  }
});

// userdata
app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, `${process.env.JWT_SECRET}`);
    const userEmail = user.email;
    User.findOne({ email: userEmail })
      .then((data) => {
        res.send({ status: "Ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "Ok", data: error });
      });
  } catch (error) {}
});

app.get("/", (req, res) => {
  res.send("quize app is running!");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
