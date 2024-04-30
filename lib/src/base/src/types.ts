import { ExtractDocumentTypeFromTypedRxJsonSchema, RxCollection, RxJsonSchema } from '@pexlab/rxdb';
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { getRxStorageFoundationDB } from 'rxdb/plugins/storage-foundationdb';
import { Collection } from './collection';
import { ErrorHandler } from './error.handler';

export type Definition = RxJsonSchema<any>;
export type Definitions = Record<string, Definition>;
export type Document<A extends Definition> = ExtractDocumentTypeFromTypedRxJsonSchema<A>;
export type IntermediateCollection<A> = RxCollection<A>;

export async function inferFromDefinitions<ProvidedDefinitions extends Definitions>(
    definitions: ProvidedDefinitions,
    storage: {
                 type: 'browser'
             } | {
                 type: 'foundationDB',
                 clusterFile: string,
                 apiVersion?: number,
                 batchSize?: number
             },
    errorHandler: ErrorHandler
) {
    
    const inferredDefinitions = definitions as unknown as {
        [K in keyof ProvidedDefinitions]: ProvidedDefinitions[K];
    };
    
    const inferredDocuments = definitions as unknown as {
        [K in keyof ProvidedDefinitions]: Document<typeof inferredDefinitions[K]>;
    };
    
    const inferredIntermediateCollections = definitions as unknown as {
        [K in keyof ProvidedDefinitions]: IntermediateCollection<typeof inferredDocuments[K]>;
    };
    
    const inferredSchema = Object.fromEntries(
        Object.entries( definitions ).map( ( [ key, definition ] ) =>
            [ key, { schema: definition } ]
        )
    ) as unknown as {
        [K in keyof ProvidedDefinitions]: {
            schema: typeof inferredDefinitions[K]
        };
    };
    
    const inferredDatabase = await ( () => {
        switch ( storage.type ) {
            
            case 'browser':
                return createRxDatabase<typeof inferredIntermediateCollections>( {
                    name   : '',
                    storage: getRxStorageDexie()
                } );
            
            case 'foundationDB':
                return createRxDatabase<typeof inferredIntermediateCollections>( {
                    name   : '',
                    storage: getRxStorageFoundationDB( {
                        clusterFile: storage.clusterFile,
                        batchSize  : storage.batchSize ?? 20,
                        apiVersion : storage.apiVersion ?? 620
                    } )
                } );
            
            default:
                throw new Error();
        }
    } )();
    
    const addedCollections = await inferredDatabase.addCollections( inferredSchema );
    
    const inferredCollections = Object.fromEntries( Object.entries( inferredDocuments ).map( ( [ key, document ] ) => [
        key, new Collection( {
            intermediateCollection: addedCollections[ key ],
            errorHandler          : errorHandler
        } )
    ] ) ) as unknown as {
        [K in keyof ProvidedDefinitions]: Collection<typeof inferredDocuments[K]>
    };
    
    return {
        definitions            : inferredDefinitions,
        documents              : inferredDocuments,
        intermediateCollections: inferredIntermediateCollections,
        collections            : inferredCollections,
        database               : inferredDatabase
    };
}