import faker from 'faker';
import {
    GOVERNING_ARTICLE_MANAGER_EMAIL,
    BANNER_MANAGER_EMAIL,
    CUSTOMER_EMAIL,
    MANAGER_EMAIL,
    USER_STATUS,
    ADMIN_EMAIL,
    USER_ROLE,
    EUsers,
    EArticleStatus,
    EBannerPositionX,
    EBannerPositionY
} from '../constants';

const word = () => `${faker.lorem.word()}${Math.random().toString().replace('.', '_')}`;

export const createDataForSignIn = (email: string | null = null, repeatPassword: boolean = true) => {
    const password = faker.internet.password()
    return ({
        fullName: `${faker.name.firstName()} ${faker.name.lastName()} ${faker.name.middleName()}`,
        phone: faker.phone.phoneNumber(),
        city: faker.address.city(),
        email: email ? email : faker.internet.email(),
        password: password,
        ...(repeatPassword ? {repeatPassword: password} : null)
    });
}

export const getInputDataForSignIn = (user: EUsers, rememberMe: boolean = false) => {
    let email = null
    if (user === EUsers.ADMIN) { email = ADMIN_EMAIL; }
    if (user === EUsers.MANAGER) { email = MANAGER_EMAIL; }
    if (user === EUsers.CUSTOMER) { email = CUSTOMER_EMAIL; }
    if (user === EUsers.GOVERNING_ARTICLE_MANAGER) { email = GOVERNING_ARTICLE_MANAGER_EMAIL; }
    if (user === EUsers.BANNER_MANAGER) { email = BANNER_MANAGER_EMAIL; }
    return {
        password: '123456789',
        rememberMe,
        email,
    }
}
export const createDataForCreateOrUpdateUser = (id: number | null = null, repeatPassword: boolean = true) => {
    const part1 = createDataForSignIn(null, repeatPassword);
    return {
        ...(id ? { id } : null),
        ...part1,
        role: USER_ROLE[faker.datatype.number({
            'min': 0,
            'max': 4
        })],
        status: USER_STATUS[faker.datatype.number({
            'min': 0,
            'max': 2
        })]
    }
}

export const createDataForDeliveryService = () => {
    return ({
        name: word(),
        isActive: Math.random() < 0.5,
        info: faker.lorem.text(),
    });
}

export const createDataForArticle = (articleCategoryId: number) => {
    return ({
        source: faker.internet.url(),
        status: Math.random() < 0.5 ? EArticleStatus.HIDDEN : EArticleStatus.VISIBLE,
        image: faker.image.imageUrl(),
        text: faker.lorem.text(),
        articleCategoryId,
        title: faker.name.title(),
    });
}

export const createDataForArticleCategory = (parentId: number | null = null) => {
    return ({
        name: word(),
        parentId: parentId
    })
}

export const createDataForBanner = () => {
    return ({
        page: word(),
        title: word(),
        positionX: [
            EBannerPositionX.LEFT,
            EBannerPositionX.RIGHT,
            EBannerPositionX.MIDDLE
        ]
            [faker.datatype.number({ min: 0, max: 2 })],
        positionY: [
            EBannerPositionY.BOTTOM,
            EBannerPositionY.TOP,
            EBannerPositionY.MIDDLE
        ]
            [faker.datatype.number({ min: 0, max: 2 })],
        html: word(),
    })
}

export const createDataForBannerImage = (bannerId: number | undefined) => {
    return ({
        bannerId,
        imageUrl: faker.image.imageUrl(),
        title: word(),
        productUrl: faker.internet.url(),
    });
}

export const createDataForCategory = (parentId: number | null = null) => {
    return ({
        name: word(),
        parentId
    });
}
