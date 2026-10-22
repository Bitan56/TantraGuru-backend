import mongoose from 'mongoose';
import { Product } from '../models/product.model.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/storage.service.js';

const sampleFallbackProducts = [
  {
    _id: '661fa1000000000000000001',
    name: 'পঞ্চমুখী নেপালি রুদ্রাক্ষ মালা',
    category: 'রুদ্রাক্ষ',
    tag: 'মহাশ্মশানে শোধিত',
    description: 'তারাপীঠ মহাশ্মশানের পুণ্য ভূমিতে ১০৮+১ পঞ্চমুখী রুদ্রাক্ষ জপমালা। আধ্যাত্মিক একাগ্রতা ও মনঃশান্তির জন্য শ্রেষ্ঠ।',
    originalPrice: 1500,
    discountPrice: 1101,
    rating: 5,
    images: [
      { imageUrl: '/src/assets/img5.jpg', storageKey: 'mock1_1', orderIndex: 0 },
      { imageUrl: '/src/assets/img3.jpg', storageKey: 'mock1_2', orderIndex: 1 },
      { imageUrl: '/src/assets/img8.jpg', storageKey: 'mock1_3', orderIndex: 2 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '661fa1000000000000000002',
    name: 'শ্রী শ্রী তারা কবচ ও সর্বসিদ্ধি যন্ত্রম',
    category: 'কবচ ও যন্ত্রম',
    tag: 'প্রাণপ্রতিষ্ঠিত',
    description: 'তন্ত্রোক্ত মতে নির্মিত বিশেষ অষ্টধাতু তারা কবচ। যাবতীয় অশুভ প্রভাব ও নজর দোষ থেকে সম্পূর্ণ সুরক্ষা প্রদান করে।',
    originalPrice: 1800,
    discountPrice: 1501,
    rating: 5,
    images: [
      { imageUrl: '/src/assets/img7.jpg', storageKey: 'mock2_1', orderIndex: 0 },
      { imageUrl: '/src/assets/img1.jpg', storageKey: 'mock2_2', orderIndex: 1 },
      { imageUrl: '/src/assets/img4.jpg', storageKey: 'mock2_3', orderIndex: 2 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '661fa1000000000000000003',
    name: 'তান্ত্রিক মহাযজ্ঞ ও হোম সামগ্রী কিট',
    category: 'পূজা সামগ্রী',
    tag: 'বিশুদ্ধ উপকরণ',
    description: 'হোমের বিশুদ্ধ দেশি ঘি, সমিধ কাঠ, নবগ্রহ কাঠ, তিল, জপ কর্পূর ও সুগন্ধি বনৌষধির স্বয়ংসম্পূর্ণ পূজা কিট। তারাপীঠের প্রাচীন বৈদিক রীতি মেনে প্রস্তুত।',
    originalPrice: 1000,
    discountPrice: 801,
    rating: 5,
    images: [
      { imageUrl: '/src/assets/img10.jpg', storageKey: 'mock3_1', orderIndex: 0 },
      { imageUrl: '/src/assets/img1.jpg', storageKey: 'mock3_2', orderIndex: 1 },
      { imageUrl: '/src/assets/img2.jpg', storageKey: 'mock3_3', orderIndex: 2 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '661fa1000000000000000004',
    name: 'দুর্লভ একমুখী রুদ্রাক্ষ (মহাশক্তি শোধিত)',
    category: 'রুদ্রাক্ষ',
    tag: 'বিশেষ দুর্লভ',
    description: 'শিব ও শক্তির সর্বোচ্চ কৃপাপ্রাপ্ত একমুখী রুদ্রাক্ষ যা একাগ্রতা, আত্মবিশ্বাস ও সকল কাজে ঐশ্বরিক সাফল্য প্রদান করে। সাধকদের জন্য পরম উপযোগী।',
    originalPrice: 6500,
    discountPrice: 5101,
    rating: 5,
    images: [
      { imageUrl: '/src/assets/img3.jpg', storageKey: 'mock4_1', orderIndex: 0 },
      { imageUrl: '/src/assets/img5.jpg', storageKey: 'mock4_2', orderIndex: 1 },
      { imageUrl: '/src/assets/img8.jpg', storageKey: 'mock4_3', orderIndex: 2 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '661fa1000000000000000005',
    name: 'প্রাকৃতিক শোধিত রক্তপ্রবাল ও মুক্তা',
    category: 'গ্রহরত্ন',
    tag: 'ল্যাব সার্টিফাইড',
    description: 'মাঙ্গলিক দোষ ও চন্দ্রের প্রতিকূলতা প্রশমনে বৈদিক নিয়মে শোধিত এবং ধারণোপযোগী প্রাকৃতিক রত্নপাথর। সার্টিফিকেট সহ প্রদান করা হয়।',
    originalPrice: 3200,
    discountPrice: 2501,
    rating: 5,
    images: [
      { imageUrl: '/src/assets/img6.jpg', storageKey: 'mock5_1', orderIndex: 0 },
      { imageUrl: '/src/assets/img7.jpg', storageKey: 'mock5_2', orderIndex: 1 },
      { imageUrl: '/src/assets/img2.jpg', storageKey: 'mock5_3', orderIndex: 2 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '661fa1000000000000000006',
    name: 'মহাশ্মশান সিদ্ধ রক্ষা কবচ',
    category: 'কবচ ও যন্ত্রম',
    tag: 'সিদ্ধপীঠ সুরক্ষা',
    description: 'তারাপীঠের গোপন তান্ত্রিক বিধানে সাধিত শক্তিশালী রক্ষা কবচ। ব্যবসা, কর্মক্ষেত্র ও পারিবারিক সুরক্ষায় অব্যর্থ।',
    originalPrice: 1500,
    discountPrice: 1201,
    rating: 5,
    images: [
      { imageUrl: '/src/assets/img1.jpg', storageKey: 'mock6_1', orderIndex: 0 },
      { imageUrl: '/src/assets/img7.jpg', storageKey: 'mock6_2', orderIndex: 1 },
      { imageUrl: '/src/assets/img4.jpg', storageKey: 'mock6_3', orderIndex: 2 },
    ],
    createdAt: new Date().toISOString(),
  },
];

let inMemoryStore = [...sampleFallbackProducts];

export const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search, category } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let filtered = [...inMemoryStore];
      if (category && category !== 'সকল সামগ্রী') {
        filtered = filtered.filter((p) => p.category === category);
      }
      if (search) {
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
        );
      }
      return res.status(200).json({
        success: true,
        pagination: {
          total: filtered.length,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(filtered.length / Number(limit)) || 1,
        },
        data: filtered,
      });
    }

    const filter = {};
    if (category && category !== 'সকল সামগ্রী') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const item = inMemoryStore.find((p) => p._id === id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.status(200).json({ success: true, data: item });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  const files = req.files || [];
  let uploadedMedia = [];

  try {
    const {
      name,
      description = '',
      category = 'সকল সামগ্রী',
      tag = 'বিশুদ্ধ সামগ্রী',
      originalPrice,
      discountPrice,
      imageUrl,
    } = req.body;

    if (files.length > 0) {
      uploadedMedia = await Promise.all(
        files.map((file) => uploadToCloudinary(file.buffer))
      );
    }

    let images = uploadedMedia.map((item, index) => ({
      imageUrl: item.url,
      storageKey: item.key,
      orderIndex: index,
    }));

    if (images.length === 0 && imageUrl) {
      images = [
        {
          imageUrl,
          storageKey: `url_${Date.now()}`,
          orderIndex: 0,
        },
      ];
    }

    // Default fallback image if none provided
    if (images.length === 0) {
      images = [
        {
          imageUrl: '/src/assets/img5.jpg',
          storageKey: `default_${Date.now()}`,
          orderIndex: 0,
        },
      ];
    }

    const numOriginal = Number(originalPrice);
    const numDiscount =
      discountPrice !== undefined && discountPrice !== null && discountPrice !== ''
        ? Number(discountPrice)
        : null;

    if (mongoose.connection.readyState !== 1) {
      const newProduct = {
        _id: new mongoose.Types.ObjectId().toString(),
        name,
        category,
        tag,
        description: description || '',
        originalPrice: numOriginal,
        discountPrice: numDiscount,
        rating: 5,
        images,
        createdAt: new Date().toISOString(),
      };
      inMemoryStore.unshift(newProduct);
      return res.status(201).json({ success: true, data: newProduct });
    }

    const product = await Product.create({
      name,
      category,
      tag,
      description,
      originalPrice: numOriginal,
      discountPrice: numDiscount,
      rating: 5,
      images,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (uploadedMedia.length > 0) {
      await Promise.all(uploadedMedia.map((m) => deleteFromCloudinary(m.key)));
    }
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  const newFiles = req.files || [];
  let newUploadedMedia = [];

  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const idx = inMemoryStore.findIndex((p) => p._id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      const existing = inMemoryStore[idx];
      const { name, description, category, tag, originalPrice, discountPrice } = req.body;
      if (name !== undefined) existing.name = name;
      if (description !== undefined) existing.description = description;
      if (category !== undefined) existing.category = category;
      if (tag !== undefined) existing.tag = tag;
      if (originalPrice !== undefined) existing.originalPrice = Number(originalPrice);
      if (discountPrice !== undefined) existing.discountPrice = Number(discountPrice);
      return res.status(200).json({ success: true, data: existing });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const { name, description, category, tag, originalPrice, discountPrice, deleteImageIds } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (tag !== undefined) product.tag = tag;
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);

    if (deleteImageIds) {
      const idsToDelete = Array.isArray(deleteImageIds) ? deleteImageIds : [deleteImageIds];
      const imagesToRemove = product.images.filter((img) =>
        idsToDelete.includes(img._id.toString())
      );

      await Promise.all(imagesToRemove.map((img) => deleteFromCloudinary(img.storageKey)));

      product.images = product.images.filter(
        (img) => !idsToDelete.includes(img._id.toString())
      );
    }

    if (newFiles.length > 0) {
      newUploadedMedia = await Promise.all(
        newFiles.map((file) => uploadToCloudinary(file.buffer))
      );

      const startIndex = product.images.length;
      newUploadedMedia.forEach((media, idx) => {
        product.images.push({
          imageUrl: media.url,
          storageKey: media.key,
          orderIndex: startIndex + idx,
        });
      });
    }

    await product.save();
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (newUploadedMedia.length > 0) {
      await Promise.all(newUploadedMedia.map((m) => deleteFromCloudinary(m.key)));
    }
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      inMemoryStore = inMemoryStore.filter((p) => p._id !== id);
      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.images.length > 0) {
      await Promise.all(product.images.map((img) => deleteFromCloudinary(img.storageKey)));
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product and all associated images deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};