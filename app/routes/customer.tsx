import { ActionIcon, ActionIconGroup, Alert, BackgroundImage, Box, Breadcrumbs, Button, Card, Container, Grid, Group, Paper, Stack, Tabs, Text, Title, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { openModal } from '@mantine/modals';
import { Address, Customer } from '@medusajs/medusa';
import { Link, Outlet, useLocation, useNavigate } from '@remix-run/react';
import { LoaderFunctionArgs, redirect } from '@vercel/remix';
import { useMeCustomer, useRegion, useRegions } from 'medusa-react';
import React, { useEffect, useState } from 'react'
import { BiEdit, BiLogOut, BiMinus, BiPlus } from 'react-icons/bi';
import AppFooter from '~/components/app-footer';
import CustomerAddress from '~/components/customer-address';
import ProductsHeader from '~/components/products-header';
import medusaClient from '~/services/medusa.client';
import { useSelectedRegion } from '~/services/states';

const CustomerPage = () => {

    const loc = useLocation();
    const [customer, setCustomer] = useState<Omit<Customer, "password_hash"> | null>(null);
    const nav = useNavigate();
    const theme = useMantineTheme();
    const mdHook = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);

    useEffect(() => {
        (async () => {
            try {
                const customer = await medusaClient.auth.getSession();
                setCustomer(customer.customer);
            } catch (error) {
                nav("/customer/login");
            }
        })();
    }, [])

    const _logOut = async () => {
        const _w = await medusaClient.auth.deleteSession();
        window.location.href = "/customer/login";
    }

    const _region = useSelectedRegion(s => s.region);
    const region = useRegion(String(_region?.id));

    const onAddressCreate = (val: Omit<Customer, "password_hash">) => {
        setCustomer(val);
    }

    const _deleteAddress = async (a: Address) => {
        if (confirm(`Are you sure you want to delete`)) {
            const customer = await medusaClient.customers.addresses.deleteAddress(a.id);
            setCustomer(customer.customer);
        }
    }

    return (
        <BackgroundImage src="/assets/webbg.webp">
            <Stack>
                <ProductsHeader />
                {loc.pathname === "/customer" && customer ?
                    <>
                        <Box pt={20} pb={20} style={{ background: "linear-gradient(0deg,#f4f4f4,#f4f4f4)" }}>
                            <Container style={{ zIndex: 1, position: "relative" }}>
                                <Group className='center' style={{ flex: 1 }} justify='space-between'>
                                    <Breadcrumbs separator="/">
                                        <Text component={Link} to="/" size="xs" className='live-link'>Home</Text>
                                        <Text component={Link} to="/products" size="xs" className='live-link'>Customers</Text>
                                        <Text size="xs" className='dead-link' c="#ccc">{`${customer.first_name} ${customer.last_name}`}</Text>
                                    </Breadcrumbs>
                                </Group>
                                <Group wrap='nowrap'>
                                    <ActionIcon onClick={() => _logOut()} color='violet'>
                                        <BiLogOut />
                                    </ActionIcon>
                                    <Text truncate size="xl" fw="lighter" c="violet">Welcome, {`${customer.first_name} ${customer.last_name}`}</Text>
                                </Group>
                            </Container>
                        </Box>
                        <Box p={20}>
                            <Tabs color='violet' variant='pills' orientation={mdHook ? "vertical" : "horizontal"} defaultValue="orders">
                                <Tabs.List>
                                    <Tabs.Tab value="orders">
                                        Orders
                                    </Tabs.Tab>
                                    <Tabs.Tab value="profile">
                                        Edit Profile
                                    </Tabs.Tab>
                                    <Tabs.Tab value="address">
                                        Addresses
                                    </Tabs.Tab>
                                </Tabs.List>
                                <Tabs.Panel p={10} value='orders'>
                                    {!customer.orders && (
                                        <Alert>
                                            No Orders
                                        </Alert>
                                    )}
                                    {Array.isArray(customer.orders) && customer.orders.map((o, i) => (
                                        <Card key={i}></Card>
                                    ))}
                                </Tabs.Panel>
                                <Tabs.Panel p={10} value='address'>
                                    <Stack>
                                        <Group>
                                            <Button color='violet' onClick={() => openModal({ children: <CustomerAddress onCreate={onAddressCreate} /> })} leftSection={<BiPlus />} variant='transparent'>Add Address</Button>
                                        </Group>
                                        {customer.shipping_addresses.map((a, i) => (
                                            <Card withBorder key={i}>
                                                <Group>
                                                    <Stack style={{ flex: 1 }}>
                                                        <Text>{a.company}</Text>
                                                    </Stack>
                                                    <ActionIconGroup>
                                                        <ActionIcon onClick={() => _deleteAddress(a)} variant='light' color='red'>
                                                            <BiMinus />
                                                        </ActionIcon>
                                                        <ActionIcon onClick={() => openModal({ children: <CustomerAddress address_id={a.id} onCreate={onAddressCreate} /> })} variant='light'>
                                                            <BiEdit />
                                                        </ActionIcon>
                                                    </ActionIconGroup>
                                                </Group>
                                            </Card>
                                        ))}
                                    </Stack>
                                </Tabs.Panel>
                            </Tabs>
                        </Box>
                    </>
                    :
                    <Box mih="60vh">
                        <Outlet />
                    </Box>
                }
                <AppFooter />
            </Stack>
        </BackgroundImage>
    )
}

export default CustomerPage;