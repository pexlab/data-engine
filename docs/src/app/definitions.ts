import { Define } from '@pexlab/data-engine';

export const definitions = Define( {
    a: {
        type      : 'object',
        version   : 0,
        primaryKey: 'id',
        properties: {
            id : { type: 'string', maxLength: 12 },
            str: { type: 'string' },
            arr: { type: 'array', ref: 'b', items: { type: 'string' } }
        },
        required  : [ 'id', 'str', 'arr' ]
    },
    b: {
        type      : 'object',
        version   : 0,
        primaryKey: 'id',
        properties: {
            id  : { type: 'string', maxLength: 12 },
            bool: { type: 'boolean' }
        },
        required  : [ 'id', 'bool' ]
    }
} );