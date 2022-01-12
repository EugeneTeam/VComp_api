import faker from 'faker';
import {
    GOVERNING_MANAGER_EMAIL,
    BANNER_MANAGER_EMAIL,
    CUSTOMER_EMAIL,
    MANAGER_EMAIL,
    USER_STATUS,
    ADMIN_EMAIL,
    USER_ROLE,
    EUsers
} from '../constants';

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
    if (user === EUsers.GOVERNING_MANAGER) { email = GOVERNING_MANAGER_EMAIL; }
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
        ...(id ? {id} : null),
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
