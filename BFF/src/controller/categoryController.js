const categoryClient = require('../clients/category');

exports.getCategories = async (req, res) => {
  try {
    const response = await categoryClient.getCategories();
    res.json(response.data);
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
    res.json(response.data);
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