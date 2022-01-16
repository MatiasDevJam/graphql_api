import { GraphQLList, GraphQLID } from "graphql"
import User from "../models/User"
import Post from "../models/Post"
import { UserType, PostType, CommentType } from "./types"
import Comment from "../models/Comment"

module.exports = {
    users: {
        type: new GraphQLList(UserType),
        resolve() {
            return User.find();
        }
    },

    user: {
        type: UserType,
        description: "Get a user by id",
        args: {
            id: { type: GraphQLID }
        },
        resolve(_, args) {
            return User.findById( args.id )
        }
    },

    posts: {
        type: new GraphQLList(PostType),
        description: "Get all posts",
        resolve: () =>  Post.find() 
    },

    post: {
        type: PostType,
        description: "Get by post id",
        args: {
            id: { type: GraphQLID }
        },
        resolve: (_, { id }) => Post.findById( id )
    },

    comments: {
        type: new GraphQLList(CommentType),
        description: "Get all comments",
        resolve: () => Comment.find()
    },

    comment: {
        type: CommentType,
        description: "Get a comment by id",
        args: {
            id: { type: GraphQLID }
        },
        resolve: (_, { id }) => Comment.findById( id )
    }

}
