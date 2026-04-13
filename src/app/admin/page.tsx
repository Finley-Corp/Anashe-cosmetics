import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";
import {
  createAdminProduct,
  deleteAllAdminProducts,
  deleteAdminProduct,
  getCatalogProducts,
  updateAdminProduct,
  type AdminProductInput,
} from "@/lib/catalog-db";

type AdminSection =
  | "orders"
  | "products"
  | "categories"
  | "journal"
  | "feedback"
  | "subscribers"
  | "discounts"
  | "faqs"
  | "sellers"
  | "settings";

const SIDEBAR_ITEMS: { label: string; slug: AdminSection }[] = [
  { label: "Orders", slug: "orders" },
  { label: "Products", slug: "products" },
  { label: "Categories", slug: "categories" },
  { label: "Journal", slug: "journal" },
  { label: "Feedback", slug: "feedback" },
  { label: "Subscribers", slug: "subscribers" },
  { label: "Discounts", slug: "discounts" },
  { label: "FAQs", slug: "faqs" },
  { label: "Sellers", slug: "sellers" },
  { label: "Settings", slug: "settings" },
];

const SECTION_META: Record<
  AdminSection,
  { title: string; subtitle: string; emptyMessage: string; showOrderActions?: boolean }
> = {
  orders: {
    title: "ORDERS",
    subtitle: "Manage all customer checkouts",
    emptyMessage: "No orders match the current filter.",
    showOrderActions: true,
  },
  products: {
    title: "PRODUCTS",
    subtitle: "Create, edit, and organize your product catalog",
    emptyMessage: "No products yet. Add your first product to get started.",
  },
  categories: {
    title: "CATEGORIES",
    subtitle: "Group products to improve storefront discovery",
    emptyMessage: "No categories available yet.",
  },
  journal: {
    title: "JOURNAL",
    subtitle: "Manage editorial posts and publishing workflow",
    emptyMessage: "No journal posts yet.",
  },
  feedback: {
    title: "FEEDBACK",
    subtitle: "Review customer feedback and support notes",
    emptyMessage: "No feedback records found.",
  },
  subscribers: {
    title: "SUBSCRIBERS",
    subtitle: "Track newsletter subscribers and engagement",
    emptyMessage: "No subscribers found.",
  },
  discounts: {
    title: "DISCOUNTS",
    subtitle: "Manage discount codes and active promotions",
    emptyMessage: "No discount campaigns configured.",
  },
  faqs: {
    title: "FAQS",
    subtitle: "Maintain frequently asked questions",
    emptyMessage: "No FAQs available.",
  },
  sellers: {
    title: "SELLERS",
    subtitle: "Manage seller accounts and onboarding",
    emptyMessage: "No sellers found.",
  },
  settings: {
    title: "SETTINGS",
    subtitle: "Control admin and storefront configuration",
    emptyMessage: "No settings sections available.",
  },
};

function toSection(value?: string): AdminSection {
  const exists = SIDEBAR_ITEMS.some((item) => item.slug === value);
  return exists ? (value as AdminSection) : "orders";
}

function isAllowedMode(value?: string) {
  return value === "add" || value === "edit";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getExtension(fileName: string) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "jpg";
}

async function uploadImageToImageKit(file: File, slug: string, variant: "main" | "hover") {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is missing.");
  }

  const extension = getExtension(file.name);
  const uploadForm = new FormData();
  uploadForm.append("file", file);
  uploadForm.append("fileName", `${slug}-${variant}-${Date.now()}.${extension}`);
  uploadForm.append("folder", "/anashe/products");
  uploadForm.append("useUniqueFileName", "true");

  const auth = Buffer.from(`${privateKey}:`).toString("base64");
  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}` },
    body: uploadForm,
  });

  if (!response.ok) {
    throw new Error("ImageKit upload failed.");
  }

  const payload = (await response.json()) as { url?: string };
  if (!payload.url) {
    throw new Error("ImageKit did not return a URL.");
  }

  return payload.url;
}

async function parseProductFormData(formData: FormData): Promise<AdminProductInput> {
  const name = String(formData.get("name") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const imageUrlInput = String(formData.get("image") ?? "").trim();
  const hoverImageUrlInput = String(formData.get("hoverImage") ?? "").trim();
  const existingImage = String(formData.get("existingImage") ?? "").trim();
  const existingHoverImage = String(formData.get("existingHoverImage") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const badgeRaw = String(formData.get("badge") ?? "").trim();
  const badge = badgeRaw ? badgeRaw : null;
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug = slugRaw ? slugify(slugRaw) : slugify(name);
  const isNew = formData.get("isNew") === "on";
  const price = Number(formData.get("price"));
  const imageFile = formData.get("imageFile");
  const hoverImageFile = formData.get("hoverImageFile");

  let image = imageUrlInput || existingImage;
  let hoverImage = hoverImageUrlInput || existingHoverImage || image;

  if (imageFile instanceof File && imageFile.size > 0) {
    image = await uploadImageToImageKit(imageFile, slug, "main");
  }

  if (hoverImageFile instanceof File && hoverImageFile.size > 0) {
    hoverImage = await uploadImageToImageKit(hoverImageFile, slug, "hover");
  }

  if (!hoverImage) {
    hoverImage = image;
  }

  if (!name || !category || !slug || !image || Number.isNaN(price)) {
    throw new Error("Missing required fields.");
  }

  return {
    slug,
    name,
    subtitle,
    price,
    category,
    badge,
    isNew,
    image,
    hoverImage,
    description,
  };
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ section?: string; mode?: string; editId?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!verifyAdminSessionToken(token)) {
    redirect("/admin/login");
  }

  const params = searchParams ? await searchParams : undefined;
  const activeSection = toSection(params?.section);
  const sectionMeta = SECTION_META[activeSection];
  const mode = isAllowedMode(params?.mode) ? params?.mode : undefined;
  const editId = Number(params?.editId);
  const products = activeSection === "products" ? await getCatalogProducts() : [];
  const editingProduct =
    activeSection === "products" && mode === "edit" && !Number.isNaN(editId)
      ? products.find((product) => product.id === editId)
      : undefined;

  async function createProductAction(formData: FormData) {
    "use server";
    const input = await parseProductFormData(formData);
    await createAdminProduct(input);
    revalidatePath("/admin");
    redirect("/admin?section=products");
  }

  async function updateProductAction(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (Number.isNaN(id)) throw new Error("Invalid product id.");
    const input = await parseProductFormData(formData);
    await updateAdminProduct(id, input);
    revalidatePath("/admin");
    redirect("/admin?section=products");
  }

  async function deleteProductAction(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    if (Number.isNaN(id)) throw new Error("Invalid product id.");
    await deleteAdminProduct(id);
    revalidatePath("/admin");
    redirect("/admin?section=products");
  }

  async function deleteAllProductsAction() {
    "use server";
    await deleteAllAdminProducts();
    revalidatePath("/admin");
    redirect("/admin?section=products");
  }

  return (
    <main className="min-h-screen bg-[#ececec]">
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[255px_1fr]">
        <aside className="bg-[#f2f2f2] border-r border-neutral-300/70 flex flex-col">
          <div className="h-[72px] border-b border-neutral-300/70 px-5 flex items-center">
            <p className="text-[30px] leading-none tracking-tight font-semibold text-neutral-900 uppercase">
              Anashe Admin
            </p>
          </div>

          <nav className="px-3 py-4 border-b border-neutral-300/70">
            <ul className="space-y-1">
              {SIDEBAR_ITEMS.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/admin?section=${item.slug}`}
                    className={`w-full min-h-10 px-3 text-left rounded-md text-[13px] uppercase tracking-[0.14em] transition-colors inline-flex items-center ${
                      activeSection === item.slug
                        ? "bg-white text-neutral-900 border border-neutral-300/70"
                        : "text-neutral-600 hover:bg-white/80 border border-transparent"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto px-4 py-5 space-y-2 border-t border-neutral-300/80">
            <a
              href="/api/admin/logout"
              className="w-full h-10 rounded-md border border-neutral-300 bg-white text-[12px] uppercase tracking-[0.08em] text-neutral-700 hover:bg-neutral-100 transition-colors inline-flex items-center justify-center"
            >
              Logout
            </a>
            <Link
              href="/"
              className="w-full h-10 rounded-md border border-neutral-300 text-[12px] uppercase tracking-[0.08em] text-neutral-700 hover:bg-white/80 transition-colors inline-flex items-center justify-center"
            >
              View Storefront
            </Link>
          </div>
        </aside>

        <section className="px-5 lg:px-8 py-6">
          <div className="border border-neutral-300/70 bg-[#efefef] min-h-[calc(100vh-48px)] p-5 lg:p-7">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5 pb-3 border-b border-neutral-300/60">
              <div>
                <h1 className="text-[43px] leading-none tracking-tight text-neutral-900">{sectionMeta.title}</h1>
                <p className="text-sm text-neutral-500 mt-1">{sectionMeta.subtitle}</p>
              </div>

              {activeSection === "products" ? (
                <div className="flex flex-wrap items-center gap-2">
                  <form action={deleteAllProductsAction}>
                    <button className="h-10 px-4 border border-red-700 bg-red-600 text-[11px] uppercase tracking-[0.14em] text-white hover:bg-red-700 transition-colors">
                      Delete All
                    </button>
                  </form>
                  <Link
                    href="/admin?section=products&mode=add"
                    className="h-10 px-4 border border-neutral-900 bg-neutral-900 text-[11px] uppercase tracking-[0.14em] text-white hover:bg-neutral-700 transition-colors inline-flex items-center"
                  >
                    + Add Product
                  </Link>
                </div>
              ) : null}

              {sectionMeta.showOrderActions && activeSection !== "products" ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button className="h-10 px-4 border border-neutral-300 bg-white text-[12px] uppercase tracking-[0.08em] text-neutral-700 hover:bg-neutral-100 transition-colors">
                    All Statuses
                  </button>
                  <button className="h-10 px-4 border border-neutral-300 bg-white text-[12px] uppercase tracking-[0.08em] text-neutral-700 hover:bg-neutral-100 transition-colors">
                    Refresh
                  </button>
                  <button className="h-10 px-4 border border-red-200 bg-red-50 text-[12px] uppercase tracking-[0.08em] text-red-500 hover:bg-red-100 transition-colors">
                    Delete All
                  </button>
                  <button className="h-10 px-4 border border-neutral-900 bg-neutral-900 text-[12px] uppercase tracking-[0.08em] text-white hover:bg-neutral-700 transition-colors">
                    Visible Orders
                  </button>
                </div>
              ) : null}
            </div>

            {activeSection === "orders" ? (
              <div className="border border-red-200 bg-red-50 text-red-600 text-sm px-4 py-3 mb-6">
                Error loading orders: Unauthorized
              </div>
            ) : null}

            {activeSection === "products" ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  {products.map((product) => (
                    <article key={product.id} className="border border-neutral-300 bg-[#f8f8f8]">
                      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-cover"
                        />
                        {product.isNew ? (
                          <span className="absolute top-2 right-2 bg-neutral-900 text-white text-[9px] uppercase tracking-[0.18em] px-2 py-1">
                            New
                          </span>
                        ) : null}
                      </div>
                      <div className="p-3">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-500 mb-2">
                          {product.category}
                        </p>
                        <h3 className="text-[18px] leading-tight tracking-tight text-neutral-900 uppercase min-h-[44px]">
                          {product.name}
                        </h3>
                        <div className="mt-4 flex items-center justify-between text-sm">
                          <span className="font-semibold">KSh {product.price.toLocaleString()}</span>
                          <span className="text-neutral-400 text-xs">ID: {product.id}</span>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Link
                            href={`/admin?section=products&mode=edit&editId=${product.id}`}
                            className="h-9 px-3 border border-neutral-900 bg-neutral-900 text-[11px] uppercase tracking-[0.08em] text-white hover:bg-neutral-700 transition-colors inline-flex items-center"
                          >
                            Edit
                          </Link>
                          <form action={deleteProductAction}>
                            <input type="hidden" name="id" value={product.id} />
                            <button className="h-9 px-3 border border-red-200 bg-red-50 text-[11px] uppercase tracking-[0.08em] text-red-500 hover:bg-red-100 transition-colors">
                              Delete
                            </button>
                          </form>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {mode === "add" || editingProduct ? (
                  <div className="fixed inset-0 z-[100] bg-black/35 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto border border-neutral-300 bg-[#efefef] shadow-2xl">
                      <form action={mode === "add" ? createProductAction : updateProductAction}>
                        {editingProduct ? <input type="hidden" name="id" value={editingProduct.id} /> : null}
                        <input type="hidden" name="existingImage" value={editingProduct?.image ?? ""} />
                        <input type="hidden" name="existingHoverImage" value={editingProduct?.hoverImage ?? ""} />
                        <div className="h-16 border-b border-neutral-300 px-5 flex items-center justify-between">
                          <h2 className="text-[22px] leading-none tracking-[0.18em] uppercase text-neutral-900">
                            {editingProduct ? "Edit Product" : "Add New Product"}
                          </h2>
                          <Link href="/admin?section=products" className="text-5xl leading-none text-neutral-400 hover:text-neutral-700">
                            ×
                          </Link>
                        </div>

                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="md:col-span-2">
                            <label className="text-[12px] uppercase tracking-[0.18em] text-neutral-600 font-semibold block mb-2">Product Images *</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input name="imageFile" type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" className="h-12 border border-neutral-300 bg-white px-3 py-2 text-sm w-full" />
                              <input name="hoverImageFile" type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" className="h-12 border border-neutral-300 bg-white px-3 py-2 text-sm w-full" />
                            </div>
                            <p className="text-xs text-neutral-500 mt-1">Upload JPG/PNG files. URL fields below are optional fallback.</p>
                          </div>
                          <div>
                            <label className="text-[12px] uppercase tracking-[0.18em] text-neutral-600 font-semibold block mb-2">Name *</label>
                            <input name="name" defaultValue={editingProduct?.name ?? ""} className="h-14 border border-neutral-300 bg-white px-3 text-lg w-full" required />
                          </div>
                          <div>
                            <label className="text-[12px] uppercase tracking-[0.18em] text-neutral-600 font-semibold block mb-2">Price (KSh) *</label>
                            <input name="price" type="number" defaultValue={editingProduct?.price ?? ""} className="h-14 border border-neutral-300 bg-white px-3 text-lg w-full" required />
                          </div>
                          <div>
                            <label className="text-[12px] uppercase tracking-[0.18em] text-neutral-600 font-semibold block mb-2">Category *</label>
                            <select name="category" defaultValue={editingProduct?.category ?? "The Ordinary"} className="h-14 border border-neutral-300 bg-white px-3 text-lg w-full">
                              <option>The Ordinary</option>
                              <option>Black Girl Sunscreen</option>
                              <option>CeraVe</option>
                              <option>La Roche-Posay</option>
                            </select>
                          </div>
                          <label className="h-14 inline-flex items-center gap-3 mt-7 text-[22px] uppercase tracking-[0.1em] text-neutral-800">
                            <input type="checkbox" name="isNew" defaultChecked={editingProduct?.isNew ?? false} className="h-7 w-7 border-neutral-400" />
                            Mark as 'New Arrival'
                          </label>
                          <div>
                            <label className="text-[12px] uppercase tracking-[0.18em] text-neutral-600 font-semibold block mb-2">Slug {editingProduct ? "*" : ""}</label>
                            <input name="slug" defaultValue={editingProduct?.slug ?? ""} className="h-14 border border-neutral-300 bg-white px-3 text-lg w-full" required={Boolean(editingProduct)} />
                          </div>
                          <div>
                            <label className="text-[12px] uppercase tracking-[0.18em] text-neutral-600 font-semibold block mb-2">Badge</label>
                            <input name="badge" defaultValue={editingProduct?.badge ?? ""} className="h-14 border border-neutral-300 bg-white px-3 text-lg w-full" />
                          </div>
                          <div>
                            <label className="text-[12px] uppercase tracking-[0.18em] text-neutral-600 font-semibold block mb-2">Image URL *</label>
                            <input name="image" defaultValue={editingProduct?.image ?? ""} className="h-14 border border-neutral-300 bg-white px-3 text-sm w-full" />
                          </div>
                          <div>
                            <label className="text-[12px] uppercase tracking-[0.18em] text-neutral-600 font-semibold block mb-2">Hover Image URL</label>
                            <input name="hoverImage" defaultValue={editingProduct?.hoverImage ?? ""} className="h-14 border border-neutral-300 bg-white px-3 text-sm w-full" />
                          </div>
                          <div>
                            <label className="text-[12px] uppercase tracking-[0.18em] text-neutral-600 font-semibold block mb-2">Subtitle</label>
                            <input name="subtitle" defaultValue={editingProduct?.subtitle ?? ""} className="h-14 border border-neutral-300 bg-white px-3 text-lg w-full" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[12px] uppercase tracking-[0.18em] text-neutral-600 font-semibold block mb-2">Description</label>
                            <textarea name="description" defaultValue={editingProduct?.description ?? ""} placeholder="Enter product description..." className="min-h-32 border border-neutral-300 bg-white px-3 py-3 text-lg w-full" />
                          </div>
                        </div>

                        <div className="border-t border-neutral-300 px-5 py-5 flex items-center justify-end gap-3">
                          <Link href="/admin?section=products" className="h-12 px-8 border border-neutral-300 bg-white text-[16px] uppercase tracking-[0.14em] text-neutral-500 inline-flex items-center">
                            Cancel
                          </Link>
                          <button className="h-12 px-8 border border-neutral-900 bg-neutral-900 text-[16px] uppercase tracking-[0.14em] text-white hover:bg-neutral-700 transition-colors">
                            Save Product
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="border border-neutral-300 bg-white h-[420px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[64px] leading-none text-neutral-300 mb-4">◎</p>
                  <p className="text-[12px] uppercase tracking-[0.14em] text-neutral-500">
                    {sectionMeta.emptyMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
