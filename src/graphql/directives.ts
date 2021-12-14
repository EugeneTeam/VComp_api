import {defaultFieldResolver, GraphQLFieldConfig, GraphQLResolveInfo, GraphQLSchema} from "graphql/index";
import {getDirective, MapperKind, mapSchema} from "@graphql-tools/utils";

export const roleDirective = (schema: GraphQLSchema) => {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig: GraphQLFieldConfig<any, any>) => {
            const permissionDirective = getDirective(schema, fieldConfig, "hasRole")?.[0];
            if (permissionDirective) {
                const {resolve = defaultFieldResolver} = fieldConfig;
                fieldConfig.resolve = async (source: any, args: any, context: any, info: GraphQLResolveInfo) => {
                    if (context?.user?.role?.name !== permissionDirective?.role) {
                        throw new Error('Access denied');
                    }
                    return await resolve(source, args, context, info);
                }
                return fieldConfig;
            }
        }
    })
}

export const authDirective = (schema: GraphQLSchema) => {
    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig: GraphQLFieldConfig<any, any>) => {
            const permissionDirective = getDirective(schema, fieldConfig, "auth")?.[0];
            if (permissionDirective) {
                const {resolve = defaultFieldResolver} = fieldConfig;
                fieldConfig.resolve = async (source: any, args: any, context: any, info: GraphQLResolveInfo) => {
                    if (!context?.user) {
                        throw new Error('Please authorize!');
                    }
                    return await resolve(source, args, context, info);
                }
                return fieldConfig;
            }
        }
    })
}
