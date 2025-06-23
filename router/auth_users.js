const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if the username already exists
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  // Check if username and password match
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate presence
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Authenticate user
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Generate JWT
  const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

  // Save token in session
  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({
    message: "Customer login successful",
    token: accessToken
  });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  // Validate input
  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review query is missing" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Ensure the reviews object exists
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or modify the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully added or modified",
    reviews: books[isbn].reviews
  });
});

// DELETE route to remove a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  // Check if user is logged in
  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has a review
  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "No review found for this user on the given book" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
