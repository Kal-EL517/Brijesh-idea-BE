import mongoose, { Schema, model, Document, ObjectId } from "mongoose";

interface IResourceId extends Document{
    kind : string,
    channelId : string
}

// define UserModel Interface
export interface ISubscribeChannel extends Document {
  title: string;
  description: string;
  resourceId: IResourceId;
  thumbnails : any;
  userId : ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Create schema with all fields from the interface
const SubscribeChannelSchema = new Schema<ISubscribeChannel>(
  {
    title: { type: String, required: true },
    description : { type: String, required: true },
    resourceId : { type : Object },
    userId : { type : mongoose.Types.ObjectId },
    thumbnails : { type : Object },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false,
  }
);

// Create model
export const SubscribeChannelModel = model<ISubscribeChannel>("SubscribeChannel", SubscribeChannelSchema);
