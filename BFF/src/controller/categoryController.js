const categoryClient = require('../clients/category');
const { createImageReadUrl } = require("../services/uploadService");

const withSignedCategoryImage = async (category) => {
  if (!category?.categoryImage) {
    return category;
  }

  try {
    const signedImageUrl = await createImageReadUrl({ fileUrl: category.categoryImage });
    return {
      ...category,
      categoryImage: signedImageUrl || category.categoryImage,
    };
  } catch (_) {
    return category;
  }
};

exports.getCategories = async (req, res) => {
  try {
    const response = await categoryClient.getCategories();
    const payload = response?.data;
    const list = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [];

    const signedList = await Promise.all(list.map((category) => withSignedCategoryImage(category)));

    if (Array.isArray(payload?.data)) {
      return res.json({
        ...payload,
        data: signedList,
      });
    }

    return res.json(signedList);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching categories",
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await categoryClient.getCategoryById(id);
    const payload = response?.data;
    const category = payload?.data ?? payload;
    const signedCategory = await withSignedCategoryImage(category);

    if (payload?.data) {
      return res.json({
        ...payload,
        data: signedCategory,
      });
    }

    return res.json(signedCategory);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching category by ID",
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const categoryData = req.body; 
    const response = await categoryClient.createCategory(categoryData);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Error while creating category",
    });
  }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const categoryData = req.body;
        const response = await categoryClient.updateCategory(id, categoryData);
        res.json(response.data);
    }   catch (error) {
        res.status(500).json({
            message: "Error while updating category",
        }) ;
    }
} ;