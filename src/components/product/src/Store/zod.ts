import { z } from 'zod'

const zodProduct = z.object({
	article: z.string().optional(),
	price: z.number().optional(),
	image: z.string().optional(),
	color: z.string().optional(),
	colorful_temperature: z.number().optional(),
	light_flow: z.number().optional(),
	power: z.number().optional(),
	angle_of_light: z.number().optional(),
	brightness_adjustment: z.boolean().optional(),
	sale: z.union([z.boolean(), z.number(), z.string()]),

	stock: z.union([
		z.null(), z.number()
	]).optional(),

	drawings: z.union([
		z.array(z.string()),
		z.null()
	]).optional(),

	description: z.union([
		z.string(),
		z.null()
	])
})

export const productAPIDataContract = z.object({
	is_admin: z.boolean().optional(),

	data: z.object({
		title: z.string(),

        alias: z.string().optional(),

		gallery: z.array(z.string()),

        products_available: z.array(zodProduct),

		fields: z.record(z.string(), z.array(z.object({
			value: z.union([z.string(), z.number()]),
			products: z.array(z.number())
		}))),

        translate: z.record(z.string()),

        units: z.record(z.string()),

        videos: z.union([
			z.array(z.record(z.string())),
			z.null()
		]),

        description: z.union([
			z.string(),
			z.null()
		]),

		files: z.union([
			z.array(z.object({
				id: z.number(),
				url: z.string(),
				name: z.string()
			})),
			z.null()
		]),

        badges: z.union([
			z.array(z.string()),
			z.null()
		]),

		specifications: z.union([
			z.record(z.string()),
			z.null()
		]),

		characteristics: z.array(z.string()).optional()
	})
})
