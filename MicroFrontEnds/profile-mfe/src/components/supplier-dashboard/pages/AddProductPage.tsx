import React from "react";

type SupplierCategory = {
  categoryId: number;
  categoryName: string;
};

type AddProductPageProps = {
  productForm: {
    name: string;
    categoryId: string;
    supplierId: string;
    price: string;
    quantity: string;
    unitOfSelling: string;
    description: string;
  };
  setProductForm: React.Dispatch<React.SetStateAction<{
    name: string;
    categoryId: string;
    supplierId: string;
    price: string;
    quantity: string;
    unitOfSelling: string;
    description: string;
  }>>;
  categoryOptions: SupplierCategory[];
  isLoadingCategoryOptions: boolean;
  productImageFile: File | null;
  productImageUrl: string;
  isUploadingProductImage: boolean;
  isCreatingProduct: boolean;
  productError: string | null;
  productSaved: boolean;
  onImageSelected: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export default function AddProductPage({
  productForm,
  setProductForm,
  categoryOptions,
  isLoadingCategoryOptions,
  productImageFile,
  productImageUrl,
  isUploadingProductImage,
  isCreatingProduct,
  productError,
  productSaved,
  onImageSelected,
  onSubmit,
}: AddProductPageProps) {
  return (
    <section className="supplier-form-shell" aria-label="Add product form">
      <article className="supplier-form-card">
        <div className="supplier-panel-head">
          <h2>Add New Product</h2>
        </div>

        <form className="supplier-form-grid" onSubmit={onSubmit}>
          <label className="supplier-field">
            <span>Product Name</span>
            <input
              type="text"
              value={productForm.name}
              onChange={(event) => {
                setProductForm((prev) => ({ ...prev, name: event.target.value }));
              }}
              placeholder="Enter product name"
              required
            />
          </label>

          <label className="supplier-field">
            <span>Category</span>
            <select
              value={productForm.categoryId}
              onChange={(event) => {
                setProductForm((prev) => ({ ...prev, categoryId: event.target.value }));
              }}
              disabled={isLoadingCategoryOptions || categoryOptions.length === 0}
            >
              {isLoadingCategoryOptions ? (
                <option value="">Loading categories...</option>
              ) : categoryOptions.length === 0 ? (
                <option value="">No categories available</option>
              ) : (
                categoryOptions.map((category) => (
                  <option key={category.categoryId} value={String(category.categoryId)}>
                    {category.categoryName}
                  </option>
                ))
              )}
            </select>
          </label>

          <label className="supplier-field">
            <span>Price</span>
            <input
              type="text"
              value={productForm.price}
              onChange={(event) => {
                setProductForm((prev) => ({ ...prev, price: event.target.value }));
              }}
              placeholder="e.g. 5.99"
              required
            />
          </label>

          <label className="supplier-field">
            <span>Quantity</span>
            <input
              type="number"
              min={0}
              value={productForm.quantity}
              onChange={(event) => {
                setProductForm((prev) => ({ ...prev, quantity: event.target.value }));
              }}
              placeholder="e.g. 100"
              required
            />
          </label>

          <label className="supplier-field">
            <span>Unit of Selling</span>
            <select
              value={productForm.unitOfSelling}
              onChange={(event) => {
                setProductForm((prev) => ({ ...prev, unitOfSelling: event.target.value }));
              }}
            >
              <option value="UNIT">Units</option>
              <option value="KG">Kilograms</option>
              <option value="G">Grams</option>
              <option value="L">Liters</option>
              <option value="ML">Milliliters</option>
            </select>
          </label>

          <label className="supplier-field supplier-field-full">
            <span>Description</span>
            <textarea
              value={productForm.description}
              onChange={(event) => {
                setProductForm((prev) => ({ ...prev, description: event.target.value }));
              }}
              placeholder="Add a short product description"
              rows={4}
              required
            />
          </label>

          <label className="supplier-field supplier-field-full">
            <span>Product Image</span>
            <input type="file" accept="image/*" onChange={onImageSelected} required />
          </label>

          {productImageFile ? (
            <div className="supplier-field-full supplier-upload-preview">
              <p className="supplier-upload-name">Selected: {productImageFile.name}</p>
              <p className="supplier-upload-note">
                {isUploadingProductImage
                  ? "Uploading image..."
                  : productImageUrl
                    ? "Image uploaded and ready to save."
                    : "Ready to upload."}
              </p>
            </div>
          ) : null}

          <div className="supplier-form-actions supplier-field-full">
            <button className="supplier-primary-btn" type="submit" disabled={isUploadingProductImage || isCreatingProduct || !productImageUrl}>
              <i className="bx bx-check" aria-hidden="true" />
              {isCreatingProduct ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>

        {productError ? <p className="supplier-error-text">{productError}</p> : null}
        {productSaved ? <p className="supplier-success-text">Product saved. Ready for data steward review.</p> : null}
      </article>
    </section>
  );
}
