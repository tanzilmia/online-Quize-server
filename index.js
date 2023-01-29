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
const QuizeSetting = new mongoose.Schema({
  timer:Number,
  dayliQuize:Number,
  icressPoint:Number,
  decressPoint:Number,
  autosubmitPoint:Number,
 
 
});

// user dailyQuize 
const DailyQuizeInfo = new mongoose.Schema({
        email :String,
        categoryName:String,
        date:String,
        currentQuestion:Number,
        score:Number,
        rightAns:Number,
        wrongAns:Number,
        autoSubmitAnswer:Number,
})


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
const settings = new mongoose.model("settings",QuizeSetting);
const dailyQuize = new mongoose.model("dailyQuize",DailyQuizeInfo);

// get single Quize 

app.get("/single-Quize/:id", async (req,res)=>{
  const id = req.params.id
  try{
    await allQuize.findOne({_id:id}, (err,data)=>{
      if(err){
        res.send({message:"data not found"})
      }else{
        res.send(data)
      }
    })
  }catch(err){}
  
})

// update timer 

app.put("/update-timer", async(req,res)=>{
  const {time} = req.body
  try{
    await settings.updateOne({},
      {
        $set:{
          timer:time
            
        }
      },
      (err)=>{
        if(err){
          res.send({message:"sorry Update not complete"})
        }else{
          res.send({message:"update complete"})
        }
      }
      )
  }catch(err){}
})


app.put("/single-Quize-update", async(req,res)=>{
  const updateinfo = req.body
  const {title,quizeOptions,categoryName,correctAnswer,id} = updateinfo
  
  try{
    await allQuize.updateOne({_id:id},
      {
        $set:{
          title: title,
          quizeOptions: quizeOptions,
          correctAnswer: correctAnswer,
          categoryName: categoryName,
        }
      },
      (err)=>{
        if(err){
          res.send({message:"sorry Update not complete"})
        }else{
          res.send({message:"update complete"})
        }
      }
      )
  }catch(err){}
})







// update daily Quize limite

app.put("/update-dailyQuze", async(req,res)=>{
  const {UpdateDailyQuize} = req.body

  try{
    await settings.updateOne({},
      {
        $set:{
          dayliQuize:UpdateDailyQuize
            
        }
      },
      (err)=>{
        if(err){
          res.send({message:"sorry Update not complete"})
        }else{
          res.send({message:"update complete"})
        }
      }
      )
  }catch(err){}
})
// update right point
app.put("/update-right-point", async(req,res)=>{
  const {UpdaterightPoint} = req.body

  try{
    await settings.updateOne({},
      {
        $set:{
          icressPoint:UpdaterightPoint
            
        }
      },
      (err)=>{
        if(err){
          res.send({message:"sorry Update not complete"})
        }else{
          res.send({message:"update complete"})
        }
      }
      )
  }catch(err){}
})  

// update wrong point
app.put("/update-wrong-point", async(req,res)=>{
  const {UpdatewrongPoint} = req.body

  try{
    await settings.updateOne({},
      {
        $set:{
          decressPoint:UpdatewrongPoint
            
        }
      },
      (err)=>{
        if(err){
          res.send({message:"sorry Update not complete"})
        }else{
          res.send({message:"update complete"})
        }
      }
      )
  }catch(err){}
})  

// update autosubmit point
app.put("/update-autosubmit-point", async(req,res)=>{
  const {Updateautosubmit} = req.body
  try{
    await settings.updateOne({},
      {
        $set:{
          autosubmitPoint:Updateautosubmit
            
        }
      },
      (err)=>{
        if(err){
          res.send({message:"sorry Update not complete"})
        }else{
          res.send({message:"update complete"})
        }
      }
      )
  }catch(err){}
})  




// get all user info 

app.get("/all-user", async(req,res)=>{
 try{
  User.find({}, (err,data)=>{
    if(err){
      res.send({message:"No User Available"})
    }else{
      res.send(data)
    }
  })
 }catch(err){}
})

// get my quize histry -- user panel

app.get("/user-info", async(req,res)=>{
 try{
  dailyQuize.find({email:req.query.email}, (err,data)=>{
    if(err){
      res.send({message:"No User Available"})
    }else{
      res.send(data)
    }
  })
 }catch(err){}
})

// get single user info

app.get("/single-user-info/:email", async(req,res)=>{
  
 try{
  dailyQuize.find({email:req.params.email}, (err,data)=>{
    if(err){
      res.send({message:"No User Available"})
    }else{
      res.send(data)
    }
  })
 }catch(err){}
})


app.get("/all-user-history", async(req,res)=>{
 try{
  dailyQuize.find({}, (err,data)=>{
    if(err){
      res.send({message:"No User Available"})
    }else{
      res.send(data)
    }
  })
 }catch(err){}
})


// delete a user 


app.delete("/delete-user-history", async(req,res)=>{
  try{
    await dailyQuize.deleteOne({_id:req.query.id}, (err)=>{
      if(err){
        res.send({message:" Not Success Delete History"})
      }else{
        res.send({message:"Successfully Deleted User History"})
      }
    })
  }catch(err){}
})


// delete user

app.delete("/delete-user", async(req,res)=>{
  try{
    await User.deleteOne({_id:req.query.id}, (err)=>{
      if(err){
        res.send({message:" Not Success Delete History"})
      }else{
        res.send({message:"Successfully Deleted User History"})
      }
    })
  }catch(err){}
})


// delete quize 


app.delete("/delete-quize", async(req,res)=>{
  try{
    await allQuize.deleteOne({_id:req.query.id}, (err)=>{
      if(err){
        res.send({message:" Not Success Delete History"})
      }else{
        res.send({message:"Successfully Deleted"})
      }
    })
  }catch(err){}
})

// delete category name
app.delete("/delete-category", async(req,res)=>{
  try{
    await category.deleteOne({_id:req.query.id}, (err)=>{
      if(err){
        res.send({message:" Not Success Delete History"})
      }else{
        res.send({message:"Successfully Deleted"})
      }
    })
  }catch(err){}
})

// reset user history

app.put("/reset-user-history", async(req,res)=>{
  const {id} = req.query
  try{
    await dailyQuize.updateOne({_id:id},
      {
        $set:{
            wrongAns:0,
            score:0,
            currentQuestion :0,
            rightAns:0,
        }
      },
      (err)=>{
        if(err){
          res.send({message:"sorry Update not complete"})
        }else{
          res.send({message:"update complete"})
        }
      }
      )
  }catch(err){}
})


app.put("/auto-submit-quize", async(req,res)=>{
  const {wrong,score,categoryName,date,email,currentQuestion,dayliQuize,autosubmitPoint,autosubmit} = req.body;
  const isAlreadyExist = await dailyQuize.findOne({email:email,date:date,categoryName:categoryName});
  if(isAlreadyExist.currentQuestion === dayliQuize){  
    res.send({message:"You Already Play TODay"})
  }else{
    try{
      await dailyQuize.updateOne(
        {email:email,date:date,categoryName:categoryName},
        {
          $set:{
            wrongAns:wrong + 1,
            score:score - autosubmitPoint,
            currentQuestion : currentQuestion + 1,
            autoSubmitAnswer : autosubmit + 1,
          },
        },
        (err)=>{
          if(err){
            res.send({message:"error Update"})
          }else{
            res.send({message:"auto submit Quize Update"})
          }
        }
      )
    }catch(err) {}
  }
  
})

// right anser 
app.put("/right-quize", async(req,res)=>{
  const {score,categoryName,date,email,currentQuestion,dayliQuize,rigthAns,icressPoint} = req.body;
  const isAlreadyExist = await dailyQuize.findOne({email:email,date:date,categoryName:categoryName});
  if(isAlreadyExist.currentQuestion === dayliQuize){  
    res.send({message:"You Already Play TODay"})
  }else{
    try{
      await dailyQuize.updateOne(
        {email:email,date:date,categoryName:categoryName},
        {
          $set:{
            rightAns:rigthAns + 1,
            score:score + icressPoint,
            currentQuestion : currentQuestion + 1
          },
        },
        (err)=>{
          if(err){
            res.send({message:"error Update"})
          }else{
            res.send({message:"right answer points Update"})
          }
        }
      )
    }catch(err) {}
  }
  
})
// wrong answer
app.put("/wrong-quize", async(req,res)=>{
  const {score,categoryName,date,email,currentQuestion,dayliQuize,wrong,decressPoint} = req.body;
  const isAlreadyExist = await dailyQuize.findOne({email:email,date:date,categoryName:categoryName});
  if(isAlreadyExist.currentQuestion === dayliQuize){  
    res.send({message:"You Already Play TODay"})
  }else{
    try{  
      await dailyQuize.updateOne(
        {email:email,date:date,categoryName:categoryName},
        {
          $set:{
            wrongAns:wrong + 1,
            score:score - decressPoint,
            currentQuestion : currentQuestion + 1
          },
        },
        (err)=>{
          if(err){
            res.send({message:"error Update"})
          }else{
            res.send({message:"wrong answer points Update"})
          }
        }
      )
    }catch(err) {}
  }
  
})

// get daily stored data 

app.get("/store-daily-quize", async(req,res)=>{
  const {email,date,categoryName} = req.query
  try{
    dailyQuize.findOne({email:email,date:date,categoryName:categoryName}, (err,data)=>{
      if(err){
        res.send({message:"Sorry Not Available Info"})
      }else{
        res.send({data})
      }
    })
  } catch(err) {}
})


app.post("/store-daily-quize", async(req,res)=>{
  const userdailyQuize = req.body
  const { email,categoryName,date } = userdailyQuize;
  const alreadyPlayed = await dailyQuize.findOne({ email: email , categoryName:categoryName,date:date});
  if(alreadyPlayed){
    res.send({message: `you alreay Play ${date}`})
  }else{
      const newdailyQuize = new dailyQuize(userdailyQuize)
      newdailyQuize.save((err)=>{
        if(err){
          res.send({message:"Something went to wrong"})
        }else{
          res.send({message:"SuccessFull"})
        }
      })
  }
})

app.get("/settings", async(req,res)=>{
  try{
    settings.find({}, (err,data)=>{
      if(err){
        res.send({message:"no Data Availabe"})
      }else{
        res.send({data})
      }
    })
  }catch(err){}
})

// get quize data 

app.get("/playQuize/:categoryName", async (req,res)=>{
  const categoryName = req.params.categoryName;
  try{
 
    allQuize.find({categoryName:categoryName}, (err,data)=>{
      if (err) {
        res.send({message : "data not Founding"})
      } else {
          res.send({data})
      }
    })

  }catch(err){
    console.log(err);
  }
})

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
  const alreadyExist = await allQuize.findOne({ title: title,categoryName:categoryName });
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
