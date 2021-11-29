
/* DB 생성 */
CREATE DATABASE Macaron
default character set utf8
collate utf8_general_ci;

USE Macaron;

/* Member */
CREATE TABLE Macaron.member (
    m_id varchar(20) not null, 
    m_pw varchar(20) not null, 
    m_name varchar(20) not null, 
    m_tel varchar(20), 
    m_addr text, 
    primary key(m_id)
)Default charset=UTF8;

INSERT INTO `member` VALUES ('tree','keroro2424.','허정연','01052949601','서울특별시');

/* Product */
CREATE TABLE Macaron.product (
    prd_id varchar(100), 
    prd_img text, 
    prd_kor varchar(100), 
    prd_eng varchar(100), 
    prd_type varchar(2), 
    prd_color varchar(10), 
    primary key(prd_id)
)Default charset=UTF8;

INSERT INTO `product` VALUES 
('b01','m_shooting_yogurt.jpg','슈팅 요거트','shooting yogurt','P','#fff'),
('b02','m_green_tea_mochi.jpg','녹차 모찌','green tea mochi','P','#fff'),
('b03','m_choco_presso.jpg','초코 프레소','choco presso','P','#fff'),
('b04','m_real_blueberry.jpg','리얼 블루베리','real blueberry','P','#fff'),
('b05','m_injeolmi.jpg','인절미','injeolmi','P','#fff'),
('b06','m_cranberry.jpg','크랜베리','cranberry','P','#fff'),
('b07','m_mint_choco.jpg','민트초코','mint choco','P','#fff'),
('b08','m_real_cheese.jpg','리얼치즈','real cheese','P','#fff'),
('b09','m_cream_cheese_tiramisu.jpg','크림치즈 티라미수','cream cheese tiramisu','P','#fff'),
('b10','m_biscuit_crumble.jpg','비스킷크럼블','biscuit crumble','P','#fff'),
('b11','m_choco_green_tea.jpg','초코 그린티','choco green tea','P','#fff'),
('b12','m_coconut_mango.jpg','코코넛 망고','coconut mango','P','#fff'),
('b13','m_earlgray.jpg','얼그레이','earlgray','B','#fff'),
('b14','m_black_sugar.jpg','흑당','black sugar','B','#fff'),
('b15','m_oreo.jpg','오레오','oreo','B','#fff'),
('b16','m_red_velvet.jpg','레드벨벳','red velvet','B','#fff'),
('b17','m_blue_hawaii.jpg','블루 하와이','blue hawaii','B','#fff'),
('b18','m_honey_lemon.jpg','허니 레몬','honey lemon','B','#fff'),
('b19','m_salt_caramel.jpg','솔트 카라멜','salt caramel','B','#fff'),
('b20','m_vanilla.jpg','바닐라','vanilla','B','#fff'),
('b21','m_choco.jpg','초코','choco','B','#fff'),
('b22','m_blueberry.jpg','블루베리','blueberry','B','#fff'),
('b23','m_green_tea.jpg','녹차','green tea','B','#fff'),
('b24','m_strawberry.jpg','딸기','strawberry','B','#fff');

/* Contest */

-- mysql 5.6.5 이상 
CREATE TABLE Macaron.contest (
    cont_id int not null auto_increment, 
    cont_img text, 
    cont_review text, 
    cont_date datetime default CURRENT_TIMESTAMP , 
    cont_title text, 
    m_id varchar(20), 
    primary key(cont_id), 
    constraint m_id 
    foreign key (m_id)
    References Macaron.member(m_id)
    on delete cascade
    on update cascade)
Default charset=utf8;

-- mysql 5.6.5 미만
CREATE TABLE Macaron.contest (
    cont_id int not null auto_increment, 
    cont_img text, 
    cont_review text, 
    cont_date datetime, 
    cont_title text, 
    m_id varchar(20), 
    primary key(cont_id), 
    constraint m_id 
    foreign key (m_id)
    References Macaron.member(m_id)
    on delete cascade
    on update cascade)
Default charset=utf8;

CREATE TRIGGER contest_date_insert BEFORE INSERT 
ON contest FOR EACH ROW
SET 
NEW.cont_date = NOW()
;


INSERT INTO `contest` VALUES (1,'m_injeolmi1575707285846.jpg','마카롱 쟁여놓고 먹으려고 처음으로 온라인으로 구매했어요. 마카롱 크기도 크고 너무 맛있네요!','2019-12-07 17:28:05','인절미 마카롱','tree'),(2,'m_cranberry1575734826338.jpg','선물주려고 구매했다가 너무 예뻐서 이미 한 상자 다 비웠네요 ㅠㅠ 다시 주문했는데 예쁘고 깔끔하게 포장되어 와서 대만족이에요~','2019-12-08 01:07:06','크랜베리 마카롱','tree'),(3,'m_real_cheese1575734847935.jpg','세상에서 제일 맛있는 마카롱입니다!! 진짜 너무 맛있고 선물용으로 최고에요~!!','2019-12-08 01:07:27','리얼치즈 마카롱','tree'),(4,'m_mint_choco1575738659417.jpg','알록달록 눈도 입도 정말 즐겁네요~ 빵집에 파는 얇은 마카롱과는 비교불가입니당ㅎㅎ','2019-12-08 02:10:59','민트초코 마카롱','tree');
