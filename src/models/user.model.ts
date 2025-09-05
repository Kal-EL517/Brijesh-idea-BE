import { Schema, model, Document } from "mongoose";

// define UserModel Interface
export interface IUser extends Document {
  name: string;
  email: string;
  verified_email: boolean;
  given_name: string;
  family_name: string;
  picture: string;
  googleId: string;
  google_access_token: string;
  google_refresh_token: string;
  google_scope: string;
  google_token_type: string;
  google_id_token: string;
  google_refresh_token_expires_in: number;
  google_expiry_date: number;
  createdAt: Date;
  updatedAt: Date;
}

// Create schema with all fields from the interface
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    verified_email: { type: Boolean, required: true },
    given_name: { type: String, required: true },
    family_name: { type: String, required: true },
    picture: { type: String },
    googleId: { type: String, required: true },
    google_access_token: { type: String, required: true },
    google_refresh_token: { type: String, required: true },
    google_scope: { type: String, required: true },
    google_token_type: { type: String, required: true },
    google_id_token: { type: String, required: true },
    google_refresh_token_expires_in: { type: Number, required: true },
    google_expiry_date: { type: Number, required: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false,
  }
);

// Create model
export const UserModel = model<IUser>("User", userSchema);
