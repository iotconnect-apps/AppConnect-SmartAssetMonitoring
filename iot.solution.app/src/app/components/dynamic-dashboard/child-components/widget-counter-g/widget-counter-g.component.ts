import {  OnInit, OnDestroy, Component, Input, ViewEncapsulation, EventEmitter } from '@angular/core';
import {Subscription} from 'rxjs/Subscription'

@Component({
	selector: 'app-widget-counter-g',
	templateUrl: './widget-counter-g.component.html',
	styleUrls: ['./widget-counter-g.component.css']
})
export class WidgetCounterGComponent implements OnInit,OnDestroy {
	@Input() widget;
	@Input() count;
	@Input() resizeEvent: EventEmitter<any>;
	resizeSub: Subscription;

	constructor(){

	}

	ngOnInit() {
		this.resizeSub = this.resizeEvent.subscribe((widget) => {
		});
	}

	ngOnDestroy() {
		this.resizeSub.unsubscribe();
	}

}
