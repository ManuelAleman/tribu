import mongoose, { Schema, type Document, Types } from "mongoose";

export interface IChat extends Document {
    participants: Types.ObjectId[];
    lastMessage?: Types.ObjectId;
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ChatSchema = new Schema<IChat>({
    participants: [
        {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        }
    ],
    lastMessage: {
        type: Types.ObjectId,
        ref: 'Message',
        default: null,
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
},
    {
        timestamps: true
    }
);

export const Chat = mongoose.model("Chat", ChatSchema);