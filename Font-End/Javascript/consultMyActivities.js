function addnewTR(pilot, flightOrSimpil){
    let flight = typeof(flightOrSimpil.belonging) !== 'undefined';
    let newTR = $('<TR>');
    let date = new Date(flightOrSimpil.date).getDate()+'-'+((new Date(flightOrSimpil.date).getMonth())+1)+'-'+new Date(flightOrSimpil.date).getFullYear();
    type = ( flight) ? flightOrSimpil.belonging : 'SIMPIL';
    $('<TD>', {html: type, class:'type'}).appendTo(newTR);
    $('<TD>',{html:date}).appendTo(newTR);
    aicraftValue = ( flight ) ? flightOrSimpil.aircraftNumber : '/';
    $('<TD>', {html: aicraftValue}).appendTo(newTR);
    responsabilty = (flightOrSimpil.pilots[0].name === pilot) ? 'CDA' : 'pilote';
    $('<TD>', {html:responsabilty}).appendTo(newTR);
    crew = ( flight ) ? flightOrSimpil.crew : '/';
    $('<TD>', {html:crew}).appendTo(newTR);
    $('<TD>', {html:flightOrSimpil.mission}).appendTo(newTR);
    for ( let i = 0 ; i < flightOrSimpil.pilots.length; i++){
        if ( flightOrSimpil.pilots[i].name === pilot ){
            let day = ( flight ) ? flightOrSimpil.pilots[i].day : flightOrSimpil.pilots[i].total - flightOrSimpil.pilots[i].night;
            let total = ( flight ) ? flightOrSimpil.pilots[i].day + flightOrSimpil.pilots[i].night : flightOrSimpil.pilots[i].total;
            $('<TD>', {html:day.toFixed(1), class:'day'}).appendTo(newTR);
            $('<TD>', {html:(flightOrSimpil.pilots[i].night).toFixed(1), class:'night'}).appendTo(newTR);
            $('<TD>', {html:total.toFixed(1), class:'total'}).appendTo(newTR);
        }
    }
    newTR.appendTo($('#consultMyHoursTBody'));
}
async function displayMyHours(startDate, endDate){
    $('#consultMyHoursTBody tr').remove();
    const pilot = await postFetchRequest('http://localhost:3000/api/user/getOne');
    const pilotName = await postFetchRequest('http://localhost:3000/api/pilot/getOne', {name:pilot.name});
    if ( typeof(pilotName[0]) !== 'undefined'){
        const flightsOrSimpils = await postFetchRequest('http://localhost:3000/api/validatedFlight/byDate', {'startDate':startDate, 'endDate':endDate, 'access':0});
        const simpils = await postFetchRequest('http://localhost:3000/api/simpil/byDate', {'startDate':startDate, 'endDate':endDate, 'acces':0});
        for ( let i = 0 ; i < simpils.length ; i++) flightsOrSimpils.push(simpils[i]);
        flightsOrSimpils.sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
        let myhours = new Array;
        flightsOrSimpils.forEach(activity => {
            let found = false;
            activity.pilots.forEach(pilot => { found = found || pilot.name === pilotName[0].name;})
            if ( found ) myhours.push(flightsOrSimpils[i]);
        });
        if ( myhours.length === 0) $('#noActivities').html('Aucune activité pour cette période');
        else $('#noActivities').html('');
        myhours.forEach(activity => addnewTR(pilotName[0].name, activity));
        let sums ={
            flights:{day:0, night:0, total:0},
            simpils:{day:0, night:0, total:0}
        }
        for ( let i = 0 ; i < $('#consultMyHoursTBody tr').length ; i++){
            if ($('#consultMyHoursTBody tr').eq(i).find('td[class=type]').html() === 'SIMPIL'){
                sums.simpils.day += parseFloat($('#consultMyHoursTBody tr').eq(i).find('td[class=day]').html());
                sums.simpils.night += parseFloat($('#consultMyHoursTBody tr').eq(i).find('td[class=night]').html());
                sums.simpils.total += parseFloat($('#consultMyHoursTBody tr').eq(i).find('td[class=total]').html());
            }
            else{
                sums.flights.day += parseFloat($('#consultMyHoursTBody tr').eq(i).find('td[class=day]').html());
                sums.flights.night += parseFloat($('#consultMyHoursTBody tr').eq(i).find('td[class=night]').html());
                sums.flights.total += parseFloat($('#consultMyHoursTBody tr').eq(i).find('td[class=total]').html());
            }
        }
        $('#consultMyHoursFlightSumDay').html(sums.flights.day.toFixed(1));
        $('#consultMyHoursFlightSumNight').html(sums.flights.night.toFixed(1));
        $('#consultMyHoursFlightSumTotal').html(sums.flights.total.toFixed(1));
        $('#consultMyHoursSimpilSumDay').html(sums.simpils.day.toFixed(1));
        $('#consultMyHoursSimpilSumNight').html(sums.simpils.night.toFixed(1));
        $('#consultMyHoursSimpilSumTotal').html(sums.simpils.total.toFixed(1));
        checkForm('#consultMyHoursForm');
    }
    else $('#noActivities').html("Vous n'êtes pas pilote");
}
(function(){
    $('#consultMyHoursForm input').keyup(checkForm('#consultMyHoursForm'));
    $('#consultMyHoursForm input').change(function(){
        $('#DisplayMyHoursButton').prop('disabled',false);
        checkForm('#consultMyHoursForm');
    });
    $('#DisplayMyHoursButton').click(function(){
        displayMyHours($('#startDate').val(), $('#endDdate').val());
        $('#DisplayMyHoursButton').prop('disabled',true);
    });
})();