const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    urls: {
        github: {
            type: String,
            trim: true,
            match: [/^https?:\/\/github\.com\/.*/, 'Please provide a valid GitHub URL']
        },
        linkedin: {
            type: String,
            trim: true,
            match: [/^https?:\/\/linkedin\.com\/in\/.*/, 'Please provide a valid LinkedIn URL']
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // This will automatically handle createdAt and updatedAt
});

// Create indexes for faster queries
userProfileSchema.index({ email: 1 });
userProfileSchema.index({ name: 1 });

// Pre-save middleware to handle any pre-save operations
userProfileSchema.pre('save', function (next) {
    // You can add any pre-save operations here
    next();
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
