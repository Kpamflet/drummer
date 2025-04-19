import { LoaderFunction, MetaFunction } from '@vercel/remix';
import React, { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router';
import medusa from '~/services/medusa.server';
import { AspectRatio, Box, Breadcrumbs, Container, Grid, Group, Image as _Image, Paper, Text, Title, Stack, SimpleGrid, Button, Divider, BackgroundImage, ActionIcon, TextInput } from '@mantine/core';
import { Link } from '@remix-run/react';
import { Image, Product, ProductVariant, VariantInventory } from '@medusajs/medusa';
import { add_to_cart, get_brand_image, get_money, is_brand } from '~/services';
import { Carousel } from '@mantine/carousel';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { useSelectedRegion } from '~/services/states';

export const loader: LoaderFunction = async ({ params }) => {
    const { slug } = params;
    if (slug) {
        const { products } = await medusa.products.list({
            handle: slug
        });
        return { product: products[0] };
    }
    return null;
}

export const meta: MetaFunction = ({ data }: { data: any }) => ([
    {
        title: data.product.title,
    },
    {
        name: "description",
        content: data.product.description,
    },
    {
        name: "og:title",
        content: data.product.title
    },
    {
        name: "og:description",
        content: data.product.description
    },
    {
        name: "og:image",
        content: data.product.thumbnail
    },
    {
        name: "og:site_name",
        content: "Drum and Bass Centre"
    }
]);

const ProductSlug = () => {
    const data = useLoaderData() as { product: Product };
    const [images, setImages] = useState<Image[]>([]);
    const [selectedImage, setSetselectedImage] = useState<Image>();

    const [variations, setVariations] = useState<ProductVariant[]>([]);
    const [selectedVariation, setSelectedVariation] = useState<ProductVariant>();

    const [cartCounter, setCartCounter] = useState(1);

    console.log(data);
    useEffect(() => {

        if (Array.isArray(data.product.images)) {
            setImages(data.product.images);
        }
        if (Array.isArray(data.product.variants)) {
            setVariations(data.product.variants);
        }
    }, [data]);

    useEffect(() => {
        if (Array.isArray(data.product.images)) {
            setSetselectedImage(data.product.images[0]);
        }
    }, [images, images.length]);

    useEffect(() => {
        if (Array.isArray(data.product.variants)) {
            setSelectedVariation(data.product.variants[0]);
        }
    }, [variations, variations.length]);

    const _plus = () => {
        setCartCounter(v => v + 1);
    }

    const _minus = () => {
        if (cartCounter > 1) {
            setCartCounter(v => v - 1);
        }
    }

    const [cart_loading, setCart_loading] = useState(false);
    const region = useSelectedRegion(s => s.region);

    const _add_to_cart = async () => {
        setCart_loading(true);
        try {
            if (region) {
                await add_to_cart(region.id, String(data.product.variants[0].id), cartCounter);
            }
        } catch (error) {
            console.log(error);
        }
        setCart_loading(false);
    }

    return (
        <>
            <Box pt={20} pb={20} style={{ background: "linear-gradient(0deg,#f4f4f4,#f4f4f4)" }}>
                <Container style={{ zIndex: 1, position: "relative" }}>
                    <Group className='center' style={{ flex: 1 }} justify='space-between'>
                        <Breadcrumbs separator="/">
                            <Text component={Link} to="/" size="xs" className='live-link'>Home</Text>
                            <Text component={Link} to="/products" size="xs" className='live-link'>Products</Text>
                            <Text size="xs" className='dead-link' c="#ccc">{data.product.title}</Text>
                        </Breadcrumbs>
                    </Group>
                </Container>
            </Box>
            <Container>
                <Grid gutter={10}>
                    <Grid.Col span={{ md: 6 }}>
                        <Stack>
                            <Carousel>
                                {images.map((image, i) =>
                                    <Carousel.Slide key={i}>
                                        <AspectRatio>
                                            <BackgroundImage src={image.url} />
                                            {/* <_Image src={image.url} /> */}
                                        </AspectRatio>
                                    </Carousel.Slide>
                                )}
                            </Carousel>
                            <SimpleGrid cols={6}>
                                {images.map((image, i) => (
                                    <AspectRatio key={i}>
                                        <_Image src={image.url} />
                                    </AspectRatio>
                                ))}
                            </SimpleGrid>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{ md: 6 }}>
                        <Stack>
                            <Title c="#3a3a3a" className='title'>{data.product.title}</Title>
                            {data.product.subtitle && (
                                <Text size="xl" c="#3a3a3a" className='title'>{data.product.subtitle}</Text>
                            )}
                            {selectedVariation && (
                                <Group>
                                    <Title>
                                        <Box fw="lighter" component='span' tt="uppercase" fz="lg">{selectedVariation.prices[0].currency_code}</Box>
                                        <Box fw="lighter" component="span">{get_money(selectedVariation.prices[0].amount).amount}</Box>
                                    </Title>
                                </Group>
                            )}
                            <Group>
                                {is_brand(data.product) && (
                                    <>
                                        <_Image fit='contain' style={{ width: 100, height: 100 }} src={get_brand_image(data.product)} />
                                        <Text tt="capitalize" fw="bold">{data.product.collection.title}</Text>
                                    </>
                                )}
                            </Group>
                            <Text size='xs'>Variation:</Text>
                            {/* <Divider label="Variations" labelPosition='left' styles={{ label: { color: "violet" } }} color="#ccc3" /> */}
                            <Group>
                                {data.product.variants.map((variant, i) => (
                                    <Button key={i} onClick={() => setSelectedVariation(variant)} variant={selectedVariation?.id == variant.id ? "outline" : "default"} color='dark'>{variant.title}</Button>
                                ))}
                            </Group>
                            <Group wrap='nowrap'>
                                <Paper component={Group} wrap="nowrap">
                                    <ActionIcon onClick={() => _minus()} variant='light'>
                                        <BiMinus />
                                    </ActionIcon>
                                    <TextInput defaultValue={1} value={cartCounter} min={1} styles={{ input: { textAlign: "center" } }} variant='unstyled' w={60} />
                                    <ActionIcon onClick={() => _plus()} variant='light'>
                                        <BiPlus />
                                    </ActionIcon>
                                </Paper>
                                <Button loading={cart_loading} color='dark' fullWidth onClick={() => _add_to_cart()}>Add to cart</Button>
                            </Group>
                            <Text fw="bold">Description</Text>
                            {/* <Divider label="Description" labelPosition='left' styles={{ label: { color: "violet" } }} color="#ccc3" /> */}
                            <Text c="#3a3a3a" fw="lighter">{data.product.description}</Text>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
        </>
    )
}

export default ProductSlug;