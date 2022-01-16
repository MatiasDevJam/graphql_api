import { Schema, model } from "mongoose"

const postSchema = Schema({
    authorId: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true,
    },

    body: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
    }
)

export default model("Post", postSchema)