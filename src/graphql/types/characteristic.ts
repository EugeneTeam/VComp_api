import { gql } from 'apollo-server';
import { QueryUtil } from '../../typescript/utils/helper';

export default class Characteristic extends QueryUtil{
    static resolver() {
        this.init('characteristic');
        return {
            Query: {
                getCharacteristic: (obj: any, args: any) => this.findById(args.id),
                getCharacteristics: (obj: any, args: any) => this.findAllAndCount(null, args?.pagination?.limit, args?.pagination?.offset),
            },
            Mutation: {
                createCharacteristic: async (obj: any, args: any, context: any) => {
                    await this.setAnotherTableForNextRequest('category');
                    await this.findById(args.categoryId);
                    return context.prisma.characteristic.craete({
                        data: args.input,
                    });
                },
                updateCharacteristic: async (obj: any, args: any, context: any) => {
                    await this.findById(args.id);
                    await this.setAnotherTableForNextRequest('category');
                    await this.findById(args.categoryId);
                    return context.prisma.characteristic.update({
                        where: {
                            id: args.id,
                        },
                        data: args.input,
                    });
                },
                removeCharacteristic: async (obj: any, args: any, context: any) => {
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
            }

			type CharacteristiQuantityAndList {
				count: Int
				rows: [Characteristic]
			}
            
            # INPUTS
            
            input CharacteristicInput {
				name: String!
				value: String!
				categoryId: Int!
            }
        `;
    }
}
