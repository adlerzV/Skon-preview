const WP_GRAPHQL_URL = 'http://tazavesh.local/graphql';

export interface HeaderCategoryNode {
  name: string;
  slug: string;
  image?: {
    sourceUrl: string;
  } | null;
  categoryImage?: {
    sourceUrl: string;
  } | null;
}

const parsePrice = (priceString?: string | null): number | null => {
  if (!priceString) return null;
  const splitString = String(priceString).split(/[-–—]|&ndash;/)[0];
  const englishNumbers = splitString
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
  const numericString = englishNumbers.replace(/[^0-9]/g, '');
  return numericString ? parseInt(numericString, 10) : null;
};

const BANNER_FIELDS = `
  fragment BannerFields on CategoryBannerItem {
    title
    subtitle
    imageUrl
    link
  }
`;

const CATEGORY_BASIC_FIELDS = `
  fragment CategoryBasicFields on ProductCategory {
    name
    slug
    image {
      sourceUrl(size: THUMBNAIL)
    }
  }
`;

const PRODUCT_CARD_FIELDS = `
  ${CATEGORY_BASIC_FIELDS}
  fragment ProductCardFields on Product {
    id
    databaseId
    name
    slug
    featured
    date
    shortDescription
    image {
      sourceUrl(size: MEDIUM)
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

async function fetchGraphQL(query: string, variables: any = {}, tags: string[] = []) { 
  try {
    const res = await fetch(WP_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      next: { 
        tags: tags,
        revalidate: 0 
      }
    });

    const json = await res.json();
    if (json.errors) return null;
    return json.data;
  } catch (error) {
    return null;
  }
}

const formatProducts = (products: any[]) => {
  return products.map(product => ({
    ...product,
    parsedPrice: parsePrice(product.price),
    parsedRegularPrice: parsePrice(product.regularPrice),
  }));
};

export async function getHeaderCategories() {
  const data = await fetchGraphQL(
    `
      ${CATEGORY_BASIC_FIELDS}
      query GetHeaderCategories {
        productCategories(where: { hideEmpty: true, parent: 0 }, first: 15) {
          nodes {
            ...CategoryBasicFields
          }
        }
      }
    `,
    {},
    ["categories", "header-categories"]
  );

  const nodes: HeaderCategoryNode[] = data?.productCategories?.nodes || [];

  return nodes
    .filter((cat) => !["home", "uncategorized"].includes(cat.slug) && cat.image?.sourceUrl)
    .map((cat) => ({
      title: cat.name,
      img: cat.image!.sourceUrl,
      link: `/${cat.slug}`,
    }));
}

export async function getProducts(categorySlug?: string) {
  const tags = categorySlug ? ['products', `category-${categorySlug}`] : ['products'];
  
  const data = await fetchGraphQL(`
    ${PRODUCT_CARD_FIELDS}
    query GetProducts($categoryIn: [String]) {
      products(first: 12, where: { categoryIn: $categoryIn, status: "PUBLISH" }) {
        nodes { ...ProductCardFields }
      }
    }
  `, categorySlug ? { categoryIn: [categorySlug] } : {}, tags); 
  
  const rawProducts = data?.products?.nodes || [];
  return formatProducts(rawProducts);
}

export async function getCategoryArchive(slug: string) {
  const categoryAndProductsPromise = fetchGraphQL(`
    ${CATEGORY_BASIC_FIELDS}
    ${PRODUCT_CARD_FIELDS}
    query GetCategoryProducts($id: ID!) {
      productCategory(id: $id, idType: SLUG) {
        ...CategoryBasicFields
        products(first: 20, where: { status: "PUBLISH" }) {
          nodes { ...ProductCardFields }
        }
      }
    }
  `, { id: slug }, ['products', `category-${slug}`]); 

  const bannersPromise = fetchGraphQL(`
    ${BANNER_FIELDS}
    query GetCategoryBanners($id: ID!) {
      productCategory(id: $id, idType: SLUG) {
        banners { ...BannerFields }
      }
    }
  `, { id: slug }, ['banners', `banners-${slug}`]); 

  const [categoryData, bannersData] = await Promise.all([categoryAndProductsPromise, bannersPromise]);

  if (!categoryData?.productCategory) return null;

  return {
    ...categoryData.productCategory,
    banners: bannersData?.productCategory?.banners || [],
    products: {
      nodes: formatProducts(categoryData.productCategory.products?.nodes || [])
    }
  };
}

export async function getHomePageData() {
  const data = await fetchGraphQL(`
    ${PRODUCT_CARD_FIELDS}
    ${BANNER_FIELDS}
    query GetHomePage {
      homeBanners: productCategory(id: "home", idType: SLUG) {
        banners {
          ...BannerFields
        }
      }
      featuredProducts: products(first: 12, where: { featured: true, status: "PUBLISH" }) {
        nodes {
          ...ProductCardFields
        }
      }
      latestProducts: products(first: 10, where: { status: "PUBLISH", orderby: { field: DATE, order: DESC } }) {
        nodes {
          ...ProductCardFields
        }
      }
    }
  `, {}, ['products', 'banners', 'home']); 

  return {
    banners: data?.homeBanners?.banners || [],
    featured: formatProducts(data?.featuredProducts?.nodes || []),
    latest: formatProducts(data?.latestProducts?.nodes || [])
  };
}

export async function getHeaderBlogCategories() {
  const data = await fetchGraphQL(
    `
      query GetBlogCategories {
        categories(where: { hideEmpty: true, parent: 0 }, first: 15) {
          nodes {
            name
            slug
            categoryImage { 
              sourceUrl(size: "thumbnail")
            }
          }
        }
      }
    `,
    {},
    ["blog-categories"]
  );

  const nodes: HeaderCategoryNode[] = data?.categories?.nodes || [];

  return nodes
    .filter((cat) => cat.categoryImage?.sourceUrl) 
    .map((cat) => ({
      title: cat.name,
      img: cat.categoryImage!.sourceUrl, 
      link: `/blog/${cat.slug}/`,
    }));
}

export async function getPostDetail(slug: string) {
  const data = await fetchGraphQL(`
    query GetPostDetail($id: ID!) {
      post(id: $id, idType: SLUG) {
        title
        content
        date
        featuredImage {
          node {
            sourceUrl(size: LARGE)
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  `, { id: slug }, [`post-${slug}`]);

  return data?.post;
}