import { GraphQLID, GraphQLString } from "graphql";
import Comment from "../models/Comment";
import Post from "../models/Post";
import User from "../models/User";
import { createJWTToken } from '../util/auth'
import { PostType, CommentType } from './types'

module.exports = {
    register: {
        type: GraphQLString,
        description: "Register a new user and returns a token",
        args: {
            username: { type: GraphQLString },
            email: { type: GraphQLString },
            password: { type: GraphQLString },
            displayName: { type: GraphQLString },
        },
        async resolve( _, args ) {
            console.log( args )

            const { username, email, password, displayName } = args;

            const user = new User( { 
                username, 
                email, 
                password, 
                displayName } )

            await user.save();

            const token = createJWTToken({ 
                _id: user._id, 
                username: user.username, 
                email: user.email 
            })

            console.log( token )

            return token;
        }
    },

    login: {
        type: GraphQLString,
        description: "Login a user and returns a token",
        args: {
            email: { type: GraphQLString },
            password: { type: GraphQLString },
        },
        async resolve(_, args) {
            
            const user = await User.findOne({ email: args.email }).select('+password')

            console.log( user )
            if( !user || args.password !== user.password ) throw new Error('Invalid Credentials')

            const token = createJWTToken({ 
                _id: user._id, 
                username: user.username, 
                email: user.email 
            })

            return token
        }
    },

    createPost: {
        type: PostType,
        description: "Create a new post",
        args:{
            title: { type: GraphQLString },
            body: { type: GraphQLString }
        },
        async resolve(_, args, { verifiedUser }){

            const post = new Post({
                title: args.body,
                body: args.body,
                authorId: verifiedUser._id
            })

            await post.save();
            return post
        }
    },

    updatePost: {
        type: PostType,
        description: "Update a post",
        args:{
            id: { type: GraphQLID },
            title: { type: GraphQLString },
            body: { type: GraphQLString }
        },
        async resolve(_, { id, title, body }, { verifiedUser }){

            if( !verifiedUser ) throw new Error( "Unauthorized" )

            const updatedPost = await Post.findByIdAndUpdate(
                { _id: id, authorId: verifiedUser._id},
                {
                    title,
                    body
                },
                {
                    new: true,
                    runValidators: true
                }
                )
            
            return updatedPost;
        } 
    },

    deletePost: {
        type: GraphQLString,
        description: "Delete a post",
        args:{
            postId: { type: GraphQLID },
        },
        async resolve(_, { postId }, { verifiedUser }){

            if( !verifiedUser ) throw new Error( "Unauthorized" )

            const deletedPost = await Post.findByIdAndDelete({
                _id: postId,
                authorId: verifiedUser._id
            })

            if( !deletedPost ) throw new Error("Post not found")
            
            return "Post deleted";
        } 
    },

    addComment: {
        type: CommentType,
        description: "Add comment to post",
        args:{
            comment: { type: GraphQLString },
            postId: { type: GraphQLID },
        },
        async resolve(_, { comment, postId }, { verifiedUser }){

            const newComment = new Comment({
                comment,
                postId,
                authorId: verifiedUser._id
            })

            return newComment.save()
        } 
    },

    updateComment: {
        type: CommentType,
        description: "Update a comment",
        args: {
            id: { type: GraphQLID },
            comment: { type: GraphQLString }
        },
        async resolve (_, { id, comment }, { verifiedUser }) {
            if( !verifiedUser ) throw new Error("Unauthorized")

            const commentUpdated = await Comment.findByIdAndUpdate(
                {
                    _id: id,
                    userId: verifiedUser._id
                },
                {
                    comment
                }
            );

            if( !commentUpdated ) throw new Error("Comment not found");

            return commentUpdated;
        }
    },

    deleteComment: {
        type: CommentType,
        description: "Delete a comment",
        args: {
            id: { type: GraphQLID }
        },
        async resolve (_, { id }, { verifiedUser }) {
            if( !verifiedUser ) throw new Error("Unauthorized")

            const commentDeleted = await Comment.findOne(
                {
                    _id: id,
                    userId: verifiedUser._id
                }
            )

            if( !commentDeleted ) throw new Error("Comment not found");

            return "Comment Deleted";
        }
    }
}