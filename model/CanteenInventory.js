import mongoose from 'mongoose';

const CanteenInventorySchema = new mongoose.Schema({
    productName : { type: String, required: true },
    mesurment   : { type: String, required: true },
    deleted: { type: Boolean, default: false },
    createdBy     : {
        type: mongoose.Schema.ObjectId,
        ref:  'Hostel'
    }
});

export default mongoose.model('CanteenInventory',CanteenInventorySchema);