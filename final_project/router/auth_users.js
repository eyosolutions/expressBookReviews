const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Define Functions
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

// End of Functions


//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const book = books[isbn];
  const user = req.session.authorization['username'];

  if (typeof book != "undefined") {
    if (review) {
        for (let k in book) {
            if (k == "reviews") {
                books[isbn][k][`${user}`] = review;
            }
        }
    }
    return res.send(books[isbn]);
  }
  return res.status(300).json({message: `Book with ISBN \'${isbn}\' not found.`});
});

// Delete a book review by user
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const user = req.session.authorization['username'];
    const book = books[isbn];
    const review = books[isbn]['reviews'][`${user}`];

    if (typeof book != "undefined") {
      if (review) {
        delete books[isbn]['reviews'][`${user}`];
      } 
      return res.send(books[isbn]);
    }
    return res.status(300).json({message: `Book with ISBN \'${isbn}\' not found.`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
