import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";

import UserNavbar from "../../../components/layout/UserNavbar";
import ClayCard from "../../../components/ui/ClayCard";
import ClayButton from "../../../components/ui/ClayButton";
import ClayInput from "../../../components/ui/ClayInput";
import ClayEmptyState from "../../../components/ui/ClayEmptyState";
import ClayModal from "../../../components/ui/ClayModal";
import { useToast } from "../../../contexts/ToastContext";

import {
    getMyProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../services/productService";

const emptyForm = {
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
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
        setModalOpen(true);
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name || "",
            description: product.description || "",
            price: product.price ?? "",
            category: product.category || "",
            stock: product.stock ?? "",
        });
        setModalOpen(true);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };
    const handleImageChange = (event) => {
    const file = event.target.files[0];

    setForm((previous) => ({
        ...previous,
        image: file || null,
    }));
};

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);

          const payload = {
    name: form.name.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    category: form.category.trim(),
    stock: Number(form.stock),
    image: form.image,
};

            if (editingProduct) {
                await updateProduct(editingProduct._id, payload);
                toast.success("Product updated successfully.", "Product Updated");
            } else {
                await createProduct(payload);
                toast.success("Product created successfully.", "Product Added");
            }

            setModalOpen(false);
            setForm(emptyForm);
            setEditingProduct(null);
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

    const handleDelete = async (productId) => {
        try {
            await deleteProduct(productId);
            setProducts((previous) =>
                previous.filter((product) => product._id !== productId)
            );
            toast.success("Product deleted successfully.", "Product Deleted");
        } catch (error) {
            console.error("Failed to delete product:", error);
            toast.error(
                error.response?.data?.message || "Failed to delete product.",
                "Product Error"
            );
        }
    };

    return (
        <div className="min-h-screen bg-sand font-georama pb-12">
            <UserNavbar />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
                <ClayCard level="2" className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="font-bitcount text-burntOrange text-xs uppercase font-bold tracking-wider">
                                PRACTITIONER MARKETPLACE
                            </span>

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-forest mt-1">
                                My Products
                            </h1>

                            <p className="text-sm text-forest/70 mt-2">
                                Create and manage the wellness products you offer through Nurova.
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
                            Add Product
                        </ClayButton>
                    </div>
                </ClayCard>

                {loading ? (
                    <ClayCard level="1" className="p-8 text-center">
                        <p className="text-sm font-semibold text-forest/70">
                            Loading your products...
                        </p>
                    </ClayCard>
                ) : !products.length ? (
                    <ClayCard level="1" className="p-8">
                        <ClayEmptyState
                            icon={Package}
                            title="No Products Yet"
                            description="Create your first product and it will appear in the Nurova marketplace."
                            actionLabel="Add Product"
                            onAction={openCreate}
                        />
                    </ClayCard>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products.map((product) => (
                            <ClayCard
                                key={product._id}
                                level="1"
                                className="p-5 flex flex-col"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-base font-bold text-forest">
                                            {product.name}
                                        </h2>

                                        <p className="text-xs font-semibold text-burntOrange mt-1">
                                            {product.category}
                                        </p>
                                    </div>

                                    <Package className="w-5 h-5 text-forest/50" />
                                </div>

                                <p className="text-sm text-forest/70 mt-3 flex-1">
                                    {product.description}
                                </p>

                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div className="p-3 rounded-xl bg-warmBeige">
                                        <p className="text-[10px] uppercase font-bold text-forest/50">
                                            Price
                                        </p>
                                        <p className="text-sm font-bold text-forest">
                                            ?{product.price}
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-xl bg-warmBeige">
                                        <p className="text-[10px] uppercase font-bold text-forest/50">
                                            Stock
                                        </p>
                                        <p className="text-sm font-bold text-forest">
                                            {product.stock}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
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
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        Delete
                                    </ClayButton>
                                </div>
                            </ClayCard>
                        ))}
                    </div>
                )}
            </main>

            <ClayModal
                isOpen={modalOpen}
                onClose={() => {
                    if (!saving) {
                        setModalOpen(false);
                    }
                }}
                title={editingProduct ? "Edit Product" : "Add Product"}
                subtitle="MARKETPLACE PRODUCT"
                maxWidth="max-w-xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <ClayInput
                        label="Product Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Ashwagandha Herbal Blend"
                        required
                    />

                    <ClayInput
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe the product"
                        required
                    />
                    <div className="space-y-2">
                    <label className="block text-sm font-semibold text-forest">
                    Product Image
                    </label>

                   <input
                   type="file"
                   accept="image/*"
                   onChange={handleImageChange}
                     className="w-full rounded-xl border border-forest/20 bg-warmBeige px-3 py-2 text-sm text-forest"
                    />

                  {form.image && (
                   <p className="text-xs text-forest/60">
                    Selected: {form.image.name}
                   </p>
                      )}
                  </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ClayInput
                            label="Price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="0"
                            required
                        />

                        <ClayInput
                            label="Category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="Herbal"
                            required
                        />

                        <ClayInput
                            label="Stock"
                            name="stock"
                            type="number"
                            min="0"
                            step="1"
                            value={form.stock}
                            onChange={handleChange}
                            placeholder="0"
                            required
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
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
                            {editingProduct ? "Update Product" : "Create Product"}
                        </ClayButton>
                    </div>
                </form>
            </ClayModal>
        </div>
    );
};

export default PractitionerProductsPage;
