import {USER_STATE} from './enums'

interface ITimestamp {
    createdAt: String
    updatedAt: String
}

export interface IDeliveryServices {
    id: Number
    name: String
    isActive: Boolean
    info: String
}

export interface IPaymentType extends IDeliveryServices {}

export interface ICategory {
    id: Number
    name: String
    parentId?: Number | null
}

export interface IFavorite {
    id: Number
    productId: Number
    userId: Number
}

export interface IOrder {
    id: Number
    paymentTypeId: Number
    deliveryServiceId: Number
    comment?: String
    callback: Boolean
}

export interface IProduct extends ITimestamp{
    id: Number
    name: String
    description: String
    price: Number
    discountId: Number | null
    categoryId: Number
    galleryId: Number
}

export interface IUser extends ITimestamp{
    id: Number
    phone: String
    city: String
    email: String
    state: USER_STATE
    banReason?: String
    activationToken: String
    authorizationToken?: String
    resetPasswordToken?: String
    googleId?: String
}
