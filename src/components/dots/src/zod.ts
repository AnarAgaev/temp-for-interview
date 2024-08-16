import { z } from "zod";

export const zodSteps = z.record(
	z.array(
		z.array(
		z.string().or(z.null())
		)
	)
)

export const dotsAPIDataContract = z.object({
	is_admin: z.boolean().optional(),

	steps: zodSteps,

	stepsCount: z.record(
		z.string(),
		z.number()
	).optional(),

	blacklists: z.array(
		z.array(
		z.string()
		)
	),

	titles: z.record(
		z.string()
	),

	filters: z.record(
		z.record(
			z.string()
		)
	).nullable(),

	products: z.record(
		z.record(z.any())
	),

	characteristics: z.record(
		z.string(),
		z.record(
			z.string(),
			z.string()
		)
	),

	units: z.record(
		z.string(),
		z.string()
	).optional(),

	combos: z.array(
		z.record(
			z.string(),
			z.union([
				z.record(
					z.string(),
					z.array(
						z.string()
					)
				),
				z.array(z.record(z.string())),
				z.number(),
				z.string()
			])
		)
	).optional(),

	description: z.union([
		z.string(),
		z.null()
	]).optional(),

	videos: z.array(
		z.record(
			z.string()
		)
	).optional(),

	files: z.array(
		z.record(
			z.string()
		)
	).optional()
})