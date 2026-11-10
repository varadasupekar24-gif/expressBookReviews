
const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const auth = require('./auth_users.js');

const public_users = express.Router();

const BASE_URL = 'http://localhost:5000';

// Axios functions using async/await
async function getAllBooks() {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
}

async function getBookByISBN(isbn) {
    const response = await axios.get(`${BASE_URL}/isbn/${encodeURIComponent(isbn)}`);
    return response.data;
}

async function getBooksByAuthor(author) {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    return response.data;
}

async function getBooksByTitle(title) {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    return response.data;
}

// User registration
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ message: 'Enter username and password' });

    if (auth.isValid(username))
        return res.status(400).json({ message: 'User already exists' });

    auth.users.push({ username, password });
    res.status(200).json({ message: 'User successfully registered' });
});

// Retrieve all books
public_users.get('/', (req, res) => {
    res.status(200).json(books);
});

// Retrieve by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
});

// Retrieve by author
public_users.get('/author/:author', (req, res) => {
    const result = Object.values(books).filter(book =>
        book.author.toLowerCase().includes(req.params.author.toLowerCase())
    );
    res.status(200).json(result);
});

// Retrieve by title
public_users.get('/title/:title', (req, res) => {
    const result = Object.values(books).filter(book =>
        book.title.toLowerCase().includes(req.params.title.toLowerCase())
    );
    res.status(200).json(result);
});

// Retrieve reviews
public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book.reviews);
});

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
