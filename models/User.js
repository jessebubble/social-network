const { Schema, model } = require('mongoose');

// create SCHEMA 
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trimmed: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // MATCH - RegExp, creates a validator that checks if the value matches the given regular expression
        match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
    },
    thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }], // Array of _id values referencing the Thought model
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }] // Array of _id values referencing the User model (self-reference)
    },
    {
    toJSON: {
        virtuals: true
    },
    id: false
});

// Create a virtual called friendCount that retrieves the length of the user's friends array field on query.
UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

// Create USER model using UserSchema
const User = model('User', UserSchema);

module.exports = User;