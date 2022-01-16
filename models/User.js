import { Schema, model } from "mongoose"

const userSchema = Schema({
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i,
            'Provide a valid email'
        ]
    },

    displayName: {
        type: String,
        required: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
)

export default model("User", userSchema)