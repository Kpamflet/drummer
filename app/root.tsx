// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import "~/styles/app.css";

import { cssBundleHref } from '@remix-run/css-bundle';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { LinksFunction, LoaderFunctionArgs } from '@vercel/remix';
import medusa from './services/medusa.server';
import { MedusaProvider } from "medusa-react"
import { QueryClient } from "@tanstack/react-query"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { regions } = await medusa.regions.list();
  const { product_categories } = await medusa.productCategories.list();
  return {
    categories: product_categories,
    regions: regions
  };
}

export const links: LinksFunction = () => [
  ...(cssBundleHref
    ? [{ rel: 'stylesheet', href: cssBundleHref }, {
      rel: 'icon',
      href: '/favicon.png',
      type: 'image/png',
    },]
    : []),
];

export default function App() {

  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider classNamesPrefix='simmslabs' theme={{
          components: {
            Container: {
              defaultProps: {
                size: "xl"
              }
            }
          }
        }}>
          <ModalsProvider modalProps={{ title: "Drum and Bass Centre" }}>
            <MedusaProvider
              queryClientProviderProps={{ client: queryClient }}
              baseUrl="https://backend-druman.fly.dev"
            >
              <Outlet />
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
            </MedusaProvider>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html >
  );
}