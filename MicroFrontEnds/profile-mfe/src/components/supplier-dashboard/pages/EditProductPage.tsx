import React from "react";

type SupplierProductRecord = {
  id: string;
  name: string;
  category: string;
  categoryId: number;
  price: string;
  supplierId: string;
  quantity: number;
  imageUrl: string;
  status: string;
  unitOfSelling: string;
  updatedAt: string;
  description: string;
};

type CategoryOption = {
  categoryId: number;
  categoryName: string;
};

type EditProductPageProps = {
  productDraft: SupplierProductRecord;
  setProductDraft: React.Dispatch<React.SetStateAction<SupplierProductRecord>>;
  isLoadingProductDetail: boolean;
  productDetailError: string | null;
  productUpdateError: string | null;
  editProductImageError: string | null;
  isUploadingEditProductImage: boolean;
  isUpdatingProduct: boolean;
  onBackToProducts: () => void;
  onSave: () => Promise<void>;
  onImageUpload: (file: File) => Promise<void>;
  categories?: CategoryOption[];
};

export default function EditProductPage({
  productDraft,
  setProductDraft,
  isLoadingProductDetail,
  productDetailError,
  productUpdateError,
  editProductImageError,
  isUploadingEditProductImage,
  isUpdatingProduct,
  onBackToProducts,
  onSave,
  onImageUpload,
  categories = [],
}: EditProductPageProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [initialDraft, setInitialDraft] = React.useState<SupplierProductRecord | null>(null);

  React.useEffect(() => {
    if (productDraft.id) {
      setInitialDraft(productDraft);
      setIsEditing(false);
    }
  }, [productDraft.id]);

  return (
    <section className="supplier-list-layout" aria-label="Edit product details">
      <article className="supplier-products-panel">
        <div className="supplier-panel-head">
          <h2>Product Details</h2>
          <button type="button" className="supplier-secondary-btn" onClick={onBackToProducts}>Back to Products</button>
        </div>

        {isLoadingProductDetail ? <p className="supplier-list-sub">Loading product details...</p> : null}
        {productDetailError ? <p className="supplier-error-text">{productDetailError}</p> : null}
        {productUpdateError ? <p className="supplier-error-text">{productUpdateError}</p> : null}
        {editProductImageError ? <p className="supplier-error-text">{editProductImageError}</p> : null}

        {!isLoadingProductDetail && !productDetailError && !productDraft.id ? <p className="supplier-list-sub">Select a product from Products tab.</p> : null}

        {productDraft.id ? (
          <>
            {/* Top Section: Image + Side Details */}
            <div className="supplier-product-top-layout">
              {/* Image on Left */}
              <div className="supplier-product-image-section">
                {productDraft.imageUrl ? (
                  <div className="supplier-product-image-wrap-medium">
                    <img src={productDraft.imageUrl} alt={`${productDraft.name} image`} className="supplier-product-image-medium" />
                  </div>
                ) : (
                  <p className="supplier-list-sub">No product image available.</p>
                )}
                {isEditing ? (
                  <div className="supplier-image-upload-zone-compact">
                    <input
                      className="supplier-file-input"
                      type="file"
                      accept="image/*"
                      onChange={async (event) => {
                        const file = event.target.files?.[0] || null;
                        if (!file) return;
                        await onImageUpload(file);
                      }}
                      disabled={isUploadingEditProductImage || isUpdatingProduct}
                    />
                    <p className="supplier-upload-hint-compact">
                      {isUploadingEditProductImage ? "Uploading..." : "Change Image"}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Details on Right */}
              <div className="supplier-product-details-side">
                <div className={`supplier-detail-block`}>
                  <p className="supplier-detail-label">Name</p>
                  {isEditing ? (
                    <input className="supplier-modal-input" type="text" value={productDraft.name} onChange={(event) => setProductDraft((prev) => ({ ...prev, name: event.target.value }))} />
                  ) : (
                    <p className="supplier-detail-value">{productDraft.name}</p>
                  )}
                </div>

                <div className={`supplier-detail-block`}>
                  <p className="supplier-detail-label">Product ID</p>
                  <p className="supplier-detail-value">{productDraft.id}</p>
                </div>

                <div className={`supplier-detail-block`}>
                  <p className="supplier-detail-label">Price</p>
                  {isEditing ? (
                    <input className="supplier-modal-input" type="text" value={productDraft.price} onChange={(event) => setProductDraft((prev) => ({ ...prev, price: event.target.value }))} />
                  ) : (
                    <p className="supplier-detail-value">{productDraft.price}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields - Below */}
            <div className="supplier-product-full-form">
              <div className="supplier-form-row">
                <div className={`supplier-detail-block`} style={{ flex: 1 }}>
                  <p className="supplier-detail-label">Category</p>
                  {isEditing ? (
                    <select 
                      className="supplier-modal-input" 
                      value={productDraft.categoryId || 0}
                      onChange={(event) => {
                        const selectedCategory = categories.find((cat) => cat.categoryId === Number(event.target.value));
                        if (selectedCategory) {
                          setProductDraft((prev) => ({
                            ...prev,
                            category: selectedCategory.categoryName,
                            categoryId: selectedCategory.categoryId,
                          }));
                        }
                      }}
                    >
                      <option value={0}>Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="supplier-detail-value">{productDraft.category}</p>
                  )}
                </div>
                <div className={`supplier-detail-block`} style={{ flex: 1, marginLeft: "12px" }}>
                  <p className="supplier-detail-label">Unit of Selling</p>
                  {isEditing ? (
                    <select className="supplier-modal-input" value={productDraft.unitOfSelling} onChange={(event) => setProductDraft((prev) => ({ ...prev, unitOfSelling: event.target.value }))}>
                      <option value="UNIT">Units</option>
                      <option value="KG">Kilograms</option>
                      <option value="G">Grams</option>
                      <option value="L">Liters</option>
                      <option value="ML">Milliliters</option>
                    </select>
                  ) : (
                    <p className="supplier-detail-value">{productDraft.unitOfSelling}</p>
                  )}
                </div>
              </div>

              <div className="supplier-form-row">
                <div className={`supplier-detail-block`} style={{ flex: 1 }}>
                  <p className="supplier-detail-label">Approval Status</p>
                  <p className="supplier-detail-value">{productDraft.status}</p>
                </div>
              </div>

              <div className={`supplier-detail-block`}>
                <p className="supplier-detail-label">Last Updated</p>
                <p className="supplier-detail-value">{productDraft.updatedAt}</p>
              </div>

              <div className={`supplier-detail-block`}>
                <p className="supplier-detail-label">Description</p>
                {isEditing ? (
                  <textarea className="supplier-modal-textarea" value={productDraft.description} onChange={(event) => setProductDraft((prev) => ({ ...prev, description: event.target.value }))} rows={4} />
                ) : (
                  <p className="supplier-detail-text">{productDraft.description}</p>
                )}
              </div>

              <div className="supplier-form-actions">
                {isEditing ? (
                  <>
                    <button
                      className="supplier-secondary-btn"
                      type="button"
                      onClick={() => {
                        if (initialDraft) {
                          setProductDraft(initialDraft);
                        }
                        setIsEditing(false);
                      }}
                      disabled={isUpdatingProduct || isUploadingEditProductImage}
                    >
                      Cancel
                    </button>
                    <button className="supplier-primary-btn" type="button" onClick={onSave} disabled={isUpdatingProduct || isUploadingEditProductImage}>
                      {isUpdatingProduct ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <button className="supplier-primary-btn" type="button" onClick={() => setIsEditing(true)}>
                    Edit Details
                  </button>
                )}
              </div>
            </div>
          </>
        ) : null}
      </article>
    </section>
  );
}
