# db 생성
CREATE SCHEMA `nodejs` DEFAULT CHARACTER SET utf8;

# 테이블 생성

## users
CREATE TABLE nodejs.users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  age INT UNSIGNED NOT NULL,
  married TINYINT NOT NULL,
  comment TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT now(),
  PRIMARY KEY(id),
  UNIQUE INDEX name_UNIQUE (name ASC)
) 
COMMENT = '사용자정보'
DEFAULT CHARACTER SET = utf8
ENGINE = InnoDB;


## comments
CREATE TABLE nodejs.comments (
   id INT NOT NULL AUTO_INCREMENT,
   commenter INT NOT NULL,
   comment VARCHAR(100) NOT NULL,
   created_at DATETIME NOT NULL DEFAULT now(),
   PRIMARY KEY(id),
   INDEX commenter_idx (commenter ASC),
   CONSTRAINT commenter 
   FOREIGN KEY (commenter) 
   REFERENCES nodejs.users (id) 
   ON DELETE CASCADE 
   ON UPDATE CASCADE
)
COMMENT = '댓글'
DEFAULT CHARSET=utf8mb4
ENGINE=InnoDB;


# 데이터 생성

## users
INSERT INTO nodejs.users (name, age, married, comment) VALUES ('sico', 25, 0, '자기소개1');
INSERT INTO nodejs.users (name, age, married, comment) VALUES ('nico', 20, 1, '자기소개2');
INSERT INTO nodejs.users (name, age, married, comment) VALUES ('mico', 30, 1, '자기소개3');

## comments
INSERT INTO nodejs.comments (commenter, comment) VALUES (1, '안녕하세요 sico의 댓글 입니다.');


# 데이터 조회
SELECT * FROM nodjs.users;
SELECT name, married FROM nodejs.users;
SELECT name, married FROM nodejs.users WHERE married = 1 AND age > 25;
SELECT name, married FROM nodejs.users ORDER BY age DESC;
SELECT name, married FROM nodejs.users ORDER BY age DESC LIMIT 1 OFFSET 1;

# 데이터 수정
UPDATE nodejs.users SET comment = '바뀐 자기소개 입니다.' WHERE id = 2;

# 데이터 삭제
DELETE FROM nodejs.users WHERE id = 2;