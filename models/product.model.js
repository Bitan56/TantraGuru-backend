import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    storageKey: {
      type: String,
      required: true,
      trim: true,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
  },
  { _id: true, timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [255, 'Product name cannot exceed 255 characters'],
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'সকল সামগ্রী',
      index: true,
    },
    tag: {
      type: String,
      trim: true,
      default: 'বিশুদ্ধ সামগ্রী',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    originalPrice: {
      type: Number,
      required: [true, 'Original price is required'],
      min: [0, 'Original price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      default: null,
      validate: {
        validator: function (value) {
          if (value === null || value === undefined) return true;
          return value >= 0 && value <= this.originalPrice;
        },
        message: 'Discount price must be >= 0 and <= original price',
      },
    },
    rating: {
      type: Number,
      default: 5,
    },
    images: {
      type: [imageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ originalPrice: 1, discountPrice: 1 });

export const Product = mongoose.model('Product', productSchema);