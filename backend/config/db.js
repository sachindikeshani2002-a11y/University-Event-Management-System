const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );
  } catch (error) {
  console.error("MongoDB connection failed:", error.message);
  console.error("Error type:", error.name);

  if (error.reason?.servers) {
    for (const [address, server] of error.reason.servers) {
      console.error(
        `${address}:`,
        server.error?.message || server.type
      );
    }
  }

  process.exit(1);
}
};

module.exports = connectDB;