import { Burger, Button, Menu } from '@mantine/core';
import { Customer } from '@medusajs/medusa';
import { Link } from '@remix-run/react';
import React, { useState } from 'react'
import { BiHome, BiLogIn, BiUser } from 'react-icons/bi';
import medusaClient from '~/services/medusa.client';

const BurgerMenu: React.FC<{ customer: Omit<Customer, "password_hash"> | undefined }> = ({ customer }) => {

    const [menuOpen, setMenuOpen] = useState(false);

    const _logOut = async () => {
        const _w = await medusaClient.auth.deleteSession();
        window.location.href = "/customer/login";
    }

    return (
        <Menu opened={menuOpen}>
            <Menu.Target>
                <Burger opened={menuOpen} onClick={() => setMenuOpen(v => !v)} hiddenFrom='md' color='violet' />
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item leftSection={<BiHome />} component={Link} to="/" color='violet'>
                    Home
                </Menu.Item>
                {customer ?
                    <>
                        <Menu.Label>Session</Menu.Label>
                        <Menu.Item leftSection={<BiUser />} component={Link} to="/customer">
                            Profile
                        </Menu.Item>
                        <Menu.Item leftSection={<BiHome />} color='red' onClick={() => _logOut()}>
                            Logout
                        </Menu.Item>
                    </> : <>
                        <Menu.Item leftSection={<BiLogIn />} component={Link} to="/customer/login">
                            Sign In
                        </Menu.Item>
                    </>
                }
            </Menu.Dropdown>
        </Menu>
    )
}

export default BurgerMenu;