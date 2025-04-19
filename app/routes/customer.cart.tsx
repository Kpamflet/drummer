import { ActionIcon, BackgroundImage, Box, Container, Divider, Grid, Group, Paper, Stack, Table, Text } from '@mantine/core';
import { MetaFunction } from '@vercel/remix';
import React from 'react'
import { BiMinus } from 'react-icons/bi';
import CartSummary from '~/components/cart-summary';
import { get_money } from '~/services';
import medusaClient from '~/services/medusa.client';
import { useLocalCart } from '~/services/states';

export const meta: MetaFunction = () => {
	return [
		{ title: "Cart" },
		{ name: "description", content: "Cart" },
	];
};

const CustomerCart = () => {

  const cart = useLocalCart(s => s.cart);
  const set_cart = useLocalCart(s => s.set_cart);
  const _delete_item = async (id: string) => {
    const _cart = await medusaClient.carts.lineItems.delete(cart!.id, id);
    set_cart!(_cart.cart);
  }

  return (
    <Box>
      <Container>
        <Grid>
          <Grid.Col span={{ md: 6 }}>
            <Stack>
              <Text fw="lighter" size="xl">My Orders</Text>
              {cart && Array.isArray(cart.items) && cart.items.map((c, i) => (
                <Paper key={i} p={10}>
                  <Group>
                    <BackgroundImage w={80} h={80} src={String(c.thumbnail)} />
                    <Stack style={{ flex: 1 }} gap={1}>
                      <Text fw="lighter">{c.title}</Text>
                      <Text fz="xs" fw="bold">{`${get_money(c.unit_price).currency.code} ${get_money(c.unit_price).amount}`} x {c.quantity}</Text>
                      <Text c="violet" fw="bold">{`${get_money(Number(c.total)).currency.code} ${get_money(Number(c.total)).amount}`}</Text>
                    </Stack>
                    <ActionIcon onClick={() => _delete_item(c.id)} variant='transparent'>
                      <BiMinus />
                    </ActionIcon>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ md: 6 }}>
            <CartSummary />
          </Grid.Col>
        </Grid>
      </Container>
    </Box >
  )
}

export default CustomerCart;