interface productInterface {
    article?: string
    price?: number
    image?: string
    color?: string
    colorful_temperature?: number
    light_flow?: number
    power?: number
    angle_of_light?: number
    brightness_adjustment?: boolean
    stock?: null | number
    drawings?: Array<string> | null
    description?: string | TrustedHTML | null
    sale?: boolean | number | string
    [key: string]: unknown
}

interface Cart {
    dots?: Record<string, unknown>[]
    products?: {
        article: string,
        price: number,
        count: number,
        [key: string]: unknown }[]
}

interface productStoreInterface {
    series: {
        title: string
        alias?: string
        gallery: string[]
        products_available: productInterface[]
        fields: Record<string, Array<{ value: string | number, products: Array<number> }>>
        translate: Record<string, string>
        videos: {[key: string]: string}[] | null
        description: string | null
        files: {
            id: number,
            url: string,
            name: string
        }[] | null
        badges: string[] | null
        units: Record<string, string>
        specifications: { [key: string]: string } | null
        characteristics?: Array<string>
    }

    current: productInterface
    loading: boolean
    error: Error | unknown
    selectsMap: productInterface
    userStatus: "admin" | "manager" | "user" | null

    fetchProductInitData: () => void
    setInitProduct: () => void
    updateProduct: (field: string, val: number | string | boolean | undefined) => void

    cart: Cart
    updateCart: (cart: Cart) => void
    setCountInCart: (article: string, newCount: number) => void
    updateProductCountInRemoteCart: (article: string, count: number) => void

    count: number
    setCount: (count: number) => void
}