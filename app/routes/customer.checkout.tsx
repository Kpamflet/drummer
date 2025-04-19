import { Accordion, Container, Grid, Paper, Select, Title } from '@mantine/core';
import { Address } from '@medusajs/medusa';
import { MetaFunction } from '@vercel/remix';
import { useMeCustomer } from 'medusa-react';
import React, { useEffect, useState } from 'react'

export const meta: MetaFunction = () => {
    return [
        { title: "Checkout" },
        { name: "description", content: "Checkout" },
    ];
};

const CustomerCheckout = () => {

    const [accord_value, setAccord_value] = useState<string | null>("address");
    const cust = useMeCustomer();
    const [address, setAddress] = useState<string | null>(null);
    useEffect(() => {
        if (address) {
            setAccord_value("payment")
        }
    }, [address])
    return (
        <Container>
            {cust && cust.customer && (
                <Grid justify='center'>
                    <Grid.Col span={{ md: 6 }}>
                        <Paper withBorder>
                            <Accordion onChange={setAccord_value} value={accord_value}>
                                <Accordion.Item value="address">
                                    <Accordion.Control><Title>Address</Title></Accordion.Control>
                                    <Accordion.Panel>
                                        <Select onChange={setAddress} placeholder='Select Address' size='xl' data={cust.customer.shipping_addresses.map(a => ({ label: String(a.company), value: String(a.id) }))} />
                                    </Accordion.Panel>
                                </Accordion.Item>
                                {address && (
                                    <Accordion.Item value="payment">
                                        <Accordion.Control><Title>Payment</Title></Accordion.Control>
                                        <Accordion.Panel></Accordion.Panel>
                                    </Accordion.Item>
                                )}
                            </Accordion>
                        </Paper>
                    </Grid.Col>
                </Grid>
            )}
        </Container>
    )
}

export default CustomerCheckout;