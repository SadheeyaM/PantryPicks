const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");
const { createCategoryImagePresign, createProductImagePresign } = require("../services/uploadService");

router.post("/category-image/presign", authenticate, async (req, res) => {
  try {
    const { fileName, contentType } = req.body || {};

    if (!fileName || !contentType) {
      return res.status(400).json({
        message: "fileName and contentType are required",
      });
    }

    const result = await createCategoryImagePresign({ fileName, contentType });

    return res.status(200).json({
      message: "Upload URL created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Failed to create upload URL",
    });
  }
});

router.post("/product-image/presign", authenticate, async (req, res) => {
  try {
    const { fileName, contentType } = req.body || {};

    if (!fileName || !contentType) {
      return res.status(400).json({
        message: "fileName and contentType are required",
      });
    }

    const result = await createProductImagePresign({ fileName, contentType });

    return res.status(200).json({
      message: "Upload URL created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Failed to create upload URL",
    });
  }
});

module.exports = router;
