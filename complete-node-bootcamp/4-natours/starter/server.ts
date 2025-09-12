

import * as mongoose from "mongoose";
import * as dotenv from "dotenv";
import app from "./app";
dotenv.config({ path: "./config.env" });
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

  const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: [true, "Tour name must be unique"],
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"],
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
  });

    const Tour = mongoose.model("Tour", tourSchema);
    const testTour = new Tour({
      name: "The Park Camper",
      rating: 4.7,
      price: 997,
    });
    testTour
      .save()
      .then((doc) => {
        console.log(doc);
      })
      .catch((err) => {
        console.log("Error 💥💥💥: ", err);
      });



// Start the server

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});