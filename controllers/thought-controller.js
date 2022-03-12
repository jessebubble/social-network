const res = require('express/lib/response');
const { User, Thought, Reaction } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({ path: 'reactions', select: '-__v' })
        .select('__v')
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No THOUGHT found with this id' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    createThought({ body }, res) {
        Thought.create(body)
        .then((dbThoughtData) => {
            User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: dbThoughtData._id } }, //$push adds data to array - $ indicated built into mongodb
                { new: true }
            )
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No USER found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
        })
        .catch((err) => res.status(400).json(err));
    },
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No THOUGHT found with this id' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.status(400).json(err));
    },
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No THOUGHT found with this id' })
                return;
            }
        })
    },
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate( // POST - create a reaction stored in a single thought's reactions array field
            { _id: params.thoughtId }, // - api/thoughts/:thoughtId/reactions
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No THOUGHT found with this id' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.status(500).json(err));
    },
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No REACTION found' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    }

};

module.exports = thoughtController;