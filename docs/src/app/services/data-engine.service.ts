import { CreateDataEngineServiceProvider } from '@pexlab/ngx-data-engine';

export const DataEngineServiceProvider = CreateDataEngineServiceProvider( {
    a: {
        type      : 'object',
        version   : 0,
        primaryKey: 'id',
        properties: {
            id    : { type: 'string', maxLength: 12 },
            str   : { type: 'string' },
            b_of_a: { type: 'array', ref: 'b', items: { type: 'string' } }
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
} as const );