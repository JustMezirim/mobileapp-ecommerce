import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
        fullName: { type: String, required: true },
        streetAddress: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        phoneNumber: { type: String, required: true }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['placed', 'pending', 'processing', 'shipped', 'in_transit', 'delivered', 'cancelled'],
        default: 'placed'
    },
    placedAt: Date,
    pendingAt: Date,
    processingAt: Date,
    shippedAt: Date,
    inTransitAt: Date,
    deliveredAt: Date,
    cancelledAt: Date
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);