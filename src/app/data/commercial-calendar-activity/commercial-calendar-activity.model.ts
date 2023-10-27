import { CommercialCalendar } from "../commercial-calendar/commercial-calendar.model";
import { CommercialCalendarActivityType } from "../commercial-calendar-activity-type/commercial-calendar-activity-type.model";

export class CommercialCalendarActivity {
    id?: number;

    name?: string;

    tagline?: string;

    content?: string;

    calendar: any;
    calendarId?: number;

    year?: number;

    startWeek?: number;

    endWeek?: number;

    isActive?: boolean;

    createdAt?: Date;

    updatedAt?: Date;

    products?: any[];

    activityType?: CommercialCalendarActivityType;
    activityTypeId?: number;

    position?: number;

    color?: string;

    fillColor?: string;
}
