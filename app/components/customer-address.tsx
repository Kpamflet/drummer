import { Button, Group, Paper, Select, Stack, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { closeAllModals } from '@mantine/modals';
import { AddressCreatePayload, AddressPayload, Customer, Region, StoreCustomersRes } from '@medusajs/medusa';
import { Response } from '@medusajs/medusa-js';
import React, { useEffect } from 'react'
import medusaClient from '~/services/medusa.client';

const CustomerAddress: React.FC<{ address_id?: string, onCreate?: (val: Omit<Customer, "password_hash">) => void }> = ({ onCreate, address_id }) => {
    const form = useForm<AddressCreatePayload>({
        initialValues: {
            company: "",
            first_name: "",
            last_name: "",
            address_1: "",
            address_2: "",
            city: "",
            country_code: "",
            postal_code: "",
            phone: "",
            province: "",
            metadata: {},
        }
    });

    const _onSubmit = async (val: AddressCreatePayload) => {
        let resp: Response<StoreCustomersRes> | null = null;
        if (address_id) {
            resp = await medusaClient.customers.addresses.updateAddress(address_id, {
                first_name: val.first_name,
                last_name: val.last_name,
                address_1: val.address_1,
                address_2: val.address_2,
                city: val.city,
                company: val.company,
                country_code: val.country_code,
                phone: val.phone,
                postal_code: val.postal_code,
                province: val.province,
                metadata: undefined
            });
        } else {
            resp = await medusaClient.customers.addresses.addAddress({ address: val });
        }
        if (onCreate) {
            onCreate(resp.customer);
        }
        closeAllModals();
    }

    useEffect(() => {
        if (address_id) {
            (async () => {
                const cust = await medusaClient.customers.retrieve();
                const add = cust.customer.shipping_addresses.find(address => address.id === address_id);
                if (add) {
                    form.setValues(add as AddressPayload);
                }
            })();
        }
    }, [address_id]);

    return (
        <Paper component="form" onSubmit={form.onSubmit(_onSubmit)}>
            <Stack>
                <Group grow>
                    <TextInput variant='filled' placeholder='First name' {...form.getInputProps("first_name")} />
                    <TextInput variant='filled' placeholder='Last name' {...form.getInputProps("last_name")} />
                </Group>
                <TextInput variant='filled' placeholder='Company name' {...form.getInputProps("company")} />
                <TextInput variant='filled' placeholder='Phone number' {...form.getInputProps("phone")} />
                <Textarea variant='filled' placeholder='Address 1' {...form.getInputProps("address_1")} />
                <Textarea variant='filled' placeholder='Address 2' {...form.getInputProps("address_2")} />
                <TextInput variant='filled' placeholder='City' {...form.getInputProps("city")} />
                <TextInput variant='filled' placeholder='State' {...form.getInputProps("province")} />
                <TextInput variant='filled' placeholder='Country Code e.g GH, EU, NG e.t.c' {...form.getInputProps("country_code")} />
                <TextInput variant='filled' placeholder='Postal Code' {...form.getInputProps("postal_code")} />
                <Button type='submit' color='violet'>{address_id ? "Update" : "Save"}</Button>
            </Stack>
        </Paper>
    )
}

export default CustomerAddress;