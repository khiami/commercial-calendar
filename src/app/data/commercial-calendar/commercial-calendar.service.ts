import {Injectable} from "@angular/core";
// import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from "@ngrx/data";
import {CommercialCalendar} from "./commercial-calendar.model";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class CommercialCalendarService {
    constructor(
        // public serviceElementsFactory: EntityCollectionServiceElementsFactory,
        private http: HttpClient,
    ) {
        // super('commercial-calendars', serviceElementsFactory);
    }

    public clone(id: number, query: any): Promise<CommercialCalendar|undefined> {
        return this.http.post<CommercialCalendar>('/api/commercial-calendars/clone/' + id, query, {observe: 'body'}).toPromise();
    }
}
