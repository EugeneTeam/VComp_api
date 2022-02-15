import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

import {
    Characteristic as TCharacteristic,
    CharacteristicQuantityAndList as TCharacteristicQuantityAndList,
    MutationCreateCharacteristicArgs as TMutationCreateCharacteristicArgs,
    MutationRemoveCharacteristicArgs as TMutationRemoveCharacteristicArgs,
    MutationUpdateCharacteristicArgs as TMutationUpdateCharacteristicArgs,
    QueryGetCharacteristicArgs as TQueryGetCharacteristicArgs,
    QueryGetCharacteristicsArgs as TQueryGetCharacteristicsArgs
} from '../../graphql';

export default class Characteristic extends QueryUtil{
    static resolver(): any {
        this.init('characteristic');
        return {
            Query: {
                getCharacteristic: (obj: any, args: TQueryGetCharacteristicArgs): Promise<TCharacteristic> => {
                    return this.findById(args.id);
                },
                getCharacteristics: (obj: any, args: TQueryGetCharacteristicsArgs): Promise<TCharacteristicQuantityAndList> => {
                    return this.findAllAndCount(null, args?.pagination?.limit, args?.pagination?.offset);
                },
            },
            Mutation: {
                createCharacteristic: async (obj: any, args: TMutationCreateCharacteristicArgs, context: any): Promise<TCharacteristic> => {
                    await this.setAnotherTableForNextRequest('category');
                    await this.findById(args.input!.categoryId);
                    return context.prisma.characteristic.create({
                        data: args.input,
                    });
                },
                updateCharacteristic: async (obj: any, args: TMutationUpdateCharacteristicArgs, context: any): Promise<TCharacteristic> => {
                    await this.findById(args.id);
                    await this.setAnotherTableForNextRequest('category');
                    await this.findById(args.input!.categoryId);
                    return context.prisma.characteristic.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeCharacteristic: async (obj: any, args: TMutationRemoveCharacteristicArgs, context: any): Promise<TCharacteristic> => {
                    await this.findById(args.id);
                    return context.prisma.characteristic.delete({
                        where: {
                            id: args.id,
                        },
                    });
                },
            },
        }
    }
    static typeDefs(): object {
        return gql`
            
            # TYPES
            
            type Characteristic {
                id: Int!
                name: String!
                value: String!
                categoryId: Int!
                url: String
            }

			type CharacteristicQuantityAndList {
				count: Int
				rows: [Characteristic]
			}
            
            # INPUTS
            
            input CharacteristicInput {
				name: String!
				value: String!
				categoryId: Int!
                url: String
            }
        `;
    }
}
