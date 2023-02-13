const { User, sequelize } = require('../models');

const user = await User.findOne({});
const comments = await user.getComments();

console.log(comments); // 사용자 댓글

const [result, metadata] = await sequelize.query('SELECT * from comments');
console.log(result);
