import { APP_INITIALIZER, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CreateDataEngineServiceProvider } from './ngx.service';

type Injectable<T> = T extends InjectionToken<infer U> ? U : never;

@NgModule( {
    declarations: [],
    imports     : [],
    exports     : []
} )
export class DataEngineModule {
    static forRoot( config: {
        serviceProvider: ReturnType<typeof CreateDataEngineServiceProvider>;
    } ): ModuleWithProviders<DataEngineModule> {
        return {
            ngModule : DataEngineModule,
            providers: [
                {
                    provide   : APP_INITIALIZER,
                    useFactory: ( service: Injectable<typeof config.serviceProvider> ) => {
                        return () => service.initializeService();
                    },
                    deps      : [ config.serviceProvider ],
                    multi     : true
                }
            ]
        };
    }
}