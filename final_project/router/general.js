const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const arrayOfISBN = Object.keys(books);

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user. Please provide username and password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn <= arrayOfISBN.length && isbn > 0) {
    return res.send(books[isbn]);
  }
  return res.status(300).json({message: `Book with ISBN \'${isbn}\' not found.`});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksByAuthor = [];

  for (let k of arrayOfISBN){
      if (books[k]['author'] === author) {
          booksByAuthor.push(books[k]);
      }
  }
  if (booksByAuthor.length > 0){
      //const booksByAuthorObject = {...booksByAuthor};
      //const booksByAuthorObject = Object.assign({}, booksByAuthor);
      return res.send(booksByAuthor);
  }
  return res.status(300).json({message: `Book by author \'${author}\' not found`});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title
  let booksByTitle = [];

  for (let k of arrayOfISBN){
      if (books[k]['title'] === title) {
          booksByTitle.push(books[k]);
      }
  }
  if (booksByTitle.length > 0){
      //const booksByTitleObject = {...booksByTitle};
      //const booksByTitleObject = Object.assign({}, booksByTitle);
      return res.send(booksByTitle);
  }
  return res.status(300).json({message: `Book by title \'${title}\' not found`});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn <= arrayOfISBN.length && isbn > 0) {
    return res.send(books[isbn]['reviews']);
  }
  return res.status(300).json({message: `Book with ISBN \'${isbn}\' not found.`});
});

module.exports.general = public_users;