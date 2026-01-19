import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    streetAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
    }
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    imageURL:{
        type: String,
        default: ""
    },
    clerkId:{
        type: String,
        unique: true,
        required: true,
    },
    addresses: [addressSchema],
    wishList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
    ],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);