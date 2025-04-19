import { ActionIcon, Box, Container, Group, Text, Center, Divider, Button, Burger, Indicator } from '@mantine/core';
import { Link } from '@remix-run/react';
import { BiCart, BiSearch, BiShoppingBag, BiSolidUser, BiUser } from "react-icons/bi";
import LogoOnly from './LogoOnly';
import { useLocalCart } from '~/services/states';
import { useMeCustomer } from 'medusa-react';
import BurgerMenu from './BurgerMenu';

const AppHeader = () => {
    const cart = useLocalCart(s => s.cart);
    const cust = useMeCustomer();
    return (
        <Box className='app-header'>
            <Box pt={30} pb={30}>
                <Container h="100%">
                    <Group h="100%">
                        <Center>
                            <Box w={50} h={50}>
                                <LogoOnly />
                            </Box>
                        </Center>
                        <Group justify="right" align="center" wrap='nowrap' gap={30} style={{ flex: 1 }}>
                            <Text visibleFrom='md' component={Link} to="/" className="menu-item-x">Home</Text>
                            <Text visibleFrom='md' component={Link} to="/about-us" className="menu-item-x">About Us</Text>
                            <Text visibleFrom='md' component={Link} to="/contact-us" className="menu-item-x">Contact Us</Text>
                            <ActionIcon visibleFrom='md' component={Link} to="/products" color="violet">
                                <BiShoppingBag />
                            </ActionIcon>
                            <Indicator size={30} color='red' label={cart?.items.length}>
                                <ActionIcon component={Link} to="/customer/cart" color="violet">
                                    <BiCart />
                                </ActionIcon>
                            </Indicator>
                            {!cust.customer && (
                                <Button component={Link} to="/customer/login" color="violet" leftSection={<BiSolidUser />}>Sign in</Button>
                            )}
                            {cust.customer && (
                                <Button visibleFrom='md' radius="xl" component={Link} to="/customer" leftSection={<BiUser />} color='violet'>Profile</Button>
                            )}
                            <BurgerMenu customer={cust.customer} />
                        </Group>
                    </Group>
                </Container>
            </Box>
        </Box>
    )
}

export default AppHeader;