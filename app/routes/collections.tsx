import { Box, Container, Paper, Stack } from '@mantine/core';
import { Outlet, useLocation } from '@remix-run/react';
import React from 'react'
import AppFooter from '~/components/app-footer';
import ProductsHeader from '~/components/products-header';

const CollectionsPage = () => {

    const loc = useLocation();

    return (
        <Stack>
            <ProductsHeader />
            {loc.pathname === "/customer" ?
                <Paper>
                    <Container>
                    </Container>
                </Paper>
                :
                <Box mih="60vh">
                    <Outlet />
                </Box>
            }
            <AppFooter />
        </Stack>
    )
}

export default CollectionsPage;