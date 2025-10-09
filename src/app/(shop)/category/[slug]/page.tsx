/**
 * Category Page Component (Dynamic Route)
 * @next-migration: This will become app/(shop)/category/[slug]/page.tsx in Next.js
 */

import React from 'react';

/**
 * @next-migration: Add dynamic metadata
 * export async function generateMetadata({ params }: Props): Promise<Metadata> {
 *   const category = await getCategory(params.slug);
 *   return {
 *     title: category.name,
 *     description: `Explora nuestra colección de ${category.name}`,
 *   };
 * }
 */

/**
 * Migration Notes:
 * ================
 * 
 * Current: Route handled by React Router -> src/pages/CategoryPage.tsx
 * React Router pattern: /category/:slug
 * Next.js pattern: /category/[slug]
 * 
 * In Next.js, the [slug] folder name creates a dynamic segment.
 * The slug value will be available in params:
 * 
 * interface Props {
 *   params: { slug: string };
 * }
 * 
 * export default function CategoryPage({ params }: Props) {
 *   const { slug } = params;
 *   // Use slug to fetch category data
 *   return <CategoryPageComponent slug={slug} />;
 * }
 * 
 * You can also generate static pages at build time:
 * 
 * export async function generateStaticParams() {
 *   const categories = await getCategories();
 *   return categories.map((category) => ({
 *     slug: category.slug,
 *   }));
 * }
 */

export default function CategoryPagePlaceholder() {
  return null;
}
