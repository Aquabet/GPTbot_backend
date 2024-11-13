const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const userDataPath = path.join(__dirname, '../user_data.json');

function loadUsers() {
  try {
    const rawData = fs.readFileSync(userDataPath);
    const users = JSON.parse(rawData);

    return users.map((user) => ({
      username: user.username,
      password: bcrypt.hashSync(user.password, 10),
      systemInstructions: user.systemInstructions,
    }));
  } catch (error) {
    return [];
  }
}

const USERS = loadUsers();
module.exports = USERS;
