import { ModuleWithProviders, NgModule } from '@angular/core';
import { prepare } from '@pexlab/data-engine';
import { DataEngineService } from './data-engine.service';
import { DateEngineServiceOptions } from './data-engine.interface';

@NgModule( {
    declarations: [],
    imports     : [],
    exports     : []
} )
export class DataEngineModule {
    static forRoot( config: DateEngineServiceOptions ): ModuleWithProviders<DataEngineModule> {
        return {
            ngModule : DataEngineModule,
            providers: [
                DataEngineService,
                {
                    provide : 'DataEngineMetadata',
                    useValue: prepare( config.definitions )
                }
            ]
        };
    }
}
