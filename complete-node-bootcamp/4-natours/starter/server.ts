

import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import app from "./app";


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




// Start the server

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});