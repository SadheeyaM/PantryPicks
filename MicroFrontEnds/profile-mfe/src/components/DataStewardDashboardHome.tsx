import React, { useEffect, useMemo, useState } from "react";
import logoImage from "../../../shared-mfe/src/assets/Logo.jpg";
import "./data-steward-dashboard.css";
import OverviewPage from "./data-steward-dashboard/pages/OverviewPage";
import ProductsPage from "./data-steward-dashboard/pages/ProductsPage";
import ApprovalsPage from "./data-steward-dashboard/pages/ApprovalsPage";
import CategoriesPage from "./data-steward-dashboard/pages/CategoriesPage";
import CategoryProductsPage from "./data-steward-dashboard/pages/CategoryProductsPage";
import ProfilePage from "./data-steward-dashboard/pages/ProfilePage";

type StewardView = "overview" | "products" | "approvals" | "categories" | "category-products" | "profile";
type StewardModal = { kind: "product" | "approval"; id: string } | null;

type CategoryItem = {
  categoryId?: number;
  categoryName?: string;
  categoryImage?: string;
};

type CurrentUser = {
  userEmail?: string;
  userFistName?: string;
  userLastName?: string;
  userStatus?: string;
} | null;

type DataStewardDashboardProps = {
  currentUser?: CurrentUser;
};

type StewardProductItem = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  status: string;
  price: string;
  imageUrl: string;
  updatedAt: string;
  notes: string;
};

type ApprovalItem = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  submittedAt: string;
  price: string;
  notes: string;
};

type BackendProduct = {
  productId?: number | string;
  productName?: string;
  categoryName?: string;
  supplierId?: string;
  productUrl?: string;
  updatedAt?: string;
  updateAt?: string;
  createdAt?: string;
  price?: number | string;
  productDescription?: string;
  productStatus?: string;
};

const initialStewardProducts: StewardProductItem[] = [
  {
    id: "PROD-2401",
    name: "Cherry Tomatoes",
    category: "Vegetables",
    supplier: "FreshFields Foods",
    status: "Approved",
    price: "$5.99",
    imageUrl: "",
    updatedAt: "Today",
    notes: "Category and pricing validated.",
  },
  {
    id: "PROD-2402",
    name: "Greek Yogurt",
    category: "Dairy",
    supplier: "North Dairy Co",
    status: "Approved",
    price: "$4.75",
    imageUrl: "",
    updatedAt: "Today",
    notes: "Nutrition metadata and image quality passed checks.",
  },
  {
    id: "PROD-2403",
    name: "Sunflower Oil",
    category: "Oils",
    supplier: "Harvest Mills",
    status: "Approved",
    price: "$10.40",
    imageUrl: "",
    updatedAt: "Yesterday",
    notes: "Packaging dimensions synced with catalog template.",
  },
];

const initialApprovals = [
  {
    id: "PROD-2501",
    name: "Organic Spinach",
    category: "Vegetables",
    supplier: "Green Basket Farms",
    submittedAt: "2 hours ago",
    price: "$3.85",
    notes: "New seasonal listing with updated certificate attached.",
  },
  {
    id: "PROD-2502",
    name: "Multigrain Bread",
    category: "Bread",
    supplier: "Daily Bake House",
    submittedAt: "4 hours ago",
    price: "$3.45",
    notes: "Revised ingredients and allergen information included.",
  },
];

const stewardProfile = {
  name: "Ananya Rao",
  role: "Data Steward",
  email: "ananya.rao@pantrypicks.com",
  team: "Catalog Quality",
  region: "North America",
  joined: "Aug 2023",
};

export default function DataStewardDashboardHome({ currentUser }: DataStewardDashboardProps) {
  const [activeView, setActiveView] = useState<StewardView>("overview");
  const [modal, setModal] = useState<StewardModal>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [stewardProducts, setStewardProducts] = useState<StewardProductItem[]>(initialStewardProducts);
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalItem[]>(initialApprovals);
  const [approvedToday, setApprovedToday] = useState(6);
  const [approvalsLoading, setApprovalsLoading] = useState(false);
  const [approvalsError, setApprovalsError] = useState<string | null>(null);
  const [isSubmittingApprovalAction, setIsSubmittingApprovalAction] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [showCreateCategoryForm, setShowCreateCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    categoryName: "",
  });
  const [selectedCategoryFile, setSelectedCategoryFile] = useState<File | null>(null);
  const [categoryImageUrl, setCategoryImageUrl] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isUploadingCategoryImage, setIsUploadingCategoryImage] = useState(false);
  const [createCategoryMessage, setCreateCategoryMessage] = useState<string | null>(null);
  const [createCategoryError, setCreateCategoryError] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editCategoryForm, setEditCategoryForm] = useState({
    categoryName: "",
    categoryImage: "",
  });
  const [editCategoryFile, setEditCategoryFile] = useState<File | null>(null);
  const [isUploadingEditCategoryImage, setIsUploadingEditCategoryImage] = useState(false);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const [updateCategoryMessage, setUpdateCategoryMessage] = useState<string | null>(null);
  const [updateCategoryError, setUpdateCategoryError] = useState<string | null>(null);

  useEffect(() => {
    if (activeView !== "categories") {
      return;
    }

    const loadCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);

      try {
        const accessToken = window.localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No authentication token found. Please sign in again.");
        }

        const response = await fetch("http://localhost:3000/api/v1/categories", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const responseBody = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(responseBody?.message || "Failed to load categories");
        }

        const payload = responseBody?.data || responseBody;
        setCategories(Array.isArray(payload) ? payload : []);
      } catch (error) {
        setCategoriesError(error instanceof Error ? error.message : "Failed to load categories");
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, [activeView]);

  const selectedProduct = useMemo(() => {
    if (!modal || modal.kind !== "product") return null;
    return stewardProducts.find((item) => item.id === modal.id) ?? null;
  }, [modal, stewardProducts]);

  const selectedApproval = useMemo(() => {
    if (!modal || modal.kind !== "approval") return null;
    return pendingApprovals.find((item) => item.id === modal.id) ?? null;
  }, [modal, pendingApprovals]);

  const overviewMetrics = useMemo(() => {
    const categoryCountMap: Record<string, number> = {};

    stewardProducts.forEach((product) => {
      const categoryName = product.category?.trim() || "Unknown";
      categoryCountMap[categoryName] = (categoryCountMap[categoryName] || 0) + 1;
    });

    const derivedCategoriesCount = Object.keys(categoryCountMap).length;
    const topCategories = Object.entries(categoryCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({ name, count }));

    return {
      categoriesCount: categories.length > 0 ? categories.length : derivedCategoriesCount,
      topCategories,
    };
  }, [categories.length, stewardProducts]);

  const selectedCategoryProducts = useMemo(
    () => stewardProducts.filter((product) => product.category === selectedCategoryName),
    [selectedCategoryName, stewardProducts]
  );

  const selectedCategory = useMemo(
    () => categories.find((category) => category.categoryName === selectedCategoryName) || null,
    [categories, selectedCategoryName]
  );

  const navItems: Array<{ key: StewardView; label: string; icon: string }> = [
    { key: "overview", label: "Overview", icon: "bx-home-alt-2" },
    { key: "products", label: "Products", icon: "bx-package" },
    { key: "approvals", label: "Approvals", icon: "bx-check-shield" },
    { key: "categories", label: "Categories", icon: "bx-category" },
    { key: "profile", label: "Profile", icon: "bx-user-circle" },
  ];

  const mapBackendProductToApproval = (product: BackendProduct): ApprovalItem => {
    const priceNumber = Number(product?.price);
    const timestamp = String(product?.updatedAt || product?.updateAt || product?.createdAt || "-");

    return {
      id: String(product?.productId ?? ""),
      name: String(product?.productName || "Unnamed product"),
      category: String(product?.categoryName || "Unknown"),
      supplier: String(product?.supplierId || "Unknown supplier"),
      submittedAt: timestamp,
      price: Number.isFinite(priceNumber) ? `$${priceNumber.toFixed(2)}` : "$0.00",
      notes: String(product?.productDescription || "No notes available."),
    };
  };

  const mapBackendProductToStewardProduct = (product: BackendProduct): StewardProductItem => {
    const priceNumber = Number(product?.price);
    const timestamp = String(product?.updatedAt || product?.updateAt || product?.createdAt || "-");
    const statusRaw = String(product?.productStatus || "PENDING_APPROVAL");

    return {
      id: String(product?.productId ?? ""),
      name: String(product?.productName || "Unnamed product"),
      category: String(product?.categoryName || "Unknown"),
      supplier: String(product?.supplierId || "Unknown supplier"),
      status: statusRaw,
      price: Number.isFinite(priceNumber) ? `$${priceNumber.toFixed(2)}` : "$0.00",
      imageUrl: String(product?.productUrl || ""),
      updatedAt: timestamp,
      notes: String(product?.productDescription || "No notes available."),
    };
  };

  const handleProductStatusAction = async (productIdValue: string, action: "approve" | "reject") => {
    const accessToken = window.localStorage.getItem("accessToken");
    if (!accessToken) {
      setApprovalsError("No authentication token found. Please sign in again.");
      return;
    }

    const productId = Number(productIdValue);
    if (!Number.isFinite(productId) || productId <= 0) {
      setApprovalsError("Invalid product ID for status action.");
      return;
    }

    setApprovalsError(null);

    try {
      const nextStatus = action === "approve" ? "APPROVED" : "REJECTED";
      const response = await fetch(`http://localhost:3000/api/v1/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ productStatus: nextStatus }),
      });

      const responseBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(responseBody?.message || "Failed to update product status");
      }

      if (action === "approve") {
        setApprovedToday((prev) => prev + 1);
      }

      await loadStewardProducts();
    } catch (error) {
      setApprovalsError(error instanceof Error ? error.message : "Failed to update product status");
    }
  };

  const loadStewardProducts = async () => {
    setApprovalsLoading(true);
    setApprovalsError(null);

    try {
      const accessToken = window.localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No authentication token found. Please sign in again.");
      }

      const response = await fetch("http://localhost:3000/api/v1/products", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseBody = await response.json().catch(() => ([]));
      if (!response.ok) {
        throw new Error(responseBody?.message || "Failed to load products for approval queue");
      }

      const list: BackendProduct[] = Array.isArray(responseBody) ? responseBody : [];
      const mappedProducts = list
        .map(mapBackendProductToStewardProduct)
        .filter((item) => item.id);

      const pendingList = list
        .filter((product) => String(product?.productStatus || "").toUpperCase() === "PENDING_APPROVAL")
        .map(mapBackendProductToApproval)
        .filter((item) => item.id);

      setStewardProducts(mappedProducts);
      setPendingApprovals(pendingList);
    } catch (error) {
      setApprovalsError(error instanceof Error ? error.message : "Failed to load approval queue");
      setStewardProducts([]);
      setPendingApprovals([]);
    } finally {
      setApprovalsLoading(false);
    }
  };

  useEffect(() => {
    void loadStewardProducts();
  }, []);

  const handleApprovalAction = async (action: "approve" | "reject") => {
    if (!selectedApproval) return;

    const accessToken = window.localStorage.getItem("accessToken");
    if (!accessToken) {
      setApprovalsError("No authentication token found. Please sign in again.");
      return;
    }

    const productId = Number(selectedApproval.id);
    if (!Number.isFinite(productId) || productId <= 0) {
      setApprovalsError("Invalid product ID for approval action.");
      return;
    }

    setIsSubmittingApprovalAction(true);
    setApprovalsError(null);

    try {
      const nextStatus = action === "approve" ? "APPROVED" : "REJECTED";
      const response = await fetch(`http://localhost:3000/api/v1/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ productStatus: nextStatus }),
      });

      const responseBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(responseBody?.message || "Failed to update product approval status");
      }

      if (action === "approve") {
        setApprovedToday((prev) => prev + 1);
      }

      setModal(null);
      await loadStewardProducts();
    } catch (error) {
      setApprovalsError(error instanceof Error ? error.message : "Failed to process approval action");
    } finally {
      setIsSubmittingApprovalAction(false);
    }
  };

  const handleCreateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setCreateCategoryMessage(null);
    setCreateCategoryError(null);

    const accessToken = window.localStorage.getItem("accessToken");
    if (!accessToken) {
      setCreateCategoryError("No authentication token found. Please sign in again.");
      return;
    }

    const trimmedName = categoryForm.categoryName.trim();

    if (!trimmedName || !categoryImageUrl) {
      setCreateCategoryError("Category name and uploaded image are required.");
      return;
    }

    setIsCreatingCategory(true);

    try {
      const response = await fetch("http://localhost:3000/api/v1/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          categoryName: trimmedName,
          categoryImage: categoryImageUrl,
        }),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        const details = responseBody?.message || responseBody?.details?.message || "Failed to create category";
        throw new Error(details);
      }

      const createdCategory = responseBody?.data || responseBody;
      setCategories((prev) => [
        {
          categoryId: createdCategory?.categoryId,
          categoryName: createdCategory?.categoryName || trimmedName,
          categoryImage: createdCategory?.categoryImage || categoryImageUrl,
        },
        ...prev,
      ]);

      setCreateCategoryMessage("Category created successfully.");
      setCategoryForm({ categoryName: "" });
      setSelectedCategoryFile(null);
      setCategoryImageUrl("");
      setShowCreateCategoryForm(false);
    } catch (error) {
      setCreateCategoryError(error instanceof Error ? error.message : "Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const readResponseText = async (response: Response) => {
    try {
      return await response.text();
    } catch (_error) {
      return "";
    }
  };

  const uploadCategoryImageToS3 = async (file: File, accessToken: string): Promise<string> => {
    const presignResponse = await fetch("http://localhost:3000/api/v1/uploads/category-image/presign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
      }),
    });

    const presignBody = await presignResponse.json().catch(() => ({}));

    if (!presignResponse.ok) {
      throw new Error(presignBody?.message || "Failed to create upload URL");
    }

    const uploadUrl = presignBody?.data?.uploadUrl;
    const fileUrl = presignBody?.data?.fileUrl;

    if (!uploadUrl || !fileUrl) {
      throw new Error("Upload URL was not returned by the server");
    }

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      const uploadBody = await readResponseText(uploadResponse);
      throw new Error(
        `Failed to upload image to S3 (${uploadResponse.status} ${uploadResponse.statusText})${uploadBody ? `: ${uploadBody}` : ""}`
      );
    }

    return fileUrl;
  };

  const handleCategoryImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setCreateCategoryError(null);
    setCreateCategoryMessage(null);
    setSelectedCategoryFile(file);
    setCategoryImageUrl("");

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setCreateCategoryError("Please upload a JPG, PNG, WEBP, or GIF image.");
      setSelectedCategoryFile(null);
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setCreateCategoryError("Image must be 5MB or smaller.");
      setSelectedCategoryFile(null);
      return;
    }

    const accessToken = window.localStorage.getItem("accessToken");
    if (!accessToken) {
      setCreateCategoryError("No authentication token found. Please sign in again.");
      setSelectedCategoryFile(null);
      return;
    }

    setIsUploadingCategoryImage(true);

    try {
      const fileUrl = await uploadCategoryImageToS3(file, accessToken);
      setCategoryImageUrl(fileUrl);
      setCreateCategoryMessage("Image uploaded successfully. You can now create the category.");
    } catch (error) {
      setSelectedCategoryFile(null);
      setCategoryImageUrl("");
      setCreateCategoryError(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploadingCategoryImage(false);
    }
  };

  const handleStartEditCategory = (category: CategoryItem) => {
    if (!category.categoryId) return;

    setEditingCategoryId(category.categoryId);
    setEditCategoryForm({
      categoryName: category.categoryName || "",
      categoryImage: category.categoryImage || "",
    });
    setEditCategoryFile(null);
    setUpdateCategoryMessage(null);
    setUpdateCategoryError(null);
    setShowCreateCategoryForm(false);
  };

  const handleEditCategoryImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setEditCategoryFile(file);
    setUpdateCategoryMessage(null);
    setUpdateCategoryError(null);

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setUpdateCategoryError("Please upload a JPG, PNG, WEBP, or GIF image.");
      setEditCategoryFile(null);
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setUpdateCategoryError("Image must be 5MB or smaller.");
      setEditCategoryFile(null);
      return;
    }

    const accessToken = window.localStorage.getItem("accessToken");
    if (!accessToken) {
      setUpdateCategoryError("No authentication token found. Please sign in again.");
      setEditCategoryFile(null);
      return;
    }

    setIsUploadingEditCategoryImage(true);

    try {
      const fileUrl = await uploadCategoryImageToS3(file, accessToken);
      setEditCategoryForm((prev) => ({ ...prev, categoryImage: fileUrl }));
      setUpdateCategoryMessage("Image uploaded successfully. You can now save category changes.");
    } catch (error) {
      setEditCategoryFile(null);
      setUpdateCategoryError(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploadingEditCategoryImage(false);
    }
  };

  const handleUpdateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingCategoryId) {
      return;
    }

    setUpdateCategoryMessage(null);
    setUpdateCategoryError(null);

    const accessToken = window.localStorage.getItem("accessToken");
    if (!accessToken) {
      setUpdateCategoryError("No authentication token found. Please sign in again.");
      return;
    }

    const trimmedName = editCategoryForm.categoryName.trim();
    const trimmedImage = editCategoryForm.categoryImage.trim();

    if (!trimmedName || !trimmedImage) {
      setUpdateCategoryError("Category name and image are required.");
      return;
    }

    setIsUpdatingCategory(true);

    try {
      const response = await fetch(`http://localhost:3000/api/v1/categories/${editingCategoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          categoryName: trimmedName,
          categoryImage: trimmedImage,
        }),
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responseBody?.message || "Failed to update category");
      }

      setCategories((prev) =>
        prev.map((category) =>
          Number(category.categoryId) === Number(editingCategoryId)
            ? { ...category, categoryName: trimmedName, categoryImage: trimmedImage }
            : category
        )
      );

      setUpdateCategoryMessage("Category updated successfully.");
      setEditingCategoryId(null);
      setEditCategoryFile(null);
    } catch (error) {
      setUpdateCategoryError(error instanceof Error ? error.message : "Failed to update category");
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  return (
    <main className="steward-page">
      <div className="steward-layout">
        <aside className="steward-sidebar" aria-label="Data steward navigation">
          <div className="steward-brand">
            <img src={logoImage} alt="Sysco logo" className="steward-brand-logo" />
            <div>
              <p className="steward-brand-title">Data Steward Hub</p>
              <p className="steward-brand-subtitle">PantryPicks</p>
            </div>
          </div>

          <nav className="steward-nav">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`steward-nav-item ${activeView === item.key ? "active" : ""}`}
                onClick={() => {
                  setActiveView(item.key);
                }}
              >
                <i className={`bx ${item.icon}`} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="steward-main">
          <header className="steward-topbar">
            <div>
              <p className="steward-kicker">Data Steward Dashboard</p>
              <h1>
                {activeView === "overview"
                  ? "Catalog quality and approvals"
                  : activeView === "products"
                    ? "Product Catalog"
                    : activeView === "approvals"
                      ? "Pending Approvals"
                      : activeView === "categories"
                        ? "Category Management"
                      : "Profile"}
              </h1>
            </div>
          </header>

          {activeView === "overview" && (
            <OverviewPage
              totalProducts={stewardProducts.length}
              pendingApprovals={pendingApprovals.length}
              approvedToday={approvedToday}
              categoriesCount={overviewMetrics.categoriesCount}
              topCategories={overviewMetrics.topCategories}
              recentApprovals={pendingApprovals.slice(0, 4)}
            />
          )}

          {activeView === "products" && (
            <ProductsPage
              products={stewardProducts}
              onOpenProduct={(id) => {
                setModal({ kind: "product", id });
              }}
              onUpdateProductStatus={(id, action) => {
                void handleProductStatusAction(id, action);
              }}
            />
          )}

          {activeView === "approvals" && (
            <ApprovalsPage
              pendingApprovals={pendingApprovals}
              approvalsLoading={approvalsLoading}
              approvalsError={approvalsError}
              onOpenApproval={(id) => {
                setModal({ kind: "approval", id });
              }}
              onUpdateApprovalStatus={(id, action) => {
                void handleProductStatusAction(id, action);
              }}
            />
          )}

          {activeView === "categories" && (
            <CategoriesPage
              categories={categories}
              products={stewardProducts}
              categoriesLoading={categoriesLoading}
              categoriesError={categoriesError}
              showCreateCategoryForm={showCreateCategoryForm}
              onToggleCreateForm={() => setShowCreateCategoryForm((prev) => !prev)}
              onStartEditCategory={handleStartEditCategory}
              onOpenCategory={(categoryName) => {
                setSelectedCategoryName(categoryName);
                setActiveView("category-products");
              }}
            >

              {editingCategoryId !== null && (
                <article className="steward-profile-card">
                  <div className="steward-panel-head">
                    <h2>Edit Category</h2>
                    <span>ID: {editingCategoryId}</span>
                  </div>

                  {updateCategoryError ? <p className="steward-inline-error">{updateCategoryError}</p> : null}
                  {updateCategoryMessage ? <p className="steward-inline-success">{updateCategoryMessage}</p> : null}

                  <form className="steward-form" onSubmit={handleUpdateCategory}>
                    <label className="steward-field">
                      <span>Category Name</span>
                      <input
                        type="text"
                        value={editCategoryForm.categoryName}
                        onChange={(event) => setEditCategoryForm((prev) => ({ ...prev, categoryName: event.target.value }))}
                        placeholder="Update category name"
                      />
                    </label>

                    <label className="steward-field">
                      <span>Category Image</span>
                      <input type="file" accept="image/*" onChange={handleEditCategoryImageSelect} />
                    </label>

                    {editCategoryFile ? (
                      <div className="steward-upload-preview">
                        <p className="steward-upload-name">Selected: {editCategoryFile.name}</p>
                        <p className="steward-upload-url">
                          {isUploadingEditCategoryImage
                            ? "Uploading image..."
                            : "Image uploaded and ready to save."}
                        </p>
                      </div>
                    ) : (
                      <div className="steward-upload-preview">
                        <p className="steward-upload-name">Current image</p>
                        <p className="steward-upload-url">{editCategoryForm.categoryImage || "No image URL"}</p>
                      </div>
                    )}

                    <div className="steward-form-actions">
                      <button
                        type="button"
                        className="steward-btn reject"
                        onClick={() => {
                          setEditingCategoryId(null);
                          setEditCategoryFile(null);
                          setUpdateCategoryMessage(null);
                          setUpdateCategoryError(null);
                        }}
                        disabled={isUpdatingCategory || isUploadingEditCategoryImage}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="steward-btn approve"
                        disabled={isUpdatingCategory || isUploadingEditCategoryImage}
                      >
                        {isUpdatingCategory ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </article>
              )}

              {showCreateCategoryForm && (
                <article className="steward-profile-card">
                  <div className="steward-panel-head">
                    <h2>Create New Category</h2>
                    <span>Catalog admin</span>
                  </div>

                  {createCategoryError ? <p className="steward-inline-error">{createCategoryError}</p> : null}
                  {createCategoryMessage ? <p className="steward-inline-success">{createCategoryMessage}</p> : null}

                  <form className="steward-form" onSubmit={handleCreateCategory}>
                    <label className="steward-field">
                      <span>Category Name</span>
                      <input
                        type="text"
                        value={categoryForm.categoryName}
                        onChange={(event) => setCategoryForm((prev) => ({ ...prev, categoryName: event.target.value }))}
                        placeholder="e.g. Frozen Foods"
                      />
                    </label>

                    <label className="steward-field">
                      <span>Category Image</span>
                      <input type="file" accept="image/*" onChange={handleCategoryImageSelect} />
                    </label>

                    {selectedCategoryFile ? (
                      <div className="steward-upload-preview">
                        <p className="steward-upload-name">Selected: {selectedCategoryFile.name}</p>
                        <p className="steward-upload-url">
                          {isUploadingCategoryImage
                            ? "Uploading image..."
                            : categoryImageUrl
                              ? "Image uploaded and ready to save."
                              : "Ready to upload."}
                        </p>
                      </div>
                    ) : null}

                    <div className="steward-form-actions">
                      <button
                        type="submit"
                        className="steward-btn approve"
                        disabled={isCreatingCategory || isUploadingCategoryImage || !categoryImageUrl}
                      >
                        {isCreatingCategory ? "Creating..." : "Create Category"}
                      </button>
                    </div>
                  </form>
                </article>
              )}
            </CategoriesPage>
          )}

          {activeView === "category-products" && (
            <CategoryProductsPage
              categoryName={selectedCategory?.categoryName || selectedCategoryName}
              products={selectedCategoryProducts}
              onBack={() => setActiveView("categories")}
              onOpenProduct={(id) => {
                setModal({ kind: "product", id });
              }}
            />
          )}

          {activeView === "profile" && (
            <ProfilePage currentUser={currentUser} stewardProfile={stewardProfile} />
          )}
        </section>
      </div>

      {modal && (
        <div
          className="steward-modal-backdrop"
          role="presentation"
          onClick={() => {
            setModal(null);
          }}
        >
          <article
            className="steward-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="steward-panel-head">
              <h2>{modal.kind === "product" ? "Product Details" : "Approval Details"}</h2>
              <button className="steward-close" type="button" onClick={() => setModal(null)}>
                <i className="bx bx-x" aria-hidden="true" />
              </button>
            </div>

            {modal.kind === "product" && selectedProduct && (
              <>
                <div className="steward-modal-image-wrap">
                  {selectedProduct.imageUrl ? (
                    <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="steward-modal-image" />
                  ) : (
                    <div className="steward-modal-image-placeholder" aria-hidden="true" />
                  )}
                </div>

                <div className="steward-grid">
                  <div><label>Product ID</label><p>{selectedProduct.id}</p></div>
                  <div><label>Name</label><p>{selectedProduct.name}</p></div>
                  <div><label>Category</label><p>{selectedProduct.category}</p></div>
                  <div><label>Supplier</label><p>{selectedProduct.supplier}</p></div>
                  <div><label>Price</label><p>{selectedProduct.price}</p></div>
                  <div><label>Status</label><p>{selectedProduct.status}</p></div>
                  <div><label>Last Updated</label><p>{selectedProduct.updatedAt}</p></div>
                  <div className="full"><label>Notes</label><p>{selectedProduct.notes}</p></div>
                </div>
              </>
            )}

            {modal.kind === "approval" && selectedApproval && (
              <>
                <div className="steward-grid">
                  <div><label>Product ID</label><p>{selectedApproval.id}</p></div>
                  <div><label>Name</label><p>{selectedApproval.name}</p></div>
                  <div><label>Category</label><p>{selectedApproval.category}</p></div>
                  <div><label>Supplier</label><p>{selectedApproval.supplier}</p></div>
                  <div><label>Price</label><p>{selectedApproval.price}</p></div>
                  <div><label>Submitted</label><p>{selectedApproval.submittedAt}</p></div>
                  <div className="full"><label>Notes</label><p>{selectedApproval.notes}</p></div>
                </div>
                <div className="steward-actions">
                  <button type="button" className="steward-btn reject" disabled={isSubmittingApprovalAction} onClick={() => void handleApprovalAction("reject")}> 
                    Reject
                  </button>
                  <button type="button" className="steward-btn approve" disabled={isSubmittingApprovalAction} onClick={() => void handleApprovalAction("approve")}> 
                    Approve
                  </button>
                </div>
              </>
            )}
          </article>
        </div>
      )}
    </main>
  );
}
