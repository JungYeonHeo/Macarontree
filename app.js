/**
 * 
 * Macaron Tree
 *
 * MySQL 사용 : macarontree.sql 파일로 테이블 생성 가능
 *
 * 1. 웹서버 실행 : 명령프롬프트에서 node app.js 실행
 * 2. 웹페이지 열기 : 웹브라우저에서 http://13.125.26.112:3002 열기
 */

// Express 기본 모듈 불러오기
var express = require('express');
var http = require('http');
var path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser');
var static = require('serve-static');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// 파일 처리
var fs = require('fs');

//클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
var cors = require('cors');

// mime 모듈
var mime = require('mime');

// 쿠키
var cookieParser = require('cookie-parser');

// 로그
var logger = require('morgan');

// session 에서 사용
var session = require('express-session');
const FileStore = require('session-file-store')(session);

// 라우팅 모듈
var index = require('./routes/index'); // index페이지 
var basic = require('./routes/basic'); // basic 페이지 
var unique = require('./routes/unique'); // unique 페이지 
var contest = require('./routes/contest'); // contest 페이지
var cooking = require('./routes/cooking'); // cooking 페이지
var mind = require('./routes/mind'); // mind 페이지 
var order = require('./routes/order'); // unique 페이지 주문처리 
var like_add_delete = require('./routes/like_add_delete');  // Basic 상품 찜 추가 
var login = require('./routes/login'); // 로그인 페이지 
var login_check = require('./routes/login_check');  // 로그인 정보 체크
var id_check = require('./routes/id_check'); // 회원가입 id 중복 체크
var signup_agree = require('./routes/signup_agree'); // 회원가입 약관동의 페이지 
var signup_input = require('./routes/signup_input'); // 회원가입 사용자 정보 입력 페이지 
var signup_add = require('./routes/signup_add'); // 사용자 추가 
var order_done = require('./routes/order_done'); // 주문 완료 페이지 
var order_list = require('./routes/order_list'); // 주문 목록 (마이페이지)
var like_list = require('./routes/like_list'); // 찜한 목록 (마이페이지)
var like_list_delete = require('./routes/like_list_delete'); // 찜한 목록 삭제 (마이페이지)
var user_update = require('./routes/user_update'); // 정보 수정 (마이페이지)
var user_updateDone = require('./routes/user_updateDone'); // 정보 수정을 처리 (마이페이지)

// 익스프레스 객체 생성
var app = express();

// 포트 설정
app.set('port', process.env.PORT || 3002);

// 뷰 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile); //html 렌더링 시 사용

// 로그
app.use(logger('dev'));

// 쿠키
app.use(cookieParser());

// 세션
app.use(session({
  key: 'sid',
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: new FileStore(), //sessions라는 디렉토리가 생김
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}));

// body-parser 설정
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

//클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
app.use(cors());

// 로그인 여부 확인
app.use(function (req, res, next) {
  if (req.session.logined) {
    console.log('### res.locals.isLogin: yes');
    res.locals.isLogin = true;
  } else {
    console.log('### res.locals.isLogin: no');
    res.locals.isLogin = false;
  }
  next();
});

// 기능별 라우팅 관리
app.use('/', index);
app.use('/basic', basic);
app.use('/unique', unique);
app.use('/contest', contest);
app.use('/cooking', cooking);
app.use('/mind', mind);
app.use('/order', order);
app.use('/like_add_delete', like_add_delete); 
app.use('/login', login); 
app.use('/id_check', id_check);
app.use('/login_check', login_check);
app.use('/signup_agree', signup_agree); 
app.use('/signup_input', signup_input); 
app.use('/signup_add', signup_add); 
app.use('/order_done', order_done); 
app.use('/order_list', order_list); 
app.use('/like_list', like_list); 
app.use('/like_list_delete', like_list_delete); 
app.use('/user_update', user_update); 
app.use('/user_updateDone', user_updateDone); 

//404 에러 페이지 처리
var errorHandler = expressErrorHandler({
  static: {
  //    '404': './views/404.ejs'
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

// 웹서버 시작
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('### 웹 서버 시작됨 -> %s', server.address());
});

