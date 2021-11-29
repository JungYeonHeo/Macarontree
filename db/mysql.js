//===== MySQL 데이터베이스를 사용할 수 있도록 하는 mysql 모듈 불러오기 =====//
var mysql = require('mysql');

//===== MySQL 데이터베이스 연결 설정 =====//
var pool      =    mysql.createPool({
    connectionLimit : 10, 
    host     : 'localhost',
    user     : 'tree',
    password : 'keroro2424.',
    database : 'macaron',
    debug    :  false
});

module.exports = function() {
    return {
        init: function() {
            return pool;
        }
    }
}

// pool.connect(function(err) {
//     if (err) {
//         res.render('mysql', { connect: '연결 실패',err:err });
//         console.error(err);
//         throw err;
//     }else{
//         // res.render('mysql', { connect: '연결 성공',err:'없음' });
//         module.exports = function() {
//             return {
//                 init: function() {
//                     return pool;
//                 }
//             }
//         }
//     }
// });
// pool.end();
