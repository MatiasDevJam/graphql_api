import { Schema, model } from "mongoose"

const commentSchema = Schema({
    comment: {
        type: String,
        required: true
    },

    userId: {
        type: String,
        required: true,
    },

    postId: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
    }
)

export default model("Comment", commentSchema)