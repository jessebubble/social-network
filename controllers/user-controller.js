const { User } = require('../models');

const userController = { // CRUD TIME
    getAllUser(req, res) {
        User.find({})
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData) { //IF NO USER FOUND
                res.status(404).json({ message: 'No USER found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true }) // new:true - instructing Mongoose to return the new version of the document.
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No USER found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No USER found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
    addFriend({ params }, res) { //POST - add a new friend to a user's friend list
        User.findOneAndUpdate( // - api/users/:userId/friends/:friendId
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No USER found with this userId' });
                return;
            }
            User.findOneAndUpdate(
                { _id: params.friendId },
                { $addToSet: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then((dbUserData2) => {
                if (!dbUserData2) {
                    res
                    .status(404).json({ message: 'No USER found with this friendId' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
        })
        .catch((err) => res.json(err));
    },
    deleteFriend({ params }, res) { // DELETE - remove a friend from a user's friend list
        User.findOneAndUpdate( // - api/users/:userId/friends/:friendId
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No USER found with this userId' });
                return;
            }
            User.findOneAndUpdate(
                { _id: params.friendId },
                { $pull: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then((dbUserData2) => {
                if (!dbUserData2) {
                    res.status(404).json({ message: 'No USER found with this friendId' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
        })
        .catch((err) => res.json(err));
    },

};

module.exports = userController;