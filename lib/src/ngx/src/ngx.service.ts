import { inject, InjectionToken } from '@angular/core';
import { Collection, Definitions, Document, inferFromDefinitions } from '@pexlab/base-data-engine';
import { AlertPortalService } from '@pexlab/ngx-front-engine';

class DataEngineService<ProvidedDefinitions extends Definitions> {
    
    constructor(
        private definitions: ProvidedDefinitions,
        private alert: AlertPortalService
    ) {}
    
    private inferred!: Awaited<ReturnType<typeof inferFromDefinitions<typeof this.definitions>>>;
    
    /* Gets resolved via APP_INITIALIZER in the ngModule before the service can be consumed */
    public async initializeService() {
        
        this.inferred = await inferFromDefinitions(
            this.definitions,
            {
                type: 'browser'
            },
            ( error ) => {
                
                if ( !error.scope ) {
                    console.error( error.head, error.body, error.stacktrace );
                    return;
                }
                
                this.alert.emit( error.scope, {
                    type       : 'error',
                    title      : error.head,
                    description: error.body,
                    code       : error.stacktrace
                } );
            }
        );
        
        Object.entries( this.inferred.collections ).forEach( ( [ name, collection ] ) => {
            ( this as any )[ name ] = collection;
        } );
    }
}

export const CreateDataEngineServiceProvider = <ProvidedDefinitions extends Definitions>( definitions: ProvidedDefinitions ) => new InjectionToken(
    'DataEngineService',
    {
        providedIn: 'root',
        factory   : () => {
            
            const alert = inject( AlertPortalService );
            
            const constructor = DataEngineService as
                new (
                    definitions: ProvidedDefinitions,
                    alert: AlertPortalService
                ) =>
                    InstanceType<typeof DataEngineService<ProvidedDefinitions>> &
                    { [key in keyof ProvidedDefinitions]: Collection<Document<ProvidedDefinitions[key]>> };
            
            return new constructor( definitions, alert );
        }
    }
);