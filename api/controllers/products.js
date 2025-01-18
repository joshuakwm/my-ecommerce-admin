import { Op } from 'sequelize';
import Product from '../models/product.js';
import {
  NotFoundError,
  InternalServerError
} from '../errors/index.js';

// Get all products with search/filter
export const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, inStock } = req.query;
    
    const where = {};
    
    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }
    
    if (category) {
      where.category = category;
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price[Op.gte] = minPrice;
      }
      if (maxPrice) {
        where.price[Op.lte] = maxPrice;
      }
    }
    
    if (inStock === 'true') {
      where.stock_quantity = { [Op.gt]: 0 };
    }
    
    const products = await Product.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
    
    res.json({ success: true, data: products });
  } catch (error) {
    throw new InternalServerError('Failed to fetch products');
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    throw new InternalServerError('Failed to fetch product');
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock_quantity, description, image_url, featured } = req.body;
    
    const product = await Product.create({
      name,
      category,
      price,
      stock_quantity,
      description,
      image_url,
      featured
    });
    
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    throw new InternalServerError('Failed to create product');
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock_quantity, description, image_url, featured } = req.body;
    
    const [updated] = await Product.update({
      name,
      category,
      price,
      stock_quantity,
      description,
      image_url,
      featured
    }, {
      where: { product_id: id },
      returning: true
    });
    
    if (!updated) {
      throw new NotFoundError('Product not found');
    }
    
    const updatedProduct = await Product.findByPk(id);
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    throw new InternalServerError('Failed to update product');
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({
      where: { product_id: id }
    });
    
    if (!deleted) {
      throw new NotFoundError('Product not found');
    }
    
    res.status(204).end();
  } catch (error) {
    throw new InternalServerError('Failed to delete product');
  }
};
