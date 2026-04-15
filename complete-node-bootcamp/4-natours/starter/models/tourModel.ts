import mongoose from 'mongoose';
import slugify from 'slugify';

export interface ITour extends mongoose.Document {
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount?: number;
  summary: string;
  description?: string;
  imageCover: string;
  images?: string[];
  createdAt: Date;
  startDates?: Date[];
  slug?: string;
  secretTour: boolean;
  durationWeeks?: number | null;
}

export const tourSchema = new mongoose.Schema<ITour>(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: [true, 'Tour name must be unique'],
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (this: ITour, val: number) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    slug: {
      type: String,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function (this: ITour) {
  if (this.duration == null) return null;
  return Number((this.duration / 7).toFixed(1));
});

// Document Middleware: runs before .save() and .create()
tourSchema.pre('save', function (this: ITour, next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

// Query Middleware
tourSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, ITour> & { start: number }, next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
  },
);

tourSchema.post(
  /^find/,
  function (this: mongoose.Query<any, ITour> & { start: number }, docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
  },
);

export const Tour = mongoose.model<ITour>('Tour', tourSchema);
