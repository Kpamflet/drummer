import { ActionIcon, AspectRatio, BackgroundImage, Box, Button, Center, Container, Group, Image, Paper, Select, SimpleGrid, Space, Stack, Text, useMantineTheme } from "@mantine/core";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useMatches } from "@remix-run/react";
import { MetaFunction } from "@vercel/remix";
import drum_display from "~/assets/drum_display.jpg";
import { get_regions, useParentCategories } from "~/services/hooks";
import AppHeader from "~/components/AppHeader";
import { TypeAnimation } from "react-type-animation";
import { BiShoppingBag } from "react-icons/bi";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useRef } from "react";
import { Carousel } from "@mantine/carousel";
import Autoplay from 'embla-carousel-autoplay';
import AppFooter from "~/components/app-footer";
import medusaServer from "~/services/medusa.server";
import { useLocalCart, useSelectedRegion } from "~/services/states";
import { modals, openModal } from "@mantine/modals";
import { useRegions } from "medusa-react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const resp = await medusaServer.collections.list();
	return { secondary: resp.collections.filter(c => c.metadata.type == "secondary") };
}

export const meta: MetaFunction = () => {
	return [
		{ title: "Drum and Bass Centre" },
		{ name: "description", content: "Drum and Bass Centre" },
	];
};

export default function Index() {

	const categories = useParentCategories();
	const theme = useMantineTheme();
	const mdHook = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
	console.log(`(min-width: ${theme.breakpoints.md})`);
	//@ts-ignore
	const autoplay = useRef(Autoplay({ delay: 2000 }));
	//@ts-check

	const data = useLoaderData<typeof loader>();
	const region = useSelectedRegion(s => s.region);
	const set_region = useSelectedRegion(s => s.set_region);
	const _r = get_regions();

	const _currencyChange = (v: string | null) => {
		const reg = _r.find(r => r.id === v);
		if (reg) {
			set_region!(reg);
		}
	}

	useEffect(() => {
		if (!region) {
			openModal({ centered: true, children: <Select onChange={(v) => _currencyChange(v)} label="Select Currency" variant="filled" size="xl" data={[{ label: "", value: "" }, ..._r.map((r) => ({ label: r.name, value: r.id }))]}></Select> });
		} else {
			modals.closeAll();
		}
	}, [region])

	return (
		<>
			<Box mih="100vh" display="flex" pos="relative" style={{ flexDirection: "column" }}>
				<BackgroundImage style={{ flex: 1 }} src={drum_display} />
				<Box className="cover">
					<Container h="100%">
						<Box className="inner">
							<AppHeader />
							<SimpleGrid cols={{ base: 1, md: 2 }}>
								<Center>
									<Image w={300} src="/assets/footer-logo.webp" />
								</Center>
								<Stack>
									<Text variant="gradient" gradient={{ from: 'cyan', to: 'purple', deg: 90 }}>
										<TypeAnimation wrapper="span" style={{ fontSize: 80 }} sequence={["we sell sound."]} repeat={12} speed={50}>

										</TypeAnimation>
									</Text>
									<Text fw={100} c="#fff" fz={40}>from starters to pro.</Text>
								</Stack>
							</SimpleGrid>
							<Box visibleFrom='xs' className="cat-box" style={{ flex: 1, flexDirection: "column-reverse", justifyContent: "center", alignItems: "center" }}>
								<Group justify="space-evenly" gap={40}>
									{categories.map((category, i) => (
										<Stack key={i}>
											<Text component={Link} to={`/categories/${category.handle}`} className="main-cat-text" fw={600} fz={30}>{category.name}</Text>
										</Stack>
									))}
								</Group>
								<Space h={100} />
							</Box>
							<Center visibleFrom='md' style={{ flex: 1, overflow: "hidden" }}>
								<Carousel style={{ flex: 1 }} styles={{ indicators: { bottom: "-50px" }, indicator: { width: 20, height: 20 } }} withIndicators color="violet" hiddenFrom='xs' onMouseEnter={autoplay.current.stop}
									onMouseLeave={autoplay.current.reset} withControls={false} loop plugins={[autoplay.current]}>
									{categories.map((category, i) => (
										<Carousel.Slide key={i}>
											<Text fw="lighter" c="#fff" component={Link} to={`/categories/${category.handle}`} fz={50}>{category.name}</Text>
										</Carousel.Slide>
									))}
								</Carousel>
							</Center>
						</Box>
					</Container>
					<Box display="flex">
						<Box pos={!mdHook ? "relative" : "absolute"} style={!mdHook ? { flex: 1 } : { minWidth: 380 }} component={Link} to="/products" className="shop-now">
							<Group>
								<BiShoppingBag style={{ fontSize: 30 }} />
								SHOP NOW
							</Group>
						</Box>
					</Box>
				</Box>
			</Box>
			<Box>
				<SimpleGrid spacing={0} cols={{ base: 1, md: 3 }}>
					{data.secondary.map((c, i) => (
						<AspectRatio key={i}>
							<BackgroundImage component={Link} to={`/collections/${c.handle}`} className="sec-menu" src={`/assets/primary/${c.handle}.webp`}>
								<Stack style={{ flex: 1, }}>
									<Text ta="center" ff="serif" fw="bold" c="#fff" fz={36}>{c.title}</Text>
								</Stack>
							</BackgroundImage>
						</AspectRatio>
					))}
				</SimpleGrid>
			</Box>
			<AppFooter />
		</>
	);
}
