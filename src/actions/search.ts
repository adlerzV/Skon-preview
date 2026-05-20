// src/actions/search.ts
"use server"

const WP_GRAPHQL_URL = 'http://tazavesh.local/graphql';

const CATEGORY_BASIC_FIELDS = `
  fragment CategoryBasicFields on ProductCategory {
    name
    slug
    image {
      sourceUrl
    }
  }
`;

const PRODUCT_SEARCH_FIELDS = `
  ${CATEGORY_BASIC_FIELDS}
  fragment ProductSearchFields on Product {
    id
    slug
    name
    image {
      sourceUrl(size: THUMBNAIL)
    }
    productCategories(first: 1) {
      nodes {
        ...CategoryBasicFields
      }
    }
    ... on SimpleProduct {
      price
      regularPrice
      salePrice
    }
    ... on VariableProduct {
      price
      regularPrice
      salePrice
    }
  }
`;

export async function searchProductsByKeyword(keyword: string) {
  const safeKeyword = keyword?.trim();
  
  if (!safeKeyword || safeKeyword === '') return [];

  try {
    const res = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          ${PRODUCT_SEARCH_FIELDS}
          query SearchProducts($search: String!) {
            products(first: 5, where: { search: $search, status: "PUBLISH" }) {
              nodes {
                ...ProductSearchFields
              }
            }
          }
        `,
        variables: { search: safeKeyword }
      }),
      next: { 
        revalidate: 86400, // ۲۴ ساعت به ثانیه
        tags: ['search', `search-${safeKeyword.toLowerCase()}`]
      }
    });

    const json = await res.json();
    
    if (json.errors) {
      return [];
    }
    
    return json?.data?.products?.nodes || [];
  } catch (error) {
    return [];
  }
}