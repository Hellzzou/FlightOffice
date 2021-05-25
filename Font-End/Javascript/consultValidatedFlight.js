function addnewTRValidateFlight(validatedflights){
    let newTR = $('<TR>');
    let date = new Date(validatedflights.date).getDate()+'/'+((new Date(validatedflights.date).getMonth())+1)+'/'+new Date(validatedflights.date).getFullYear();
    $('<TD>',{html:date}).appendTo(newTR);
    $('<TD>', {html: validatedflights.aircraftNumber}).appendTo(newTR);
    $('<TD>', {html:validatedflights.pilots[0].name}).appendTo(newTR);
    $('<TD>', {html:validatedflights.crew }).appendTo(newTR);
    $('<TD>', {html:validatedflights.mission}).appendTo(newTR);
    $('<TD>', {html:validatedflights.done}).appendTo(newTR);
    let cause = (validatedflights.cause === 'done') ? '-' : validatedflights.cause;
    $('<TD>', {html:cause}).appendTo(newTR);
    $('<TD>', {html:validatedflights.group}).appendTo(newTR);
    $('<TD>', {html:validatedflights.client}).appendTo(newTR);
    $('<TD>', {html:validatedflights.manager}).appendTo(newTR);
    $('<TD>', {html:validatedflights.dayDuration}).appendTo(newTR);
    $('<TD>', {html:validatedflights.nightDuration}).appendTo(newTR);
    $('<TD>', {html:(validatedflights.dayDuration + validatedflights.nightDuration).toFixed(1)}).appendTo(newTR);
    newTR.appendTo($('#consultValidateFlightsTBody'));
}
async function displayValidatedFlights(startDate, endDate){
    $('#consultValidateFlightsTBody tr').remove();
    let sums ={day:0, night:0, total:0}
    const validatedflights = await postFetchRequest('http://localhost:3000/api/validatedFlight/byDate', {'startDate':startDate, 'endDate':endDate, access:1});
    if ( validatedflights.length === 0 ) $('#noFlightValidated').html('Aucun vol validé pour cette période');
    else $('#noFlightValidated').html('');
    validatedflights.sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    validatedflights.forEach(flight => {
        if( flight.belonging === 'Vol 23F'){
            sums.day += flight.dayDuration;
            sums.night += flight.nightDuration;
            sums.total += flight.dayDuration + flight.nightDuration;
            addnewTRValidateFlight(flight);
        }
    });
    $('#consultValidateFlightsFlightSumDay').html(sums.day.toFixed(1));
    $('#consultValidateFlightsFlightSumNight').html(sums.night.toFixed(1));
    $('#consultValidateFlightsFlightSumTotal').html(sums.total.toFixed(1));
    checkForm('#consultValidateFlightsForm');
}
(function(){
    $('#consultValidateFlightsForm input').keyup(checkForm('#consultValidateFlightsForm'));
    $('#consultValidateFlightsForm input').change(function(){
        checkForm('#consultValidateFlightsForm');
        $('#DisplayValidateFlightsButton').prop('disabled',false);
    });
    $('#DisplayValidateFlightsButton').click(function(){
        displayValidatedFlights($('#ValidateFlightsstartDate').val(), $('#ValidateFlightsendDdate').val());
        $('#DisplayValidateFlightsButton').prop('disabled',true);
    });
})();