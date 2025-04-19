import { Alert, Box, Button, Card, Container, Grid, Group, Notification, Paper, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from '@remix-run/react';
import { MetaFunction } from '@vercel/remix';
import React, { useEffect, useState } from 'react'
import medusaClient from '~/services/medusa.client';

type FormType = { phone?: string; confirmpassword: string; first_name: string; last_name: string; password: string; email: string; };

export const meta: MetaFunction = () => {
	return [
		{ title: "Register" },
		{ name: "description", content: "Register" },
	];
};

const CustomerRegister = () => {

    const [error, setError] = useState("");
    const nav = useNavigate();

    const form = useForm<FormType>({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirmpassword: "",
            phone: ""
        }
    });

    const _onSubmit = async (vals: FormType) => {

        setError("");

        if (vals.password.length == 0) {
            setError("Enter password!");
            return;
        }

        if (vals.password !== vals.confirmpassword) {
            setError("Password does not match!");
            return;
        }

        try {
            const customer = await medusaClient.customers.create({
                email: vals.email,
                first_name: vals.first_name,
                last_name: vals.last_name,
                password: vals.password,
                phone: vals.phone
            });
            nav("/customer/login");
        } catch (error: any) {
            setError(error.message);
        }

    }
    useEffect(() => {
        (async () => {
            try {
                await medusaClient.customers.retrieve();
                nav("/customer");
            } catch (error) {

            }
        })();
    }, [])

    return (
        <Box>
            <Container>
                <Grid>
                    <Grid.Col span={{ md: 3 }}>
                        <Card onSubmit={form.onSubmit(_onSubmit)} component="form" shadow='xl'>
                            <Stack>
                                <Group grow>
                                    <TextInput required label="First name" {...form.getInputProps("first_name")} />
                                    <TextInput required label="Last name" {...form.getInputProps("last_name")} />
                                </Group>
                                <TextInput required label="Email address" {...form.getInputProps("email")} />
                                <TextInput label="Phone" {...form.getInputProps("phone")} />
                                <PasswordInput required label="Password" {...form.getInputProps("password")} />
                                <PasswordInput required label="Confirm Password" {...form.getInputProps("confirmpassword")} />
                                <Button type='submit' color='violet'>Sign Up</Button>
                                <Group>
                                    <Text size="xs">Already having an account?</Text>
                                    <Text component={Link} to="/customer/login" size="xs" span>Login</Text>
                                </Group>
                                {error && (
                                    <Alert color='red' variant='light'>{error}</Alert>
                                )}
                            </Stack>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Container>
        </Box>
    )
}

export default CustomerRegister;