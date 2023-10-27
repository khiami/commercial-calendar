import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	OnDestroy,
	OnInit,
	QueryList,
	Renderer2,
	ViewChildren,
} from '@angular/core';
import { format, getISOWeeksInYear } from 'date-fns';

import {
	DialogAction,
	DialogCloseResult,
	DialogService,
} from '@progress/kendo-angular-dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CommercialCalendarActivity } from 'src/app/data/commercial-calendar-activity/commercial-calendar-activity.model';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, fromEvent, race, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { CalendarUiService } from './services/calendar-ui.service';
import { CommercialCalendar } from 'src/app/data/commercial-calendar/commercial-calendar.model';
import { orderBy } from '@progress/kendo-data-query';
import { CommercialCalendarActivityComponent } from './commercial-calendar-activity/commercial-calendar-activity.component';
import { CssVarService } from '../services/css-var.service';
import { LocalStorageService } from '../services/local-storage.service';
import { cap, generateRandomText, getDateOfIsoWeek, getInteger, isNil, ngForTrackByFn, readVerticalOverlapFor, triggerWindowResize } from '../helpers';
import { CommercialCalendarActivityService } from '../data/commercial-calendar-activity/commercial-calendar-activity.service';
import { HttpClient } from '@angular/common/http';

@UntilDestroy()
@Component({
	selector: 'commercial-calendar',
	templateUrl: './commercial-calendar.component.html',
	styleUrls: ['./commercial-calendar.component.scss'],
})
export class CommercialCalendarComponent
	implements OnInit, AfterViewInit, OnDestroy {
	// default
	public year: number = new Date().getFullYear();
	public weeks: number = getISOWeeksInYear(new Date());
	public seasons = ['Winter', 'Spring', 'Summer', 'Autumn'];

	public months: string[] = [];

	public startAtWeek: number = 1;
	public startAtMonth: number = 0;
	public trackByIndex: any = ngForTrackByFn();

	public calendar!: CommercialCalendar;
	public activities: CommercialCalendarActivity[] = [];

	public zoomLevel: number = 2;
	private calendarId: number = 0

	public readonly rowGap: number = 16 * 0.25;
	public readonly baseColSize: number = 5 * 16;
	public colSize: number = 5 * 16;

	public isAdmin: boolean = true;
	public canClone: boolean = true;
	public dragging: boolean = false;
	public showScrollbars: boolean = false;
	public stickyTypes: boolean = false;

	private destroy$: Subject<void>;
	private domElements: any[] = [];

	@ViewChildren('items', { read: ElementRef }) items?: QueryList<CommercialCalendarActivityComponent>;

	constructor(
		private cdr: ChangeDetectorRef,
		private storage: LocalStorageService,
		// private dialogService: DialogService,
		private route: ActivatedRoute,
		private renderer: Renderer2,
		public calendarUiService: CalendarUiService,
		private cssVarService: CssVarService,
		private http: HttpClient,
	) {
		this.destroy$ = new Subject();
	}

	async ngOnInit() {

		this.zoomLevel = getInteger(
			this.storage.get('calendar-zoom-level'),
			this.zoomLevel,
		);
		this.showScrollbars = true;
		this.stickyTypes = false;
		this.startAtWeek = 1;

		this.calendarId = +this.route.snapshot.params['id'];
		await this.onLoadData();

		if (this.isAdmin) this.dragToCreate();

		this.calendarUiService.stackedDoms$
			.pipe(untilDestroyed(this))
			.subscribe(doms => {
				let domIds = [...new Set(doms)].map((a) => +a);

				let items = domIds.map((id) => {
					let element = document.querySelector(`.activity-${id}`);
					let activity = this.activities.find((a) => a.id == id);

					return {
						id,
						element,
						activityIdsInSameWeek: this.activities.filter((a) => a.startWeek == activity?.startWeek),
						...(element?.getBoundingClientRect().toJSON() ?? {}),
					};
				})

				items = orderBy(items.slice(), [
					{ field: 'y', dir: 'asc' },
					{ field: 'x', dir: 'asc' },
				]);

				// console.log('stacked doms ', items.map(a=> a.id));

				for (let i = 1; i < items?.length; i++) {
					let prev = items[i - 1];

					let current = items[i];
					let margin = this.rowGap;
					let element: HTMLElement = current.element;
					let overlapped: number = getInteger(element?.getAttribute('data-overlapped'), 0);

					if (prev.element && current.element) {
						margin += prev.height;

						if (overlapped == 0) {
							// shift vertically
							let bound = readVerticalOverlapFor(element, prev.element);
							let min = Math.min.apply(null, bound.map((b) => Math.abs(b)));
							if (min >= this.rowGap) margin += min;
							++overlapped;
						}

						if (overlapped >= 5) overlapped = 0;

						this.renderer.setStyle(element, 'marginTop', cap(margin, 0) + 'px');
						this.renderer.setAttribute(element, 'data-overlapped', overlapped + '');
					}
				}
			});
	}

	ngAfterViewInit(): void {
		this.zoomChanged(this.zoomLevel);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	public async forceUIRefresh() {
		this.removeMargins();
		await this.onLoadData();
	}

	private removeMargins() {
		let items = this.items?.toArray();
		if (items?.length) {
			items.forEach((item: any) => {
				try {
					let current = item.nativeElement;
					current.style.marginTop = 0 + '';
					current.dataset.overlapped = 0 + '';
				} catch (e) { }
			});
		}
	}

	public async onLoadData() {
		await this.loadCalendar();
		await this.loadActivityList();

		this.year = this.setCalendarYear();
		this.weeks = getISOWeeksInYear(new Date(`1 1 ${this.year}`));
		this.months = this.getCalendarMonths();
		this.startAtMonth = getDateOfIsoWeek(
			this.startAtWeek + 1,
			this.year,
		).getMonth();
		setTimeout(() => triggerWindowResize(), 500);
	}

	private baseUrl: string = 'http://localhost:4200/api';

	private async loadCalendar() {
		let res = await this.http.get(this.baseUrl + '/commercial-calendars/' + +this.calendarId, {
			observe: 'body',
			headers: {
				'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBlY2NvY3AuY29tIiwicm9sZXMiOlsxXSwiaWF0IjoxNjk4MzkzNjgxLCJleHAiOjE2OTg0ODAwODF9.aJPxVzBS3Jki-N5oqcfETFK3GW0gh2Q10_viZfbvQBI`,
			}
		}).toPromise() as CommercialCalendar;

		this.calendar = {
			...res,
			types: orderBy(res.types?.filter((a) => a.isActive) ?? [], [
				{ field: 'position', dir: 'asc' },
			]),
		};
	}

	private async loadActivityList() {
		const typeIds = this.calendar?.types?.map((a) => a.id);
		const res: any = await this.http.get(this.baseUrl + '/commercial-calendar-activitys/' + `?filter=calendarId||$eq||${this.calendarId}&filter=isActive||$eq||true&sort=position,ASC`, {
			observe: 'body',
			headers: {
				'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBlY2NvY3AuY29tIiwicm9sZXMiOlsxXSwiaWF0IjoxNjk4MzkzNjgxLCJleHAiOjE2OTg0ODAwODF9.aJPxVzBS3Jki-N5oqcfETFK3GW0gh2Q10_viZfbvQBI`,
			}
		}).toPromise();
		this.activities = res.filter((a: any) => typeIds?.includes(a.activityTypeId));
	}

	public onActivityClick(item: any) {
		console.log('onActivityClick');
		// this.dsUi.showProductDetailsDialog(item);
	}

	public zoomChanged(level: number, opts?: any): void {
		let isChanged = level !== this.zoomLevel;
		if (level >= 0) this.zoomLevel = level;
		this.storage.set('calendar-zoom-level', level);

		this.colSize =
			this.baseColSize + (this.baseColSize * this.zoomLevel * 2) / 10;

		// fully-out feature is WIP: fix sizing
		if (opts?.fullyOut) {
			let activitiesHeaderWidth =
				parseInt(
					this.cssVarService.vars['calendar-activities-header-width'],
				) || 0;
			this.colSize =
				(window.innerWidth - activitiesHeaderWidth - 13) /
				(this.weeks - this.startAtWeek);
		}

		if (opts?.forceUpdate ?? isChanged) {
			this.removeMargins();
			setTimeout(() => {
				this.cdr.markForCheck();
				triggerWindowResize();
			}, 100);
		}
	}

	public openSettings() {
		console.log('openSettings');
	}

	public onManageCalendar() {
		console.log('onManageCalendar');
	}

	private baseActivity(): Partial<CommercialCalendarActivity> {
		return {
			calendarId: this.calendarId,
			year: this.year,
		};
	}

	public onUpsertActivity(item?: Partial<CommercialCalendarActivity>) {
		console.log('onUpsertActivity');
	}

	public onDeleteActivity(item: any): void {
		console.log('onDeleteActivity');
	}

	public async onCloneCalendar() {
		console.log('onCloneCalendar')
	}

	public dragToCreate() {
		let lastCapturedLeft = 0;
		const internal$: Subject<void> = new Subject();
		const endStream$ = new Subject();

		fromEvent(window, 'mousedown')
			.pipe(
				tap((e: any) => {
					this.cleanup();
					if (
						e.srcElement?.classList.contains('calendar-placeholder')
					) {
						const id = generateRandomText();
						const element = this.renderer.createElement('DIV');
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
								activityTypeId: +e.srcElement?.dataset.typeId,
							},
						});
					}
				}),
				switchMap(() => fromEvent(document, 'mousemove')),
				takeUntil(
					race([
						fromEvent(document, 'mouseup'),
						endStream$,
						this.destroy$,
					]),
				),
			)
			.subscribe({
				next: (e: any) => {
					this.dragging = true;
					const { child } = this.latestDomElement();
					if (child) {
						child.style.width =
							e.screenX - lastCapturedLeft + this.colSize + 'px';
					}
				},
				complete: () => {
					internal$.next();
					internal$.complete();
				},
			});

		return forkJoin([internal$]).subscribe(() => {
			this.dragging = false;
			const { child, data } = this.latestDomElement();
			if (child) {
				this.onUpsertActivity({
					...this.baseActivity(),
					...data,
					endWeek: cap(
						2,
						data.startWeek +
						Math.ceil(
							parseInt(window.getComputedStyle(child).width) /
							this.colSize,
						),
						this.weeks + 1,
					),
				});
			}
			this.dragToCreate();
		});
	}

	private latestDomElement(): any {
		return this.domElements.slice().pop() ?? {};
	}

	@HostListener('document:keydown.escape')
	private cleanup() {
		this.domElements.forEach((item) => {
			this.renderer.removeChild(item.parent, item.child);
		});
		this.domElements = [];
	}

	private getCalendarMonths(): string[] {
		let months = [];
		for (let i = this.startAtWeek ?? 1; i < this.weeks; i++) {
			let date = getDateOfIsoWeek(i + 1, this.year);
			months.push(format(date, 'LLLL'));
		}
		return [...new Set(months)];
	}

	private setCalendarYear() {
		return 2023;
	}
}
