export class SunUpDown {
  /*************************************************************/
  /* Solar position calculation publics */
  /*************************************************************/

  public calcTimeJulianCent(julianDay: number): number {
    var T = (julianDay - 2451545.0) / 36525.0;
    return T;
  }

  public calcjulianDayFromJulianCent(t: number): number {
    var julianDay = t * 36525.0 + 2451545.0;
    return julianDay;
  }

  public isLeapYear(year: number) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }

  public calcDateFromjulianDay(julianDay: number) {
    var z = Math.floor(julianDay + 0.5);
    var f = julianDay + 0.5 - z;
    if (z < 2299161) {
      var A = z;
    } else {
      let alpha = Math.floor((z - 1867216.25) / 36524.25);
      var A = z + 1 + alpha - Math.floor(alpha / 4);
    }
    var B = A + 1524;
    var C = Math.floor((B - 122.1) / 365.25);
    var D = Math.floor(365.25 * C);
    var E = Math.floor((B - D) / 30.6001);
    var day = B - D - Math.floor(30.6001 * E) + f;
    var month = E < 14 ? E - 1 : E - 13;
    var year = month > 2 ? C - 4716 : C - 4715;

    return { year: year, month: month, day: day };
  }

  public calcDoyFromjulianDay(jd: number): number {
    var date = this.calcDateFromjulianDay(jd);

    var k = this.isLeapYear(date.year) ? 1 : 2;
    var doy =
      Math.floor((275 * date.month) / 9) -
      k * Math.floor((date.month + 9) / 12) +
      date.day -
      30;

    return doy;
  }

  public radToDeg(angleRad: number): number {
    return (180.0 * angleRad) / Math.PI;
  }

  public degToRad(angleDeg: number): number {
    return (Math.PI * angleDeg) / 180.0;
  }

  public calcGeomMeanLongSun(t: number): number {
    var L0 = 280.46646 + t * (36000.76983 + t * 0.0003032);
    while (L0 > 360.0) {
      L0 -= 360.0;
    }
    while (L0 < 0.0) {
      L0 += 360.0;
    }
    return L0; // in degrees
  }

  public calcGeomMeanAnomalySun(t: number): number {
    var M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
    return M; // in degrees
  }

  public calcEccentricityEarthOrbit(t: number): number {
    var e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
    return e; // unitless
  }

  public calcSunEqOfCenter(t: number): number {
    var m = this.calcGeomMeanAnomalySun(t);
    var mrad = this.degToRad(m);
    var sinm = Math.sin(mrad);
    var sin2m = Math.sin(mrad + mrad);
    var sin3m = Math.sin(mrad + mrad + mrad);
    var C =
      sinm * (1.914602 - t * (0.004817 + 0.000014 * t)) +
      sin2m * (0.019993 - 0.000101 * t) +
      sin3m * 0.000289;
    return C; // in degrees
  }

  public calcSunTrueLong(t: number): number {
    var l0 = this.calcGeomMeanLongSun(t);
    var c = this.calcSunEqOfCenter(t);
    var O = l0 + c;
    return O; // in degrees
  }

  public calcSunTrueAnomaly(t: number): number {
    var m = this.calcGeomMeanAnomalySun(t);
    var c = this.calcSunEqOfCenter(t);
    var v = m + c;
    return v; // in degrees
  }

  public calcSunRadVector(t: number): number {
    var v = this.calcSunTrueAnomaly(t);
    var e = this.calcEccentricityEarthOrbit(t);
    var R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(this.degToRad(v)));
    return R; // in AUs
  }

  public calcSunApparentLong(t: number): number {
    var o = this.calcSunTrueLong(t);
    var omega = 125.04 - 1934.136 * t;
    var lambda = o - 0.00569 - 0.00478 * Math.sin(this.degToRad(omega));
    return lambda; // in degrees
  }

  public calcMeanObliquityOfEcliptic(t: number): number {
    var seconds = 21.448 - t * (46.815 + t * (0.00059 - t * 0.001813));
    var e0 = 23.0 + (26.0 + seconds / 60.0) / 60.0;
    return e0; // in degrees
  }

  public calcObliquityCorrection(t: number): number {
    var e0 = this.calcMeanObliquityOfEcliptic(t);
    var omega = 125.04 - 1934.136 * t;
    var e = e0 + 0.00256 * Math.cos(this.degToRad(omega));
    return e; // in degrees
  }

  public calcSunRtAscension(t: number): number {
    var e = this.calcObliquityCorrection(t);
    var lambda = this.calcSunApparentLong(t);
    var tananum = Math.cos(this.degToRad(e)) * Math.sin(this.degToRad(lambda));
    var tanadenom = Math.cos(this.degToRad(lambda));
    var alpha = this.radToDeg(Math.atan2(tananum, tanadenom));
    return alpha; // in degrees
  }

  public calcSunDeclination(t: number): number {
    var e = this.calcObliquityCorrection(t);
    var lambda = this.calcSunApparentLong(t);
    var sint = Math.sin(this.degToRad(e)) * Math.sin(this.degToRad(lambda));
    var theta = this.radToDeg(Math.asin(sint));
    return theta; // in degrees
  }

  public calcEquationOfTime(t: number): number {
    var epsilon = this.calcObliquityCorrection(t);
    var l0 = this.calcGeomMeanLongSun(t);
    var e = this.calcEccentricityEarthOrbit(t);
    var m = this.calcGeomMeanAnomalySun(t);

    var y = Math.tan(this.degToRad(epsilon) / 2.0);
    y *= y;

    var sin2l0 = Math.sin(2.0 * this.degToRad(l0));
    var sinm = Math.sin(this.degToRad(m));
    var cos2l0 = Math.cos(2.0 * this.degToRad(l0));
    var sin4l0 = Math.sin(4.0 * this.degToRad(l0));
    var sin2m = Math.sin(2.0 * this.degToRad(m));

    var Etime =
      y * sin2l0 -
      2.0 * e * sinm +
      4.0 * e * y * sinm * cos2l0 -
      0.5 * y * y * sin4l0 -
      1.25 * e * e * sin2m;
    return this.radToDeg(Etime) * 4.0; // in minutes of time
  }

  public calcHourAngleSunrise(lat: number, solarDec: number): number {
    var latRad = this.degToRad(lat);
    var sdRad = this.degToRad(solarDec);
    var HAarg =
      Math.cos(this.degToRad(90.833)) / (Math.cos(latRad) * Math.cos(sdRad)) -
      Math.tan(latRad) * Math.tan(sdRad);
    var HA = Math.acos(HAarg);
    return HA; // in radians (for sunset, use -HA)
  }

  public isNumber(inputVal: string): boolean {
    var oneDecimal = false;
    var inputStr = "" + inputVal;
    for (var i = 0; i < inputStr.length; i++) {
      var oneChar = inputStr.charAt(i);
      if (i == 0 && (oneChar == "-" || oneChar == "+")) {
        continue;
      }
      if (oneChar == "." && !oneDecimal) {
        oneDecimal = true;
        continue;
      }
      if (oneChar < "0" || oneChar > "9") {
        return false;
      }
    }
    return true;
  }

  public getjulianDay(year: number, month: number, day: number): number {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }

    var A = Math.floor(year / 100);
    var B = 2 - A + Math.floor(A / 4);

    var julianDay =
      Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day +
      B -
      1524.5;

    return julianDay;
  }

  public calcRefraction(elev: number): number {
    if (elev > 85.0) {
      var correction = 0.0;
    }
    else {
      var te = Math.tan(this.degToRad(elev));
      if (elev > 5.0) {
        var correction =
          58.1 / te -
          0.07 / (te * te * te) +
          0.000086 / (te * te * te * te * te);
      }
      else if (elev > -0.575) {
        var correction =
          1735.0 +
          elev * (-518.2 + elev * (103.4 + elev * (-12.79 + elev * 0.711)));
      }
      else {
        var correction = -20.774 / te;
      }

      correction = correction / 3600.0;
    }

    return correction;
  }

  public calcAzEl(T: number, localtime: number, latitude: number, longitude: number, zone: number) {
    var eqTime = this.calcEquationOfTime(T);
    var theta = this.calcSunDeclination(T);

    var solarTimeFix = eqTime + 4.0 * longitude - 60.0 * zone;
    var earthRadVec = this.calcSunRadVector(T);
    var trueSolarTime = localtime + solarTimeFix;

    while (trueSolarTime > 1440) {
      trueSolarTime -= 1440;
    }

    var hourAngle = trueSolarTime / 4.0 - 180.0;

    if (hourAngle < -180) {
      hourAngle += 360.0;
    }

    var haRad = this.degToRad(hourAngle);
    var csz =
      Math.sin(this.degToRad(latitude)) * Math.sin(this.degToRad(theta)) +
      Math.cos(this.degToRad(latitude)) *
        Math.cos(this.degToRad(theta)) *
        Math.cos(haRad);

    if (csz > 1.0) {
      csz = 1.0;
    }
    else if (csz < -1.0) {
      csz = -1.0;
    }

    var zenith = this.radToDeg(Math.acos(csz));
    var azDenom = Math.cos(this.degToRad(latitude)) * Math.sin(this.degToRad(zenith));
    if (Math.abs(azDenom) > 0.001) {
      var azRad =
        (Math.sin(this.degToRad(latitude)) * Math.cos(this.degToRad(zenith)) -
          Math.sin(this.degToRad(theta))) /
        azDenom;

      if (Math.abs(azRad) > 1.0) {
        if (azRad < 0) {
          azRad = -1.0;
        }
        else {
          azRad = 1.0;
        }
      }

      var azimuth = 180.0 - this.radToDeg(Math.acos(azRad));

      if (hourAngle > 0.0) {
        azimuth = -azimuth;
      }
    }
    else {
      if (latitude > 0.0) {
        var azimuth = 180.0;
      }
      else {
        var azimuth = 0.0;
      }
    }

    if (azimuth < 0.0) {
      azimuth += 360.0;
    }

    var exoatmElevation = 90.0 - zenith;

    // Atmospheric Refraction correction
    var refractionCorrection = this.calcRefraction(exoatmElevation);

    var solarZen = zenith - refractionCorrection;
    var elevation = 90.0 - solarZen;

    return { azimuth: azimuth, elevation: elevation };
  }

  public calcSolNoon(jd: number, longitude: number, timezone: number): number {
    var tnoon = this.calcTimeJulianCent(jd - longitude / 360.0);
    var eqTime = this.calcEquationOfTime(tnoon);
    var solNoonOffset = 720.0 - longitude * 4 - eqTime; // in minutes
    var newt = this.calcTimeJulianCent(jd - 0.5 + solNoonOffset / 1440.0);
    eqTime = this.calcEquationOfTime(newt);
    var solNoonLocal = 720 - longitude * 4 - eqTime + timezone * 60.0; // in minutes

    while (solNoonLocal < 0.0) {
      solNoonLocal += 1440.0;
    }

    while (solNoonLocal >= 1440.0) {
      solNoonLocal -= 1440.0;
    }

    return solNoonLocal;
  }

  public calcSunriseSetUTC(rise: boolean, julianDay: number, latitude: number,longitude: number) {
    var t = this.calcTimeJulianCent(julianDay);
    var eqTime = this.calcEquationOfTime(t);
    var solarDec = this.calcSunDeclination(t);
    var hourAngle = this.calcHourAngleSunrise(latitude, solarDec);

    if (!rise) {
        hourAngle = -hourAngle;
    }

    var delta = longitude + this.radToDeg(hourAngle);
    var timeUTC = 720 - 4.0 * delta - eqTime; // in minutes

    return timeUTC;
  }

  // rise = 1 for sunrise, 0 for sunset
  public calcSunriseSet(rise: boolean, julianDay: number, latitude: number, longitude: number, timezone: number) {
    var timeUTC = this.calcSunriseSetUTC(rise, julianDay, latitude, longitude);
    var newTimeUTC = this.calcSunriseSetUTC(
      rise,
      julianDay + timeUTC / 1440.0,
      latitude,
      longitude
    );

    // TODO:  value was expected to be NaN at some point?
    // if (this.isNumber(newTimeUTC)) {
    if (true) {
      var timeLocal = newTimeUTC + timezone * 60.0;
      var riseT = this.calcTimeJulianCent(julianDay + newTimeUTC / 1440.0);
      var riseAzEl = this.calcAzEl(
        riseT,
        timeLocal,
        latitude,
        longitude,
        timezone
      );
      var azimuth = riseAzEl.azimuth;
      var jday = julianDay;
      if (timeLocal < 0.0 || timeLocal >= 1440.0) {
        var increment = timeLocal < 0 ? 1 : -1;
        while (timeLocal < 0.0 || timeLocal >= 1440.0) {
          timeLocal += increment * 1440.0;
          jday -= increment;
        }
      }
    } else {
      // no sunrise/set found
      var azimuth = -1.0;
      var timeLocal = 0.0;
      var doy = this.calcDoyFromjulianDay(julianDay);
      if (
        (latitude > 66.4 && doy > 79 && doy < 267) ||
        (latitude < -66.4 && (doy < 83 || doy > 263))
      ) {
        //previous sunrise/next sunset
        jday = this.calcjulianDayofNextPrevRiseSet(
          !rise,
          rise,
          julianDay,
          latitude,
          longitude,
          timezone
        );
      } else {
        //previous sunset/next sunrise
        jday = this.calcjulianDayofNextPrevRiseSet(
          rise,
          rise,
          julianDay,
          latitude,
          longitude,
          timezone
        );
      }
    }

    return { jday: jday, timelocal: timeLocal, azimuth: azimuth };
  }

  public calcjulianDayofNextPrevRiseSet(
    next: boolean,
    rise: boolean,
    julianDay: number,
    latitude: number,
    longitude: number,
    tz: number
  ): number {
    var julianday = julianDay;
    var increment = next ? 1.0 : -1.0;
    var time = this.calcSunriseSetUTC(rise, julianday, latitude, longitude);

    // TODO:  Return value was expected to be NaN at some point?
    // while(!this.isNumber(time)) {
    // 	julianday += increment;
    // 	time = this.calcSunriseSetUTC(rise, julianday, latitude, longitude);
    // }
    var timeLocal = time + tz * 60.0;
    while (timeLocal < 0.0 || timeLocal >= 1440.0) {
      var incr = timeLocal < 0 ? 1 : -1;
      timeLocal += incr * 1440.0;
      julianday -= incr;
    }

    return julianday;
  }

  /*************************************************************/
  /* end calculation publics */
  /*************************************************************/

  monthList = [
    { name: "January", numdays: 31, abbr: "Jan" },
    { name: "February", numdays: 28, abbr: "Feb" },
    { name: "March", numdays: 31, abbr: "Mar" },
    { name: "April", numdays: 30, abbr: "Apr" },
    { name: "May", numdays: 31, abbr: "May" },
    { name: "June", numdays: 30, abbr: "Jun" },
    { name: "July", numdays: 31, abbr: "Jul" },
    { name: "August", numdays: 31, abbr: "Aug" },
    { name: "September", numdays: 30, abbr: "Sep" },
    { name: "October", numdays: 31, abbr: "Oct" },
    { name: "November", numdays: 30, abbr: "Nov" },
    { name: "December", numdays: 31, abbr: "Dec" },
  ];

  //--------------------------------------------------------------
  // returns a string in the form DDMMMYYYY[ next] to display prev/next rise/set
  // flag=2 for DD MMM, 3 for DD MM YYYY, 4 for DDMMYYYY next/prev
  public dayString(jd: number, next: number, flag: number): string {
    let output = "";

    if (jd < 900000 || jd > 2817000) {
      return "error";
    }

    var date = this.calcDateFromjulianDay(jd);

    if (flag == 2)
      output =
        this.zeroPad(date.day, 2) + " " + this.monthList[date.month - 1].abbr;
    if (flag == 3)
      output =
        this.zeroPad(date.day, 2) +
        this.monthList[date.month - 1].abbr +
        date.year.toString();
    if (flag == 4)
      output =
        this.zeroPad(date.day, 2) +
        this.monthList[date.month - 1].abbr +
        date.year.toString() +
        (next ? " next" : " prev");

    return output;
  }

  //--------------------------------------------------------------
  public timeDateString(julianDay: number, minutes: number): string {
    return this.timeString(minutes, 2) + " " + this.dayString(julianDay, 0, 2);
  }

  //--------------------------------------------------------------
  // timeString returns a zero-padded string (HH:MM:SS) given time in minutes
  // flag=2 for HH:MM, 3 for HH:MM:SS
  public timeString(minutes: number, flag: number): string {
    if (minutes >= 0 && minutes < 1440) {
      var floatHour = minutes / 60.0;
      var hour = Math.floor(floatHour);
      var floatMinute = 60.0 * (floatHour - Math.floor(floatHour));
      var minute = Math.floor(floatMinute);
      var floatSec = 60.0 * (floatMinute - Math.floor(floatMinute));
      var second = Math.floor(floatSec + 0.5);
      if (second > 59) {
        second = 0;
        minute += 1;
      }
      if (flag == 2 && second >= 30) minute++;
      if (minute > 59) {
        minute = 0;
        hour += 1;
      }
      var output = this.zeroPad(hour, 2) + ":" + this.zeroPad(minute, 2);
      if (flag > 2) output = output + ":" + this.zeroPad(second, 2);
    } else {
      var output = "error";
    }

    return output;
  }

  //--------------------------------------------------------------
  // zero pad a string 'n' with 'digits' number of zeros
  public zeroPad(n: number, digits: number): string {
    let padded = n.toString();
    while (padded.length < digits) {
      padded = "0" + n;
    }
    return padded;
  }

  //--------------------------------------------------------------
  // Read a form input box and do some validation on the result
  // public readTextBox(inputId, numchars, intgr, pad, min, max, def) {
  // 	var number = document.getElementById(inputId).value.substring(0,numchars)
  // 	if (intgr) {
  // 		number = Math.floor(parseFloat(number))
  // 	} else {  // float
  // 		number = parseFloat(number)
  // 	}

  // 	if (number < min) {
  // 		number = min
  // 	} else if (number > max) {
  // 		number = max
  // 	} else if (number.toString() == "NaN") {
  // 		number = def
  // 	}

  // 	if ((pad) && (intgr)) {
  // 		document.getElementById(inputId).value = this.zeroPad(number,2)
  // 	} else {
  // 		document.getElementById(inputId).value = number
  // 	}

  // 	return number
  // }

  //--------------------------------------------------------------
  // get, validate, reset if necessary, the date and time input boxes
  // public getDatevals() {
  // 	var docmonth = $('#mosbox').prop('selectedIndex') + 1
  // 	var docday = $('#daybox').prop('selectedIndex') + 1
  // 	var docyear = this.readTextBox("yearbox", 5, 1, 0, -2000, 3000, 2009)
  // 	var dochr = this.readTextBox("hrbox", 2, 1, 1, 0, 23, 12)
  // 	var docmn = this.readTextBox("mnbox", 2, 1, 1, 0, 59, 0)
  // 	var docsc = this.readTextBox("scbox", 2, 1, 1, 0, 59, 0)
  // 	var docpm = $('#pmbox').prop('checked')

  // 	if ( (this.isLeapYear(docyear)) && (docmonth == 2) ) {
  // 		if (docday > 29) {
  // 			docday = 29
  // 			$('#daybox').prop('selectedIndex', docday - 1)
  // 		}
  // 	} else {
  // 		if (docday > this.monthList[docmonth-1].numdays) {
  // 			docday = this.monthList[docmonth-1].numdays
  // 			$('#daybox').prop('selectedIndex', docday - 1)
  // 		}
  // 	}

  // 	if ( (docpm) && (dochr < 12) ) {
  // 		dochr += 12
  // 	}

  // 	return {"year": docyear, "month": docmonth, "day": docday, "hour": dochr, "minute": docmn, "second": docsc}
  // }

  //--------------------------------------------------------------
  // public getDateString(date) {

  //         var s = date.year
  // 		+ '-'
  // 		+ this.zeroPad(date.month,2)
  // 		+ '-'
  // 		+ this.zeroPad(date.day,2)
  // 		+ 'T'
  // 		+ this.zeroPad(date.hour,2)
  // 		+ ':'
  // 		+ this.zeroPad(date.minute,2)
  // 		+ ':'
  // 		+ this.zeroPad(date.second,2)

  // 	return s
  // }

  //--------------------------------------------------------------
  // Get the input data from the form (date, time, location, time zone)
  // public get_input_data(adjusttz) {

  // 	var date = this.getDatevals()
  // 	var mins = date.hour*60 + date.minute + date.second/60.0
  // 	var lat = parseFloat($('#latbox').val())
  // 	var lng = parseFloat($('#lngbox').val())
  //         var tzname = $('#tz').val();

  //         // get utc offset for selected timezone and date
  //         if (adjusttz == false) {
  // 		var utcoffset = $('#zonebox').val()

  // 	} else {
  // 		// make sure utc offset is set correctly
  // 		// (may have changed entered day value if it was out of range)
  // 		var datestr = this.getDateString(date)
  // 		if (date.year < 1000) {
  // 			var utcoffset = moment('1900-1-1').tz(tzname).format('Z');
  // 		} else {
  // 			var utcoffset = moment(datestr).tz(tzname).format('Z');
  // 		}
  // 		$('#zonebox').val(utcoffset)
  // 	}

  // 	var a = utcoffset.split(":")
  // 	var tz = parseFloat(a[0]) + parseFloat(a[1])/60.0

  // 	var data = {
  // 		"year": date.year,
  // 		"month": date.month,
  // 		"day": date.day,
  // 		"hour": date.hour,
  // 		"minute": date.minute,
  // 		"second": date.second,
  // 		"time_local": mins,
  // 		"utc_offset": utcoffset,
  // 		"lat": lat,
  // 		"lon": lng,
  // 		"tz": tz,
  // 	}

  // 	return data
  // }

  //--------------------------------------------------------------
  // Do the calculations and update the result text boxes
  // public calculate(adjusttz) {

  // 	var data = this.get_input_data(adjusttz)
  // 	var jday = this.getjulianDay(data.year, data.month, data.day)
  // 	var total = jday + data.time_local/1440.0 - data.tz/24.0
  // 	var T = this.calcTimeJulianCent(total)
  // 	var azel = this.calcAzEl(T, data.time_local, data.lat, data.lon, data.tz)
  // 	var solnoon = this.calcSolNoon(jday, data.lon, data.tz)
  // 	var rise = this.calcSunriseSet(1, jday, data.lat, data.lon, data.tz)
  // 	var set  = this.calcSunriseSet(0, jday, data.lat, data.lon, data.tz)

  // 	var eqTime = this.calcEquationOfTime(T)
  // 	var theta  = this.calcSunDeclination(T)

  // 	// Now update form boxes and lines on map

  // 	$("#eqtbox").val(Math.floor(eqTime*100 +0.5)/100.0)
  // 	$("#sdbox").val(Math.floor(theta*100 +0.5)/100.0)

  // 	// azimuth and elevation boxes, azimuth line
  // 	var solarZen = 90.0 - azel.elevation
  // 	if (solarZen > 108.0) {
  // 		$("#azbox").val("dark")
  // 		$("#elbox").val("dark")
  // 	} else {
  // 		$("#azbox").val(Math.floor(azel.azimuth*100 + 0.5)/100.0)
  // 		$("#elbox").val(Math.floor(azel.elevation*100 + 0.5)/100.0)
  // 		if ($('#showae').prop('checked')) {
  // 			showLineGeodesic2("azimuth", "#ff00ff", azel.azimuth, data.lat, data.lon)
  // 		}
  // 	}

  // 	// solar noon time box
  // 	$("#noonbox").val(this.timeString(solnoon, 3))

  // 	// sunrise time box
  // 	if (rise.jday == jday) {
  // 		$("#risebox").val(this.timeString(rise.timelocal,2))
  // 	} else {
  // 		if (rise.azimuth >= 0.0) {
  // 			$("#risebox").val(this.timeDateString(rise.jday, rise.timelocal))
  // 		} else {
  // 			$("#risebox").val(this.dayString(rise.jday,0,3))
  // 		}
  // 	}

  // 	// sunset time box
  // 	if (set.jday == jday) {
  // 		$("#setbox").val(this.timeString(set.timelocal,2))
  // 	} else {
  // 		if (set.azimuth >= 0.0) {
  // 			$("#setbox").val(this.timeDateString(set.jday, set.timelocal))
  // 		} else {
  // 			$("#setbox").val(this.dayString(set.jday,0,3))
  // 		}
  // 	}

  // 	// sunrise line
  // 	if ($('#showsr').prop('checked')) {
  // 		if (rise.azimuth >= 0.0) {
  // 			showLineGeodesic2("sunrise", "#00aa00", rise.azimuth, data.lat, data.lon);
  // 		}
  // 	}

  // 	// sunset line
  // 	if ($('#showss').prop('checked')) {
  // 		if (set.azimuth >= 0.0) {
  // 			showLineGeodesic2("sunset", "#ff0000", set.azimuth, data.lat, data.lon);
  // 		}
  // 	}
}
