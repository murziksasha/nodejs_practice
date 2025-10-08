
import fs = require("fs");
import path = require("path");
import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import { Tour } from "../../models/tourModel";


// Connect to the database

const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    // useUnifiedTopology: true,  // These options are no longer supported in Mongoose 6 and above
  })
  .then(() => console.log("DB connection successful!  "));

// Read JSON file
const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tours-simple.json"), "utf-8")
);

// Import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  } process.exit(); 
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

// npx ts-node dev-data/data/import-dev-data.ts --import
// npx ts-node dev-data/data/import-dev-data.ts --delete