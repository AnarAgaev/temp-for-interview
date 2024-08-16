export type getOptionListType = (
    current: Record<never>,
    fields: Record<string, Array<{ value: string | number, products: Array<number> }>>,
    field: string,
    id: string,
    isSelected: boolean
) => React.ReactNode[]