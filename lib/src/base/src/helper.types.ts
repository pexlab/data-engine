import { Definitions } from './types';

export function Define<T extends Definitions>( def: T ) {
    return def;
}

export type NullishToUndefined<T> = T extends null | undefined ? undefined :
                                    T extends object ? { [K in keyof T]: NullishToUndefined<T[K]> } : T;

export function NullishToUndefined<T>( value: T ): NullishToUndefined<T> {
    if ( value === null ) {
        return undefined as NullishToUndefined<T>;
    } else if ( typeof value === 'object' ) {
        if ( Array.isArray( value ) ) {
            return value.map( item => NullishToUndefined( item ) ) as unknown as NullishToUndefined<T>;
        } else {
            const transformedObject: any = {};
            for ( const key in value ) {
                transformedObject[ key ] = NullishToUndefined( value[ key ] );
            }
            return transformedObject as NullishToUndefined<T>;
        }
    } else {
        return value as NullishToUndefined<T>;
    }
}

export type NullishToNull<T> = T extends null | undefined ? null :
                               T extends object ? { [K in keyof T]: NullishToNull<T[K]> } : T;

export function NullishToNull<T>( value: T ): NullishToNull<T> {
    if ( value === null ) {
        return null as NullishToNull<T>;
    } else if ( typeof value === 'object' ) {
        if ( Array.isArray( value ) ) {
            return value.map( item => NullishToNull( item ) ) as unknown as NullishToNull<T>;
        } else {
            const transformedObject: any = {};
            for ( const key in value ) {
                transformedObject[ key ] = NullishToNull( value[ key ] );
            }
            return transformedObject as NullishToNull<T>;
        }
    } else {
        return value as NullishToNull<T>;
    }
}