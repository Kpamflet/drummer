import { ActionIcon, Avatar, Box, Burger, Button, Center, Container, Group, HoverCard, Image, Indicator, Menu, Paper, Select, SimpleGrid, Text, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import { IoMdArrowDropdown } from 'react-icons/io';
import { BiCart, BiSearch, BiSolidUser, BiUser } from 'react-icons/bi';
import LogoLong from './LogoLong';
import { get_child_categories, get_regions, useParentCategories } from '~/services/hooks';
import { Link, useNavigate } from '@remix-run/react';
import { useMeCustomer, useRegions } from 'medusa-react';
import { useLocalCart, useSelectedRegion } from '~/services/states';
import medusaClient from '~/services/medusa.client';
import BurgerMenu from './BurgerMenu';
import LogoOnly from './LogoOnly';

const ProductsHeader = () => {
    const categories = useParentCategories();
    const set_region = useSelectedRegion(s => s.set_region);
    const selected_region = useSelectedRegion(s => s.region);
    const cart = useLocalCart(s => s.cart);
    const cust = useMeCustomer();
    const nav = useNavigate();
    const [search_str, setSearch_str] = useState<string>("");

    const _onSearch:React.KeyboardEventHandler<HTMLInputElement> | undefined = (e) => {
        if(e.key === "Enter"){
            nav(`/products/?search=${search_str}`);
        }
    }

    return (
        <Paper radius={0} style={{ borderBottom: "1px solid #d9d8d854" }}>
            <Container>
                <Group wrap='nowrap' pt={10} pb={10} justify='space-between'>
                    <Center component={Link} to="/" visibleFrom='md' w={40}>
                        <LogoOnly />
                    </Center>
                    <Menu>
                        <Menu.Target>
                            <Paper withBorder radius={10} p={10} component={Group}>
                                {selected_region ?
                                    <>
                                        <Text>{selected_region.name}</Text> <IoMdArrowDropdown />
                                    </> : <>
                                        <Text>GH</Text> <IoMdArrowDropdown />
                                    </>
                                }
                            </Paper>
                        </Menu.Target>
                        <Menu.Dropdown>
                            {get_regions().map((r, i) => (<Menu.Item onClick={() => set_region!(r)} key={i}>{r.name}</Menu.Item>))}
                        </Menu.Dropdown>
                    </Menu>
                    <TextInput onKeyDown={_onSearch} onChange={(e) => setSearch_str(e.target.value)} placeholder="Search Drum & Bass Centre" radius="lg" size="lg" styles={{ input: { backgroundColor: "var(--mantine-color-violet-light)" } }} variant='filled' rightSection={<BiSearch />} style={{ flex: 1 }} type='search' />
                    <Text visibleFrom='md' component={Link} to="/" className='menu-item-x' size="xs">Home</Text>
                    <Text visibleFrom='md' component={Link} to="/contact-us" className='menu-item-x' size="xs">Contact Us</Text>
                    <Indicator size={30} color='red' label={cart?.items.length}>
                        <ActionIcon component={Link} to="/customer/cart" color='violet'>
                            <BiCart />
                        </ActionIcon>
                    </Indicator>
                    {!cust.customer && (
                        <Button visibleFrom='md' component={Link} to="/customer/login" variant='light' color="violet" leftSection={<BiSolidUser />}>Sign in</Button>
                    )}
                    {cust.customer && (
                        <Button visibleFrom='md' radius="xl" variant='light' component={Link} to="/customer" leftSection={<BiUser />} color='violet'>Profile</Button>
                    )}
                    <BurgerMenu customer={cust.customer} />
                </Group>
                <Group visibleFrom='md' grow>
                    {categories.map((category, i) => (
                        <HoverCard radius={0} offset={0} key={i}>
                            <HoverCard.Target>
                                <Center>
                                    <Text component={Link} to={`/categories/${category.handle}`} ta="center" className='header-drop-item'>{category.name}</Text>
                                </Center>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Box>
                                    <Group>
                                        <Image style={{ width: 200, height: 200 }} fit='contain' src={`/assets/categories/${category.handle}.webp`} />
                                        <SimpleGrid cols={3}>
                                            {get_child_categories(category.id).map((c, i) => (
                                                <Text component={Link} to={`/categories/${c.handle}`} className='menu-item-x' key={i}>{c.name}</Text>
                                            ))}
                                        </SimpleGrid>
                                    </Group>
                                </Box>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    ))}
                </Group>
            </Container>
        </Paper>
    )
}

export default ProductsHeader;