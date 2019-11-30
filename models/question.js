const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const questionSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title must be filled']
    },
    description: {
        type: String,
        required: [true, 'Description must be filled']
    },
    upvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
    downvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
    answerID: [{
        type: Schema.Types.ObjectId,
        ref: 'Answers'
    }],
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    createdAt: String,
    updatedAt: String
});

const Question = mongoose.model("Questions", questionSchema);

module.exports = Question;