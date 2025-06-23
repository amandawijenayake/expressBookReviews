const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Step 1: Retrieve ISBN from request parameters
  const isbn = req.params.isbn;

  // Step 2: Check if the book with that ISBN exists
  if (books.hasOwnProperty(isbn)) {
    // Step 3: Send book details as JSON response
    return res.status(200).json({
      message: "Book found",
      book: books[isbn]
    });
  } else {
    // Step 4: If not found, return 404 response
    return res.status(404).json({ message: "Book not found with the given ISBN." });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];

  // Iterate over all book entries
  Object.keys(books).forEach((isbn) => {
    const book = books[isbn];
    if (book.author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push({
        isbn: isbn,
        title: book.title,
        author: book.author,
        reviews: book.reviews
      });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json({
      message: "Books by the author found",
      books: matchingBooks
    });
  } else {
    return res.status(404).json({ message: "No books found for the given author." });
  }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  const matchingBooks = [];

  // Loop through all books to find matches
  Object.keys(books).forEach((isbn) => {
    const book = books[isbn];
    if (book.title.toLowerCase() === title) {
      matchingBooks.push({
        isbn: isbn,
        title: book.title,
        author: book.author,
        reviews: book.reviews
      });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json({
      message: "Books with the given title found",
      books: matchingBooks
    });
  } else {
    return res.status(404).json({ message: "No books found with the given title." });
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  // Check if book exists
  if (books.hasOwnProperty(isbn)) {
    const reviews = books[isbn].reviews;
    return res.status(200).json({
      message: "Reviews for the book",
      reviews: reviews
    });
  } else {
    return res.status(404).json({ message: "Book not found with the given ISBN." });
  }
});

// Get book list using Promises
public_users.get('/books-promise', (req, res) => {
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Books data not found");
    }
  });

  getBooks
    .then((bookList) => {
      return res.status(200).json(bookList);
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
});

// Get book details by ISBN using Promises
public_users.get('/books-promise/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN
    .then((book) => {
      return res.status(200).json({
        message: "Book found using Promise",
        book: book
      });
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Get books by author using Promises
public_users.get('/books-promise/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();

  const getBooksByAuthor = new Promise((resolve, reject) => {
    const matchingBooks = [];

    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author.toLowerCase() === author) {
        matchingBooks.push({ isbn, ...books[isbn] });
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found for the given author");
    }
  });

  getBooksByAuthor
    .then((result) => {
      return res.status(200).json({
        message: "Books retrieved using Promise",
        books: result
      });
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Get books by title using Promises
public_users.get('/books-promise/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();

  const getBooksByTitle = new Promise((resolve, reject) => {
    const matchingBooks = [];

    Object.keys(books).forEach((isbn) => {
      if (books[isbn].title.toLowerCase() === title) {
        matchingBooks.push({ isbn, ...books[isbn] });
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found with the given title");
    }
  });

  getBooksByTitle
    .then((result) => {
      return res.status(200).json({
        message: "Books retrieved using Promise",
        books: result
      });
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

module.exports.general = public_users;
