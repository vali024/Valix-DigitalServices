import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    prices: {
        g250: {type: Number, required: true},
        g500: {type: Number},
        kg1: {type: Number}
    },
    marketPrices: {
        g250: {type: Number},
        g500: {type: Number},
        kg1: {type: Number}
    },
    quantityOptions: {
        g250: {type: Boolean, default: true},
        g500: {type: Boolean, default: false},
        kg1: {type: Boolean, default: false}
    },
    image: {type: String, required: true},
    category: {
        type: String, 
        required: true,
        enum: ['Fashion Accessories', 'Office Accessories', 'Kitchen Accessories', 'Kids Toys', 'Vegetables', 'Fruits', 'Exotic Vegetables', 'Exotic Fruits', 'Meat']
    },
    status: {
        type: String,
        enum: ['in-stock', 'out-of-stock', 'coming-soon'],
        default: 'in-stock'
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0,
        min: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    featured: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    }
}, {
    timestamps: true
});

// Add middleware to set marketPrices if not provided
foodSchema.pre('save', function(next) {
    if (!this.marketPrices.g250) this.marketPrices.g250 = this.prices.g250;
    if (this.quantityOptions.g500 && !this.marketPrices.g500) this.marketPrices.g500 = this.prices.g500;
    if (this.quantityOptions.kg1 && !this.marketPrices.kg1) this.marketPrices.kg1 = this.prices.kg1;
    next();
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;