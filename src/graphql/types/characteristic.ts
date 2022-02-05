import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

import {
    Characteristic as ICharacteristic,
    CharacteristicQuantityAndList as ICharacteristicQuantityAndList,
    MutationCreateCharacteristicArgs as IMutationCreateCharacteristicArgs,
    MutationRemoveCharacteristicArgs as IMutationRemoveCharacteristicArgs,
    MutationUpdateCharacteristicArgs as IMutationUpdateCharacteristicArgs,
    QueryGetCharacteristicArgs as IQueryGetCharacteristicArgs,
    QueryGetCharacteristicsArgs as IQueryGetCharacteristicsArgs
} from '../../graphql';

export default class Characteristic extends QueryUtil{
    static resolver() {
        this.init('characteristic');
        return {
            Query: {
                getCharacteristic: (obj: any, args: IQueryGetCharacteristicArgs): Promise<ICharacteristic> => this.findById(args.id),
                getCharacteristics: (obj: any, args: IQueryGetCharacteristicsArgs): Promise<ICharacteristicQuantityAndList> => {
                    return this.findAllAndCount(null, args?.pagination?.limit, args?.pagination?.offset)
                },
            },
            Mutation: {
                createCharacteristic: async (obj: any, args: IMutationCreateCharacteristicArgs, context: any): Promise<ICharacteristic> => {
                    await this.setAnotherTableForNextRequest('category');
                    await this.findById(args.input!.categoryId);
                    return context.prisma.characteristic.create({
                        data: args.input,
                    });
                },
                updateCharacteristic: async (obj: any, args: IMutationUpdateCharacteristicArgs, context: any): Promise<ICharacteristic> => {
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
                removeCharacteristic: async (obj: any, args: IMutationRemoveCharacteristicArgs, context: any): Promise<ICharacteristic> => {
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
    static typeDefs() {
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
