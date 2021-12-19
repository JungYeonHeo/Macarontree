// ===== MongoDB를 사용할 수 있도록 하는 MongoDB 연결 모듈 =====//

const MongoClient = require('mongodb').MongoClient;
const url = `mongodb://tree:${encodeURIComponent('macaron2424.')}@localhost:27017/mongo`;

var _db;

module.exports = {
    connectToServer: function(callback) {
        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, database) {
        	_db = database.db('mongo');
        	return callback(err);
      	});
    },

    getDb: function() {
		return _db;
    }
};
