import { ExtractDocumentTypeFromTypedRxJsonSchema, RxCollection, RxJsonSchema } from '@pexlab/rxdb';
import { Collection } from '../collection';

export type Definition = RxJsonSchema<any>;
export type Document<A extends Definition> = ExtractDocumentTypeFromTypedRxJsonSchema<A>;
export type IntermediateCollection<A> = RxCollection<A>;

export function prepare<ProvidedDefinitions extends Record<string, Definition>>( provided: ProvidedDefinitions ) {
    
    const definitions = provided as {
        [K in keyof ProvidedDefinitions]: ProvidedDefinitions[K];
    };
    
    const documents = provided as {
        [K in keyof ProvidedDefinitions]: Document<typeof definitions[K]>;
    };
    
    const collections = Object.fromEntries( Object.entries( documents ).map( ( [ key, document ] ) => [ key, new Collection( document ) ] ) ) as {
        [K in keyof ProvidedDefinitions]: Collection<typeof documents[K]>
    };
    
    return {
        definition: definitions,
        document  : documents,
        collection: collections
    };
}