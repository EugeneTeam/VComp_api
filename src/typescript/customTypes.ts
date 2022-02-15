export type ProductView = {
    id: number
    productId: number
    count: number
    createdAt: Date
    updatedAt: Date
}

export type SignInData = {
    city: string
    email: string
    fullName: string
    password: string
    phone: string
    repeatPassword?: string
}

export interface SignInDataFull extends SignInData {
    id?: number | undefined
    role: string
    status: string
}

export type LogInResponse = {
    logIn: {
        token: string
    }
}

export type LogInData = {
    password: string
    rememberMe: boolean
    email: string | null
}

export type ArticleCategory = {
    id: number
    name: string
    parentId: number | null
}

export type Banner = {
    id: number
    page: string
    title: string
    positionX: string
    positionY: string
    html: string
}

export type Category = {
    id: number
    name: string
    parentId: number | null
}

export type Discount = {
    id: number
    type: string
    value: number
    expiredAt: Date
}

export type Gallery = {
    id: number
    name: string
}

export type Product = {
    id: number
    name: string
    description: string
    price: number
    discountId: number | null
    categoryId: number
    galleryId: number | null
    createdAt: Date
    updatedAt: Date
}

export type User = {
    id: number
    fullName: string
    phone: string
    city: string
    email: string
    status: string
    banReason: string | null
    activationToken: string
    passwordHash: string | null
    resetPasswordToken: string | null
    googleId: string | null
    roleId: number
    createdAt: Date
    updatedAt?: Date
}

export type Comment = {
    id: number
    type: string
    rating: number
    description: string
    flaws: string
    dignity: string
    userId: number
    productId: number
    parentId: number | null
}

export type Image = {
    id: number
    name: string
    url: string
    order: number
}
