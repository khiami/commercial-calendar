
import { CommercialCalendarActivity } from "../commercial-calendar-activity/commercial-calendar-activity.model";
import { CommercialCalendar } from "../commercial-calendar/commercial-calendar.model";



export class CommercialCalendarActivityType {
    id?: number;

    code?: string;

    name?: string;

    isActive?: boolean;

    createdAt?: Date;

    updatedAt?: Date;

    position?: number;

    data?: any;

    activities?: CommercialCalendarActivity[];
    calendars?: CommercialCalendar[];
}
