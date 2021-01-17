import { Component, OnInit } from '@angular/core';
import { AppService, Foo } from 'app/app.service';
import { Resource, ResourceService } from 'app/shared/services/resource.service';


@Component({
    selector: 'foo-details',
    providers: [AppService],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit {

    resources: Resource[] = []
    refreshing: boolean = false;

    constructor(private _resService: ResourceService) { }

    ngOnInit() {
        console.log("construcitn homecponent");
        this._resService.getResources()
            .subscribe(
                data => this.resources = data
            )
    }

    refresh() {
        
        this.refreshing = true;
        this._resService.refreshResource()
            .subscribe(data => {
                this.resources = data;
                this.refreshing = false;

            },
                error => {
                    this.refreshing = false;
                    console.log(error);
                })
    }

}
