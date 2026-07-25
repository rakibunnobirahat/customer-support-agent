/**
 * manfareTransform.js
 * Transforms Manfare's real API product JSON into our internal Product schema.
 */

const CDN_BASE = 'https://cdn.manfarebd.com/';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildImageUrl(path) {
  if (!path || !path.trim()) return null;
  const p = path.trim();
  if (p.startsWith('http')) return p;
  return CDN_BASE + p;
}

function parseImages(str) {
  if (!str) return [];
  return str.split(',').map(s => buildImageUrl(s.trim())).filter(Boolean);
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// ─── Core transform ───────────────────────────────────────────────────────────

/**
 * Transform a single Manfare product object into our Product schema shape.
 * Ready to be upserted into MongoDB.
 */
function transformProduct(p) {
  // ── Images ──────────────────────────────────────────────────
  // Thumbnail first (best quality hero images), then unique SKU images
  const thumbnailImages = parseImages(p.thumbnail);
  const imageSet = new Set(thumbnailImages);

  for (const sku of (p.skus || [])) {
    for (const img of parseImages(sku.images)) {
      imageSet.add(img);
    }
  }
  const images = [...imageSet].filter(Boolean);

  // ── Attributes from SKUs (unique colors & sizes) ─────────────
  const colorSet = new Set();
  const sizeSet  = new Set();

  for (const sku of (p.skus || [])) {
    for (const attr of (sku.attributes || [])) {
      if (attr.key === 'Color') colorSet.add(attr.value);
      if (attr.key === 'Size')  sizeSet.add(attr.value);
    }
  }

  const colors = [...colorSet];
  const sizes  = [...sizeSet];

  // ── Pricing ─────────────────────────────────────────────────
  // Use the first active SKU for pricing
  const activeSku = (p.skus || []).find(s => s.status === 'active') ?? p.skus?.[0];
  const price         = activeSku?.discountedPrice ?? activeSku?.price ?? 0;
  const originalPrice = activeSku?.price ?? null;
  // Only set originalPrice if there is actually a discount
  const hasDiscount   = originalPrice && originalPrice > price;
  const discount      = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // ── Stock ────────────────────────────────────────────────────
  const stockCount = (p.skus || []).reduce((sum, s) => sum + (s.stockQuantity || 0), 0);

  // ── Tags ─────────────────────────────────────────────────────
  // bestseller  → product has actual customer reviews
  // new-arrival → created in the last 90 days
  const tags = [];

  if (p.review && p.review.totalReview > 0) {
    tags.push('bestseller');
  }
  if (p.isFeatured) {
    if (!tags.includes('bestseller')) tags.push('bestseller');
  }

  const createdAt    = new Date(p.createdAt);
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  if (createdAt > ninetyDaysAgo) {
    tags.push('new-arrival');
  }

  // ── Description ──────────────────────────────────────────────
  const description = stripHtml(p.shortDescription) || p.name;

  // ── SKU ──────────────────────────────────────────────────────
  // Manfare's product-level SKU can contain pipe characters which MongoDB
  // handles fine — we just strip them for our unique key
  const sku = (p.sku || String(p.id)).replace(/[|]/g, '-');

  return {
    manfareId:    p.id,
    slug:         p.slug,
    name:         p.name,
    category:     p.category?.slug || '',
    price,
    originalPrice: hasDiscount ? originalPrice : undefined,
    discount,
    rating:       p.review?.avgRating  ?? 5.0,
    reviewCount:  p.review?.totalReview ?? 0,
    images,
    colors,
    sizes,
    description,
    features:     [],
    inStock:      stockCount > 0,
    stockCount,
    sku,
    tags,
    material:     '',
  };
}

module.exports = { transformProduct };
