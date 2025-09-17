  import * as mongoose from "mongoose";
  
  
  export const tourSchema = new mongoose.Schema({
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

    export const Tour = mongoose.model("Tour", tourSchema);