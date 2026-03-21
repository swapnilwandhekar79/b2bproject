const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= MONGODB =================
mongoose.connect("mongodb+srv://swapnil2525:swapnil2525@cluster0.odfmxt2.mongodb.net/b2b")
.then(()=>console.log("MongoDB Connected ✅"))
.catch(err=>console.log("Mongo Error:",err));

// ================= MODELS =================

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

// ================= ROUTES =================

// TEST
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    await new User(req.body).save();
    res.json({ message: "Signup successful ✅" });
  } catch (err) {
    res.json({ message: "Signup error ❌" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (user) {
    res.json({ message: "Login successful ✅" });
  } else {
    res.json({ message: "Invalid login ❌" });
  }
});

// ADD PRODUCT
app.post("/product", async (req, res) => {
  await new Product(req.body).save();
  res.json({ message: "Product added ✅" });
});

// GET PRODUCTS
app.get("/products", async (req, res) => {
  const data = await Product.find();
  res.json(data);
});

// CREATE ORDER
app.post("/order", async (req, res) => {
  await new Order(req.body).save();
  res.json({ message: "Order saved ✅" });
});

// GET USER ORDERS
app.get("/orders/:user", async (req, res) => {
  const data = await Order.find({ user: req.params.user });
  res.json(data);
});

// UPDATE STATUS (optional)
app.post("/update-status", async (req, res) => {
  const { id, status } = req.body;
  await Order.findByIdAndUpdate(id, { status });
  res.json({ message: "Status updated ✅" });
});

// ADMIN ALL ORDERS
app.get("/all-orders", async (req, res) => {
  const data = await Order.find();
  res.json(data);
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running 🚀");
});
