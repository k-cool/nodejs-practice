jest.mock("../models/user");
const User = require("../models/user");
const { addFollowing } = require("./user");

describe("addFollowing", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("user가 있으면 팔로잉을 추가하고 success반환", async () => {
    User.findOne.mockReturnValue(
      Promise.resolve({
        addFollowing(id) {
          return Promise.resolve(true);
        },
      })
    );

    await addFollowing(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });

  test("user가 없으면 404 no user 반환", async () => {
    User.findOne.mockReturnValue(Promise.resolve(null));

    await addFollowing(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });

  test("db에러나면 next(err) 호출", async () => {
    const err = "testError";
    User.findOne.mockReturnValue(Promise.reject(err));
    await addFollowing(req, res, next);
    expect(next).toBeCalledWith(err);
  });
});
