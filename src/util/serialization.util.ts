export function serializeBigInt(value: any): any {
    if (typeof value === 'bigint') {
        return value.toString();
    } else if (typeof value === 'object') {
        for (const key in value) {
            value[key] = serializeBigInt(value[key]);
        }
    }
    return value;
}