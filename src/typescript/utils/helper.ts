import { prisma } from "../../config/prismaClient";

export const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) => obj[key];

export class QueryUtil {
    static tableName: string = '';
    static table: any = null;
    static isInit: boolean = false;
    static tempTable: any = {
        model: null,
        name: null
    };

    static init(tableName: string): void {
        this.tableName = tableName
        const table: any = getKeyValue<any, any>(this.tableName)(prisma);
        if (!table) {
            throw new Error(`Table ${this.tableName} not found`);
        }
        this.isInit = true;
        this.table = table;
    }

    static firstLetterInUppercase = (tableName: string): string => {
        return tableName.replace(/^[a-z]/, (w: string) => w.toUpperCase())
    }

    static checkStatus(): void {
        if (!this.isInit) {
            throw new Error('First you need to call init');
        }
    }

    static async setAnotherTableForNextRequest(tableName: string): Promise<void> {
        const table: any = await getKeyValue<any, any>(tableName)(prisma);
        if (!table) {
            throw new Error(`Table ${tableName} not found`);
        }
        this.tempTable = {
            model: table,
            name: tableName
        };
    }

    static getActualTable(): any {
        return this?.tempTable?.model ? this.tempTable.model : this.table;
    }

    static clearTempTable(): void {
        if (this?.tempTable) {
            this.tempTable = {
                model: null,
                name: null
            };
        }
    }

    static async findById(id: number): Promise<any> {
        this.checkStatus();

        const data: any = await (this.getActualTable()).findUnique({
            where: { id },
        });

        if (!data) {
            throw new Error(`${this.firstLetterInUppercase(this?.tempTable?.name || this?.tableName)} not found`);
        }

        this.clearTempTable();
        return data;
    }

    static async errorIfExists(where: any, errorMsg: string): Promise<void> {
        this.checkStatus();
        const data: any = await (this.getActualTable()).findMany({ where });
        if (data?.length) {
            throw new Error(errorMsg);
        }
        this.clearTempTable();
    }

    static async errorIfNotCreated(where: any, errorMsg: string): Promise<void> {
        this.checkStatus();
        const data: any = await (this.getActualTable()).findMany({ where });
        if (!data?.length) {
            throw new Error(errorMsg);
        }
        this.clearTempTable();
    }

    static async findAllAndCount(options: any = {}, limit: number | null | undefined, offset: number | null | undefined): Promise<any> {
        this.checkStatus();
        const pagination: any = {
            ...(limit ? { take: limit } : null),
            ...(offset ? { skip: offset } : null),
        };

        const count: any = await (this.getActualTable()).aggregate({
            _count: {
                id: true,
            },
            ...options,
        });

        const dataList: Array<any> = await (this.getActualTable()).findMany({
            ...pagination,
            ...options,
        });

        this.clearTempTable();
        return {
            count: count?._count.id,
            rows: dataList,
        };
    }
}
