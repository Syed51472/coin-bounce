const mongoose = require("mongoose");
const { MONGODB_CONNECTION_STRING } = require("../Config/index");

const connectionString = `${MONGODB_CONNECTION_STRING}`;

const dbConnect = async () => {
  try {
    const db = await mongoose.connect(connectionString);
    console.log(`Database Connected to host: ${db.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

module.exports = dbConnect;
