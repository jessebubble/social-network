const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const dateFormat = require('../utils/dateFormat');

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal) // Use a getter method to format the timestamp on query
    },
    username: {
        type: String,
        required: true
    },
    reactions: [reactionSchema] // These are like replies
    },
    {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

// Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query. 
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;