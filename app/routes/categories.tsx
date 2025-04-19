import { BackgroundImage, Box, Breadcrumbs, Container, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, Outlet, useLocation } from '@remix-run/react';
import { MetaFunction } from '@vercel/remix';
import React from 'react'
import AppHeader from '~/components/AppHeader';
import AppFooter from '~/components/app-footer';
import ProductsHeader from '~/components/products-header';
import { get_child_categories, useParentCategories } from '~/services/hooks';

export const meta: MetaFunction = ({ data }: { data: any }) => ([
    {
        title: "Categories"
    }
]);

const Categories = () => {

    const loc = useLocation();
    const categories = useParentCategories();
    return (
        <BackgroundImage src="/assets/webbg.webp">
            <ProductsHeader />
            {loc.pathname === "/categories" ?
                <>
                    <Box mb={20} pt={20} pb={20} style={{ background: "linear-gradient(0deg,#f4f4f4,#f4f4f4)" }}>
                        <Container>
                            <Stack>
                                <Breadcrumbs>
                                    <Text size="xs" component={Link} to="/">Home</Text>
                                    <Text size="xs" component={Link} to="/products" c="#ccc">Categories</Text>
                                </Breadcrumbs>
                                <Title fw="lighter" c="#ccc">All Categories</Title>
                            </Stack>
                        </Container>
                    </Box>
                    <Container>
                        <SimpleGrid cols={{ base: 1, md: 3 }}>
                            {categories.map((category, i) => (
                                <Stack key={i}>
                                    <Title>{category.name}</Title>
                                    {get_child_categories(category.id).map((c, i) => (
                                        <Text component={Link} to={`/categories/${c.handle}`} className='menu-item-x'>{c.name}</Text>
                                    ))}
                                </Stack>
                            ))}
                        </SimpleGrid>
                    </Container>
                </>
                : <Outlet />
            }
            <AppFooter />
        </BackgroundImage>
    )
}

export default Categories;