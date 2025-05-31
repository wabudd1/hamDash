import { TZDate } from '@date-fns/tz';
export class ClockInfo {
    public timeZone: string;
    public showClock: boolean;
    public showLabel: boolean;
    public showDate: boolean;
    public isShortTimeZone: boolean;
    public isLocalClock: boolean;

    constructor(timeZone: string) {
        if (timeZone.length == 0) {
            this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            this.isLocalClock = true;
        }
        else {
            this.timeZone = timeZone;

            if (timeZone == Intl.DateTimeFormat().resolvedOptions().timeZone) {
                this.isLocalClock = true;
            }
            else {
                this.isLocalClock = false;
            }
        }

        this.showClock = true;
        this.showLabel = true;
        this.isShortTimeZone = true;
        this.showDate = true;
    }

    /**
     * Returns a friendly name for the clock's time zone based on this object's configuration.
     * 
     * @param date TimeZone Date object
     * @returns Friendly name of the time zone
     */
    public getLabel(date: TZDate): string {
        let zoneFormat: "short" | "long" | "shortOffset" | "longOffset" | "shortGeneric" | "longGeneric" | undefined = "short";
        if (!this.isShortTimeZone) {
            zoneFormat = "long";
        }

        return date.withTimeZone(this.timeZone).toLocaleDateString(undefined, { timeZoneName: zoneFormat }).substring(10);
    }

    /**
     * Gets a date format string based on config.
     * 
     * @returns Format string based on configuration parameter
     */
    public getDateFormat(): string {
        let formatString = "";

        if (this.showDate) {
            formatString += "MM/dd/YY ";
        }

        formatString += "hh:mm:ss"

        return formatString;
    }

    /**
     * Determiens which class to apply to the clock(s).
     * @param even If the list item is at an even position in the array
     * @returns string class name
     */
    public getListItemClass(even: boolean): string {
        let className = "";

        if (this.isLocalClock) {
            className = "list-group-item-primary";
        }
        else {
            if (even) {
                className = "list-group-item-secondary";
            }
            else {
                className = "list-group-item-light";
            }
        }

        return className;
    }
}