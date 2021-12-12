import {USER_STATUS} from './enums'

interface ITimestamp {
    createdAt: string
    updatedAt: string
}

export interface IDeliveryServices {
    id: number
    name: string
    isActive: boolean
    info: string
}

export interface IPaymentType extends IDeliveryServices {}

export interface ICategory {
    id: number
    name: string
    parentId?: number | null
}

export interface IFavorite {
    id: number
    productId: number
    userId: number
}

export interface IOrder {
    id: number
    paymentTypeId: number
    deliveryServiceId: number
    comment?: string
    callback: boolean
}

export interface IProduct extends ITimestamp{
    id: number
    name: string
    description: string
    price: number
    discountId: number | null
    categoryId: number
    galleryId: number
}

export interface IUser extends ITimestamp{
    id: number
    fullName: string
    phone: string
    city: string
    email: string
    status: USER_STATUS
    banReason?: string
    activationToken: string
    authorizationToken?: string
    resetPasswordToken?: string
    googleId?: string
}
