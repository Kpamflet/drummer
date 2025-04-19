import { Box, Stack } from '@mantine/core'
import React from 'react'
import AppFooter from '~/components/app-footer'
import ProductsHeader from '~/components/products-header'

const AboutUs = () => {
    return (
        <Stack>
            <ProductsHeader />
            <Box mih="80vh">
                <div>About Us</div>
            </Box>
            <AppFooter />
        </Stack>
    )
}

export default AboutUs;