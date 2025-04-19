import { ProductCategory, Region } from "@medusajs/medusa";
import { useRouteLoaderData } from "@remix-run/react"

export const useParentCategories = () => {
    const { categories } = useRouteLoaderData("root") as unknown as { categories: ProductCategory[] };
    return categories.filter(category => !category.parent_category_id);
}

export const get_child_categories = (parent_id: string) => {
    const { categories } = useRouteLoaderData("root") as unknown as { categories: ProductCategory[] };
    return categories.filter(category => category.parent_category_id === parent_id);
}

export const get_regions = () => {
    const { regions } = useRouteLoaderData("root") as unknown as { regions: Region[] };
    return regions;
}