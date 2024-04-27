import { NgModule } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { GettingStartedComponent } from './pages/getting-started/getting-started.component';
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DemoComponent } from './pages/showcase/demo/demo.component';
import { ShowcaseSidebarComponent } from './pages/showcase/sidebar/showcase-sidebar.component';

@NgModule(
    {
        imports: [
            RouterModule.forRoot(
                [
                    {
                        path     : 'introduction',
                        component: IntroductionComponent,
                        data     : {
                            metaTitle      : 'Introduction to FrontEngine',
                            metaDescription: 'A angular component library which features astonishing components, theming and a vast color palette'
                        }
                    },
                    {
                        path     : 'getting-started',
                        component: GettingStartedComponent,
                        data     : {
                            metaTitle      : 'Getting started with FrontEngine',
                            metaDescription: 'Installing, customizing and making use of FrontEngine'
                        }
                    },
                    {
                        path    : 'showcase',
                        data    : {
                            metaTitle      : 'Showcase of FrontEngine',
                            metaDescription: 'Learn about the components and features of FrontEngine'
                        },
                        children: [
                            {
                                path     : '',
                                component: ShowcaseSidebarComponent,
                                outlet   : 'sidebar'
                            },
                            {
                                path      : '',
                                redirectTo: '/showcase/demo',
                                pathMatch : 'full'
                            },
                            {
                                path     : 'demo',
                                component: DemoComponent
                            }
                        ]
                    },
                    {
                        path    : 'examples',
                        data    : {
                            metaTitle      : 'Examples of FrontEngine in the real world',
                            metaDescription: 'See how FrontEngine could integrate with your existing use-cases'
                        },
                        children: []
                    },
                    {
                        path     : '404',
                        component: NotFoundComponent
                    },
                    {
                        path      : '**',
                        redirectTo: '/introduction'
                    }
                ]
            )
        ],
        exports: [ RouterModule ]
    }
)
export class AppRoutingModule {

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private metaService: Meta
    ) {
        this.router.events.pipe(
            filter( event => event instanceof NavigationEnd ),
            map( () => this.activatedRoute ),
            map( route => {
                while ( route.firstChild ) {
                    route = route.firstChild;
                }
                return route;
            } ),
            filter( route => route.outlet === 'primary' ),
            mergeMap( route => route.data )
        ).subscribe( ( event ) => {
            this.titleService.setTitle( event[ 'metaTitle' ] );
            this.metaService.removeTag( 'name="description"' );
            this.metaService.addTag( { name: 'description', content: event[ 'metaDescription' ] }, false );
        } );
    }
}
