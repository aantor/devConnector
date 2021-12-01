const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const chalk = require('chalk')

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log(chalk.bgGreen.black('MongoDB connected...'));
  } catch (error) {
    console.error(error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;