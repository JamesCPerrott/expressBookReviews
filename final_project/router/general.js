const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

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
    const get_books = new Promise((resolve, reject) => {
        try {
            resolve(books);
        } catch (error) {
            reject(error);
        }
    });
    get_books.then((books) => {
        return res.send(JSON.stringify({books}, null, 4));
    }).catch((error) => {
       return res.status(500).json({error: 'Internal server error'});
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let matching_isbn = {};
    const get_isbn = new Promise((resolve, reject) => {
        try {
            for (let id in books) {
                if (books[id].isbn === isbn) {
                    matching_isbn = books[id];
                    resolve(matching_isbn);
                }
            }
            reject('Book not found');
        } catch (error) {
            reject(error);
        }
    });
    get_isbn.then((matching_isbn) => {
        return res.send(JSON.stringify({matching_isbn}, null, 4));
    }).catch((reject) => {
        if(reject === 'Book not found') {
            return res.status(404).json({error: 'Book not found'});
        } else {
            return res.status(500).json({error: 'Internal server error'});
        }
    });
});
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    let books_by_author = {};
    const get_author = new Promise((resolve, reject) => {
        try {
            for (let id in books) {
                if (books[id].author === author) {
                    books_by_author[id] = books[id];
                }
            }
            if (Object.keys(books_by_author).length > 0) {
                resolve(books_by_author);
            } else {
                reject('Author not found');
            }
        } catch (error) {
            reject(error);
        }
    });
    get_author.then((books_by_author) => {
        return res.send(JSON.stringify({books_by_author}, null, 4));
    }).catch((reject) => {
        if (reject === 'Author not found') {
            return res.status(404).json({error: 'Author not found'});
        } else {
            return res.status(500).json({error: 'Internal server error'});
        }
    });
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    let books_by_title = {};
    const get_title = new Promise((resolve, reject) => {
        try {
            for (let id in books) {
                if (books[id].title === title) {
                    books_by_title[id] = books[id];
                }
            }
            if (Object.keys(books_by_title).length > 0) {
                resolve(books_by_title);
            } else {
                reject('Book not found');
            }
        } catch (error) {
            reject(error);
        }
    });
    get_title.then((books_by_title) => {
        return res.send(JSON.stringify({books_by_title}, null, 4));
    }).catch((reject) => {
        if (reject === 'Book not found') {
            return res.status(404).json({error: 'Book not found'});
        } else {
            return res.status(500).json({error: 'Internal server error'});
        }
    });
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