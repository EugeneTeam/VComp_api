import {getKeyValue} from "../../typescript/utils/helper";

export const compareObjects = (obj1: any, obj2: any) => {
    Object.keys(obj1).forEach((field: any) => {
        expect(getKeyValue<string, any>(field)(obj1))
            .toBe(getKeyValue<string, any>(field)(obj2));
    });
}
