import React from "react";

type DetailModal = { kind: "product" | "order"; id: string } | null;

type SupplierProductRecord = {
  id: string;
  name: string;
  category: string;
  price: string;
  imageUrl: string;
  status: string;
  unitOfSelling: string;
  stock: string;
  updatedAt: string;
  description: string;
};

type OrderRecord = {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: string;
  deliveryDate: string;
  notes: string;
};

type ProductOrderDetailModalProps = {
  detailModal: DetailModal;
  setDetailModal: React.Dispatch<React.SetStateAction<DetailModal>>;
  productForModal: SupplierProductRecord | null;
  selectedOrder: OrderRecord | null;
  isEditingProduct: boolean;
  setIsEditingProduct: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdatingProduct: boolean;
  productUpdateError: string | null;
  setProductUpdateError: React.Dispatch<React.SetStateAction<string | null>>;
  isUploadingEditProductImage: boolean;
  setIsUploadingEditProductImage: React.Dispatch<React.SetStateAction<boolean>>;
  editProductImageError: string | null;
  setEditProductImageError: React.Dispatch<React.SetStateAction<string | null>>;
  isLoadingProductDetail: boolean;
  productDetailError: string | null;
  productDraft: SupplierProductRecord;
  setProductDraft: React.Dispatch<React.SetStateAction<SupplierProductRecord>>;
  orderDraft: OrderRecord;
  setOrderDraft: React.Dispatch<React.SetStateAction<OrderRecord>>;
  isEditingOrder: boolean;
  setIsEditingOrder: React.Dispatch<React.SetStateAction<boolean>>;
  setOrders: React.Dispatch<React.SetStateAction<OrderRecord[]>>;
  uploadProductImage: (file: File) => Promise<string>;
  onSaveProduct: () => Promise<void>;
};

export default function ProductOrderDetailModal({
  detailModal,
  setDetailModal,
  productForModal,
  selectedOrder,
  isEditingProduct,
  setIsEditingProduct,
  isUpdatingProduct,
  productUpdateError,
  setProductUpdateError,
  isUploadingEditProductImage,
  setIsUploadingEditProductImage,
  editProductImageError,
  setEditProductImageError,
  isLoadingProductDetail,
  productDetailError,
  productDraft,
  setProductDraft,
  orderDraft,
  setOrderDraft,
  isEditingOrder,
  setIsEditingOrder,
  setOrders,
  uploadProductImage,
  onSaveProduct,
}: ProductOrderDetailModalProps) {
  if (!detailModal) {
    return null;
  }

  return (
    <div className="supplier-modal-backdrop" role="presentation" onClick={() => setDetailModal(null)}>
      <article
        className="supplier-modal"
        role="dialog"
        aria-modal="true"
        aria-label={detailModal.kind === "product" ? "Product details" : "Order details"}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="supplier-modal-head">
          <h2>{detailModal.kind === "product" ? "Product Details" : "Order Details"}</h2>
          <div className="supplier-modal-actions">
            {detailModal.kind === "product" && productForModal ? (
              isEditingProduct ? (
                <>
                  <button
                    type="button"
                    className="supplier-secondary-btn"
                    onClick={() => {
                      setIsEditingProduct(false);
                      setProductUpdateError(null);
                      setEditProductImageError(null);
                      setProductDraft(productForModal);
                    }}
                    disabled={isUpdatingProduct}
                  >
                    Cancel
                  </button>
                  <button type="button" className="supplier-primary-btn" onClick={onSaveProduct} disabled={isUpdatingProduct}>
                    {isUpdatingProduct ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <button type="button" className="supplier-secondary-btn" onClick={() => setIsEditingProduct(true)}>
                  Edit
                </button>
              )
            ) : null}

            {detailModal.kind === "order" && selectedOrder ? (
              isEditingOrder ? (
                <>
                  <button
                    type="button"
                    className="supplier-secondary-btn"
                    onClick={() => {
                      setIsEditingOrder(false);
                      setOrderDraft(selectedOrder);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="supplier-primary-btn"
                    onClick={() => {
                      setOrders((prev) => prev.map((order) => (order.id === selectedOrder.id ? orderDraft : order)));
                      setIsEditingOrder(false);
                    }}
                  >
                    Save
                  </button>
                </>
              ) : (
                <button type="button" className="supplier-secondary-btn" onClick={() => setIsEditingOrder(true)}>
                  Edit
                </button>
              )
            ) : null}

            <button
              type="button"
              className="supplier-close-btn"
              onClick={() => {
                setDetailModal(null);
                setIsEditingProduct(false);
                setIsEditingOrder(false);
              }}
              aria-label="Close details"
            >
              <i className="bx bx-x" aria-hidden="true" />
            </button>
          </div>
        </div>

        {detailModal.kind === "product" ? (
          <div className="supplier-modal-body">
            {isLoadingProductDetail ? <p className="supplier-list-sub">Loading product details...</p> : null}
            {productDetailError ? <p className="supplier-error-text">{productDetailError}</p> : null}
            {productUpdateError ? <p className="supplier-error-text">{productUpdateError}</p> : null}
            {editProductImageError ? <p className="supplier-error-text">{editProductImageError}</p> : null}
            {!isLoadingProductDetail && !productDetailError && !productForModal ? <p className="supplier-list-sub">Product details unavailable.</p> : null}

            {productForModal ? (
              <>
                {(isEditingProduct ? productDraft.imageUrl : productForModal.imageUrl) ? (
                  <div className="supplier-product-image-wrap">
                    <img
                      src={isEditingProduct ? productDraft.imageUrl : productForModal.imageUrl}
                      alt={`${productForModal.name} image`}
                      className="supplier-product-image"
                    />
                  </div>
                ) : (
                  <p className="supplier-list-sub">No product image available.</p>
                )}

                {isEditingProduct ? (
                  <div className="supplier-detail-block is-editing">
                    <p className="supplier-detail-label">Change Product Image</p>
                    <input
                      className="supplier-modal-input"
                      type="file"
                      accept="image/*"
                      onChange={async (event) => {
                        const file = event.target.files?.[0] || null;
                        setEditProductImageError(null);
                        if (!file) {
                          return;
                        }

                        setIsUploadingEditProductImage(true);
                        try {
                          const nextImageUrl = await uploadProductImage(file);
                          setProductDraft((prev) => ({ ...prev, imageUrl: nextImageUrl }));
                        } catch (error) {
                          setEditProductImageError(error instanceof Error ? error.message : "Failed to upload image");
                        } finally {
                          setIsUploadingEditProductImage(false);
                        }
                      }}
                      disabled={isUploadingEditProductImage || isUpdatingProduct}
                    />
                    <p className="supplier-list-sub">
                      {isUploadingEditProductImage ? "Uploading new image..." : "Choose an image to replace the current one."}
                    </p>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}
      </article>
    </div>
  );
}
