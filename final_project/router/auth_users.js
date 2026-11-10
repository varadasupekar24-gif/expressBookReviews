
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');

const regd_users = express.Router();

let users = [];

// Check whether username already exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check username and password
const authenticatedUser = (username, password) => {
    return users.some(user =>
        user.username === username && user.password === password
    );
};

// Registered user login
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

    return res.status(200).json({
        message: 'User successfully logged in',
        accessToken: accessToken
    });
});

// Add or modify a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    try {
        const decoded = jwt.verify(token, 'access');
        const username = decoded.username;
        const isbn = req.params.isbn;
        const review = req.body.review;

        if (!books[isbn]) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!review) {
            return res.status(400).json({ message: 'Review is required' });
        }

        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }

        books[isbn].reviews[username] = review;

        return res.status(200).json({
            message: 'Review added/updated successfully',
            reviews: books[isbn].reviews
        });

    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
});


// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    try {
        const decoded = jwt.verify(token, 'access');
        const username = decoded.username;
        const isbn = req.params.isbn;

        if (!books[isbn]) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!books[isbn].reviews || !books[isbn].reviews[username]) {
            return res.status(404).json({ message: 'Review not found' });
        }

        delete books[isbn].reviews[username];

        return res.status(200).json({
            message: 'Review deleted successfully',
            reviews: books[isbn].reviews
        });

    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
});


module.exports.authenticated = regd_users;
module.exports.authenticatedUser = authenticatedUser;
module.exports.isValid = isValid;
module.exports.users = users;
