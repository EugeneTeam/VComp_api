import fs from 'fs';

import { schema } from '../graphql/schema';
import { getKeyValue } from '../typescript/utils/helper';
import {
    parseResponse,
    parseArgument,
    getNameForConstant,
    getNameForMethod
} from './utils';
import { CONSTANTS } from './constants';
import ErrnoException = NodeJS.ErrnoException;

const types: any = schema.getTypeMap();
const queries: any = schema?.getQueryType();
const mutations: any = schema?.getMutationType();

const startParse = async (nodes: any, pathToWriteFile: string, query: string): Promise<any> => {
    try {
        for (const item of nodes?.astNode?.fields) {
            const fileName: string = item.name.value;
            let queryString: string = `${ query } ${ getNameForMethod(item.name.value) }`;
            const constName: string = getNameForConstant(item.name.value);

            if (item?.arguments?.length) {
                queryString += '(';
                item.arguments.forEach((arg: any, index: number) => {
                    queryString += `$${ arg.name.value }: `;
                    queryString += parseArgument(arg);

                    if (index !== item.arguments.length - 1) {
                        queryString += ', ';
                    } else {
                        queryString += ')';
                    }
                });
            }

            queryString += ' {\n';
            queryString += `  ${ item.name.value }`;

            if (item?.arguments?.length) {
                queryString += '('
                item.arguments.forEach((arg: any, index: number) => {
                    queryString += `${ arg.name.value }: $${ arg.name.value }`;
                    if (index !== item.arguments.length - 1) {
                        queryString += ', ';
                    } else {
                        queryString += ')';
                    }
                });
            }

            const data: any = getKeyValue<string, any>(
                item?.type?.name?.value ||
                item?.type?.type?.name?.value ||
                item?.type?.type?.type?.name?.value
            )(types).astNode;

            if (data?.fields) {
                queryString += ' {\n';
                data.fields.forEach((item: any, index: number) => {
                    queryString += parseResponse(item, ``, '    ', data.fields.length - 1 === index);
                });
                queryString += '\n  }';
            }
            queryString += '\n}';


            const content: string = `${CONSTANTS.WRAP_IN_GQL ? 'import {gql} from "apollo-server";\n' : ''}export const ${ constName } = ${CONSTANTS.WRAP_IN_GQL ? 'gql' : ''}\`${ queryString }\``;


            await fs.writeFile(`${ pathToWriteFile }/${ fileName }.ts`, content, (error:ErrnoException | null) => {
                if (error) {
                    console.log(error)
                    throw new Error(`File ${ fileName } have problem!`);
                }
            });
        }
    } catch (e) {
        console.error(e);
    }
}

startParse(queries, CONSTANTS.DIRECTORY_PATH_FOR_QUERIES, CONSTANTS.QUERY.QUERY)
    .then(async (): Promise<any> => {
        await startParse(mutations, CONSTANTS.DIRECTORY_PATH_FOR_MUTATIONS, CONSTANTS.QUERY.MUTATION)
            .then((): void => {
                createIndex(CONSTANTS.DIRECTORY_PATH_FOR_MUTATIONS)
                    .then((): any  => createIndex(CONSTANTS.DIRECTORY_PATH_FOR_QUERIES))
            });
    });



const createIndex = async (path: string) => {
    return fs.readdir(path, async (err: ErrnoException | null, files: string[]) => {
        let content: string = '';
        let export_: string = `export {\n`;
        let count: number = 0;
        for (const file of files) {
            if (!file.includes('index')) {
                const clearName: string = file.substring(0, file.lastIndexOf('.'));
                const constName: string = getNameForConstant(clearName);
                content += `import {${ constName }} from './${ clearName }';\n`;
                export_ += `    ${ constName }${ count === files.length - 1 ? '' : ',\n' }`
            }
            count++;
        }
        content += '\n';
        content += export_;
        content += '\n}';

        await fs.writeFile(`${ path }/index.ts`, content, (error: ErrnoException | null) => {
            if (error) {
                console.log(error)
                throw new Error(`File index.ts have problem!`);
            }
        });
    });
}
