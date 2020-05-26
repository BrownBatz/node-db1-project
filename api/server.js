const express = require("express");

const db = require("../data/dbConfig.js");

const router = require('./resources/router');

const server = express();

server.use(express.json());

server.use('/api', router);

module.exports = server;
