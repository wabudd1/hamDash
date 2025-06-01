import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { map, share, Subscription, timer } from 'rxjs';
import { ClockInfo } from './clockInfo';
import { TZDate } from '@date-fns/tz';
import { TimeZones } from './timeZones';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUpRightFromSquare, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "ham-clock",
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: "./clock.component.html",
  styleUrl: "./clock.component.scss",
  encapsulation: ViewEncapsulation.Emulated,
})
export class ClockComponent implements OnInit, OnDestroy {
  public readonly upRightIcon: IconDefinition = faArrowUpRightFromSquare;
  public hourTransform: string = "";
  public minuteTransform: string = "";
  public secondsTransform: string = "";
  public timerSubscription?: Subscription;
  public time: TZDate = new TZDate();
  public clocks: ClockInfo[] = [];

  ngOnInit(): void {
    this.clocks.push(new ClockInfo(TimeZones.UTC));
    this.clocks.push(new ClockInfo(TimeZones.USEastern));
    this.clocks.push(new ClockInfo(TimeZones.USCentral));
    this.clocks.push(new ClockInfo(TimeZones.USMountain));
    this.clocks.push(new ClockInfo(TimeZones.USPacific));

    this.timerSubscription = timer(0, 1000)
      .pipe(
        map(() => new TZDate()),
        share()
      )
      .subscribe((time) => {
        this.time = time;

        let hour = time.getHours();
        let minute = time.getMinutes();
        this.hourTransform = this.getHourTransform(hour, minute);
        this.minuteTransform = this.getMinuteTransform(minute);
        let seconds = time.getSeconds();
        this.secondsTransform = this.getSecondTransform(seconds);
      });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  /**
   * Gets the CSS transformation to move the hour hand.
   * 
   * @param hour Hour
   * @param minute Minute
   * @returns String that applies a rotation to the hour hand
   */
  public getHourTransform(hour: number, minute: number): string {
    let hourString = `rotate(${30 * hour + minute / 2}deg)`;
    return hourString;
  }

  /**
   * Gets the CSS transformation to move the minute hand.
   * 
   * @param minute Minute
   * @returns String that applies a rotation to the minute hand
   */
  public getMinuteTransform(minute: number): string {
    let minuteString = `rotate(${6 * minute}deg)`;
    return minuteString;
  }

  /**
   * Gets the CSS transformation to move the seconds hand.
   * 
   * @param seconds Seconds
   * @returns String that applies a rotation to the seconds hand
   */
  public getSecondTransform(seconds: number): string {
    return `rotate(${6 * seconds}deg)`;
  }
}
