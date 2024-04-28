import { Inject, Injectable } from '@angular/core';
import { Definition, prepare } from '@pexlab/data-engine';

@Injectable( { providedIn: 'root' } )
export class DataEngineService<ProvidedDefinitions extends Record<string, Definition>> {
    
    constructor(
        @Inject( 'DataEngineMetadata' ) private meta: ReturnType<typeof prepare<ProvidedDefinitions>>
    ) {
        console.log( this.meta.collection );
    }
}