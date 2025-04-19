import { Box, Button, Divider, Group, Paper, Popover, Stack, Table, Text, Title, Tooltip } from '@mantine/core';
import { Link } from '@remix-run/react';
import React from 'react'
import { BiInfoCircle } from 'react-icons/bi';
import { get_money } from '~/services';
import { useLocalCart } from '~/services/states';

const CartSummary = () => {

    const cart = useLocalCart();

    return (
        <>
            {cart && cart.cart && (
                <Box>
                    <Stack>
                        <Title fw="lighter">Order Summary</Title>
                        <Group>
                            <Text size="xs" c="#ccc">Add gift card or discount code</Text>
                        </Group>
                        <Divider color="#d9d8d854" />
                        <Table fz="sm" withColumnBorders={false} withRowBorders={false}>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Th>Sub Total</Table.Th>
                                    <Table.Td ta="right"><Text>{`${get_money(Number(cart.cart.subtotal)).currency.code} ${get_money(Number(cart.cart.subtotal)).amount}`}</Text></Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th>Taxes</Table.Th>
                                    <Table.Td><Text ta="right">{`${get_money(Number(cart.cart.tax_total)).currency.code} ${get_money(Number(cart.cart.tax_total)).amount}`}</Text></Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th>Discount</Table.Th>
                                    <Table.Td><Text ta="right">{`${get_money(Number(cart.cart.discount_total)).currency.code} ${get_money(Number(cart.cart.discount_total)).amount}`}</Text></Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th>Shipping</Table.Th>
                                    <Table.Td><Text ta="right">{`${get_money(Number(cart.cart.shipping_total)).currency.code} ${get_money(Number(cart.cart.shipping_total)).amount}`}</Text></Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                        <Divider color="#d9d8d854" />
                        <Table fz="sm" withColumnBorders={false} withRowBorders={false}>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Th>Total</Table.Th>
                                    <Table.Td><Text ta="right">{`${get_money(Number(cart.cart.total)).currency.code} ${get_money(Number(cart.cart.total)).amount}`}</Text></Table.Td>
                                </Table.Tr>
                            </Table.Tbody>
                        </Table>
                        <Divider color="#d9d8d854" />
                        <Button component={Link} to="/customer/checkout" color='violet'>Go to checkout</Button>
                    </Stack>
                </Box>
            )}
        </>
    )
}

export default CartSummary;