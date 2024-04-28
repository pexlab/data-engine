import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeModule, FeRootModule, MarkdownComponent } from '@pexlab/ngx-front-engine';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { DataEngineModule } from '../../../ngx-lib/src/data-engine/data-engine.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { definitions } from './definitions';
import { GettingStartedComponent } from './pages/getting-started/getting-started.component';
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DemoComponent } from './pages/showcase/demo/demo.component';
import { ShowcaseSidebarComponent } from './pages/showcase/sidebar/showcase-sidebar.component';

@NgModule(
    {
        
        declarations: [
            AppComponent,
            NotFoundComponent,
            DemoComponent,
            IntroductionComponent,
            GettingStartedComponent,
            ShowcaseSidebarComponent
        ],
        
        imports: [
            
            BrowserModule,
            BrowserAnimationsModule,
            
            AngularSvgIconModule.forRoot(),
            
            AppRoutingModule,
            BrowserAnimationsModule,
            HttpClientModule,
            FeModule.forRoot(),
            FeRootModule,
            MarkdownComponent,
            
            DataEngineModule.forRoot( { definitions } )
        ],
        
        providers: [],
        
        bootstrap: [
            AppComponent
        ]
    }
)

export class AppModule {}
