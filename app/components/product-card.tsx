import { AspectRatio, BackgroundImage, Box, Button, Card, Space, Text } from '@mantine/core';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { Link } from '@remix-run/react';
import React, { useState } from 'react'
import { add_to_cart, get_money } from '~/services';
import { useSelectedRegion } from '~/services/states';

const ProductCard: React.FC<{ product: PricedProduct }> = ({ product }) => {

    const [cart_loading, setCart_loading] = useState(false);
    const region = useSelectedRegion(s => s.region);

    const _add_to_cart = async () => {
        setCart_loading(true);
        try {
            if (region) {
                await add_to_cart(region.id, String(product.variants[0].id), 1);
            }
        } catch (error) {
            console.log(error);
        }
        setCart_loading(false);
    }

    return (
        <Card className='product-card'>
            <Box>
                <Text truncate>{product.title}</Text>
                {product.categories && Array.isArray(product.categories) && product.categories.length > 0 && (
                    <Text component={Link} to={`/categories/${product.categories[0].handle}`} size='xs' c="#ccc">{product.categories[0].name}</Text>
                )}
            </Box>
            <Space h="xs" />
            <Card.Section component={Link} to={`/products/${product.handle}`}>
                <AspectRatio className='image-holder'>
                    {product.thumbnail && (
                        <BackgroundImage src={product.thumbnail} style={{backgroundSize:"contain", backgroundRepeat:"no-repeat"}} />
                    )}
                </AspectRatio>
            </Card.Section>
            {Array.isArray(product.variants) && product.variants.length && product.variants[0].prices.length > 0 && (
                <Text pt={20} pb={20} c="orange" fw="bold" tt="uppercase" ta="center">
                    {product.variants[0].prices[0].amount && (
                        <>
                            {get_money(product.variants[0].prices[0].amount).currency.code}
                            {get_money(product.variants[0].prices[0].amount).amount}
                        </>
                    )}
                </Text>
            )}
            {Array.isArray(product.variants) && (
                <Card.Section>
                    <Button loading={cart_loading} onClick={() => _add_to_cart()} variant='transparent' color='violet' fullWidth radius={0}>Add To Cart</Button>
                </Card.Section>
            )}
        </Card>
    )
}

export default ProductCard;