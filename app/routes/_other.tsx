import { Box, Stack } from '@mantine/core';
import { Outlet } from '@remix-run/react';
import React from 'react'
import AppFooter from '~/components/app-footer';
import ProductsHeader from '~/components/products-header';

const OtherPages = () => {
    return (
        <Stack>
            <ProductsHeader />
            <Box mih="80vh">
                <Outlet />
            </Box>
            <AppFooter />
        </Stack>
  )
}

export default OtherPages;