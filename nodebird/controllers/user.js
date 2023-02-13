const User = require("../models/user");

exports.addFollowing = async (req, res, next) => {
  try {
    const { id: loginedId } = req.user;
    const { id: followingId } = req.params;
    const user = await User.findOne({ where: { id: loginedId } });

    if (user) {
      await user.addFollowing(parseInt(followingId, 10));
      res.send("success");
    } else res.status(404).send("no user");
  } catch (err) {
    console.error(err);
    next(err);
  }
};
