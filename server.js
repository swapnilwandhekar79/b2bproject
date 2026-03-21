const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cors());

// ===== MONGODB =====
mongoose.connect(
  "mongodb://swapnil2525:swapnil2525@ac-q4fimj9-shard-00-00.odfmxt2.mongodb.net:27017,ac-q4fimj9-shard-00-01.odfmxt2.mongodb.net:27017,ac-q4fimj9-shard-00-02.odfmxt2.mongodb.net:27017/b2bDB?ssl=true&replicaSet=atlas-qo8ufj-shard-0&authSource=admin"
)
.then(()=>console.log("MongoDB Connected ✅"))
.catch(err=>console.log("Mongo Error:",err));

// ===== MODELS =====

// USER
const User = mongoose.model("User", {
  username: String,
  password: String
});

// PRODUCT
const Product = mongoose.model("Product", {
  name: String,
  price: Number
});

// ORDER
const Order = mongoose.model("Order", {
  customerName: String,
  productName: String,
  quantity: Number,
  totalPrice: Number,
  user: String,
  status: { type: String, default: "Pending" }
});

// ===== ROUTES =====

// SIGNUP
app.post("/signup", async (req,res)=>{
  try {
    await new User(req.body).save();
    res.json({message:"Signup success ✅"});
  } catch {
    res.json({message:"Error ❌"});
  }
});

// LOGIN
app.post("/login", async (req,res)=>{
  const user = await User.findOne(req.body);
  if(user) res.json({message:"Login successful ✅"});
  else res.json({message:"Invalid ❌"});
});

// ADD PRODUCT
app.post("/add-product", async (req,res)=>{
  await new Product(req.body).save();
  res.json({message:"Product added ✅"});
});

// GET PRODUCTS
app.get("/products", async (req,res)=>{
  res.json(await Product.find());
});

// CREATE ORDER
app.post("/order", async (req,res)=>{
  await new Order(req.body).save();
  res.json({message:"Order saved ✅"});
});

// USER ORDERS
app.get("/orders/:user", async (req,res)=>{
  res.json(await Order.find({user:req.params.user}));
});

// UPDATE STATUS
app.post("/update-status", async (req,res)=>{
  const {id,status} = req.body;
  await Order.findByIdAndUpdate(id,{status});
  res.json({message:"Updated ✅"});
});

// ADMIN
app.get("/all-orders", async (req,res)=>{
  res.json(await Order.find());
});

// TEST
app.get("/", (req,res)=>{
  res.send("API Running 🚀");
});

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log("Server running 🚀"));