import faker from 'faker';

export const createDataForSignIn = (email: string | null = null) => {
    const password = faker.internet.password()
    return ({
        fullName: `${faker.name.firstName()} ${faker.name.lastName()} ${faker.name.middleName()}`,
        phone: faker.phone.phoneNumber(),
        city: faker.address.city(),
        email: email ? email : faker.internet.email(),
        password: password,
        repeatPassword: password,
    });
}
