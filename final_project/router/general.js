const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    for (let id in books) {
        if (books[id].isbn === isbn) {
          let matching_isbn = books[id].isbn;
          return res.send(JSON.stringify({matching_isbn}, null, 4));
        } else {
          return res.status(404).json({error: 'Book not found'});
        }
 });
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    let books_by_author = {};
    for (let id in books) {
        if (books[id].author === author) {
            books_by_author[id] = books[id];
        }
    }
    if (Object.keys(books_by_author).length > 0) {
        return res.send(JSON.stringify({books_by_author}, null, 4));
    } else {
        return res.status(404).json({error: 'Author not found'});
    }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    let books_by_title = {};
    for (let id in books) {
        if (books[id].title === title) {
            books_by_title[id] = books[id];
        }
    }
    if (Object.keys(books_by_title).length > 0) {
        return res.send(JSON.stringify({books_by_title}, null, 4));
    } else {
        return res.status(404).json({error: 'Book not found'});
    }
});

//  Get book review
public_users.get('/reviews/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    for (let id in books) {
        if (books[id].isbn === isbn) {
            if(
                Object.keys(books[id].reviews).length === 0
            ) {
                return res.status(404).json({error: 'No reviews found'});
            } else {
                let reviews_by_isbn = books[id].reviews;
                return res.send(JSON.stringify({reviews_by_isbn}, null, 4));
            }
        }
    }
    return res.status(404).json({error: 'Book not found'});
});

module.exports.general = public_users;
