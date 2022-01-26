export const ADMIN_EMAIL = 'admin@gmail.com';
export const MANAGER_EMAIL = 'manager@gmail.com'
export const CUSTOMER_EMAIL = 'customer@gmail.com'
export const GOVERNING_ARTICLE_MANAGER_EMAIL = 'governing.manager@gmail.com'
export const BANNER_MANAGER_EMAIL = 'banner.manager@gmail.com'

export const USER_ROLE = [
    'ADMIN',
    'MANAGER',
    'CUSTOMER',
    'GOVERNING_ARTICLES',
    'BANNER_MANAGER',
]

export const USER_STATUS = [
    'ACTIVE',
    'INACTIVE',
    'BANNED',
]

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
