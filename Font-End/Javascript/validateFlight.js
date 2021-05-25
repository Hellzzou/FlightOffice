function fullfillThForm(flight){
    let month = (((new Date(flight.date).getMonth()+1)) < 10) ? '0'+(new Date(flight.date).getMonth()+1) : new Date(flight.date).getMonth()+1;
    let day = ((new Date(flight.date).getDate()) < 10) ? '0'+(new Date(flight.date).getDate()) : new Date(flight.date).getDate();
    let hours = ((new Date(flight.date).getUTCHours()) < 10) ? '0'+(new Date(flight.date).getUTCHours()) : new Date(flight.date).getUTCHours();
    let minutes = ((new Date(flight.date).getUTCMinutes()) < 10) ? '0'+(new Date(flight.date).getUTCMinutes()) : new Date(flight.date).getUTCMinutes();
    let date = new Date(flight.date).getFullYear()+'-'+month+'-'+day;
    $('#flightForm').attr('data-id', flight._id);
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
    loadClientAndManager($('#Group').val());
    for ( let i = 2 ; i < flight.pilots.length ; i++) insertNewPiloteinFlight(flight.pilots[i].name, flight.pilots[i].day, flight.pilots[i].night);
    fulllcheckFlightForm();
}
async function validateflightRequest(flight, id){
    let deleted = await deleteFetchRequest('http://localhost:3000/api/newFlight', {id:id, access:1});
    let saved = await  postFetchRequest('http://localhost:3000/api/validatedFlight/save', {flight:flight, access:1});
    if ( saved ===  'success' && deleted == 'success'){
        showToast('#validatedFlightToast');
        $('#validateFlight').removeClass('d-none');
        $('#flightForm').addClass('d-none');
        $('#bdvForm').addClass('d-none');
        $('#validateButtonsForm').addClass('d-none');
        displayUnValidatedFlight();
        update();
    }
}
async function validateFlight(id){
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
    let flight = {
        date: new Date(Date.UTC(date.year, date.month, date.day, date.hours, date.minutes, 0)),
        scheduledDeparture: $('#HPD').val(),
        dayDuration: returnValueOrZero($('#dayDuration').val()),
        nightDuration: returnValueOrZero($('#nightDuration').val()),
        belonging: $('#flightType').val(),
        mission: $('#mission').val(),
        type: $('#type').val(),
        aircraftNumber: parseInt($('#aircraftNumber').val()),
        crew: $('#crew').val(),
        flightType:[
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
        cause: ( $('#Cause').prop('disabled') === true ) ? 'done' : $('#Cause').val(),
        area: $('#area').val()
    }
    if ( exercices.length === 0) validateflightRequest(flight, id);
    else {
        $('#context').empty();
        exercices.forEach(context => $('#context').append(new Option(context, context)));
        $('#exerciceModal').modal('show');
        $('#validateModal').click(async function(){
            flight.exercice = $('#context').val();
            validateflightRequest(flight, id);
            $('#exerciceModal').modal('hide');
        });
    }
}
function addNewTR(flight){
    let newTR = $('<TR>');
    let month = ( new Date(flight.date).getMonth() < 10 ) ? '0'+(new Date(flight.date).getMonth()+1).toString() : (new Date(flight.date).getMonth()+1).toString();
    let day = ( new Date(flight.date).getDate() < 10 ) ? '0'+(new Date(flight.date).getDate()).toString() : (new Date(flight.date).getDate()).toString();
    const frenchDate = day+'-'+month+'-'+new Date(flight.date).getFullYear();
    $('<TD>', {html:frenchDate}).appendTo(newTR);
    $('<TD>', {html:flight.pilots[0].name}).appendTo(newTR);
    $('<TD>', {html:flight.aircraftNumber}).appendTo(newTR);
    $('<TD>', {html:flight.crew}).appendTo(newTR);
    $('<TD>', {html:flight.mission}).appendTo(newTR);
    $('<TD>', {html:flight.dayDuration.toFixed(1)}).appendTo(newTR);
    $('<TD>', {html:flight.nightDuration.toFixed(1)}).appendTo(newTR);
    $('<TD>', {html:(flight.nightDuration+flight.dayDuration).toFixed(1)}).appendTo(newTR);
    let newTDButtonAdd = $('<TD>').appendTo(newTR);
    newTDButtonAdd.click(function(){displayAFlightToValidate(flight._id);})
    $('<button>', {class: 'btn btn-sm btn-success rounded fw-bold', html:'Valider'}).appendTo(newTDButtonAdd);
    let newTDButtonDelete = $('<TD>').appendTo(newTR);
    newTDButtonDelete.click(async function(){
        const res = await deleteFetchRequest('http://localhost:3000/api/newFlight', {id:flight._id, access:1});
        if ( res === 'success'){
            displayUnValidatedFlight();
            showToast('#deletedFlightToast');
        }
    });
    $('<button>', {class: 'btn btn-sm btn-danger rounded fw-bold', html:'Supprimer'}).appendTo(newTDButtonDelete);
    return newTR;
}
async function displayUnValidatedFlight(){
    $('#flightToValidate tr').remove();
    const flights = await getFetchRequest('http://localhost:3000/api/newFlight');
    flights.sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    flights.forEach(flight => addNewTR(flight).appendTo($('#flightToValidate')));
    if ( flights.length === 0 ) $('#noFlightToValidate').html("Il n'y a aucun vol à valider");
    else $('#noFlightToValidate').html('');
}
async function displayAFlightToValidate(id){
    $('#validateFlight').addClass('d-none');
    displayBDVFormValidate();
    const flight = await postFetchRequest('http://localhost:3000/api/newFlight/find', {id:id, access:1});
    fullfillThForm(flight);
    $('#validateFlightButton').prop('disabled',false);
}