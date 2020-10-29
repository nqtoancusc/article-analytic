/*
Resolvers: Functions that actually fetch data from a database. They are functions that the GraphQL Engine 
or framework can call are called resolvers.
*/

/*
module.exports = {
    project() {
        return {
            name: 'Article Analytic',
            description: 'Analyze words appear in articles',
            version: 1
        };
    }
};
*/

const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require('jsonwebtoken');

const User = require("../models/user");
const Post = require("../models/post");

module.exports = {
    createUser: async function({ userInput }, req) {
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({message: 'E-mail is invalid.'});
        }
        if (validator.isEmpty(userInput.password) || 
            !validator.isLength(userInput.password, {min: 5})
        ) {
            errors.push({message: 'Password too short.'});
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.')
            error.data = errors;
            error.code = 422; // 422 Unprocessable Entity
            throw error;
        }

        const existingUser = await User.findOne({ email: userInput.email });
        if (existingUser) {
            const error = new Error('User exists already!');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const hashPw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashPw
        });
        console.log('before save user');
        const createdUser = await user.save();
        console.log('after save user');
        return { ...createdUser._doc, _id: createdUser._id.toString()}
    },

    login: async function({ email, password }) {
        const errors = [];

        const user = await User.findOne({ email: email });
        if (!user) {
            errors.push({message: 'User not found.'});
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            errors.push({message: 'Password is incorrect.'});
        }

        if (errors.length > 0) {
            const error = new Error('Log in failed.')
            error.data = errors;
            error.code = 401; // HTTP Error 401 - Unauthorized
            throw error;
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email
            },
            'somesupersecretsecret',
            { expiresIn: '1h' } // Token will be expired in 1 hour
        );

        return { 
            token: token, 
            userId: user._id.toString(), 
            name: user.name, 
            email: user.email 
        };
    },
    createPost: async function({ postInput }, req) {
        // If middleware set isAuth to false. It means user is not authenticated.
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const errors = [];
        if (validator.isEmpty(postInput.title) || 
            !validator.isLength(postInput.title, {min: 5})
        ) {
            errors.push({message: 'Title is invalid'});
        }
        if (validator.isEmpty(postInput.content) || 
            !validator.isLength(postInput.content, {min: 5})
        ) {
            errors.push({message: 'Content is invalid'});
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.')
            error.data = errors;
            error.code = 422; // 422 Unprocessable Entity
            throw error;
        }

        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('Invalid user.');
            error.code = 401;
            throw error;
        }

        const post = new Post({
            title: postInput.title,
            content: postInput.content,
            imageUrl: postInput.imageUrl,
            creator: user
        });
        console.log('before save post');
        const createdPost = await post.save();
        user.posts.push(createdPost);
        await user.save();
        console.log('after save post');
        // TODO: Add post to users' posts
        return { 
            ...createdPost._doc, 
            _id: createdPost._id.toString(), 
            createdAt: createdPost.createdAt.toISOString(), 
            updatedAt: createdPost.updatedAt.toISOString()
        };
    },
    posts: async function({page}, req) {
        // If middleware set isAuth to false. It means user is not authenticated.
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }

        // Add pagination
        if (!page) {
            page = 1;
        }

        const perPage = 2;
        const totalPosts = await Post.find().countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1})
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('creator');
        return {posts: posts.map(p => {
            return {
                ...p._doc,
                _id: p._id.toString(),
                createdAt: p.createdAt.toISOString(),
                updatedAt: p.updatedAt.toISOString()
            };
        }), 
        totalPosts: totalPosts}
    }
};