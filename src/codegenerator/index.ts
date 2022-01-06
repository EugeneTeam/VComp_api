import fs from 'fs';

import {schema} from '../graphql/schema';
import {getKeyValue} from '../typescript/utils/helper';
import {
    parseResponse,
    parseArgument,
    getNameForConstant,
    getNameForMethod
} from './utils';
import {CONSTANTS} from './constants';
import ErrnoException = NodeJS.ErrnoException;
import exp from "constants";

const types: any = schema.getTypeMap();
const queries: any = schema?.getQueryType();
const mutations: any = schema?.getMutationType();

const startParse = async (nodes: any, pathToWriteFile: string, query: string) => {
    try {
        for (const item of nodes?.astNode?.fields) {
            const fileName = item.name.value;
            let queryString = `${query} ${getNameForMethod(item.name.value)}`;
            const constName = getNameForConstant(item.name.value);

            if (item?.arguments?.length) {
                queryString += '(';
                item.arguments.forEach((arg: any, index: number) => {
                    queryString += `$${arg.name.value}: `;
                    queryString += parseArgument(arg);

                    if (index !== item.arguments.length - 1) {
                        queryString += ', ';
                    } else {
                        queryString += ')';
                    }
                });
            }

            queryString += ' {\n';
            queryString += `  ${item.name.value}`;

            if (item?.arguments?.length) {
                queryString += '('
                item.arguments.forEach((arg: any, index: number) => {
                    queryString += `${arg.name.value}: $${arg.name.value}`;
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
                data.fields.forEach((item: any) => {
                    queryString += parseResponse(item, ``, '    ');
                });
                queryString += '\n  }';
            }
            queryString += '\n}';


            const content = `${CONSTANTS.WRAP_IN_GQL ? 'import {gql} from "apollo-server";\n' : ''}export const ${constName} = ${CONSTANTS.WRAP_IN_GQL ? 'gql' : ''}\`${queryString}\``;


            await fs[CONSTANTS.REWRITE_FILE ? 'writeFile' : 'appendFile'](`${pathToWriteFile}/${fileName}.ts`, content, (error:ErrnoException | null) => {
                if (error) {
                    console.log(error)
                    throw new Error(`File ${fileName} have problem!`);
                }
            });
        }
    } catch (e) {
        console.error(e);
    }
}

startParse(queries, CONSTANTS.DIRECTORY_PATH_FOR_QUERIES, CONSTANTS.QUERY.QUERY)
    .then(async () => {
        await startParse(mutations, CONSTANTS.DIRECTORY_PATH_FOR_MUTATIONS, CONSTANTS.QUERY.MUTATION)
            .then(() => {
                createIndex(CONSTANTS.DIRECTORY_PATH_FOR_MUTATIONS)
                    .then(() => createIndex(CONSTANTS.DIRECTORY_PATH_FOR_QUERIES))
            });
    });



const createIndex = async (path: string) => {
    return fs.readdir(path, async (err: ErrnoException | null, files: string[]) => {
        let content = '';
        let export_ = `export {\n`;
        let count: number = 0;
        for (const file of files) {
            if (!file.includes('index')) {
                const clearName = file.substring(0, file.lastIndexOf('.'));
                const constName = getNameForConstant(clearName);
                content += `import {${constName}} from './${clearName}';\n`;
                export_ += `    ${constName}${count === files.length - 1 ? '' : ',\n'}`
            }
            count++;
        }
        content += '\n';
        content += export_;
        content += '\n}';

        await fs[CONSTANTS.REWRITE_FILE ? 'writeFile' : 'appendFile'](`${path}/index.ts`, content, (error:ErrnoException | null) => {
            if (error) {
                console.log(error)
                throw new Error(`File index.ts have problem!`);
            }
        });
    });
}
