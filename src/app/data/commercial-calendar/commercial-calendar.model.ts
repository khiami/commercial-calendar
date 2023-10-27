import { CommercialCalendarActivityType } from "../commercial-calendar-activity-type/commercial-calendar-activity-type.model";
import { CommercialCalendarActivity } from "../commercial-calendar-activity/commercial-calendar-activity.model";

export class CommercialCalendar {
    id?: number;

    code?: string;

    name?: string;

    isActive?: boolean;

    region?: any;
    regionId?: number;

    season?: any;
    seasonId?: number;

    createdAt?: string;

    updatedAt?: string;

    activitie?: CommercialCalendarActivity[];
    types?: CommercialCalendarActivityType[];
}
