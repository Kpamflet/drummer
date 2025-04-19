import { Cart, Region } from '@medusajs/medusa'
import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

interface CartState {
    cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
    add_to_cart?: (by: number) => void,
    set_cart?: (cart: Omit<Cart, "refundable_amount" | "refunded_total">) => void
}

export const useLocalCart = create<CartState>()(
    devtools(
        persist(
            (set) => ({
                cart: null,
                set_cart(cart) {
                    set({ cart });
                },
            }),
            {
                name: 'cart',
                storage: createJSONStorage(() => localStorage),
            },
        ),
    ),
)

export const useSelectedRegion = create<{ region: Region | null; set_region?: (region: Region) => void }>()(
    devtools(
        persist(
            (set) => ({
                region: null,
                set_region(region) {
                    set({ region });
                },
            }),
            {
                name: 'region',
                storage: createJSONStorage(() => localStorage),
            },
        ),
    ),
);
