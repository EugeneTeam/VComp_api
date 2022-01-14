import { getKeyValue } from "../typescript/utils/helper";
import { schema } from "../graphql/schema";
import { CONSTANTS } from './constants';

const types: any = schema.getTypeMap();

export const parseArgument = (node: any, steps: Array<any> = [], defaultValue: any = null): string => {
    if (node.defaultValue) {
        defaultValue = node.defaultValue.value;
    }

    if (node.type.type) {
        steps.push({
            isOptional: node.type.kind !== 'NonNullType',
            isArray: node.type.kind === 'ListType',
        });
        return parseArgument(node.type, steps, defaultValue);
    }

    let arg = `${ node.type.name.value }`;
    steps.reverse().forEach((item: any) => {
        if (!item.isOptional) {
            arg += '!';
        }
        if (item.isArray) {
            arg = `[${arg}]`;
        }
    });

    if (defaultValue !== null) {
        arg += ` = ${defaultValue}`;
    }

    return arg;
}

export const parseResponse = (
    node: any,
    responseString: string,
    tab: string = '  ',
    removeN: boolean = false
): any => {
    const returnType =
        node?.type?.name?.value ||
        node?.type?.type?.name?.value ||
        node?.type?.type?.type?.name?.value ||
        node?.type?.type?.type?.type?.name?.value;
    const field = node?.name?.value;

    const findType = getKeyValue<any, any>(returnType)(types)?.astNode

    if (!!findType?.fields) {
        responseString += `${ tab }${ field } {\n`;
        findType.fields.forEach((item: any, index: number) => {
            responseString += parseResponse(item, '', `${ tab }${ CONSTANTS.DEFAULT_SPACES }`, findType.fields.length - 1 === index);
        });
        responseString += `\n${ tab }}`;
    } else {
        responseString += `${ tab }${ field }${ removeN ? '' : '\n' }`;
    }
    return responseString;
}

export const getNameForMethod = (value: string) => {
    return `${ value[0].toUpperCase() }${ value.substring(1, value.length) }`;
}

export const getNameForConstant = (value: string) => {
    return value.replace(/[A-Z]/g,(letter: string) => {
        return `_${ letter }`;
    }).toUpperCase();
}
