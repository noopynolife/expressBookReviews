const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username){
        return res.status(404).json({message: "Username not provided!"});
    }
    if (!password){
        return res.status(404).json({message: "Password not provided!"});
    }
    if (isValid(username)) { 
    users.push({"username":username,"password":password});
    return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
    return res.status(404).json({message: "A user with that username already exists!"});    
    }
});



// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve,reject) => {
    if (books){
        resolve(books)
    }else{
        reject("Could not find any books.")
    }
  }).then((books) => {
    return res.status(200).json(books);
  }).catch((err)=>{
    return res.status(404).json(err);
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    new Promise((resolve,reject) => {
        let isbn = req.params.isbn;
        let filtered = books.filter((book)=>{
          return book.isbn === isbn
        });
        if (filtered){
            resolve(filtered)
        }else{
            reject("Could not find any books with that isbn.")
        }
      }).then((books) => {
        return res.status(200).json(books);
      }).catch((err)=>{
        return res.status(404).json(err);
      });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    new Promise((resolve,reject) => {
        let author = req.params.author;
        let filtered = books.filter((book)=>{
          return book.author === author
        });
        if (filtered){
            resolve(filtered)
        }else{
            reject("Could not find any books with that author.")
        }
      }).then((books) => {
        return res.status(200).json(books);
      }).catch((err)=>{
        return res.status(404).json(err);
      });
 });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    new Promise((resolve,reject) => {
        let title = req.params.title;
        let filtered = books.filter((book)=>{
          return book.title === title
        });
        if (filtered){
            resolve(filtered)
        }else{
            reject("Could not find any books with that title.")
        }
      }).then((books) => {
        return res.status(200).json(books);
      }).catch((err)=>{
        return res.status(404).json(err);
      });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let filtered = books.filter((book)=>{
      return book.isbn === isbn
    });
    let mapped = filtered.map((book)=>{
        return book.reviews
    });
    return res.status(200).json(mapped);
});

module.exports.general = public_users;
