const dotenv = require("dotenv");
dotenv.config();
const MongoClient = require("mongodb").MongoClient;
const url = `mongodb://${process.env.MONGO_USER}:${encodeURIComponent(`${process.env.MONGO_PASSWORD}`)}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;
let _db;

module.exports = {
  connectToServer: function (callback) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, database) {
      _db = database.db(`${process.env.MONGO_DATABASE}`);
      return callback(err);
    });
  },

  getDb: function () {
    return _db;
  },
};