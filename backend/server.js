const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Student = require("./models/Student");
const Course = require("./models/Course");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));


// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const student = await Student.create({
    name,
    email,
    password: hashed
  });

  res.json(student);
});


// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });
  if (!student) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, student.password);
  if (!valid) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: student._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});


// CREATE COURSE (Protected)
app.post("/api/courses", authMiddleware, async (req, res) => {
  const course = await Course.create(req.body);
  res.json(course);
});


// GET COURSES (Protected + Search)
app.get("/api/courses", authMiddleware, async (req, res) => {
  const { search } = req.query;

  let query = {};
  if (search) {
    query.courseName = { $regex: search, $options: "i" };
  }

  const courses = await Course.find(query);
  res.json(courses);
});


// UPDATE COURSE
app.put("/api/courses/:id", authMiddleware, async (req, res) => {
  const updated = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});


// DELETE COURSE
app.delete("/api/courses/:id", authMiddleware, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));