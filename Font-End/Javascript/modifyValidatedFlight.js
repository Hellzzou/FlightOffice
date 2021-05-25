async function deleteAFlight(id){
    const res = await deleteFetchRequest('http://localhost:3000/api/validatedFlight', {id:id, access:2});
    // utiliser res pour un toast
}
async function modifyAFlight(id){
    const groups = await postFetchRequest('http://localhost:3000/api/group/findUnderGroup', {underGroup:$('#Group').val()});
    let exercices =new Array;
    groups.forEach(group => {if ( typeof(group.context) !== 'undefined' ) group.context.forEach(context => exercices.push(context))});
    let pilots = [];
    for ( let i = 0 ; i < $('#flightPilotesFieldset > div').length - 1 ; i++){
        pilots.push({
            name: $('#flightPilotesFieldset > div').eq(i).find('select').val(),
            day: returnValueOrZero($('#flightPilotesFieldset > div').eq(i).find('input[data-durationType=day]').val()),
            night: returnValueOrZero($('#flightPilotesFieldset > div').eq(i).find('input[data-durationType=night]').val()),
        });
    }
    let date = {
        year: parseInt($('#date').val().split('-')[0]),
        month: parseInt($('#date').val().split('-')[1]) - 1,
        day: parseInt($('#date').val().split('-')[2]),
        hours: parseInt($('#takeoffTime').val().split(':')[0]),
        minutes: parseInt($('#takeoffTime').val().split(':')[1]),
    }
    let transformDate = new Date(Date.UTC(date.year, date.month, date.day, date.hours, date.minutes, 0));
    let flight = {
        date: transformDate,
        scheduledDeparture: $('#HPD').val(),
        dayDuration: returnValueOrZero($('#dayDuration').val()),
        nightDuration: returnValueOrZero($('#nightDuration').val()),
        belonging: $('#flightType').val(),
        mission: $('#mission').val(),
        type: $('#type').val(),
        aircraftNumber: parseInt($('#aircraftNumber').val()),
        crew: $('#crew').val(),
        flightType: [
            {type:'CAGIFR', day: returnValueOrZero($('#CAGIFRDay').val()), night: returnValueOrZero($('#CAGIFRNight').val())},
            {type:'CAGVFR', day: returnValueOrZero($('#CAGVFRDay').val()), night: returnValueOrZero($('#CAGVFRNight').val())},
            {type:'CAGIFR', day: returnValueOrZero($('#CAMTDay').val()), night: returnValueOrZero($('#CAMTNight').val())},
            {type:'CAGIFR', day: returnValueOrZero($('#CAMVDay').val()), night: returnValueOrZero($('#CAMVNight').val())},
            {type:'CAGIFR', day: returnValueOrZero($('#CAMIDay').val()), night: returnValueOrZero($('#CAMINight').val())}
        ],
        pilots: pilots,
        group: ($('#flightType').val() === 'Vol 23F') ? $('#Group').val() : $('#flightType').val(),
        client: ($('#flightType').val() === 'Vol 23F') ? $('#Client').val() : $('#flightType').val(),
        manager: ($('#flightType').val() === 'Vol 23F') ? $('#Manager').val() : $('#flightType').val(),
        done: $('#Done').val(),
        cause: ( $('#Cause').prop('disabled') === true ) ? 'done' : $('#AllFlightsCause').val(),
        area: $('#area').val()
    }
    if ( exercices.length === 0){
        let saved = await  postFetchRequest('http://localhost:3000/api/validatedFlight/save', {flight:flight, access:2});
        let deleted = await deleteFetchRequest('http://localhost:3000/api/validatedFlight', {id:id, access:2});
        if ( saved ===  'success' && deleted === 'success'){
            showToast('#modifiedFlightToast');
            $('#modifyFlight').removeClass('d-none');
            $('#flightSection').addClass('d-none');
            displayAllFlights($('#AllFlightssstartDate').val(), $('#AllFlightssendDdate').val());
            update();
        }
    }
    else {
        $('#context').empty();
        exercices.forEach(context => $('#context').append(new Option(context, context)));
        $('#exerciceModal').modal('show');
        $('#validateModal').click(async function(){
            flight.exercice = $('#context').val();
            let saved = await  postFetchRequest('http://localhost:3000/api/validatedFlight/save', {flight:flight, access:2});
            let deleted = await deleteFetchRequest('http://localhost:3000/api/validatedFlight', {id:id, access:2});
            if ( saved ===  'success' && deleted === 'success'){
                showToast('#modifiedFlightToast');
                $('#modifyFlight').removeClass('d-none');
                $('#flightSection').addClass('d-none');
                displayAllFlights($('#AllFlightssstartDate').val(), $('#AllFlightssendDdate').val());
                update();
                $('#exerciceModal').modal('hide');
            }
        });
    }
}
function fullfillThFormtoModify(flight){
    let month = (((new Date(flight.date).getMonth()+1)) < 10) ? '0'+(new Date(flight.date).getMonth()+1) : new Date(flight.date).getMonth()+1;
    let day = ((new Date(flight.date).getDate()) < 10) ? '0'+(new Date(flight.date).getDate()) : new Date(flight.date).getDate();
    let hours = ((new Date(flight.date).getUTCHours()) < 10) ? '0'+(new Date(flight.date).getUTCHours()) : new Date(flight.date).getUTCHours();
    let minutes = ((new Date(flight.date).getUTCMinutes()) < 10) ? '0'+(new Date(flight.date).getUTCMinutes()) : new Date(flight.date).getUTCMinutes();
    let date = new Date(flight.date).getFullYear()+'-'+month+'-'+day;
    $('#date').val(date);
    $('#HPD').val(flight.scheduledDeparture);
    $('#takeoffTime').val(hours+':'+minutes);
    $('#dayDuration').val(flight.dayDuration);
    $('#nightDuration').val(flight.nightDuration);
    $('#flightType').val(flight.belonging);
    $('#mission').val(flight.mission);
    $('#type').val(flight.type);
    $('#aircraftNumber').val(flight.aircraftNumber);
    $('#crew').val(flight.crew);
    $('#CAGIFRDay').val(flight.flightType[0].day);
    $('#CAGIFRNight').val(flight.flightType[0].night);
    $('#CAGVFRDay').val(flight.flightType[1].day);
    $('#CAGVFRNight').val(flight.flightType[1].night);
    $('#CAMTDay').val(flight.flightType[2].day);
    $('#CAMTNight').val(flight.flightType[2].night);
    $('#CAMVDay').val(flight.flightType[3].day);
    $('#CAMVNight').val(flight.flightType[3].night);
    $('#CAMIDay').val(flight.flightType[4].day);
    $('#CAMINight').val(flight.flightType[4].night);
    $('#CDAName').val(flight.pilots[0].name);
    $('#CDADay').val(flight.pilots[0].day);
    $('#CDANight').val(flight.pilots[0].night);
    $('#PiloteName').val(flight.pilots[1].name);
    $('#PiloteDay').val(flight.pilots[1].day);
    $('#PiloteNight').val(flight.pilots[1].night);
    for ( let i = 2 ; i < flight.pilots.length ; i++) insertNewPiloteinFlight(flight.pilots[i].name, flight.pilots[i].day, flight.pilots[i].night);
    $('#Group').val(flight.group);
    loadClientAndManager(flight.group);
    $('#Client').val(flight.client);
    $('#Manager').val(flight.manager);
    $('#Done').val(flight.done);
    if (flight.cause !== 'done'){
        console.log('disabled');
        $('#Cause').prop('disabled',false);
        $('#Cause').val(flight.cause);
    }
    else{
        $('#Cause').val('TECH');
        $('#Cause').prop('disabled', true);
    }
    $('#area').val(flight.area);
    fulllcheckFlightForm();
}
async function displayAFlightToModify(id){
    $('#modifyFlight').addClass('d-none');
    displayBDVFormModify()
    const flight = await postFetchRequest('http://localhost:3000/api/validatedFlight/find', {id:id, access:2});
    fullfillThFormtoModify(flight);
    $('#modifyFlightButton').prop('disabled',false);
    $('#modifyFlightButton').click(function(){modifyAFlight(id)});
}
function addnewTRAllFlights(validatedflights){
    let newTR = $('<TR>');
    let date = new Date(validatedflights.date).getDate()+'-'+((new Date(validatedflights.date).getMonth())+1)+'-'+new Date(validatedflights.date).getFullYear();
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

    let newTDButtonAdd = $('<TD>').appendTo(newTR);
    newTDButtonAdd.click(function(){displayAFlightToModify(validatedflights._id);})
    $('<button>', {class: 'btn btn-sm btn-success rounded fw-bold', html:'Modifier'}).appendTo(newTDButtonAdd);
    let newTDButtonDelete = $('<TD>').appendTo(newTR);
    newTDButtonDelete.click(function(){
        deleteAFlight(validatedflights._id);
        showToast('#deletedFlightToast');
        displayAllFlights($('#AllFlightssstartDate').val(), $('#AllFlightssendDdate').val());
        update();
    })
    $('<button>', {class: 'btn btn-sm btn-danger rounded fw-bold', html:'Supprimer'}).appendTo(newTDButtonDelete);
    newTR.appendTo($('#consultAllFlightssTBody'));
}
async function displayAllFlights(startDate, endDate){
    const validatedflights = await postFetchRequest('http://localhost:3000/api/validatedFlight/byDate', {'startDate':startDate, 'endDate':endDate, access :2});
    if ( validatedflights.length === 0 ) $('#noFlightToModify').html('Aucun vol à modifier pour cette période');
    else $('#noFlightToModify').html('');
    validatedflights.sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    $('#consultAllFlightssTBody tr').remove();
    for( let i = 0 ; i < validatedflights.length ; i++) addnewTRAllFlights(validatedflights[i]);
    checkForm('#consultAllFlightssForm');
}
(function(){
    $('#consultAllFlightssForm input').keyup(checkForm('#consultAllFlightssForm'));
    $('#consultAllFlightssForm input').change(function(){
        $('#DisplayAllFlightssButton').prop('disabled',false);
        checkForm('#consultAllFlightssForm');
    });
    $('#DisplayAllFlightssButton').click(function(){
        displayAllFlights($('#AllFlightssstartDate').val(), $('#AllFlightssendDdate').val());
        $('#DisplayAllFlightssButton').prop('disabled',true);
    });
})();