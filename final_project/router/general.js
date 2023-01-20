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
  return res.send(JSON.stringify({books},null,4));
});

// Task 10 - Get the book list using:
   // a. Promises and callbacks
public_users.get('/promise/books',function (req, res) {

    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
    });

    get_books.then(() => console.log("Promise for Task 10 resolved"));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (typeof book != "undefined") {
    return res.send(books[isbn]);
  }
  return res.status(300).json({message: `Book with ISBN \'${isbn}\' not found.`});
 });

// Task 11
public_users.get('/promise/isbn/:isbn',function (req, res) {
    //Write your code here
    const getBookByISBN = new Promise((resolve,reject)=>{
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (typeof book != "undefined") {
            resolve(res.send(books[isbn]));
        }
        reject(res.status(300).json({message: `Book with ISBN \'${isbn}\' not found.`}));

    });
    getBookByISBN.then(() => console.log("Promise for Task 11 resolved"),() => {
        console.log("Promise for Task 11 rejected");
    });
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

// Task 12
public_users.get('/promise/author/:author',function (req, res) {
    //Write your code here
    let booksByAuthor = [];

    const getBookByAuthor = new Promise((resolve,reject)=>{
        const author = req.params.author;
        for (let k of arrayOfISBN){
            if (books[k]['author'] === author) {
                booksByAuthor.push(books[k]);
            }
        }
        if (booksByAuthor.length > 0){
            resolve(res.send(booksByAuthor));
        }
        reject(res.status(300).json({message: `Book by author \'${author}\' not found`}));

    });
    getBookByAuthor.then(() => console.log("Promise for Task 12 resolved"),() => {
        console.log("Promise for Task 12 rejected");
    });
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

// Task 13
public_users.get('/promise/title/:title',function (req, res) {
    //Write your code here
    let booksByTitle = [];

    const getBookByTitle = new Promise((resolve,reject)=>{
        const title = req.params.title
        for (let k of arrayOfISBN){
            if (books[k]['title'] === title) {
                booksByTitle.push(books[k]);
            }
        }
        if (booksByTitle.length > 0){
            resolve(res.send(booksByTitle));
        }
        reject(res.status(300).json({message: `Book by title \'${title}\' not found`}));

    });
    getBookByTitle.then(() => console.log("Promise for Task 13 resolved"),() => {
        console.log("Promise for Task 13 rejected");
    });
}); // End of promise


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (typeof book != "undefined") {
    return res.send(books[isbn]['reviews']);
  }

  return res.status(300).json({message: `Book with ISBN \'${isbn}\' not found.`});
});

module.exports.general = public_users;