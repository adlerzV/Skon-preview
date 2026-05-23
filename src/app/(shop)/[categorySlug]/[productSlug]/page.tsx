import React from "react";
import { notFound } from "next/navigation";
import { getProductDetail } from "@/lib/wp-graphql";
import ProductPageClient from "@/components/product/ProductPageClient";

interface ProductPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    edition?: string;
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = params;
  const product = await getProductDetail(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto px-6 py-12 max-w-[1400px]">
      <ProductPageClient 
        product={product} 
        initialEdition={searchParams.edition} 
      />
    </main>
  );
}