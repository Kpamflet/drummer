import { ActionIcon, ActionIconGroup, BackgroundImage, Box, Center, Container, Divider, Group, List, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { Link } from '@remix-run/react';
import React from 'react'
import { BiLogoFacebook, BiLogoTwitter } from 'react-icons/bi';
import { useParentCategories } from '~/services/hooks';
import LogoOnly from './LogoOnly';

const AppFooter = () => {
  const parent_cats = useParentCategories();
  return (
    <BackgroundImage src="/assets/footer-bg.jpg" radius={0} pt={100} pb={100}>
      <Container>
        <Stack>

          <SimpleGrid cols={{ base: 2, md: 3 }} verticalSpacing={100}>
            <Box>
              <Center>
                <LogoOnly />
              </Center>
            </Box>
            <Stack>
              <Text c="#fff">Main Categories</Text>
              {parent_cats.map((cat, i) => (
                <Text key={i} size="xs" c="#ccc" component={Link} to={`/categories/${cat.handle}`}>{cat.name}</Text>
              ))}
            </Stack>
            <Stack>
              <Text c="#fff">Links</Text>
              <Text size="xs" c="#ccc" component={Link} to={`/`}>Home</Text>
              <Text size="xs" c="#ccc" component={Link} to={`/about-us`}>About Us</Text>
              <Text size="xs" c="#ccc" component={Link} to={`/contact-us`}>Contact Us</Text>
            </Stack>
            <Stack>
              <Text c="#fff">Customer</Text>
              <Text size="xs" c="#ccc" component={Link} to={`/customer`}>Profile</Text>
              <Text size="xs" c="#ccc" component={Link} to={`/customer/login`}>Login</Text>
              <Text size="xs" c="#ccc" component={Link} to={`/customer/register`}>Register</Text>
            </Stack>
          </SimpleGrid>
          <Divider color='#313131' />
          <Group>
            <Text component={Link} to="/" c="#cccccc75" size='xs'>drumandbasscentre.com</Text>
            <Text component={Link} to="/terms" c="#cccccc75" size='xs'>Terms</Text>
            <Text component={Link} to="/privacy" c="#cccccc75" size='xs'>Privacy</Text>
            <Box style={{ flex: 1 }} />
            <ActionIcon color='dark'>
              <BiLogoTwitter />
            </ActionIcon>
            <ActionIcon color='dark'>
              <BiLogoFacebook />
            </ActionIcon>
          </Group>
        </Stack>
      </Container>
    </BackgroundImage>
  )
}

export default AppFooter;