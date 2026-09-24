export const PRODUCT_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
  OUT_OF_STOCK: 'OUT_OF_STOCK'
});

export const PRODUCT_CATEGORIES = Object.freeze({
  MEN: 'men',
  WOMEN: 'women',
  KIDS: 'kids'
});

export const VALID_PRODUCT_STATUSES = Object.values(PRODUCT_STATUS);
export const VALID_PRODUCT_CATEGORIES = Object.values(PRODUCT_CATEGORIES);
