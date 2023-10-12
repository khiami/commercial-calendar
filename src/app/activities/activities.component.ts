import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { getISOWeeksInYear } from 'date-fns';
import { generateRandomText, isNil, triggerWindowResize } from '../helpers';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../services/local-storage.service';
import { Subject, finalize, forkJoin, fromEvent, race, switchMap, takeUntil, tap } from 'rxjs';

@Component({
	selector: 'calendar-activities',
	templateUrl: './activities.component.html',
	styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, AfterViewInit, OnDestroy {

	public readonly seasons = [
		'Winter',
		'Spring',
		'Summer',
		'Autumn',
	]
	public readonly months = [
		'January',
		'Feburary',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	public activities?: any[];
	public types?: any[];

	public zoomLevel: number = 0;

	public readonly baseColSize: number = 5 * 16;
	public colSize: number = 5 * 16;

	public year = new Date().getFullYear();
	public weeks = getISOWeeksInYear(new Date());

	constructor(
		private cdr: ChangeDetectorRef,
		private http: HttpClient,
		private storage: LocalStorageService,
		private renderer: Renderer2,
	) {
		this.destroy$ = new Subject();
	}

	async ngOnInit() {

		let zoomFromStorage = this.storage.get('calendar-zoom-level') ?? this.zoomLevel;
		if (!isNil(zoomFromStorage)) zoomFromStorage = +(zoomFromStorage ?? 0);
		if (isNaN(zoomFromStorage)) zoomFromStorage = 0;
		this.zoomLevel = zoomFromStorage;

		// TODO remove when sync with warroom
		await this.loadTypes();
		this.loadData();

		this.zoomChanged(this.zoomLevel);
		this.dragToCreate();
	}

	ngAfterViewInit(): void {
		triggerWindowResize();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private async loadTypes() {
		let res: any = await this.http.get('http://localhost:3015/commercial-calendar-activity-types/?filter=isActive||$eq||true&sort=position,ASC', {
			observe: 'body',
		}).toPromise();

		this.types = res.filter((a: any) => a.isActive);
	}

	private async loadData() {

		// TODO remove when sync with warroom
		let res: any = await this.http.get('http://localhost:3015/commercial-calendar-activities/?filter=calendarId||$eq||1&filter=isActive||$eq||true&sort=position,ASC', {
			observe: 'body',
			headers: {
				'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBlY2NvY3AuY29tIiwicm9sZXMiOlsxLDI0XSwiaWF0IjoxNjk3MTAxMTgxLCJleHAiOjE2OTcxODc1ODF9.hvBgaSAIe_oTFc_9Nmfiv6o1cgcEuW6oWuyQlA7yFZ4',
			}
		}).toPromise();

		let typeIds = this.types?.map(a => a.id);
		this.activities = res.filter((a: any) => typeIds?.includes(a.activityTypeId));

		triggerWindowResize();
	}

	public activityClicked(item: any) {
		console.log('activityClicked ', item);
	}

	public zoomChanged(level: number = 0): void {
		if (level >= 0)
			this.zoomLevel = level;
		this.storage.set('calendar-zoom-level', level);
		this.colSize = this.baseColSize + (this.baseColSize * this.zoomLevel / 10);
		setTimeout(() => this.cdr.markForCheck);
	}

	private destroy$: Subject<void>;

	public dragging: boolean = false;
	private domElements: any[] = [];

	public dragToCreate() {

		let internal$: Subject<void> = new Subject();
		let lastCapturedLeft = 0;
		
		fromEvent(document, 'mousedown')
			.pipe(
				tap((e: any)=> {
					this.cleanup();
					if (e.srcElement?.classList.contains('calendar-placeholder')) {
						let id = generateRandomText();
						let element = this.renderer.createElement('DIV');
						element.id = id;
						element.className = 'calendar-undetermined-element';
						element.style.minWidth = this.colSize + 'px';
	
						lastCapturedLeft = e.screenX;
						this.renderer.appendChild(e.srcElement, element);
						this.domElements.push({
							child: element,
							parent: e.srcElement,
							data: {
								startWeek: +e.srcElement?.dataset.week,
								activityTypeId: +e.srcElement?.dataset.typeId
							}
						});
					}
				}),
				switchMap(()=> 
					fromEvent(document, 'mousemove')
				),
				takeUntil(
					race([
						fromEvent(document, 'mouseup'),
						this.destroy$,
					])
				)
			).subscribe({
				next: (e: any) => {
					console.log('mouse move event ', e);
					this.dragging = true;
					let {child} = this.domElements?.slice().pop()??{};

					if (child) {
						child.style.width = (e.screenX - lastCapturedLeft) + this.colSize + 'px';
					}

				},
				complete: () => {
					internal$.next();
					internal$.complete();
				}
			});

		return forkJoin([ internal$ ]).subscribe(()=> {
			let {child, data} = this.domElements.slice().pop()??{};
			// console.log('mouse released ', child);
			if (child) {
				console.log('create activity with the following', {
					...data,
					endWeek: data.startWeek + Math.ceil(parseInt(window.getComputedStyle(child).width)/this.colSize),
				});
			}

			this.dragging = false;
			lastCapturedLeft = 0;
			this.dragToCreate();
		});
	}

	@HostListener('document:keydown.escape')
	private cleanup() {
		this.domElements?.forEach(item=> {
			this.renderer.removeChild(item.parent, item.child);
		});
		this.domElements = [];
	}

}
