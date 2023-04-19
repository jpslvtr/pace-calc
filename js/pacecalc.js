function MM_jumpMenu(targ,selObj,restore) {
  eval(targ+".location='"+selObj.options[selObj.selectedIndex].value+"'");
  if(restore) selObj.selectedIndex=0;
}

function Redir() {
	window.location.href = document.pulldown.dest[document.pulldown.dest.selectedIndex].value
}

// set global variables to be used by all functions
var dist
var time // in total secs
var pace // in total secs
var thr // hr component for time
var tmin
var tsec
var phr // hr component for pace
var pmin
var psec
var dunit // type of unit dist is in (miles, kilometers, etc)
var event // or dist like marathon, half-marathon
var punit // unit pace is in (the per unit, aka mile, kilometer, quarter, half, etc)
var maradist = '26.2187575'
var halfmaradist = '13.1093787'
var shgt = 34 // height of rows in split table to compute height of subwindow

// validate required data, convert to total secs, do computation, display results
function CalcTime(form) {
	if(!(CheckTime(form))) {
		alert("To calculate Time, enter the Pace and Distance")
	} else { //got good data, now process it
		dunit = form.dunit.options[form.dunit.selectedIndex].value
		punit = form.punit.options[form.punit.selectedIndex].value
		var factor = convUnit(dunit, punit)
		time = dist  * pace * factor
		form.thr.value = HrsFromTSecs(time)
		form.tmin.value = MinsFromTSecs(time)
    timesec = SecsFromTSecs(time)
    timesec = parseFloat(timesec).toFixed(3);
    form.tsec.value = timesec
	}
}

// validate required data, do computation, and display results
function CalcDist(form) {
	if(!(CheckDist(form))){
		alert("To calculate Distance, enter the Time and Pace")
	} else {
		dunit = form.dunit.options[form.dunit.selectedIndex].value
		punit = form.punit.options[form.punit.selectedIndex].value
		var factor = convUnit(punit, dunit)
		dist = time / (pace / factor)
		form.dist.value = dist.toFixed(3)
	}
}

// validate required data, do computation, and display results
function CalcPace(form) {
	if(!(CheckPace(form))) {
		alert("To calculate Pace, enter the Time and Distance")
	} else {
		dunit = form.dunit.options[form.dunit.selectedIndex].value
		punit = form.punit.options[form.punit.selectedIndex].value
		var factor = convUnit(dunit, punit)
		pace = (time / dist) / factor
		form.phr.value = HrsFromTSecs(pace)
		form.pmin.value = MinsFromTSecs(pace)
    timesec = SecsFromTSecs(pace)
    timesec = parseFloat(timesec).toFixed(3);
    form.psec.value = timesec
	}
}

// univer conversions
function convUnit(funit, tunit) {
		if (funit == tunit) return 1
		else if (funit == "Mile" && tunit == "Kilometer") return 1.609344
		else if (funit == "Mile" && tunit == "Meter") return 1609.344
		else if (funit == "Mile" && tunit == "Yard") return  1760
		else if (funit == "Mile" && tunit == "Half Mile") return 2
		else if (funit == "Mile" && tunit == "Quarter Mile") return 4
		else if (funit == "Mile" && tunit == "Eigth Mile") return 8
		else if (funit == "Mile" && tunit == "1500M") return 1.072896
		else if (funit == "Mile" && tunit == "800M") return 2.01168
		else if (funit == "Mile" && tunit == "400M") return 4.02336
		else if (funit == "Mile" && tunit == "200M") return 8.04672

		else if (funit == "Kilometer" && tunit == "Mile") return .6213712
		else if (funit == "Kilometer" && tunit == "Meter") return 1000
		else if (funit == "Kilometer" && tunit == "Yard") return  1093.613
		else if (funit == "Kilometer" && tunit == "Half Mile") return 1.2427424
		else if (funit == "Kilometer" && tunit == "Quarter Mile") return 2.4854848
		else if (funit == "Kilometer" && tunit == "Eigth Mile") return 4.9709696
		else if (funit == "Kilometer" && tunit == "1500M") pace = (time / dist)  / .66666666
		else if (funit == "Kilometer" && tunit == "800M") return 1.25
		else if (funit == "Kilometer" && tunit == "400M") return 2.5
		else if (funit == "Kilometer" && tunit == "200M") return 5

		else if (funit == "Meter" && tunit == "Mile") return .0006213712
		else if (funit == "Meter" && tunit == "Kilometer") return .001
		else if (funit == "Meter" && tunit == "Yard") return  1.093613
		else if (funit == "Meter" && tunit == "Half Mile") return .0012427424
		else if (funit == "Meter" && tunit == "Quarter Mile") return .0024854848
		else if (funit == "Meter" && tunit == "Eigth Mile") return .0049709696
		else if (funit == "Meter" && tunit == "1500M") pace = (time / dist)  /  .0006666
		else if (funit == "Meter" && tunit == "800M") return .00125
		else if (funit == "Meter" && tunit == "400M") return .0025
		else if (funit == "Meter" && tunit == "200M") return .005

		else if (funit == "Yard" && tunit == "Mile") return .0005681 // (1/1760=)
		else if (funit == "Yard" && tunit == "Kilometer") return .0009144
		else if (funit == "Yard" && tunit == "Meter") return  .9144
		else if (funit == "Yard" && tunit == "Half Mile") return .0011362
		else if (funit == "Yard" && tunit == "Quarter Mile") return .0022724
		else if (funit == "Yard" && tunit == "Eigth Mile") return .0045448
		else if (funit == "Yard" && tunit == "1500M") pace = (time / dist)  / .0006096
		else if (funit == "Yard" && tunit == "800M") return .001143
		else if (funit == "Yard" && tunit == "400M") return .002286
		else if (funit == "Yard" && tunit == "200M") return .004572
}

// validate required data, do computation, and display results
function CalcSplits(form) {
	var gottime = CheckPace(form)
	var gotpace = CheckTime(form)
	if(!(gottime || gotpace)) {
		alert("To calculate Splits, enter the Pace and Distance or Time and Distance")
	} else {
	// get dist, pace, and punit. Time in total seconds, pace in total seconds
		if(!(gotpace) && (gottime)) {
		    punit = form.punit.options[form.punit.selectedIndex].value
		    dunit = form.dunit.options[form.dunit.selectedIndex].value
		    var factor = convUnit(dunit, punit)
		    pace = (time / dist) / factor
		}
		var dcalc = form.dunit.options[form.dunit.selectedIndex].value
		var pcalc = form.punit.options[form.punit.selectedIndex].value
		var factor = convUnit(dcalc, pcalc)
		var pdisp = form.punit.options[form.punit.selectedIndex].text
		dist = dist * factor
		var remain = dist % 1
		nsplits = dist - remain
		// compute hgt based on number of splits
		var hgt = nsplits  * shgt
		hgt = hgt.toString(10)
		var features = "resizable,scrollbars,height=" + hgt + ",width=250,"
		swin = window.open("","",features)
		swin.document.writeln("<HTML><HEAD><TITLE>Splits</TITLE><HEAD><BODY>\n")
		swin.document.writeln("<table cellspacing=2><tr bgcolor=#C6E2FF><td colspan=2 align=left>Splits</td><td>Times</td></tr>\n")
		var stime = 0
		for(var split = 1;  split <= nsplits; split++) {
			stime = stime + pace
			var shours = HrsFromTSecs(stime)
			var smins = MinsFromTSecs(stime)
			var ssecs = SecsFromTSecs(stime)
			var hmstime = shours  + ":" + smins + ":" + ssecs.substring(0,5)
			swin.document.writeln("<tr><td>" + split + "</td><td>" + pdisp + "</td><td>" + hmstime + "</td></tr>\n")
		}
    // the last split is for the total dist
		if(nsplits  != dist) {
			var extrasecs = remain * pace
			stime = stime + extrasecs
			var shours = HrsFromTSecs(stime)
			var smins = MinsFromTSecs(stime)
			var ssecs = SecsFromTSecs(stime)
			var hmstime = shours  + ":" + smins + ":" + ssecs.substring(0,5)
			swin.document.writeln("<tr><td>" + dist + "</td><td>" + pdisp + "</td><td>" + hmstime + "</td></tr>\n")
		}
		swin.document.writeln("</table></BODY></HTML>\n")
	} // end of else
}

// makes sure that both the Dist and Pace data needed to calc Time are valid
function CheckTime(form) {
	if((getDist(form)) && (getPace(form))) {
		return true
	} else{
		return false
	}
}

// makes sure that both the Time and Pace data needed to calc Dist are valid
function CheckDist(form) {
	if(getTime(form) && getPace(form)) {
		return true
	}else {
		return false
	}
}

// makes sure that both the Dist and Time data needed to calc Pace are valid
function CheckPace(form) {
	if((getTime(form)) && (getDist(form))) {
		return true
	} else {
		return false
	}
}

// set global time var to total secs and return true if input valid
function getTime(form) {
	thour = form.thr.value
  // substitute 0 for null components
	if(thour == "") { thour = "0" }
	if(!(isPosNum(thour))){ return false }
	thr = StripZeroes(thour)
	tminute = form.tmin.value
	if(tminute == "") { tminute = "0" }
	if(!(isPosNum(tminute))){ return false }
	tmin = StripZeroes(tminute)
	tsecond = form.tsec.value
	if(tsecond == "") { tsecond = "0" }
	if(!(isPosNum(tsecond))){ return false }
	tsec = StripZeroes(tsecond)
	time = toSecs(thr, tmin, tsec)
	time = parseFloat(time, 10)
   // if all components were null
	if (time == 0) return false
  return true
}

// set global dist var to a number and return true if input valid
function getDist(form) {
	dist = document.forms[0].dist.value
	if (!(isPosNum(dist))) { return false }
	dist = StripZeroes(dist)
	dist = parseFloat(dist, 10)
  return true
}

// set global pace var to total secs and return true	if input valid
function getPace(form) {
	phr = form.phr.value
	if(phr == "") {phr = "0"} // substitute 0 for null components
	if(!(isPosNum(phr))) { return false }
	phr = StripZeroes(phr)
	pmin = form.pmin.value
	if(pmin == "") { pmin = "0" } // substitute 0 for null components
	if(!(isPosNum(pmin))) { return false }
	pmin = StripZeroes(pmin)
	psec = form.psec.value
	if(psec == "") { psec = "0" } // substitute 0 for null components
	if(!(isPosNum(psec))) { return false }
	psec = StripZeroes(psec)
	pace = toSecs(phr, pmin, psec)
	pace = parseFloat(pace, 10)
	if(pace == 0) return false
return true
}

// convert each component to a number (remove leading 0) and sum them
function toSecs(hr, min, sec) {
	var hour = parseFloat(hr, 10)
	var minute = parseFloat(min, 10)
	var second = parseFloat(sec, 10)
	var hsecs = parseFloat(hour * 3600)
	var msecs = parseFloat(minute * 60)
	var total = hsecs + msecs + second
  return total
}

// gets hr component for hr:min:sec string
function HrsFromTSecs(totsecs) {
	var hrs // hr component as string
	var flthrs = totsecs / 3600
	hrs = Math.floor(flthrs) //get next int less or equal
	hrs = hrs.toString(10)
	if (hrs.length == 1) { hrs = "0" + hrs }
  return hrs
}

// gets min component for hr:min:sec string
function MinsFromTSecs(totsecs) {
	var mins
	var hrs = HrsFromTSecs(totsecs)
	var nsecs = hrs * 3600
	var secsleft = totsecs - nsecs
	var fltmin = secsleft / 60
	mins = Math.floor(fltmin)
	mins = mins.toString(10)
	if (mins.length == 1) {mins = "0" + mins}
  return mins
}

// converts total seconds number to hr:min:sec string. Secs is only component that may have a decimal value
function SecsFromTSecs(totsecs) {
	var secs
	secs = totsecs - (HrsFromTSecs(totsecs) * 3600) - (MinsFromTSecs(totsecs) * 60)
	secs = secs.toString(10)
	if(secs.length == 1) {
		secs = "0" + secs
	} else { // check for a decimal point
		for(var i = 0; i < secs.length; i++) {
				tchar = secs.charAt(i)
			if(i == 1 && tchar == ".") {
				secs = "0" + secs
				break
			}
		}
	}
  return secs
}

// strips off the leading 0, unless only one char
function StripZeroes(number){
	if (number.length == 1) return number
	var outnum = ""
	var goodc
	mynum = number.toString(10)
	for(var i = 0; i < mynum.length; i++) {
		goodc  = mynum.charAt(i)
		if(i == 0 && goodc  == "0") {
			continue
		}
		outnum += goodc
	}
  return outnum
}

// validates number as positive number with only one decimal point at most
function isPosNum(number) {
	mynum = number.toString(10)
	if(mynum.length == 0) { return false }
	oneDecimal = false
	for(var i = 0 ; i < mynum.length; i++) {
		var oneChar = mynum.charAt(i)
		if(oneChar  ==  "." && !oneDecimal) {
			oneDecimal = true
			continue
		}
		if(oneChar < "0" ||  oneChar > "9") {
			return false
		}
	}
	 return true
}

function setDunit (form) {
	if(form.event.options[1].selected == true) { // marathon
		form.dunit.options[0].selected=true // set dist unit to miles
    maradist = parseFloat(maradist).toFixed(3);
		form.dist.value = maradist //set dist to mara
	}
	if(form.event.options[2].selected==true) { // halfmarathon
		form.dunit.options[0].selected=true // set dist unit to miles
    halfmaradist = parseFloat(halfmaradist).toFixed(3);
		form.dist.value = halfmaradist
	}
	if(form.event.options[3].selected==true) { // 5K
		form.dunit.options[1].selected=true // set dist unit to kilometers
		form.dist.value = 5
	}
	if(form.event.options[4].selected==true) { // 5M
		form.dunit.options[0].selected=true // set dist unit to miles
		form.dist.value = 5
	}
	if(form.event.options[5].selected==true) { // 8K
		form.dunit.options[1].selected=true // set dist unit to kilometers
		form.dist.value = 8
	}
	if(form.event.options[6].selected==true) { // 10K
		form.dunit.options[1].selected=true // set dist unit to kilometers
		form.dist.value = 10
	}
	if(form.event.options[7].selected==true) { // 15K
		form.dunit.options[1].selected=true // set dist unit to kilometers
		form.dist.value = 15
	}
	if(form.event.options[8].selected==true) { // 10M
		form.dunit.options[0].selected=true // set dist unit to miles
		form.dist.value = 10
	}
	if(form.event.options[9].selected==true) { // 20K
		form.dunit.options[1].selected=true // set dist unit to kilometers
		form.dist.value = 20
	}
	if(form.event.options[10].selected==true) { // 15M
		form.dunit.options[0].selected=true // set dist unit to miles
		form.dist.value = 15
	}

	if(form.event.options[11].selected==true) { // 25K
		form.dunit.options[1].selected=true // set dist unit to kilometers
		form.dist.value = 25
	}
	if(form.event.options[12].selected==true) { // 30K
		form.dunit.options[1].selected=true // set dist unit to kilometers
		form.dist.value = 30
	}
	if(form.event.options[13].selected==true) { // 20M
		form.dunit.options[0].selected=true // set dist unit to miles
		form.dist.value = 20
	}
}
