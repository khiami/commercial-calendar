import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
// import { MenuItem } from 'src/app/lib/ui/controls/context-menu/context-menu-list.component';
// import { ContextMenuActions } from '../enum/context-menu.enum';
// import { ContextMenuService } from 'src/app/lib/ui/services/context-menu.service';

@Component({
	selector: 'calendar-toolbar',
	templateUrl: './calendar-toolbar.component.html',
	styleUrls: ['./calendar-toolbar.component.scss'],
})
export class CalendarToolbarComponent {
	@Input() public editMode!: boolean;
	@Input() public canManage!: boolean;

	@Input() public canClone!: boolean;

	@Output() public onManageCalendar: EventEmitter<unknown> =
		new EventEmitter();
	@Output() public onManageTypes: EventEmitter<unknown> = new EventEmitter();
	@Output() public onReload: EventEmitter<unknown> = new EventEmitter();
	@Output() public onCreate: EventEmitter<unknown> = new EventEmitter();
	@Output() public onClone: EventEmitter<unknown> = new EventEmitter();

	// private settingsList: MenuItem[] = [
	// 	{text: 'Manage activities', action: ContextMenuActions.ManageActivities},
	// ]

	// constructor(
	// 	private cdr: ChangeDetectorRef,
	// 	private contextMenuService: ContextMenuService,
	// ) { }

	// TODO: delete
	// public openMenu(ref: HTMLButtonElement): void {
	//     const menu$ = this.contextMenuService.open(this.settingsList,
	//         {
	// 			top: ref.getBoundingClientRect().bottom,
	// 			left: ref.getBoundingClientRect().left
	// 		});

	//     menu$.subscribe(res => {
	//         switch (res.action) {
	//             case ContextMenuActions.ManageActivities:
	// 				this.onSettings.emit();
	//                 break;
	//         }
	//     });
	// }
}
