import { BackgroundImage, Box, Breadcrumbs, Card, Container, Grid, Group, Pagination, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { Link, Outlet, useLoaderData, useLocation } from '@remix-run/react';
import { LoaderFunction, LoaderFunctionArgs } from '@vercel/remix';
import React, { useState } from 'react'
import AppHeader from '~/components/AppHeader';
import AppFooter from '~/components/app-footer';
import ProductCard from '~/components/product-card';
import ProductsHeader from '~/components/products-header';
import ProductsPage from '~/components/products-page';
import { useParentCategories } from '~/services/hooks';
import medusa from '~/services/medusa.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const _LIMIT = 20;
    const { count, limit, offset, products, response } = await medusa.products.list({ limit: _LIMIT, offset: 0, expand: "variants,variants.prices,categories" });
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    
    if (search) {
        const ps = products.filter(product => product.title?.toLocaleLowerCase().includes(search.toLowerCase()) || product.description?.toLocaleLowerCase().includes(search.toLowerCase()));
        return { count, limit, offset, products: ps };
    }

    return { count, limit, offset, products };
}

const ProductsPanel = () => {

    const { count, limit, offset, products } = useLoaderData<typeof loader>();
    const [index, setIndex] = useState(1);
    const categories = useParentCategories();
    const loc = useLocation();

    return (
        <BackgroundImage src="/assets/webbg.webp">
            <Stack>
                <ProductsHeader />
                {/^\/products\/?$/.test(loc.pathname) ?
                    <>
                        <Box pt={20} pb={20} style={{ background: "linear-gradient(0deg,#f4f4f4,#f4f4f4)" }}>
                            <Container>
                                <Stack>
                                    <Breadcrumbs>
                                        <Text size="xs" component={Link} to="/">Home</Text>
                                        <Text size="xs" component={Link} to="/products" c="#ccc">Products</Text>
                                    </Breadcrumbs>
                                    <Title fw="lighter" c="#ccc">All Products</Title>
                                </Stack>
                            </Container>
                        </Box>
                        <Paper>
                            <Container>
                                <Stack>
                                    <SimpleGrid cols={{ base: 2, md: 5 }} spacing="xl" verticalSpacing="xl">
                                        {products.map((product, i) => (
                                            <ProductCard key={i} product={product as unknown as PricedProduct} />
                                        ))}
                                    </SimpleGrid>
                                    {/* <Pagination color='violet' total={Math.floor(limit / count)} value={index} /> */}
                                </Stack>
                            </Container>
                        </Paper>
                    </>
                    : <Outlet />
                }
                <AppFooter />
            </Stack>
        </BackgroundImage>
    )
}

export default ProductsPanel;