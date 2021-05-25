function determineBackgroundColor(value, floor, ceil){
    if ( value > ceil) return 'bg-danger';
    if ( value > floor) return 'bg-warning';
    return 'bg-success';
}
async function buildTable(pilotsHours){
    $('#summarytbody tr').remove();
    for ( let i = 0 ; i < pilotsHours.length ; i++){
        const normeHours = await postFetchRequest('http://localhost:3000/api/norm/find', {name:pilotsHours[i].norme});
        const sixLastMonthTotal = pilotsHours[i].sixLastMonth.day + pilotsHours[i].sixLastMonth.night + Math.min(20, pilotsHours[i].sixLastMonth.simpilTotal);
        const sixLastMonthNight = pilotsHours[i].sixLastMonth.night + Math.min(7.5, pilotsHours[i].sixLastMonth.simpilNight);
        const dayToDoBackground = determineBackgroundColor(normeHours[0].hoursToDo - sixLastMonthTotal, 0, normeHours[0].hoursToDo / normeHours[0].duration);
        const nightToDoBackground = determineBackgroundColor(normeHours[0].nightToDo - sixLastMonthNight, 0, normeHours[0].nightToDo / normeHours[0].duration);
        const daySinceLastFlightBackground = determineBackgroundColor((new Date()-pilotsHours[i].lastFlightdate)/1000/60/60/24, 22, 30);
        const daySinceLastSimpilBackground = determineBackgroundColor((new Date()-pilotsHours[i].lastSimpildate)/1000/60/60/24, 22, 30);
        let newTR = $('<TR>');
        let rowspan = 1;
        if ( i < pilotsHours.length - 1 ) if (pilotsHours[i].crew === pilotsHours[i+1].crew) rowspan++;
        if ( i === 0 ) $('<TD>', {rowspan:rowspan, html:pilotsHours[i].crew}).appendTo(newTR);
        else if ( pilotsHours[i].crew !== pilotsHours[i-1].crew) $('<TD>', {rowspan:rowspan, html:pilotsHours[i].crew}).appendTo(newTR);
        $('<TD>', {html:pilotsHours[i].name}).appendTo(newTR);
        $('<TD>', {html:pilotsHours[i].norme}).appendTo(newTR);
        $('<TD>', {html:pilotsHours[i].lastMonth.day.toFixed(1)}).appendTo(newTR);
        $('<TD>', {html:pilotsHours[i].lastMonth.night.toFixed(1)}).appendTo(newTR);
        $('<TD>', {html:(pilotsHours[i].lastMonth.day + pilotsHours[i].lastMonth.night).toFixed(1)}).appendTo(newTR);
        $('<TD>', {html:pilotsHours[i].lastMonth.simpilTotal}).appendTo(newTR);
        $('<TD>', {html:pilotsHours[i].lastMonth.simpilNight}).appendTo(newTR);
        $('<TD>', {html:(sixLastMonthTotal).toFixed(1)}).appendTo(newTR);
        $('<TD>', {html:sixLastMonthNight.toFixed(1)}).appendTo(newTR);
        $('<TD>', {html:(pilotsHours[i].twelveLastMonth.day + pilotsHours[i].twelveLastMonth.night).toFixed(1)}).appendTo(newTR);
        $('<TD>', {html:pilotsHours[i].twelveLastMonth.night.toFixed(1)}).appendTo(newTR);
        $('<TD>', {html:(normeHours[0].hoursToDo - (sixLastMonthTotal)).toFixed(1),class:dayToDoBackground}).appendTo(newTR);
        $('<TD>', {html:(normeHours[0].nightToDo - sixLastMonthNight).toFixed(1),class:nightToDoBackground}).appendTo(newTR);
        let flightday = ( (Math.floor((new Date()-pilotsHours[i].lastSimpildate)/1000/60/60/24)) > 1) ? ' jours' : 'jour';
        $('<TD>', {html:(Math.floor((new Date()-pilotsHours[i].lastFlightdate)/1000/60/60/24))+flightday,class:daySinceLastFlightBackground}).appendTo(newTR);
        let simpilday = ( (Math.floor((new Date()-pilotsHours[i].lastSimpildate)/1000/60/60/24)) > 1) ? ' jours' : 'jour';
        $('<TD>', {html:(Math.floor((new Date()-pilotsHours[i].lastSimpildate)/1000/60/60/24))+simpilday,class:daySinceLastSimpilBackground}).appendTo(newTR);
        newTR.appendTo($('#summarytbody'));
    }
}
async function displayPilotsHoursInTable(){
    const normes = await getFetchRequest('http://localhost:3000/api/norm');
    const normeDuration = normes[0].duration - 1;
    const pilotsHours = new Array;
    const lastMonthDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0));
    const sixLastMonthsDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth() - normeDuration, 1, 0, 0, 0));
    const twelveLastMonthsDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth() - 11, 1, 0, 0, 0));
    const today = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0));
    const pilots = await postFetchRequest('http://localhost:3000/api/pilot/23F', {belonging:'23F'});
    const twelveLastMonthsFlights = await postFetchRequest('http://localhost:3000/api/validatedFlight/byDate', {startDate: twelveLastMonthsDate, endDate: today});
    const sixLastMonthsSimpils = await postFetchRequest('http://localhost:3000/api/simpil/byDate', {startDate: sixLastMonthsDate, endDate: today});
    for ( let i = 0 ; i < pilots.length ; i++){
        pilotsHours[i] = {
            name:pilots[i].name,
            crew:pilots[i].crew,
            norme:pilots[i].norme,
            lastMonth:{day:0, night:0, simpilTotal:0, simpilNight:0},
            sixLastMonth:{day:0, night:0, simpilTotal:0, simpilNight:0},
            twelveLastMonth:{day:0, night:0},
            lastFlightdate: new Date(1970,1,1),
            lastSimpildate: new Date(1970,1,1)
        }
    }
    twelveLastMonthsFlights.forEach(flight => {
        flight.pilots.forEach(pilot => {
            let pilotindex = pilotsHours.findIndex(element => element.name === pilot.name);
            if ( pilotindex != -1){
                pilotsHours[pilotindex].lastFlightdate = new Date(Math.max(pilotsHours[pilotindex].lastFlightdate, new Date(flight.date)));
                if (new Date(flight.date) >= lastMonthDate) {
                    pilotsHours[pilotindex].lastMonth.day += pilot.day;
                    pilotsHours[pilotindex].lastMonth.night += pilot.night;
                }
                if (new Date(flight.date) >= sixLastMonthsDate) {
                    pilotsHours[pilotindex].sixLastMonth.day += pilot.day;
                    pilotsHours[pilotindex].sixLastMonth.night += pilot.night;
                }
                pilotsHours[pilotindex].twelveLastMonth.day += pilot.day;
                pilotsHours[pilotindex].twelveLastMonth.night += pilot.night;
            }
        });
    });
    sixLastMonthsSimpils.forEach(simpil => {
        simpil.pilots.forEach(pilot => {
            let pilotindex = pilotsHours.findIndex(element => element.name === pilot.name);
            if ( pilotindex != -1){
                pilotsHours[pilotindex].lastSimpildate = new Date(Math.max(pilotsHours[pilotindex].lastSimpildate, new Date(simpil.date)));
                if ( new Date(simpil.date) >= lastMonthDate){
                    pilotsHours[pilotindex].lastMonth.simpilTotal += pilot.total;
                    pilotsHours[pilotindex].lastMonth.simpilNight += pilot.night;
                }
                pilotsHours[pilotindex].sixLastMonth.simpilTotal += pilot.total;
                pilotsHours[pilotindex].sixLastMonth.simpilNight += pilot.night;

            }
        });
    });
    pilotsHours.sort(function compare(a,b){
        if ( a.crew < b.crew ) return -1;
        if ( a.crew > b.crew ) return 1;
        return 0;
    });
    buildTable(pilotsHours);
}