const productClient = require("../clients/product") ;
const categoryClient = require("../clients/category") ;
const { createImageReadUrl } = require("../services/uploadService");

const unwrap = (payload) => payload?.data?.data ?? payload?.data ?? payload;

const unwrapNestedData = (payload) => {
  let current = unwrap(payload);

  while (
    current &&
    typeof current === "object" &&
    !Array.isArray(current) &&
    current.data &&
    !current.productId
  ) {
    current = current.data;
  }

  return current;
};

const withSignedProductImage = async (product) => {
  if (!product?.productUrl) {
    return product;
  }

  try {
    const signedImageUrl = await createImageReadUrl({ fileUrl: product.productUrl });
    return {
      ...product,
      productUrl: signedImageUrl || product.productUrl,
    };
  } catch (_) {
    return product;
  }
};

exports.getProductsWithCategory = async (req, res) => {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      productClient.getProducts(),
      categoryClient.getCategories(),
    ]);

    const productsPayload = unwrap(productsResponse);
    const products = Array.isArray(productsPayload?.content)
      ? productsPayload.content
      : Array.isArray(productsPayload)
        ? productsPayload
        : [];

    const categoriesPayload = unwrap(categoriesResponse);
    const categories = Array.isArray(categoriesPayload) ? categoriesPayload : [];

    const productsWithCategory = await Promise.all(products.map(async (product) => {
      const category = categories.find(
        (cat) => cat.categoryId === product.categoryId
      );

      const productWithImage = await withSignedProductImage(product);

      return {
        ...productWithImage,
        categoryName: category ? category.categoryName : "Unknown",
      };
    }));

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
    const productPayload = unwrapNestedData(productResponse);
    const product = Array.isArray(productPayload?.content)
      ? productPayload.content[0]
      : Array.isArray(productPayload)
        ? productPayload[0]
        : productPayload;

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      }) ;
    }

    const categoriesResponse = await categoryClient.getCategories();
    const categoriesPayload = unwrap(categoriesResponse);
    const categories = Array.isArray(categoriesPayload) ? categoriesPayload : [];
    const category = categories.find((cat) => Number(cat.categoryId) === Number(product.categoryId)) ;

    const productWithImage = await withSignedProductImage(product);

    res.json({
      ...productWithImage,
      categoryName: category ? category.categoryName : "Unknown",
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
    const status = error?.response?.status || 500;
    const downstream = error?.response?.data;
    const message =
      downstream?.message ||
      downstream?.details?.message ||
      error?.message ||
      "Error while updating product";

    res.status(status).json({
      message,
      details: downstream || null,
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
