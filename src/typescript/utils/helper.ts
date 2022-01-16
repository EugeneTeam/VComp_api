import { prisma } from "../../config/prismaClient";

export const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) => obj[key];

export class QueryUtil {
    private static tableName: string = '';
    private static table: any = null;
    private static isInit: boolean = false;
    private static tempTable: any = {
        model: null,
        name: null
    };

    static init(tableName: string) {
        this.tableName = tableName
        const table = getKeyValue<any, any>(this.tableName)(prisma);
        if (!table) {
            throw new Error(`Table ${this.tableName} not found`);
        }
        this.isInit = true;
        this.table = table;
    }

    static firstLetterInUppercase = (tableName: string): string => {
        return tableName.replace(/^[a-z]/, (w: string) => w.toUpperCase())
    }

    static checkStatus() {
        if (!this.isInit) {
            throw new Error('First you need to call init(tableName)');
        }
    }

    static async setAnotherTableForNextRequest(tableName: string) {
        const table = await getKeyValue<any, any>(tableName)(prisma);
        if (!table) {
            throw new Error(`Table ${tableName} not found`);
        }
        this.tempTable = {
            model: table,
            name: tableName
        };
    }

    static getActualTable() {
        return this?.tempTable?.model ? this.tempTable.model : this.table;
    }

    static clearTempTable() {
        if (this?.tempTable) {
            this.tempTable = {
                model: null,
                name: null
            };
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static async findById(id: number) {
        this.checkStatus();

        const data = await (this.getActualTable()).findUnique({
            where: { id },
        });

        if (!data) {
            throw new Error(`${this.firstLetterInUppercase(this?.tempTable?.name || this?.tableName)} not found'`);
        }

        this.clearTempTable();
        return data;
    }

    static async checkByField(field: string, value: string, errorIf: boolean) {
        this.checkStatus();
        const data = await (this.getActualTable()).findMany({
            where: {
                [field]: value,
            },
        });

        this.clearTempTable();
        if (!!data?.length !== errorIf) {
            throw new Error(`${ this.firstLetterInUppercase(field) } '${ value }' not found`);
        } else {
            throw new Error(`${ this.firstLetterInUppercase(field) } '${ value }' is used`);
        }
    }

    static async findAllAndCount(options: any = {}, limit: number | null | undefined, offset: number | null | undefined) {
        this.checkStatus();
        const pagination = {
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
