import { ModuleWithProviders, NgModule } from '@angular/core';
import { DataEngineService } from './data-engine.service';

@NgModule( {
    declarations: [],
    imports     : [],
    exports     : []
} )
export class DataEngineModule {
    static forRoot(): ModuleWithProviders<DataEngineModule> {
        return {
            ngModule : DataEngineModule,
            providers: [ DataEngineService ]
        };
    }
}
