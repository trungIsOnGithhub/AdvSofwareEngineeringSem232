const supertest = require('supertest');
const requester = supertest('http://localhost:5000');

module.exports = { requester }