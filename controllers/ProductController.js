const ProductModel = require('../models/product.model');
const NodeCache = require('node-cache');
const productCache = new NodeCache();
// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const { productName, price, stockNumber, discountPrice, description, category, images, manufacturer, rating, isFeatured, color } = req.body;

    // Create a new product
    const newProduct = new ProductModel({
      productName,
      price,
      stockNumber,
      discountPrice,
      description,
      category,
      images,
      manufacturer,
      rating,
      isFeatured,
      color,
    });

    // Save the product to the database
    await newProduct.save();

    return res.status(201).json({
      status: true,
      message: 'Product added successfully',
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Update product by ID
exports.updateProductById = async (req, res) => {
  try {
    const  productId  = req.params.id;
    const updatedProductData = req.body;

    // Find the product by ID and update it
    const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updatedProductData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({
        status: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Sort products by category
exports.sortProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    // Find products by category
    const products = await ProductModel.find({ category });

    return res.status(200).json({
      status: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Sort products by price
exports.sortProductsByPrice = async (req, res) => {
  try {
    const  sortBy  = req.params.sortBy;

    // Define the sort order (1 for ascending, -1 for descending)
    const sortOrder = sortBy === 'asc' ? 1 : -1;

    // Find and sort products by price
    const products = await ProductModel.find().sort({ price: sortOrder });

    return res.status(200).json({
      status: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Delete product by ID
exports.deleteProductById = async (req, res) => {
  try {
    const  productId  = req.params.id;

    // Find and delete the product by ID
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        status: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Product deleted successfully',
      data: deletedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const  productId  = req.params.id;

    console.log(productId)
    // Find the product by ID
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      status: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// Get all products with pagination
exports.getAllProductsWithPagination = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Create a unique cache key based on the request parameters
    const cacheKey = `products:${page}:${limit}`;

    // Try to get the data from the cache
    const cachedData = productCache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        status: true,
        data: cachedData,
        message: 'Data retrieved from cache',
      });
    }

    // Parse page and limit values to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Calculate skip value for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Find all products with pagination
    const products = await ProductModel.find().skip(skip).limit(limitNumber);

    // Save the data to the cache with a TTL of 2 hours (2 * 60 * 60 seconds)
    productCache.set(cacheKey, products, 2 * 60 * 60);

    return res.status(200).json({
      status: true,
      data: products,
      message: 'Data retrieved from the database',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};