import mongoose, { Schema, type Document } from "mongoose";

export interface IMessage extends Document {
    chat: Schema.Types.ObjectId;
    sender: Schema.Types.ObjectId;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    }
},
    {
        timestamps: true,
    }
);

MessageSchema.index({ chat: 1, createdAt: 1 });

export const Message = mongoose.model("Message", MessageSchema);