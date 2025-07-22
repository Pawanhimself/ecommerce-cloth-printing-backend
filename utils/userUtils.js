const { User } = require('../models/User');

const getUserInfodb = async (userId, excludePassword = true) => {
  const query = excludePassword ? User.findById(userId).select('-password') : User.findById(userId);
  const user = await query;
  if (!user) throw new Error('User not found');
  return user;
};


module.exports = { getUserInfodb };
