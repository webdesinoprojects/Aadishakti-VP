import { productsData } from './products';

const toSpecifications = (items = []) => items.map((item) => ({
  elem: item.elem ?? item.parameter ?? '',
  val: item.val ?? item.value ?? '',
})).filter((item) => item.elem || item.val);

export const normalizeCmsProduct = (product, index = 0) => ({
  key: product.slug,
  num: String(index + 1).padStart(2, '0'),
  name: product.name || 'Untitled product',
  grade: product.code || '',
  purity: product.purity || '',
  img: product.image || '',
  overview: product.description || '',
  specs: toSpecifications(product.specifications),
  packaging: product.packaging || '',
  applications: Array.isArray(product.features) ? product.features.filter((item) => typeof item === 'string') : [],
  datasheet: product.datasheet || '',
  status: product.status || 'published',
});

export const buildProductCatalog = (cmsProducts) => {
  const products = !Array.isArray(cmsProducts) || !cmsProducts.length
    ? productsData
    : cmsProducts.map(normalizeCmsProduct);
  return products.filter((product) => !['draft', 'archived'].includes(String(product.status || 'published').toLowerCase()));
};
