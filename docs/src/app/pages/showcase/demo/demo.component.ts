import { Component, OnInit } from '@angular/core';
import { DataEngineService } from '../../../../../../ngx-lib/src/data-engine/data-engine.service';

@Component(
    {
        templateUrl: './demo.component.html',
        styleUrls  : [ './demo.component.scss' ]
    }
)
export class DemoComponent implements OnInit {

    constructor(private dataEngine: DataEngineService) {
        console.log(dataEngine);
    }

    public ngOnInit(): void {
    }
}
