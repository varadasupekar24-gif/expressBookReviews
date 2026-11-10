
const express = require('express');
const books = require('./booksdb.js');
const auth = require('./auth_users.js');

const public_users = express.Router();

public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ message: 'Enter username and password' });

    if (auth.isValid(username))
        return res.status(400).json({ message: 'User already exists' });

    auth.users.push({ username, password });

    res.status(200).json({ message: 'User successfully registered' });
});

public_users.get('/', (req, res) => {
    res.status(200).json(books);
});

public_users.get('/isbn/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
});

public_users.get('/author/:author', (req, res) => {
    const result = Object.values(books).filter(book =>
        book.author.toLowerCase().includes(req.params.author.toLowerCase())
    );
    res.status(200).json(result);
});

public_users.get('/title/:title', (req, res) => {
    const result = Object.values(books).filter(book =>
        book.title.toLowerCase().includes(req.params.title.toLowerCase())
    );
    res.status(200).json(result);
});

public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book.reviews);
});

module.exports.general = public_users;
