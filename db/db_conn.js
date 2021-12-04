//===== MySQL 데이터베이스를 사용할 수 있도록 하는 mysql 모듈 불러오기 =====//
var mysql = require('mysql');

// AWS RDS 접속 정보 
//  var pool      =    mysql.createPool({
//      host     : 'mysqldb.cim1xq4dugcp.us-east-2.rds.amazonaws.com',
//      user     : 'tree',
//      password : 'keroro2424.',
//      port     : 9999,
//      database : 'macaron',
//      connectionLimit : 10
//  });

var pool      =    mysql.createPool({
   connectionLimit : 10, 
   host     : 'localhost',
   user     : 'tree',
   password : 'keroro2424.',
   port     : 3306,
   database : 'macaron',
   debug    :  false
});

module.exports = function() {
    return {
        init: function() {
            return pool;
        }, 
        open: function(conn) {
            conn.connect( function (err) {
                if (err) {
                    console.log(">>> mysql 연결 중 에러 발생함 - " + err);
                } else {
                    console.log("### mysql 연결 성공");
                }
            })
        }
    }
};
