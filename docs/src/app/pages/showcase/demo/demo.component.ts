import { Component, OnInit } from '@angular/core';
import { DataEngineService } from '../../../../../../ngx-lib/src/data-engine/data-engine.service';
import { definitions } from '../../../definitions';

@Component(
    {
        templateUrl: './demo.component.html',
        styleUrls  : [ './demo.component.scss' ]
    }
)
export class DemoComponent implements OnInit {

    constructor(private dataEngine: DataEngineService<typeof definitions>) {
    }

    public ngOnInit(): void {
    }
}
