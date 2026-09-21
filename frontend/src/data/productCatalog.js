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
});

export const buildProductCatalog = (cmsProducts) => {
  if (!Array.isArray(cmsProducts) || !cmsProducts.length) return productsData;
  return cmsProducts.map(normalizeCmsProduct);
};
