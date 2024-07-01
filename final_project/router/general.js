const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


//Find if User already exists
const doesExist = (username)=>{
  const user = users.find((user) => user.username === username);
  return !!user;
}


// Register User
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books)
    },6000)
  });

  myPromise.then(() => {
    res.send(JSON.stringify(books,null,4));
  });  
});


public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => 
      resolve(isbn),
      6000
    )
  });
  
  myPromise.then(() => {
    res.send(JSON.stringify(books[isbn],null,4))
  });
});


// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author2 = req.params.author;
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (book2) => book2.author === author2
      );
      resolve(filteredBooks);
    }, 6000);
  });

  const filteredBooks = await myPromise;
  return res.status(200).json({ books: filteredBooks });
});


// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title;
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (book2) => book2.title === title
      );
      return resolve(filteredBooks);
    }, 6000);
  });

  const filteredBooks = await myPromise;
  return res.status(200).json({ books: filteredBooks });

});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)
});

module.exports.general = public_users;
