const mongoose = require('mongoose');
const { Schema } = mongoose;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const reelSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    videoFile: {
        type: String,
        required: true,
        trim: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
        trim: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
   
    tags: [
        {
            type: String,
            trim: true,
        },
    ],
    isPublic: {
        type: Boolean,
        default: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isReported: {
        type: Boolean,
        default: false,
    },
    reports: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Report',
        },
    ],
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    dislikes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    shares: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    saved: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
   
   
    location: {
        type: String,
        trim: true,
    },
    camera: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
},{timestamps: true});

reelSchema.plugin(aggregatePaginate);
const Reel = mongoose.model('Reel', reelSchema);

module.exports = Reel;