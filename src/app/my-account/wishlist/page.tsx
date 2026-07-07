import { getCurrentUser } from "@/lib/auth/session";
import ProductGrid from "@/components/ProductGrid";
import { fetchGraphQL, formatProducts } from "@/lib/graphql";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const data = await fetchGraphQL(`query { viewer { wishlist { id databaseId name slug } } }`, {}, [], "no-store");
  const products = formatProducts(data?.viewer?.wishlist ?? [], true);

  return (
    <div>
      <h1 className="text-xl font-black text-white mb-6">علاقه‌مندی‌های من</h1>
      <ProductGrid title="" products={products} />
    </div>
  );
}