import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser {
  name: string;
  email: string;
  photo?: string;
  role: 'user' | 'guide' | 'lead-guide' | 'admin';
  password: string;
  passwordConfirm?: string;
}

interface IUserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema<IUserDocument>({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (val: string) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val);
      },
      message: 'Please provide a valid email!',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (this: IUserDocument, val: string) {
        return val === this.password;
      },
      message: 'Passwords are not the same!',
    },
  }
});

userSchema.pre(
  'save',
  async function (this: IUserDocument, next: (err?: Error) => void) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;

    next();
  }
);

const User: Model<IUserDocument> = mongoose.model<IUserDocument>(
  'User',
  userSchema
);

export default User;
