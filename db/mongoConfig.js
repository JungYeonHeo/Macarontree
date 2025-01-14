const dotenv = require("dotenv");
dotenv.config();
const MongoClient = require("mongodb").MongoClient;
const url = `mongodb://${process.env.MONGO_USER}:${encodeURIComponent(`${process.env.MONGO_PASSWORD}`)}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;
const dbName = `${process.env.MONGO_DATABASE}`;
module.exports = { MongoClient, url , dbName};