const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./model/Todo");
const User = require("./model/user");
const path = require("path");


const app = express();
app.use(express.json());
app.use(cors());
DB = process.env.DB;

mongoose
  .connect(
    "mongodb+srv://Akash123:Akash123@cluster0.kt8hu8n.mongodb.net/todoDB",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

app.get("/todos/:username", async (req, res) => {
  try {
    const todos = await Todo.find({ username: req.params.username });
    res.status(200).json(todos);
  } catch (err) {
    res.json(err);
  }
});

app.post("/todos", async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      username: req.body.username,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({
      message: "Can not add the todo item",
    });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

app.patch("/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.complete = !todo.complete;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.json(err);
  }
});

app.post("/register", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({
      message: "Something went wrong",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({
      message: "Could not find user",
    });
  }
});

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log("server started on port 3000");
});
