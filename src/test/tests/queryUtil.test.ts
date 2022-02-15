import faker from "faker";
import { compareObjects } from '../utils/helper';
import { prisma } from "../../config/prismaClient";
import { QueryUtil } from '../../typescript/utils/helper'

describe('Test QueryUtil', function() {
    it('Return error when trying to call a method without initialization', async function () {
        try {
            const test = class Test extends QueryUtil {
                static resolver() {
                    return {
                        Mutation: {
                            someAction: () => {
                                return this.findById(1);
                            },
                        },
                    };
                };
            };

            await test.resolver().Mutation.someAction();
            throw new Error('***');
        } catch (e: any) {
            expect(e.message).toEqual('First you need to call init')
        }
    });

    it('Correct work of the method findById', async function () {
        const someEntry: any = await prisma.articleCategory.findFirst();
        const test = class Test extends QueryUtil {
            static resolver() {
                this.init('articleCategory');
                return {
                    Mutation: {
                        someAction: () => {
                            return this.findById(someEntry.id);
                        },
                    },
                };
            };
        };

        const foundEntry = await test.resolver().Mutation.someAction();
        compareObjects(someEntry, foundEntry);
    });

    it('Correct work of the method findAllAndCount', async function () {
        const test = class Test extends QueryUtil {
            static resolver() {
                this.init('articleCategory');
                return {
                    Mutation: {
                        someAction: () => {
                            return this.findAllAndCount(null, null,null);
                        },
                    },
                };
            };
        };

        const foundEntry = await test.resolver().Mutation.someAction();

        expect(foundEntry).toHaveProperty('count');
        expect(foundEntry.count).toBeGreaterThan(0);
        expect(foundEntry).toHaveProperty('rows');
        expect(Array.isArray(foundEntry.rows)).toBe(true);
    });

    it('Correct work of the method setAnotherTableForNextRequest', async function () {
        const someEntry: any = await prisma.category.findFirst();
        const test = class Test extends QueryUtil {
            static resolver() {
                this.init('articleCategory');
                return {
                    Mutation: {
                        someAction: async () => {
                            await this.setAnotherTableForNextRequest('category');
                            return this.findById(someEntry.id);
                        },
                    },
                };
            };
        };

        const foundEntry = await test.resolver().Mutation.someAction();
        compareObjects(someEntry, foundEntry);
        expect(test.tableName).toBe('articleCategory')
    });

    it('The errorIfExists method will return an error', async function () {
        try {
            const someEntry: any = await prisma.category.findFirst();
            const test = class Test extends QueryUtil {
                static resolver() {
                    this.init('category');
                    return {
                        Mutation: {
                            someAction: async () => {
                                return this.errorIfExists({
                                    id: someEntry.id,
                                }, 'Entry is exists');
                            },
                        },
                    };
                };
            };
            const foundEntry = await test.resolver().Mutation.someAction();
            compareObjects(someEntry, foundEntry);
            throw new Error('***');
        } catch (e: any) {
            expect(e.message).toEqual('Entry is exists')
        }
    });

    it('The errorIfExists method will not return an error', async function () {
        const someEntries: any = await prisma.category.findMany();
        const test = class Test extends QueryUtil {
            static resolver() {
                this.init('category');
                return {
                    Mutation: {
                        someAction: async () => {
                            return this.errorIfExists({
                                id: someEntries[someEntries.length - 1].id + 1,
                            }, 'Entry is exists');
                        },
                    },
                };
            };
        };
        await test.resolver().Mutation.someAction();
        expect(true).toBe(true);
    });

    it('The errorIfNotCreated method will not return an error', async function () {
        const someEntry: any = await prisma.category.findFirst();
        const test = class Test extends QueryUtil {
            static resolver() {
                this.init('category');
                return {
                    Mutation: {
                        someAction: async () => {
                            return this.errorIfNotCreated({
                                id: someEntry.id,
                            }, 'Entry is exists');
                        },
                    },
                };
            };
        };
        await test.resolver().Mutation.someAction();
        expect(true).toBe(true);
    });

    it('The errorIfExists method will return an error', async function () {
        try {
            const someEntries: any = await prisma.category.findMany();
            const test = class Test extends QueryUtil {
                static resolver() {
                    this.init('category');
                    return {
                        Mutation: {
                            someAction: async () => {
                                return this.errorIfNotCreated({
                                    id: someEntries[someEntries.length - 1].id + 1,
                                }, 'Entry not found');
                            },
                        },
                    };
                };
            };
            await test.resolver().Mutation.someAction();
            throw new Error('***');
        } catch (e: any) {
            expect(e.message).toEqual('Entry not found')
        }
    });

    it('Initialization will return an error due to invalid table name', async function () {
        const tableName = faker.lorem.word().replace(/[ ]/g, '');
        try {
            const someEntry: any = await prisma.category.findFirst();
            const test = class Test extends QueryUtil {
                static resolver() {
                    this.init(tableName);
                    return {
                        Mutation: {
                            someAction: async () => {
                                return this.errorIfExists({
                                    id: someEntry.id,
                                }, 'Entry is exists');
                            },
                        },
                    };
                };
            };
            await test.resolver().Mutation.someAction();
            throw new Error('***');
        } catch (e: any) {
            expect(e.message).toEqual(`Table ${tableName} not found`)
        }
    });

    it('Correct work of the method firstLetterInUppercase', async function () {
        const tableName = faker.lorem.word().replace(/[ ]/g, '');
        const test = class Test extends QueryUtil {
            static resolver() {
                this.init('articleCategory');
                return {
                    Mutation: {
                        someAction: () => {
                            return this.firstLetterInUppercase(tableName);
                        },
                    },
                };
            };
        };

        const result = await test.resolver().Mutation.someAction();
        expect(/[A-Z]/.test(result[0])).toBe(true);
    });

    it('The setAnotherTableForNextRequest method will not return an error', async function () {
        const tableName = faker.lorem.word().replace(/[ ]/g, '');
        try {
            const test = class Test extends QueryUtil {
                static resolver() {
                    this.init('articleCategory');
                    return {
                        Mutation: {
                            someAction: async () => {
                                await this.setAnotherTableForNextRequest(tableName);
                            },
                        },
                    };
                };
            };

            await test.resolver().Mutation.someAction();
            throw new Error('***');
        } catch (e: any) {
            expect(e.message).toEqual(`Table ${tableName} not found`)
        }
    });

    it('The findById method will return an error', async function () {
        try {
            const someEntries: any = await prisma.articleCategory.findMany();
            const test = class Test extends QueryUtil {
                static resolver() {
                    this.init('articleCategory');
                    return {
                        Mutation: {
                            someAction: () => {
                                return this.findById(someEntries[someEntries.length - 1].id + 1);
                            },
                        },
                    };
                };
            };

            await test.resolver().Mutation.someAction();
            throw new Error('***');
        } catch (e: any) {
            expect(e.message).toEqual(`ArticleCategory not found`);
        }
    });
});
