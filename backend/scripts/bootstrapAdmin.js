const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();

const readline = require("node:readline");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const ask = (interface_, prompt) => new Promise((resolve) => interface_.question(prompt, resolve));

function askSecret(prompt) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    return Promise.reject(new Error("Run this command from an interactive terminal to enter the password securely."));
  }

  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise((resolve, reject) => {
    let value = "";
    const finish = (error) => {
      process.stdin.off("data", onData);
      process.stdin.setRawMode(false);
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (chunk) => {
      for (const character of chunk.toString("utf8")) {
        if (character === "\u0003") return finish(new Error("Administrator setup cancelled."));
        if (character === "\r" || character === "\n") return finish();
        if (character === "\u007f" || character === "\b") {
          if (value.length) {
            value = value.slice(0, -1);
            process.stdout.write("\b \b");
          }
        } else if (character >= " ") {
          value += character;
          process.stdout.write("*");
        }
      }
    };
    process.stdin.on("data", onData);
  });
}

async function main() {
  if (!process.stdin.isTTY) throw new Error("Run this command from an interactive terminal.");
  await connectDB();

  const interface_ = readline.createInterface({ input: process.stdin, output: process.stdout });
  let session;
  try {
    const name = (await ask(interface_, "Administrator name: ")).trim();
    const email = (await ask(interface_, "Administrator email: ")).trim().toLowerCase();
    interface_.close();

    if (!name || name.length > 120) throw new Error("Enter a name of 1 to 120 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error("Enter a valid email address.");

    const password = await askSecret("Administrator password (hidden): ");
    const confirmation = await askSecret("Confirm password (hidden): ");
    if (password !== confirmation) throw new Error("Passwords do not match.");
    if (password.trim().length < 12 || Buffer.byteLength(password, "utf8") > 72) {
      throw new Error("Use a password of at least 12 characters and no more than 72 UTF-8 bytes.");
    }

    session = await mongoose.startSession();
    await session.withTransaction(async () => {
      // A unique claim serializes concurrent bootstrap attempts, including the
      // case where both transactions initially observe an empty admin set.
      await mongoose.connection
        .collection("adminBootstrapLocks")
        .insertOne({ _id: "first-admin", createdAt: new Date() }, { session });

      const adminCount = await User.countDocuments({ role: "admin" }).session(session);
      if (adminCount !== 0) throw new Error("An administrator already exists; bootstrap was not performed.");
      await User.create([{ name, email, password, role: "admin" }], { session });
    });
    process.stdout.write("First administrator created. Sign in through the application to continue setup.\n");
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?._id) {
      throw new Error("The first-administrator bootstrap has already been completed.");
    }
    if (error.code === 11000 && (error.keyPattern?.email || error.keyValue?.email)) {
      throw new Error("An account with that email already exists; no administrator was created.");
    }
    throw error;
  } finally {
    interface_.close();
    if (session) await session.endSession();
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error(error.message || "Administrator setup failed.");
  process.exitCode = 1;
});
