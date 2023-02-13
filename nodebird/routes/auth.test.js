const request = require("supertest");
const { sequelize } = require("../models");
const app = require("../app");

beforeAll(async () => {
  await sequelize.sync();
});

describe("POST /join", () => {
  test("최초 회원 가입", (done) => {
    request(app)
      .post("/auth/join")
      .send({
        email: "test@gmail.com",
        nick: "tester",
        password: "test",
      })
      .expect("Location", "/")
      .expect(302, done);
  });
});

describe("POST /join", () => {
  const agent = request.agent(app);

  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({ email: "test@gmail.com", password: "test" })
      .end(done);
  });

  test("이미 로그인했으면 redirect /", (done) => {
    const message = encodeURIComponent("로그인한 상태입니다.");

    agent
      .post("/auth/join")
      .send({
        email: "test@gmail.com",
        nick: "tester",
        password: "test",
      })
      .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });
});

describe("POST /login", () => {
  test("가입되지 않은 회원", (done) => {
    const message = encodeURIComponent("존재하지 않는 이메일 입니다.");

    request(app)
      .post("/auth/login")
      .send({ email: "wow@gmail.com", password: "test" })
      .expect("Location", `/?loginError=${message}`)
      .expect(302, done);
  });

  test("비밀번호 틀림", (done) => {
    const message = encodeURIComponent("비밀번호가 일치하지 않습니다.");

    request(app)
      .post("/auth/login")
      .send({ email: "test@gmail.com", password: "wow" })
      .expect("Location", `/?loginError=${message}`)
      .expect(302, done);
  });

  const agent = request.agent(app);

  test("최초 로그인", (done) => {
    agent
      .post("/auth/login")
      .send({ email: "test@gmail.com", password: "test" })
      .expect("Location", "/")
      .expect(302, done);
  });

  test("로그인 상태에서 로그인 시", (done) => {
    const message = encodeURIComponent("로그인한 상태입니다.");

    agent
      .post("/auth/login")
      .send({ email: "test@gmail.com", password: "test" })
      .expect("Location", `/?error=${message}`)
      .expect(302, done);
  });
});

describe("GET /logout", () => {
  test("로그아웃 한 상태에서 로그아웃 시", (done) => {
    request(app) //
      .get("/auth/logout")
      .expect(403, done);
  });

  const agent = request.agent(app);

  beforeEach((done) => {
    agent
      .post("/auth/login")
      .send({ email: "test@gmail.com", password: "test" })
      .end(done);
  });

  test("로그아웃", (done) => {
    agent //
      .get("/auth/logout")
      .expect("Location", "/")
      .expect(302, done);
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
  await sequelize.close();
});
