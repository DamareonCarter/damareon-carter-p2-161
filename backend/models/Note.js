import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
    user: {
        type: 'ObjectId',
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

const Post = mongoose.model('note', NoteSchema);

export default Post;