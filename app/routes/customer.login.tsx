import { Button, Card, Center, Container, Divider, Group, Paper, PasswordInput, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import React, { useEffect } from 'react'
import { useForm } from "@mantine/form";
import { ActionFunctionArgs, MetaFunction, json } from '@vercel/remix';
import medusaServer from '~/services/medusa.server';
import { Link, useNavigate } from '@remix-run/react';
import { commitSession, getSession } from '~/services/session.server';
import medusaClient from '~/services/medusa.client';

type FormType = { email: string; password: string };

export const meta: MetaFunction = () => {
	return [
		{ title: "Login" },
		{ name: "description", content: "Login" },
	];
};

const CustomerLogin = () => {

    const nav = useNavigate();

    const form = useForm<FormType>({
        initialValues: {
            email: "",
            password: ""
        }
    });

    const _onSubmit = async (val: FormType) => {
        try {
            const dt = await medusaClient.auth.authenticate({ email: val.email, password: val.password });
            window.location.href = "/customer";
        } catch (error) {

        }
    }

    useEffect(() => {
        (async () => {
            try {
                const cust = await medusaClient.auth.getSession();
                nav("/customer");
            } catch (error) {

            }
        })();
    }, [])

    return (
        <Container h="100%">
            <SimpleGrid cols={{ base: 1, md: 4 }}>
                <Stack>
                    <Paper component="form" onSubmit={form.onSubmit(_onSubmit)} p={20} shadow='xl'>
                        <Stack>
                            <Text fw="bold" fz="xl">Customer Panel</Text>
                            <Text c="#ccc">Login with your registered credentials</Text>
                            <Paper p={10} component={Stack} withBorder>
                                <TextInput placeholder="Email address" variant="unstyled" {...form.getInputProps("email")} />
                                <Divider />
                                <PasswordInput placeholder="Password" variant="unstyled" {...form.getInputProps("password")} />
                            </Paper>
                            <Button type='submit' color='violet'>Login</Button>
                        </Stack>
                    </Paper>
                    <Group>
                        <Text size="xs" component={Link} to="/customer/register">Dont have an account yet?</Text>
                        <Text component={Link} to="/customer/register" size="xs" span>register</Text>
                    </Group>
                </Stack>
            </SimpleGrid>
        </Container>
    )
}

export default CustomerLogin;