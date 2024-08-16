declare class Informer {
    private static _instances: Informer | undefined;
    private informer: HTMLElement | null;
    private informerBody: HTMLElement | null;
    private informerBack: HTMLElement | null;
    private informerClose: HTMLElement | null;
    private btns: HTMLElement[];

    private constructor();

    static getInstances(): Informer;

    private init(): void;

    private initEventListeners(): void;

    private async getInformation(term: string): Promise<void>;

    private updateInformerContent(data: string): void;

    private showInformer(): void;

    private hideInformer(): void;
}
interface Window {
    getUrlParameterByName: (name: string, url?: string) => string | null
    dotsDataLink: string
    cartLink: string
    dots: { [key: string]: unknown }
    addDotToCart: ({ order }: { [key: string]: unknown }) => Promise<boolean>
    initInformers: () => Informer
    informer: Informer
    spinner: {
        hide: () => void
        show: () => void
    }
    terms: Array<string>
}

interface dotsStoreInterface {
    userStatus: "admin" | "manager" | "user" | null
    loading: boolean
    error: Error | unknown
    steps: {[key: string]: Step}
    stepsCount?: Record<string, number>
    products: Products
    totalPrice: number
    totalHeight: number | null
    totalProductList: Product[] | null
    blacklists: string[][]
    titles: {[key: string]: string} | null
    complectCount: number
    hoverImage: string | null
    hoverTitle: string | null
    filters: { [key: string]: { [key: string]: string } } | null
    warning: { isVisible: boolean, fromStepNumber?: number, callbacksObj?: Record<string, unknown[]> }
    isDotInCart: boolean
    customName: undefined | string
    visibleCustomName: boolean
    characteristics: Record<string, Record<string, string>>
    units: Record<string, string>
    combos: Combos
    description: string | undefined | null
    videos: Record<string, string>[] | undefined
    files: Record<string, string>[] | undefined

    fetchDotsInitData: () => void
    getActiveStep: () => void | Step
    getFirstSelectedProductByActiveStep: () => Product | null
    setSelectedProductToStep: (article: string, stepName, stepNumber, selected) => void
    resetSelectedProductsByActiveStep: () => productButton[][] | null
    getAllSelectedProducts: () => {article: string, step: string}[] | null
    updateTotalPrice: () => void
    updateTotalHeight: () => void
    updateTotalProductList: () => void
    getStepByNumber: (stepNumber: number) => Step | null
    toggleStep: (direction: 1 | -1) => void
    unblockProductsByStep: (stepNumber: string) => Steps
    blockProducts: (steps: Steps, article: string, stepName: string, stepNumber: string) => Steps
    getBlackList: (article: string) => string[] | null
    updateComplectCount: (direction: 1 | -1) => void
    getFinalImage: () => string
    getFinalScheme: () => string
    setHoverProduct: (src: string, title: string) => void
    removeHoverProduct: () => void
    resetConfiguration: (fromStepNumber: number) => void
    checkSelectedStepMoreTarget: (stepNumber: number) => boolean
    setSelectedFilterToCurrentStep: (value: string, productProperty: string) => void
    resetSelectedFilterAtStep: (productProperty: string) => void
    toggleVisibleWarning: (direction: boolean, fromStepNumber?: number, callbacksObj?: Record<string, unknown[]> ) => void
    pushDotToCart: () => void,
    updateSelectOptionsMapAndSetAutoSelectedArticle: (productProperty: string) => void
    setAutoSelectedArticle: () => void
    getFilteredActiveStepProducts: (propKey: boolean | string) => productButton[][] | undefined
    showCustomName: (direction: boolean) => void
    setCustomName: (name?: string) => void
    getCharacteristics: () => Record<string, string>
    getResultStepAdditionalData: () => { light_flow?: number, final_image?: string, final_drawing?: string, files?: Record<string, string>[] }
    dispatchStoreActions: (callbacksObj?: Record<string, unknown[]>) => void
    setCurrentStepFilterByAutoSelectFinalArticle: (product: productButton) => Record<string>[]

    [key: string]: unknown
}

interface Steps {
    [key: string]: Step
}

interface Step {
    name: string
    number: number
    active: boolean
    required: boolean
    products: productButton[][]
    isLast: boolean
    selectedFilters?: { [key: string]: string }
    selectOptionsMap?: { [key: string]: null | boolean }
}

interface productButton {
    name: string
    selected: {[key: string]: string | null}
    blocked: {[key: string]: string | null}
    default?: boolean
}

interface Product {
    price?: number
    image?: string
    article?: string
    title?: string
    height_in_assembly?: number
    onStep?: string
    link?: string
    [key: string]: unknown
}

interface Products {
    [key: string]: {
        [key: string]: unknown
    }
}

type Combos = Record<string, Record<string, string[]>
    | Record<string, string>[]
    | string
    | number>[]