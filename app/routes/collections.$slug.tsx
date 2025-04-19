import { Box, Breadcrumbs, Container, Pagination, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { Link, useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import React, { useState } from 'react'
import ProductCard from '~/components/product-card';
import medusaServer from '~/services/medusa.server';


export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { slug } = params;
    const data = (await medusaServer.collections.list()).collections.filter(c => c.handle === slug)[0];
    if (data) {
        const { limit, count, offset, products } = await medusaServer.products.list({
            collection_id: [data.id]
        });
        return { collection: data, limit: limit, count: count, offset: offset, products: products };
    }
    return null;
}

export const meta: MetaFunction = ({data}) => {
    const dt = data as any;
	return [
		{ title:  dt.collection.title},
		{ name: "description", content: dt.collection.title },
	];
};

const CollectionsSlug = () => {
    const data = useLoaderData<typeof loader>();
    const [index, setIndex] = useState(1);
    console.log(data);
    return (
        <>
            {data && (
                <>
                    <Box pt={20} pb={20} style={{ background: "linear-gradient(0deg,#f4f4f4,#f4f4f4)" }}>
                        <Container>
                            <Stack>
                                <Breadcrumbs>
                                    <Text size="xs" component={Link} to="/">Home</Text>
                                    <Text size="xs" component={Link} to="/collections" c="#ccc">Collections</Text>
                                    <Text size="xs" c="#ccc">{data.collection.title}</Text>
                                </Breadcrumbs>
                                <Title fw="lighter" c="#ccc">{data.collection.title}</Title>
                            </Stack>
                        </Container>
                    </Box>
                    <Paper>
                        <Container>
                            <Stack>
                                <SimpleGrid cols={{ base: 2, md: 5 }} spacing="xl" verticalSpacing="xl">
                                    {data.products.map(product => (
                                        <ProductCard product={product as unknown as PricedProduct} />
                                    ))}
                                </SimpleGrid>
                                {/* <Pagination color='violet' total={Math.floor(data.limit / data.count)} value={index} /> */}
                            </Stack>
                        </Container>
                    </Paper>
                </>
            )}
        </>
    )
}

export default CollectionsSlug;