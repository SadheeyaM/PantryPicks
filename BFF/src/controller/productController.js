const productClient = require("../clients/product") ;
const categoryClient = require("../clients/category") ;

const e = require("cors");

exports.getProductsWithCategory = async (req, res) => {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      productClient.getProducts(),
      categoryClient.getCategories(),
    ]);

    const productsPayload = productsResponse.data?.data;
    const products = Array.isArray(productsPayload?.content)
      ? productsPayload.content
      : Array.isArray(productsPayload)
        ? productsPayload
        : [];

    const categoriesPayload = categoriesResponse.data?.data;
    const categories = Array.isArray(categoriesPayload) ? categoriesPayload : [];

    const productsWithCategory = products.map((product) => {
      const category = categories.find(
        (cat) => cat.categoryId === product.categoryId
      );

      return {
        ...product,
        categoryName: category ? category.categoryName : "Unknown",
      };
    });

    res.json(productsWithCategory);
  } catch (error) {
    console.error("Error in getProductsWithCategory:", error.message, error.response?.data);
    res.status(500).json({ message: "Error while fetching products with category" });
  }
};
exports.getProducts = async (req, res) => {
  try {
    const response = await productClient.getProducts() ;    
    res.json(response.data) ;
    } catch (error) {
    res.status(500).json({
        message: "Error while fetching products",
    }) ;
    }
} ;

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productResponse = await productClient.getProductById(id) ;
    const product = productResponse.data ;

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      }) ;
    }

    const categoriesResponse = await categoryClient.getCategories();
    const categories = categoriesResponse.data ;
    const category = categories.find((cat) => cat.id === product.categoryId) ;

    res.json({
      ...product,
      categoryName: category ? category.name : "Unknown",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching product by ID",
    }) ;
  }
} ;

exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const response = await productClient.createProduct(productData) ;
    res.status(201).json(response.data) ;
  } catch (error) {
    res.status(500).json({
      message: "Error while creating product",
    }) ;
  }
} ;

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;
        const response = await productClient.updateProduct(id, productData);
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({
            message: "Error while updating product",
        }) ;
    } 
} ;

// exports.getProductsByCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params ;
//     const response = await productClient.getProductsByCategory(categoryId);
//     res.json(response.data) ;
//     } catch (error) {
//     res.status(500).json({
//         message: "Error while fetching products by category",
//     }) ;
//     } 
// };
