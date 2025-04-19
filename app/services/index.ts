import { Product, ProductVariant } from "@medusajs/medusa";
import { Currency, Money } from "@bitzlato/money-js";
import medusaServer from "./medusa.server";
import { useLocalCart } from "./states";
import medusaClient from "./medusa.client";

export const is_brand = (product: Product) => {
    return product.collection && "type" in product.collection.metadata && product.collection.metadata.type === "brand";
}

export const get_brand_image = (product: Product) => {
    if (product.collection && "type" in product.collection.metadata && product.collection.metadata.type === "brand") {
        return `/assets/brands/${product.collection.handle}.webp`;
    }
}

export const get_money = (price: Number) => {
    const GHS: Currency = {
        code: 'GHS',
        minorUnit: 2,
    };
    return Money.fromCents(Number(price), GHS).toJSON();
}

export const add_to_cart = async (region_id: string, variant_id: string, quantity: number) => {
    const cart = useLocalCart.getState().cart;
    if (!cart) {
        let cart = await medusaClient.carts.create({ region_id });
        cart = await medusaClient.carts.lineItems.create(cart.cart.id, { quantity, variant_id });
        useLocalCart.setState({ cart: cart.cart });
        return false;
    } else {
        const _cart = await medusaClient.carts.lineItems.create(cart.id, { quantity, variant_id });
        useLocalCart.setState({ cart: _cart.cart });
    }
}