import React, { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Package,
    UploadCloud,
    X,
    AlertCircle,
    CheckCircle2,
    Image as ImageIcon,
    Tag,
    Sparkles,
} from "lucide-react";

import UserNavbar from "../../../components/layout/UserNavbar";
import ClayCard from "../../../components/ui/ClayCard";
import ClayButton from "../../../components/ui/ClayButton";
import ClayInput from "../../../components/ui/ClayInput";
import ClayTextarea from "../../../components/ui/ClayTextarea";
import ClaySelect from "../../../components/ui/ClaySelect";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayEmptyState from "../../../components/ui/ClayEmptyState";
import ClayModal from "../../../components/ui/ClayModal";
import { useToast } from "../../../contexts/ToastContext";

import {
    getMyProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../services/productService";

const CATEGORIES = [
    "Herbal Supplements",
    "Oils & Ghee",
    "Teas & Infusions",
    "Classical Churnas",
    "Natural Skincare",
    "Aromatherapy",
    "Yoga & Wellness",
    "Ayurvedic Formulations",
    "Pain Relief & Balms",
];

const emptyForm = {
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    category: "Herbal Supplements",
    stock: "",
    inStock: true,
    brand: "",
    specifications: "",
    usageInstructions: "",
    ingredients: "",
    image: null,
};

const PractitionerProductsPage = () => {
    const toast = useToast();

    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    // Delete confirmation state
    const [productToDelete, setProductToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Image preview state
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState("");

    const loadProducts = async () => {
        try {
            setLoading(true);
            const result = await getMyProducts();
            setProducts(result.data || []);
        } catch (error) {
            console.error("Failed to load practitioner products:", error);
            toast.error(
                error.response?.data?.message || "Failed to load products.",
                "Products"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const openCreate = () => {
        setEditingProduct(null);
        setForm(emptyForm);
        setImagePreview(null);
        setImageError("");
        setModalOpen(true);
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name || "",
            shortDescription: product.shortDescription || "",
            description: product.description || "",
            price: product.price ?? "",
            category: product.category || "Herbal Supplements",
            stock: product.stock ?? "",
            inStock: product.inStock ?? true,
            brand: product.brand || "",
            specifications: product.specifications || "",
            usageInstructions: product.usageInstructions || product.dosage || "",
            ingredients: Array.isArray(product.ingredients)
                ? product.ingredients.join(", ")
                : product.ingredients || "",
            image: product.image || null,
        });

        // Current image preview
        if (product.image) {
            const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5001";
            setImagePreview(
                product.image.startsWith("http")
                    ? product.image
                    : `${apiBase}${product.image}`
            );
        } else {
            setImagePreview(null);
        }

        setImageError("");
        setModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation: formats
        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        if (!validTypes.includes(file.mimetype || file.type)) {
            setImageError("Please upload a valid image (JPEG, PNG, or WebP).");
            return;
        }

        // Validation: size (< 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setImageError("Image size must be smaller than 5MB.");
            return;
        }

        setImageError("");
        setForm((prev) => ({
            ...prev,
            image: file,
        }));

        // Generate instant preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setForm((prev) => ({
            ...prev,
            image: null,
        }));
        setImagePreview(null);
        setImageError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!form.name.trim()) {
            toast.error("Please enter a product name.", "Validation Error");
            return;
        }

        if (!form.description.trim()) {
            toast.error("Please provide a product description.", "Validation Error");
            return;
        }

        const numPrice = Number(form.price);
        if (isNaN(numPrice) || numPrice < 0) {
            toast.error("Price must be a valid positive number.", "Validation Error");
            return;
        }

        const numStock = Number(form.stock);
        if (isNaN(numStock) || numStock < 0) {
            toast.error("Stock must be a valid non-negative number.", "Validation Error");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: form.name.trim(),
                shortDescription: form.shortDescription.trim(),
                description: form.description.trim(),
                price: numPrice,
                category: form.category.trim(),
                stock: numStock,
                inStock: numStock > 0 ? form.inStock : false,
                brand: form.brand.trim(),
                specifications: form.specifications.trim(),
                usageInstructions: form.usageInstructions.trim(),
                ingredients: form.ingredients.trim(),
                image: form.image,
            };

            if (editingProduct) {
                await updateProduct(editingProduct._id, payload);
                toast.success("Product updated successfully.", "Product Updated");
            } else {
                await createProduct(payload);
                toast.success("Product added to marketplace.", "Product Added");
            }

            setModalOpen(false);
            setForm(emptyForm);
            setEditingProduct(null);
            setImagePreview(null);
            await loadProducts();
        } catch (error) {
            console.error("Failed to save product:", error);
            toast.error(
                error.response?.data?.message || "Failed to save product.",
                "Product Error"
            );
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            setDeleting(true);
            await deleteProduct(productToDelete._id);
            setProducts((prev) =>
                prev.filter((p) => p._id !== productToDelete._id)
            );
            toast.success("Product deleted successfully.", "Product Deleted");
            setProductToDelete(null);
        } catch (error) {
            console.error("Failed to delete product:", error);
            toast.error(
                error.response?.data?.message || "Failed to delete product.",
                "Product Error"
            );
        } finally {
            setDeleting(false);
        }
    };

    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5001";

    return (
        <div className="min-h-screen bg-sand font-georama pb-16">
            <UserNavbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
                {/* Header Card */}
                <ClayCard level="2" className="p-6 sm:p-8 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="font-bitcount text-burntOrange text-xs uppercase font-bold tracking-wider">
                                PRACTITIONER APOTHECARY & SHOP
                            </span>

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-forest mt-1">
                                My Products
                            </h1>

                            <p className="text-sm text-forest/70 mt-2 max-w-2xl leading-relaxed">
                                Formulate, publish, and manage certified wellness remedies and therapeutic products for your seekers.
                            </p>
                        </div>

                        <ClayButton
                            type="button"
                            variant="forest"
                            size="md"
                            fullWidth={false}
                            icon={Plus}
                            onClick={openCreate}
                        >
                            Add New Product
                        </ClayButton>
                    </div>
                </ClayCard>

                {/* Product List */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <ClayCard key={i} level="1" className="p-5 space-y-4 animate-pulse">
                                <div className="h-44 bg-forest/10 rounded-2xl" />
                                <div className="h-4 bg-forest/20 rounded w-2/3" />
                                <div className="h-3 bg-forest/10 rounded w-full" />
                            </ClayCard>
                        ))}
                    </div>
                ) : !products.length ? (
                    <ClayCard level="1" className="p-8">
                        <ClayEmptyState
                            icon={Package}
                            title="No Products in Your Catalogue"
                            description="You haven't listed any wellness remedies yet. Create your first product and it will appear in the Nurova marketplace."
                            actionLabel="Create First Product"
                            onAction={openCreate}
                        />
                    </ClayCard>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => {
                            const isOutOfStock = product.stock <= 0 || product.inStock === false;
                            const isLowStock = product.stock > 0 && product.stock <= 5;
                            const imgUrl = product.image
                                ? product.image.startsWith("http")
                                    ? product.image
                                    : `${apiBase}${product.image}`
                                : null;

                            return (
                                <ClayCard
                                    key={product._id}
                                    level="1"
                                    className="p-5 flex flex-col justify-between hover:shadow-clay-card transition-all duration-300"
                                >
                                    <div>
                                        {/* Image Display */}
                                        <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-warmBeige/80 border border-white/60 mb-4 flex items-center justify-center">
                                            {imgUrl ? (
                                                <img
                                                    src={imgUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-forest/40">
                                                    <Package className="w-10 h-10 mb-1" />
                                                    <span className="text-xs font-semibold">No Image Uploaded</span>
                                                </div>
                                            )}

                                            {/* Stock Status Badge */}
                                            <div className="absolute top-2.5 right-2.5">
                                                <ClayBadge
                                                    status={
                                                        isOutOfStock
                                                            ? "danger"
                                                            : isLowStock
                                                            ? "orange"
                                                            : "approved"
                                                    }
                                                    size="xs"
                                                >
                                                    {isOutOfStock
                                                        ? "Out of Stock"
                                                        : isLowStock
                                                        ? `Low Stock (${product.stock})`
                                                        : `In Stock (${product.stock})`}
                                                </ClayBadge>
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-burntOrange">
                                                    {product.category}
                                                </span>
                                                {product.brand && (
                                                    <span className="text-[11px] text-forest/50 font-semibold">
                                                        • {product.brand}
                                                    </span>
                                                )}
                                            </div>

                                            <h2 className="text-lg font-bold text-forest leading-snug">
                                                {product.name}
                                            </h2>

                                            <p className="text-xs text-forest/70 line-clamp-2 leading-relaxed">
                                                {product.shortDescription || product.description}
                                            </p>
                                        </div>

                                        {/* Metric Pills */}
                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            <div className="p-2.5 rounded-xl bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08)]">
                                                <p className="text-[10px] uppercase font-bold text-forest/50">
                                                    Price
                                                </p>
                                                <p className="text-sm font-extrabold text-forest">
                                                    ₹{product.price}
                                                </p>
                                            </div>

                                            <div className="p-2.5 rounded-xl bg-warmBeige shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08)]">
                                                <p className="text-[10px] uppercase font-bold text-forest/50">
                                                    Stock Qty
                                                </p>
                                                <p className="text-sm font-extrabold text-forest">
                                                    {product.stock} units
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2.5 mt-5 pt-3 border-t border-forest/10">
                                        <ClayButton
                                            type="button"
                                            variant="beige"
                                            size="sm"
                                            fullWidth
                                            icon={Pencil}
                                            onClick={() => openEdit(product)}
                                        >
                                            Edit
                                        </ClayButton>

                                        <ClayButton
                                            type="button"
                                            variant="danger"
                                            size="sm"
                                            fullWidth
                                            icon={Trash2}
                                            onClick={() => setProductToDelete(product)}
                                        >
                                            Delete
                                        </ClayButton>
                                    </div>
                                </ClayCard>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Create / Edit Product Modal */}
            <ClayModal
                isOpen={modalOpen}
                onClose={() => {
                    if (!saving) setModalOpen(false);
                }}
                title={editingProduct ? "Edit Marketplace Product" : "Add New Remedy"}
                subtitle="WELLNESS MARKETPLACE MANAGEMENT"
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ClayInput
                            label="Product Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Organic Ashwagandha KSM-66"
                            required
                        />

                        <div>
                            <label className="block text-xs font-bold text-forest mb-1.5 uppercase tracking-wider">
                                Category
                            </label>
                            <ClaySelect
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                options={CATEGORIES.map((cat) => ({
                                    value: cat,
                                    label: cat,
                                }))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ClayInput
                            label="Price (₹)"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="499"
                            required
                        />

                        <ClayInput
                            label="Available Stock"
                            name="stock"
                            type="number"
                            min="0"
                            step="1"
                            value={form.stock}
                            onChange={handleChange}
                            placeholder="25"
                            required
                        />

                        <ClayInput
                            label="Brand / Producer"
                            name="brand"
                            value={form.brand}
                            onChange={handleChange}
                            placeholder="e.g. Nurova Naturals"
                        />
                    </div>

                    {/* Stock Status Toggle */}
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-warmBeige border border-white/60">
                        <input
                            type="checkbox"
                            id="inStockToggle"
                            name="inStock"
                            checked={form.inStock}
                            onChange={handleChange}
                            className="w-4 h-4 rounded text-forest focus:ring-forest cursor-pointer"
                        />
                        <label htmlFor="inStockToggle" className="text-xs font-bold text-forest cursor-pointer select-none">
                            Mark product as available for purchase (In Stock)
                        </label>
                    </div>

                    {/* Short Description */}
                    <ClayInput
                        label="Short Description (Summary)"
                        name="shortDescription"
                        value={form.shortDescription}
                        onChange={handleChange}
                        placeholder="Brief 1-line benefit (e.g. Calms the mind and restores adrenal vitality)"
                    />

                    {/* Detailed Description */}
                    <div>
                        <label className="block text-xs font-bold text-forest mb-1.5 uppercase tracking-wider">
                            Detailed Description
                        </label>
                        <ClayTextarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Comprehensive product benefits, botanical origins, and holistic applications..."
                            rows={3}
                            required
                        />
                    </div>

                    {/* Ingredients & Instructions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ClayInput
                            label="Ingredients / Materials"
                            name="ingredients"
                            value={form.ingredients}
                            onChange={handleChange}
                            placeholder="Comma-separated: Ashwagandha, Brahmi, Black Pepper"
                        />

                        <ClayInput
                            label="Usage Instructions / Dosage"
                            name="usageInstructions"
                            value={form.usageInstructions}
                            onChange={handleChange}
                            placeholder="e.g. 1 capsule twice daily after meals"
                        />
                    </div>

                    {/* Image Upload with Preview & Replace */}
                    <div className="space-y-2 pt-2">
                        <label className="block text-xs font-bold text-forest uppercase tracking-wider">
                            Product Image
                        </label>

                        {imagePreview ? (
                            <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-warmBeige border-2 border-dashed border-forest/30 flex items-center justify-center group">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-contain"
                                />

                                <div className="absolute inset-0 bg-forest/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <label className="px-3.5 py-1.5 rounded-xl bg-sand text-forest text-xs font-bold shadow-md cursor-pointer hover:bg-white transition-all">
                                        Replace Image
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>

                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="p-1.5 rounded-xl bg-burntOrange text-white shadow-md hover:bg-burntOrange/80 transition-all cursor-pointer"
                                        title="Remove Image"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="w-full h-36 rounded-2xl border-2 border-dashed border-forest/30 hover:border-forest/60 bg-warmBeige/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-warmBeige/70">
                                <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center text-forest">
                                    <UploadCloud className="w-5 h-5" />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-bold text-forest">
                                        Click to select product image
                                    </p>
                                    <p className="text-[10px] text-forest/60">
                                        JPG, PNG, or WebP up to 5MB
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}

                        {imageError && (
                            <div className="flex items-center gap-1.5 text-xs text-burntOrange font-bold">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>{imageError}</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex items-center gap-3 border-t border-forest/10">
                        <ClayButton
                            type="button"
                            variant="beige"
                            size="md"
                            fullWidth
                            disabled={saving}
                            onClick={() => setModalOpen(false)}
                        >
                            Cancel
                        </ClayButton>

                        <ClayButton
                            type="submit"
                            variant="forest"
                            size="md"
                            fullWidth
                            loading={saving}
                        >
                            {editingProduct ? "Save Changes" : "Publish Product"}
                        </ClayButton>
                    </div>
                </form>
            </ClayModal>

            {/* Delete Confirmation Modal */}
            <ClayModal
                isOpen={!!productToDelete}
                onClose={() => {
                    if (!deleting) setProductToDelete(null);
                }}
                title="Delete Product"
                subtitle="CONFIRM DELETION"
                maxWidth="max-w-md"
            >
                <div className="space-y-4">
                    <p className="text-sm text-forest/80 leading-relaxed">
                        Are you sure you want to delete{" "}
                        <strong className="text-forest font-bold">
                            "{productToDelete?.name}"
                        </strong>
                        ? This product will be permanently removed from your apothecary and the Nurova public marketplace.
                    </p>

                    <div className="flex gap-3 pt-2">
                        <ClayButton
                            type="button"
                            variant="beige"
                            size="md"
                            fullWidth
                            disabled={deleting}
                            onClick={() => setProductToDelete(null)}
                        >
                            Keep Product
                        </ClayButton>

                        <ClayButton
                            type="button"
                            variant="danger"
                            size="md"
                            fullWidth
                            loading={deleting}
                            onClick={confirmDelete}
                        >
                            Confirm Delete
                        </ClayButton>
                    </div>
                </div>
            </ClayModal>
        </div>
    );
};

export default PractitionerProductsPage;
