import { Component, inject, OnInit } from '@angular/core';
import { DataEngineServiceProvider } from '../../../services/data-engine.service';

@Component(
    {
        templateUrl: './demo.component.html',
        styleUrls  : [ './demo.component.scss' ]
    }
)
export class DemoComponent implements OnInit {
    
    constructor() {
    }
    
    private db = inject( DataEngineServiceProvider );
    
    public async ngOnInit() {
        
        await this.db.a.delete.usingQuery( {} ).plain().asPromise();
        
        await this.db.b.delete.usingQuery( {} ).plain().asPromise();
        
        const createdB = await this.db.b.create( {
            bool: true
        } ).plain().asPromise();
        
        const createdA = await this.db.a.create( {
            str   : 'abc',
            b_of_a: [ createdB.id ]
        } ).plain().asPromise();
        
        const allA = await this.db.a.read.all.plain().asPromise();
        
        for ( let someA of allA ) {
            console.log( 'a', someA.toJSON() );
            console.log( 'b of a', ( await someA.populate( 'b_of_a' ) ).map( ( someB: any ) => someB.toJSON() ) );
        }
    }
}
