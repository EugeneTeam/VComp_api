export const ADMIN_EMAIL: string = 'admin@gmail.com';
export const MANAGER_EMAIL: string = 'manager@gmail.com';
export const CUSTOMER_EMAIL: string = 'customer@gmail.com';
export const GOVERNING_ARTICLE_MANAGER_EMAIL: string = 'governing.manager@gmail.com';
export const BANNER_MANAGER_EMAIL: string = 'banner.manager@gmail.com';

export const USER_ROLE: Array<string> = [
    'ADMIN',
    'MANAGER',
    'CUSTOMER',
    'GOVERNING_ARTICLES',
    'BANNER_MANAGER',
]

export const USER_STATUS: Array<string> = [
    'ACTIVE',
    'INACTIVE',
    'BANNED',
]

export enum EBannerPositionX {
    LEFT = "LEFT",
    MIDDLE = "MIDDLE",
    RIGHT = "RIGHT"
}

export enum EBannerPositionY {
    TOP = "TOP",
    MIDDLE = "MIDDLE",
    BOTTOM = "BOTTOM"
}
export enum EUsers {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    CUSTOMER = "CUSTOMER",
    GOVERNING_ARTICLE_MANAGER = "GOVERNING_ARTICLE",
    BANNER_MANAGER = "BANNER_MANAGER",
}

export enum EArticleStatus {
    HIDDEN = "HIDDEN",
    VISIBLE = "VISIBLE",
}

export enum ECommentType {
    QUESTION = "QUESTION",
    COMMENT = "COMMENT",
}

export enum EDiscountType {
    VALUE = "VALUE",
    PERCENT = "PERCENT"
}
