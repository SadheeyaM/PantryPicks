import React, { useEffect, useMemo, useState } from "react";
import "./supplier-dashboard.css";
import SupplierDashboardLayout from "./supplier-dashboard/SupplierDashboardLayout";
import OverviewPage from "./supplier-dashboard/pages/OverviewPage";
import ProductsPage from "./supplier-dashboard/pages/ProductsPage";
import AddProductPage from "./supplier-dashboard/pages/AddProductPage";
import OrdersPage from "./supplier-dashboard/pages/OrdersPage";
import ProfilePage from "./supplier-dashboard/pages/ProfilePage";
import EditProductPage from "./supplier-dashboard/pages/EditProductPage";

type SupplierView = "overview" | "products" | "add-product" | "orders" | "profile" | "edit-product";
type CurrentUser = {
  id?: number;
  userId?: number | string;
  userEmail?: string;
  cognitoSub?: string;
  userFistName?: string;
  userLastName?: string;
  userPhoneNumber?: string;
  userRole?: string;
  userStatus?: string;
} | null;

type SupplierDashboardProps = {
  currentUser?: CurrentUser;
};

type SupplierCategory = {
  categoryId: number;
  categoryName: string;
};

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

type OrderRecord = {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: string;
  deliveryDate: string;
  notes: string;
};

type BackendOrderItem = {
  productId?: number;
  quantity?: number;
  price?: number;
};

type BackendOrderRecord = {
  orderId?: number | string;
  customerId?: number | string;
  orderDate?: string;
  orderStatus?: string;
  totalAmount?: number;
  items?: BackendOrderItem[];
};

const supplierProfileBase = {
  company: "FreshFields Foods",
  email: "riya.patel@freshfields.com",
};

const initialProducts: SupplierProductRecord[] = [
  {
    id: "VEG-2041",
    name: "Cherry Tomatoes",
    category: "Vegetables",
    categoryId: 1,
    price: "5.99",
    supplierId: "",
    quantity: 100,
    imageUrl: "",
    status: "PENDING_APPROVAL",
    unitOfSelling: "UNIT",
    updatedAt: "2 hours ago",
    description: "Sweet, ripe cherry tomatoes packed in 500g punnets for retail and wholesale.",
  },
];

const BFF_BASE_URL = "http://localhost:3000";

const extractOrderList = (payload: unknown): BackendOrderRecord[] => {
  const firstLevel = payload && typeof payload === "object" && "object" in payload ? (payload as { object?: unknown }).object : payload;
  const secondLevel = firstLevel && typeof firstLevel === "object" && "object" in firstLevel ? (firstLevel as { object?: unknown }).object : firstLevel;

  if (Array.isArray(secondLevel)) {
    return secondLevel as BackendOrderRecord[];
  }

  if (Array.isArray(firstLevel)) {
    return firstLevel as BackendOrderRecord[];
  }

  if (Array.isArray(payload)) {
    return payload as BackendOrderRecord[];
  }

  return [];
};

const parseJwtPayload = (token: string | null): Record<string, unknown> | null => {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=");
    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
};

const readSupplierIdFromTokens = (): string => {
  const accessPayload = parseJwtPayload(window.localStorage.getItem("accessToken"));
  const idPayload =
    parseJwtPayload(window.localStorage.getItem("idToken")) ||
    parseJwtPayload(window.localStorage.getItem("id_token"));

  const candidate =
    accessPayload?.id ??
    accessPayload?.userId ??
    idPayload?.id ??
    idPayload?.userId ??
    idPayload?.sub ??
    idPayload?.["cognito:username"] ??
    accessPayload?.sub;

  return candidate != null ? String(candidate) : "";
};

const normalizeProductUrlForSave = (url: string): string => {
  const trimmed = String(url || "").trim();
  if (!trimmed) return "";

  // Product detail responses can include signed read URLs. Strip query params before save.
  const queryIndex = trimmed.indexOf("?");
  return queryIndex >= 0 ? trimmed.slice(0, queryIndex) : trimmed;
};

export default function SupplierDashboardHome({ currentUser }: SupplierDashboardProps) {
  const tokenSupplierId = useMemo(() => readSupplierIdFromTokens(), []);
  const loggedInSupplierId =
    currentUser?.id != null
      ? String(currentUser.id)
      : currentUser?.userId != null
        ? String(currentUser.userId)
        : tokenSupplierId;
  const supplierProfile = useMemo(
    () => ({
      company: supplierProfileBase.company,
      supplierId: loggedInSupplierId || "-",
      email: currentUser?.userEmail || supplierProfileBase.email,
    }),
    [loggedInSupplierId, currentUser?.userEmail]
  );

  const [activeView, setActiveView] = useState<SupplierView>("overview");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<SupplierProductRecord[]>(initialProducts);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<SupplierProductRecord | null>(null);
  const [isLoadingProductDetail, setIsLoadingProductDetail] = useState(false);
  const [productDetailError, setProductDetailError] = useState<string | null>(null);

  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);
  const [productUpdateError, setProductUpdateError] = useState<string | null>(null);
  const [isUploadingEditProductImage, setIsUploadingEditProductImage] = useState(false);
  const [editProductImageError, setEditProductImageError] = useState<string | null>(null);

  const [productDraft, setProductDraft] = useState<SupplierProductRecord>({
    id: "",
    name: "",
    category: "",
    categoryId: 0,
    price: "",
    supplierId: loggedInSupplierId,
    quantity: 0,
    imageUrl: "",
    status: "PENDING_APPROVAL",
    unitOfSelling: "UNIT",
    updatedAt: "",
    description: "",
  });


  const [productForm, setProductForm] = useState({
    name: "",
    categoryId: "",
    supplierId: loggedInSupplierId,
    price: "",
    quantity: "",
    unitOfSelling: "UNIT",
    description: "",
  });
  const [categoryOptions, setCategoryOptions] = useState<SupplierCategory[]>([]);
  const [isLoadingCategoryOptions, setIsLoadingCategoryOptions] = useState(false);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImageUrl, setProductImageUrl] = useState("");
  const [isUploadingProductImage, setIsUploadingProductImage] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [productSaved, setProductSaved] = useState(false);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileForm, setProfileForm] = useState({
    userFistName: "",
    userLastName: "",
    userPhoneNumber: "",
  });

  useEffect(() => {
    setProfileForm({
      userFistName: currentUser?.userFistName || "",
      userLastName: currentUser?.userLastName || "",
      userPhoneNumber: currentUser?.userPhoneNumber || "",
    });
  }, [currentUser]);

  useEffect(() => {
    if (!loggedInSupplierId) return;
    setProductDraft((prev) => ({ ...prev, supplierId: loggedInSupplierId }));
    setProductForm((prev) => ({ ...prev, supplierId: loggedInSupplierId }));
  }, [loggedInSupplierId]);

  useEffect(() => {
    if (activeView !== "add-product" && activeView !== "edit-product") return;

    const loadCategoryOptions = async () => {
      setIsLoadingCategoryOptions(true);
      try {
        const accessToken = window.localStorage.getItem("accessToken");
        if (!accessToken) throw new Error("No authentication token found. Please sign in again.");

        const categoriesResponse = await fetch(`${BFF_BASE_URL}/api/v1/categories`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const categoriesBody = await categoriesResponse.json().catch(() => ({}));
        if (!categoriesResponse.ok) throw new Error(categoriesBody?.message || "Failed to load categories.");

        const categoryList = Array.isArray(categoriesBody?.data)
          ? categoriesBody.data
          : Array.isArray(categoriesBody)
            ? categoriesBody
            : [];

        const options = categoryList
          .filter((item: any) => item?.categoryId && item?.categoryName)
          .map((item: any) => ({ categoryId: Number(item.categoryId), categoryName: String(item.categoryName) }));

        setCategoryOptions(options);
        if (options.length > 0) {
          setProductForm((prev) => {
            const hasSelected = options.some((option: SupplierCategory) => String(option.categoryId) === prev.categoryId);
            return hasSelected ? prev : { ...prev, categoryId: String(options[0].categoryId) };
          });

          setProductDraft((prev) => {
            if (prev.categoryId && prev.categoryId > 0) {
              return prev;
            }

            const matchedByName = options.find(
              (option: SupplierCategory) => option.categoryName.toLowerCase() === String(prev.category || "").toLowerCase()
            );

            if (!matchedByName) {
              return prev;
            }

            return {
              ...prev,
              categoryId: matchedByName.categoryId,
              category: matchedByName.categoryName,
            };
          });
        }
      } catch (error) {
        setProductError(error instanceof Error ? error.message : "Failed to load categories.");
      } finally {
        setIsLoadingCategoryOptions(false);
      }
    };

    void loadCategoryOptions();
  }, [activeView]);

  const mapBackendProduct = (product: any): SupplierProductRecord => {
    const productStatus = String(product?.productStatus || "PENDING_APPROVAL");
    const quantity = Number(product?.productQuantity || 0);

    return {
      id: String(product?.productId ?? ""),
      name: String(product?.productName || "Unnamed product"),
      category: String(product?.categoryName || (product?.categoryId ? `Category ${product.categoryId}` : "Unassigned")),
      categoryId: Number(product?.categoryId || 0),
      price: String(product?.price ?? ""),
      supplierId: String(product?.supplierId || loggedInSupplierId),
      quantity,
      imageUrl: String(product?.productUrl || ""),
      status: productStatus,
      unitOfSelling: String(product?.unitOfSelling || "UNIT"),
      updatedAt: String(product?.updatedAt || product?.updateAt || "-"),
      description: String(product?.productDescription || ""),
    };
  };

  const loadProductsFromBackend = async () => {
    setIsLoadingProducts(true);
    setProductsError(null);

    try {
      const accessToken = window.localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No authentication token found. Please sign in again.");

      const response = await fetch(`${BFF_BASE_URL}/api/v1/products`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const body = await response.json().catch(() => ([]));
      if (!response.ok) throw new Error(body?.message || "Failed to load products");

      const list = Array.isArray(body) ? body : [];
      setProducts(list.map(mapBackendProduct));
    } catch (error) {
      setProductsError(error instanceof Error ? error.message : "Failed to load products");
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadProductById = async (productId: string) => {
    setIsLoadingProductDetail(true);
    setProductDetailError(null);
    setSelectedProductDetail(null);

    try {
      const accessToken = window.localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No authentication token found. Please sign in again.");

      const response = await fetch(`${BFF_BASE_URL}/api/v1/products/${productId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body?.message || "Failed to load product details");
      setSelectedProductDetail(mapBackendProduct(body));
    } catch (error) {
      setProductDetailError(error instanceof Error ? error.message : "Failed to load product details");
    } finally {
      setIsLoadingProductDetail(false);
    }
  };

  const mapBackendOrder = (order: BackendOrderRecord): OrderRecord => {
    const orderId = String(order?.orderId ?? "");
    const customerId = String(order?.customerId ?? "-");
    const itemCount = Array.isArray(order?.items)
      ? order.items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0)
      : 0;
    const totalAmount = Number(order?.totalAmount || 0);

    return {
      id: orderId,
      customer: `Customer #${customerId}`,
      items: itemCount,
      total: `$${totalAmount.toFixed(2)}`,
      status: String(order?.orderStatus || "UNKNOWN"),
      deliveryDate: order?.orderDate
        ? new Date(order.orderDate).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "-",
      notes: "Synced from order service",
    };
  };

  const loadOrdersFromBackend = async () => {
    setIsLoadingOrders(true);
    setOrdersError(null);

    try {
      const accessToken = window.localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No authentication token found. Please sign in again.");

      const response = await fetch(`${BFF_BASE_URL}/api/v1/orders`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body?.message || "Failed to load orders");

      const records = extractOrderList(body);
      setOrders(records.map(mapBackendOrder));
    } catch (error) {
      setOrdersError(error instanceof Error ? error.message : "Failed to load orders");
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const uploadProductImage = async (file: File): Promise<string> => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) throw new Error("Please upload a JPG, PNG, WEBP, or GIF image.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5MB or smaller.");

    const accessToken = window.localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("No authentication token found. Please sign in again.");

    const presignResponse = await fetch(`${BFF_BASE_URL}/api/v1/uploads/product-image/presign`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ fileName: file.name, contentType: file.type }),
    });

    const presignBody = await presignResponse.json().catch(() => ({}));
    if (!presignResponse.ok) throw new Error(presignBody?.message || "Failed to create upload URL");

    const uploadUrl = presignBody?.data?.uploadUrl;
    const fileUrl = presignBody?.data?.fileUrl;
    if (!uploadUrl || !fileUrl) throw new Error("Upload URL was not returned by the server");

    const uploadResponse = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
    if (!uploadResponse.ok) throw new Error("Failed to upload image to S3");

    return fileUrl;
  };

  useEffect(() => {
    void loadProductsFromBackend();
  }, []);

  useEffect(() => {
    void loadOrdersFromBackend();
  }, []);

  const selectedProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return products.find((product) => product.id === selectedProductId) ?? null;
  }, [selectedProductId, products]);

  const productForEdit = selectedProductDetail ?? selectedProduct;

  useEffect(() => {
    if (productForEdit) setProductDraft(productForEdit);
  }, [productForEdit]);

  const summaryStats = useMemo(() => {
    const totalProducts = products.length;
    const pendingApprovals = products.filter((p) => p.status === "PENDING_APPROVAL").length;
    const liveOrders = orders.length;

    return {
      totalProducts: String(totalProducts),
      pendingApprovals: String(pendingApprovals),
      liveOrders: String(liveOrders),
      lowStockAlerts: "0",
    };
  }, [products, orders]);

  const recentProducts = useMemo(() => products.slice(0, 3), [products]);
  const latestOrders = useMemo(
    () =>
      orders.slice(0, 3).map((order) => ({
        orderId: `#${order.id}`,
        customer: order.customer,
        status: order.status,
      })),
    [orders]
  );

  const navItems: Array<{ key: SupplierView; label: string; icon: string }> = [
    { key: "overview", label: "Overview", icon: "bx-home-alt-2" },
    { key: "products", label: "Products", icon: "bx-package" },
    { key: "add-product", label: "Add Product", icon: "bx-plus-circle" },
    { key: "orders", label: "Orders", icon: "bx-receipt" },
    { key: "profile", label: "Profile", icon: "bx-user-circle" },
  ];

  const renderView = () => {
    if (activeView === "products") {
      return (
        <ProductsPage
          products={products}
          isLoadingProducts={isLoadingProducts}
          productsError={productsError}
          onOpenProduct={(id) => {
            setSelectedProductId(id);
            setProductUpdateError(null);
            setEditProductImageError(null);
            setActiveView("edit-product");
            void loadProductById(id);
          }}
        />
      );
    }

    if (activeView === "edit-product") {
      return (
        <EditProductPage
          productDraft={productDraft}
          setProductDraft={setProductDraft}
          isLoadingProductDetail={isLoadingProductDetail}
          productDetailError={productDetailError}
          productUpdateError={productUpdateError}
          editProductImageError={editProductImageError}
          isUploadingEditProductImage={isUploadingEditProductImage}
          isUpdatingProduct={isUpdatingProduct}
          onBackToProducts={() => {
            setActiveView("products");
            setSelectedProductId(null);
            setSelectedProductDetail(null);
          }}
          onSave={async () => {
            await handleSaveProduct();
          }}
          onImageUpload={async (file) => {
            setEditProductImageError(null);
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
          categories={categoryOptions}
        />
      );
    }

    if (activeView === "add-product") {
      return (
        <AddProductPage
          productForm={productForm}
          setProductForm={setProductForm}
          categoryOptions={categoryOptions}
          isLoadingCategoryOptions={isLoadingCategoryOptions}
          productImageFile={productImageFile}
          productImageUrl={productImageUrl}
          isUploadingProductImage={isUploadingProductImage}
          isCreatingProduct={isCreatingProduct}
          productError={productError}
          productSaved={productSaved}
          onImageSelected={async (event) => {
            const file = event.target.files?.[0] || null;
            setProductSaved(false);
            setProductError(null);
            setProductImageFile(file);
            setProductImageUrl("");
            if (!file) return;

            setIsUploadingProductImage(true);
            try {
              const fileUrl = await uploadProductImage(file);
              setProductImageUrl(fileUrl);
            } catch (error) {
              setProductError(error instanceof Error ? error.message : "Failed to upload image");
              setProductImageFile(null);
              setProductImageUrl("");
            } finally {
              setIsUploadingProductImage(false);
            }
          }}
          onSubmit={async (event) => {
            event.preventDefault();
            setProductSaved(false);
            setProductError(null);

            const accessToken = window.localStorage.getItem("accessToken");
            if (!accessToken) return setProductError("No authentication token found. Please sign in again.");
            if (!productImageUrl) return setProductError("Please upload a product image before saving.");
            if (!productForm.categoryId) return setProductError("Please select a category.");

            const quantityNumber = Number(productForm.quantity);
            const priceNumber = Number(productForm.price);
            const selectedCategoryId = Number(productForm.categoryId);
            const supplierId = loggedInSupplierId;
            if (!supplierId) return setProductError("Unable to determine supplier ID. Please sign in again.");
            if (!Number.isFinite(quantityNumber) || quantityNumber < 0) return setProductError("Please enter a valid quantity.");
            if (!Number.isFinite(priceNumber) || priceNumber < 0) return setProductError("Please enter a valid price.");
            if (!Number.isFinite(selectedCategoryId) || selectedCategoryId <= 0) return setProductError("Please select a valid category.");

            setIsCreatingProduct(true);
            try {
              const createResponse = await fetch(`${BFF_BASE_URL}/api/v1/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
                body: JSON.stringify({
                  categoryId: selectedCategoryId,
                  supplierId,
                  productName: productForm.name,
                  productDescription: productForm.description,
                  productQuantity: quantityNumber,
                  price: priceNumber,
                  productStatus: "PENDING_APPROVAL",
                  unitOfSelling: productForm.unitOfSelling,
                  productUrl: productImageUrl,
                }),
              });

              const createBody = await createResponse.json().catch(() => ({}));
              if (!createResponse.ok) throw new Error(createBody?.message || "Failed to create product");

              setProductSaved(true);
              setProductForm({
                name: "",
                categoryId: categoryOptions[0] ? String(categoryOptions[0].categoryId) : "",
                supplierId,
                price: "",
                quantity: "",
                unitOfSelling: "UNIT",
                description: "",
              });
              setProductImageFile(null);
              setProductImageUrl("");
              void loadProductsFromBackend();
            } catch (error) {
              setProductError(error instanceof Error ? error.message : "Failed to create product");
            } finally {
              setIsCreatingProduct(false);
            }
          }}
        />
      );
    }

    if (activeView === "orders") {
      return <OrdersPage orders={orders} isLoadingOrders={isLoadingOrders} ordersError={ordersError} onOpenOrder={() => {}} />;
    }

    if (activeView === "profile") {
      return (
        <ProfilePage
          currentUser={currentUser}
          supplierProfile={supplierProfile}
          profileForm={profileForm}
          setProfileForm={setProfileForm}
          isSavingProfile={isSavingProfile}
          profileSaved={profileSaved}
          summaryStats={summaryStats}
          onSaveProfile={async (event) => {
            event.preventDefault();
            if (!loggedInSupplierId) return;

            setIsSavingProfile(true);
            setProfileSaved(false);
            try {
              const accessToken = window.localStorage.getItem("accessToken");
              await fetch(`${BFF_BASE_URL}/api/v1/users/me`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
                body: JSON.stringify(profileForm),
              });
              setProfileSaved(true);
            } finally {
              setIsSavingProfile(false);
            }
          }}
        />
      );
    }

    return (
      <OverviewPage
        summaryStats={summaryStats}
        recentProducts={recentProducts}
        latestOrders={latestOrders}
        onGoProducts={() => setActiveView("products")}
        onGoOrders={() => setActiveView("orders")}
      />
    );
  };

  const handleSaveProduct = async () => {
    if (!productForEdit) return;

    setProductUpdateError(null);
    const accessToken = window.localStorage.getItem("accessToken");
    if (!accessToken) {
      setProductUpdateError("No authentication token found. Please sign in again.");
      return;
    }

    if (!productDraft.categoryId || productDraft.categoryId === 0) {
      setProductUpdateError("Please select a valid category.");
      return;
    }

    const priceNumber = Number(productDraft.price);
    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      setProductUpdateError("Please enter a valid price.");
      return;
    }
    const quantityNumber = Number(productDraft.quantity);
    if (!Number.isFinite(quantityNumber) || quantityNumber < 0) {
      setProductUpdateError("Please enter a valid quantity.");
      return;
    }
    if (!loggedInSupplierId) {
      setProductUpdateError("Unable to determine supplier ID. Please sign in again.");
      return;
    }

    setIsUpdatingProduct(true);
    try {
      const trimmedName = String(productDraft.name || "").trim();
      const trimmedDescription = String(productDraft.description || "").trim();
      const trimmedUnitOfSelling = String(productDraft.unitOfSelling || "").trim();
      const trimmedStatus = String(productDraft.status || productForEdit.status || "").trim();
      const trimmedImageUrl = normalizeProductUrlForSave(productDraft.imageUrl || productForEdit.imageUrl || "");

      if (!trimmedName) {
        setProductUpdateError("Product name is required.");
        return;
      }

      if (!trimmedDescription) {
        setProductUpdateError("Product description is required.");
        return;
      }

      if (!trimmedUnitOfSelling) {
        setProductUpdateError("Unit of selling is required.");
        return;
      }

      if (!trimmedStatus) {
        setProductUpdateError("Product status is required.");
        return;
      }

      if (!trimmedImageUrl) {
        setProductUpdateError("Product image is required. Please upload an image before saving.");
        return;
      }

      const payload: Record<string, unknown> = {
        categoryId: productDraft.categoryId,
        productName: trimmedName,
        productDescription: trimmedDescription,
        productQuantity: quantityNumber,
        price: priceNumber,
        supplierId: loggedInSupplierId,
        unitOfSelling: trimmedUnitOfSelling,
        productStatus: trimmedStatus,
        productUrl: trimmedImageUrl,
      };

      await fetch(`${BFF_BASE_URL}/api/v1/products/${productForEdit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(payload),
      }).then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload?.message || "Failed to update product");
      });

      setProducts((prev) => prev.map((product) => (product.id === productForEdit.id ? { ...productDraft, updatedAt: "Just now" } : product)));
      setSelectedProductDetail({ ...productDraft, updatedAt: "Just now" });
      setActiveView("products");
    } catch (error) {
      setProductUpdateError(error instanceof Error ? error.message : "Failed to update product");
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  return (
    <>
      <SupplierDashboardLayout
        activeView={activeView}
        navItems={navItems}
        onNavigate={setActiveView}
        onGoToAddProduct={() => setActiveView("add-product")}
      >
        {renderView()}
      </SupplierDashboardLayout>
    </>
  );
}
