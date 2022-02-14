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
