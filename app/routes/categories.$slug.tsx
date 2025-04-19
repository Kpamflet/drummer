import { AspectRatio, BackgroundImage, Box, Breadcrumbs, Card, Center, Container, Grid, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { MetaFunction } from '@vercel/remix';
import React, { useEffect, useState } from 'react'
import medusa from '~/services/medusa.server';
import professiona_audio from "~/assets/professional-audio.jpg";
import { ProductCategoriesResource } from '@medusajs/medusa-js';
import ProductCard from '~/components/product-card';
import { Product, ProductCategory } from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { slug } = params;
    if (slug) {

        const { product_categories } = await medusa.productCategories.list({
            handle: slug
        });

        const { count, limit, offset, products } = await medusa.products.list({
            category_id: [product_categories[0].id],
            limit: 20, offset: 0, expand: "variants,variants.prices,categories"
        });

        return { category: product_categories[0], limit: limit, offset: offset, products: products, count: count };
    }
    return null;
}

export const meta: MetaFunction = ({ data }: { data: any }) => ([
    {
        title: data.category.name
    },
    {
        name: "description",
        content: data.category.description
    }
]);

const CategoriesSlug = () => {

    const data = useLoaderData<typeof loader>();
    const [products, setProducts] = useState<PricedProduct[]>([]);
    const [category, setCategory] = useState<ProductCategory | null>(null);

    useEffect(() => {
        if (data) {
            setProducts(data.products as unknown as PricedProduct[]);
            setCategory(data.category as unknown as ProductCategory);
        }
    }, [data]);

    return (
        <Box>
                <BackgroundImage className='cat-header' src={professiona_audio} mb={20}>
                    <Container style={{ zIndex: 1, position: "relative" }}>
                        {category && (
                            <Group className='center' style={{ flex: 1 }} justify='space-between'>
                                <Title className='title'>{category.name}</Title>
                                <Breadcrumbs separator="/">
                                    <Text component={Link} to="/" size="xs" className='live-link'>Home</Text>
                                    <Text component={Link} to="/categories" size="xs" className='live-link'>Categories</Text>
                                    <Text size="xs" className='dead-link'>{category.name}</Text>
                                </Breadcrumbs>
                            </Group>
                        )}
                    </Container>
                </BackgroundImage>
                <Container>
                    {Array.isArray(products) && (
                        <SimpleGrid cols={{ base: 2, md: 5, sm: 3 }} spacing="xl" verticalSpacing="xl">
                            {products.map((product, i) => (
                                <ProductCard product={product} key={i} />
                            ))}
                        </SimpleGrid>
                    )}
                </Container>
        </Box>
    )
}

export default CategoriesSlug;