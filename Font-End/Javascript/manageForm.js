function returnValueOrZero(inputValue){
    return ( inputValue !== '' ) ? parseFloat(inputValue) : 0;
}
function isValid(input) {
    switch (input.attr('data-type')) {
        case 'date':
            return ((new Date(input.val())).getFullYear() >= 1990) && ((new Date(input.val())).getFullYear() <= (new Date()).getFullYear() && new Date(input.val() < new Date()));
        case 'time':
            return (/\d{2}:\d{2}/).test(input.val());
        case 'duration':
            return (parseFloat(input.val()) >= 0) && (parseFloat(input.val()) <= 15);
        case 'text':
            return (input.val() !== '') && (input.val().length <= input.attr('data-max')) && (input.val().length >= input.attr('data-min'));
        case 'number' :
            return (input.val() !== '') && (parseFloat(input.val()) >= parseFloat(input.attr('data-min')) ) && ( parseFloat(input.val()) <= parseFloat(input.attr('data-max')) && !isNaN(parseFloat(input.val())));
        case 'crew' :
            return (((/^W[A-Z]/).test(input.val()) || (/^U[A-Z]/).test(input.val()) || (/^M[A-Z]/).test(input.val()) || (/^I[A-Z]/).test(input.val()) || input.val() === 'HE') && input.val().length === 2);
        case 'aircraft' :
            return (parseInt(input.val()) != '' && parseInt(input.val()) > 0 && parseInt(input.val()) < 29 && parseInt(input.val()) != 1 && parseInt(input.val()) != 2 && parseInt(input.val()) != 10)
        case 'password' :
            return (input.val().length > 7)
    }
}
async function loadPilotSelect(select, name){
    const pilots = await getFetchRequest('http://localhost:3000/api/pilot');
    for ( let i = 0 ; i < pilots.length ; i++) $('<option>', {value:pilots[i].name, html:pilots[i].name}).appendTo(select);
    if ( name !== '' ) select.val(name)
}
function enableButtons(form){
    let enable = true;
    for ( let i = 0 ; i < $(form+' input').length ; i++) enable = enable && ( $(form+' input').eq(i).attr('class').indexOf("is-invalid") === -1 );
    for ( let i = 0 ; i < $(form+' select').length ; i++) enable = enable && ( $(form+' select').eq(i).attr('class').indexOf("is-invalid") === -1 );
    if ( form === '#flightForm' )$('#newFlightButton').prop('disabled', !enable);
    if ( form === '#newSimpilForm') $('#newSimpilButton').prop('disabled', !enable);
}
function checkForm (form){
    for ( let i = 0 ; i < $(form+' input[data-check]').length ; i++){
        if ( isValid($(form+' input[data-check]').eq(i))) $(form+' input[data-check]').eq(i).removeClass('is-invalid').addClass('is-valid');
        else $(form+' input[data-check]').eq(i).removeClass('is-valid').addClass('is-invalid');
    }
    for ( let i = 0 ; i < $(form+' select').length ; i++){
        if ( $(form+' select').eq(i).val() != 'Choix...') $(form+' select').eq(i).removeClass('is-invalid').addClass('is-valid');
        else $(form+' select').eq(i).addClass('is-invalid').removeClass('is-valid');
    }
    enableButtons(form);
}
function resetForm(form){
    $(form)[0].reset();
    for ( let i = 0 ; i < $(form+' input').length ; i++) ($(form+' input').eq(i).attr('data-valid') === 'valid') ? $(form+' input').eq(i).removeClass('is-invalid').addClass('is-valid') : $(form+' input').eq(i).removeClass('is-valid').addClass('is-invalid');
    while ( $(form+' fieldset[data-pilot=pilot] > div').length > 3 ) $(form+' fieldset[data-pilot=pilot] > div')[$(form+' fieldset[data-pilot=pilot] > div').length-2].remove();
    for ( let i = 0 ; i < $(form+' select').length ; i++) ($(form+' select').eq(i).attr('data-valid') === 'valid') ? $(form+' select').eq(i).removeClass('is-invalid').addClass('is-valid') : $(form+' select').eq(i).removeClass('is-valid').addClass('is-invalid');
    if ( form === '#flightForm' )$('#newFlightButton').prop('disabled', true);
    if ( form === '#newSimpilForm') $('#newSimpilButton').prop('disabled', true);
    checkForm(form);
}
function checkDuration(fieldset, dayOrNight, toCompare, multiplier){
    let sum = 0;
    const durations = $(fieldset+' input[data-durationType='+dayOrNight+']');
    for ( let i = 0 ; i < durations.length ; i++) sum += returnValueOrZero(durations.eq(i).val());
    if ( sum.toFixed(1) == returnValueOrZero(toCompare.val())*multiplier) durations.removeClass('is-invalid').addClass('is-valid');
    else durations.removeClass('is-valid').addClass('is-invalid');
}
function enableFlightGroup(){
    if ( $('#flightType').val() === 'Vol 23F' ){
        $('#Group').prop('disabled', false);
        $('#Client').prop('disabled', false);
        $('#Manager').prop('disabled', false);
    }
    else {
        $('#Group').prop('disabled', true);
        $('#Client').prop('disabled', true);
        $('#Manager').prop('disabled', true);
    }
}
function durationIsNotNull(){
    ( $('#dayDuration').val() != '' || $('#nightDuration').val() != '' ) ? $('#flightForm input[data-type=duration]').removeClass('is-invalid').addClass('is-valid') : $('#flightForm input[data-type=duration]').addClass('is-invalid').removeClass('is-valid');
}
function fulllcheckFlightForm(){
    durationIsNotNull();
    checkDuration('#flightDurationTypeFieldset', 'day', $('#dayDuration'), 1);
    checkDuration('#flightPilotesFieldset', 'day', $('#dayDuration'), 2);
    checkDuration('#flightDurationTypeFieldset', 'night', $('#nightDuration'), 1);
    checkDuration('#flightPilotesFieldset', 'night', $('#nightDuration'), 2);
    checkForm('#flightForm');
    enableFlightGroup();
}
function fullcheckSimpilForm(){
    checkDuration('#newSimpilPilotesFieldset', 'day', $('#newSimpilDuration'), 2);
    checkForm('#newSimpilForm');
}
function createDurationInput (newDiv, placeholder, dayOrNight, value){
    let div = $('<div>', {class:'col-md-3'}).appendTo(newDiv);
    let input = $('<input>', {class:'form-control bg-dark text-center text-light is-invalid', step:"0.1", type:'number', placeholder:placeholder});
    input.attr('data-durationType', dayOrNight).val(value).keyup(fulllcheckFlightForm).change(fulllcheckFlightForm).appendTo(div);
}
function insertNewPiloteinFlight(name, day, night){
    let newDiv = $('<div>', {class:'form-group row my-1'});
    $('<label>', {class:'col-md-2 col-form-label fw-bold', html:'Pilote :'}).appendTo(newDiv);
    let selectDiv = $('<div>', {class:'col-md-3'}).appendTo(newDiv);
    let newselect = $('<select>', {class:'form-select bg-dark text-center text-light is-invalid'}).appendTo(selectDiv);
    newselect.change(fulllcheckFlightForm);
    newselect.append(new Option('Choix...', 'Choix...'));
    loadPilotSelect(newselect, name);
    createDurationInput(newDiv, 'Jour...', 'day', day);
    createDurationInput(newDiv, 'Nuit...', 'night', night);
    let img = $('<div>', {class:'col-md-1', html:'<img src="images/croixrouge1.png" width="22">'});
    img.click(function(){
        newDiv.remove();
        fulllcheckFlightForm();
    });
    img.appendTo(newDiv);
    $('#insertPilotFormGroup').before(newDiv);
    fulllcheckFlightForm();    
}
function insertNewPiloteinSimpil(name){
    let newDiv = $('<div>', {class:'form-group row m-1'});
    $('<label>', {class:'col-md-2 col-form-label fw-bold', html:'Pilote :'}).appendTo(newDiv);
    let selectDiv = $('<div>', {class:'col-md-5'}).appendTo(newDiv);
    let newselect = $('<select>', {class:'form-select bg-dark text-center text-light is-invalid'}).appendTo(selectDiv);
    newselect.change(fullcheckSimpilForm);
    newselect.append(new Option('Choix...', 'Choix...'));
    loadPilotSelect(newselect, name);
    createDurationInput(newDiv, 'Durée...', 'day', '');
    let img = $('<div>', {class:'col-md-1', html:'<img src="images/croixrouge1.png" width="22">'});
    img.click(function(){
        newDiv.remove();
        fullcheckSimpilForm();
    });
    img.appendTo(newDiv);
    $('#newSimpilFormButton').before(newDiv);
    fullcheckSimpilForm();
}
async function insertNewFlight(){
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
    let newFlight = {
        date: new Date(Date.UTC(date.year, date.month, date.day, date.hours, date.minutes, 0)),
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
        pilots: pilots
    };
    if ( await postFetchRequest('http://localhost:3000/api/newFlight/save', newFlight) === 'success'){
        showToast('#enteredFlightToast');
        resetForm('#flightForm');
    }
}
async function insertNewSimpil(){
    let pilots = [];
    for ( let i = 0 ; i < $('#newSimpilPilotesFieldset > div').length - 1 ; i++){
        if ($('#newSimpilPilotesFieldset > div').eq(i).find('input').val() != ''){
            pilots.push({
                name: $('#newSimpilPilotesFieldset > div').eq(i).find('select').val(),
                total: returnValueOrZero($('#newSimpilPilotesFieldset > div').eq(i).find('input').val()),
                night: returnValueOrZero(($('#newSimpilPilotesFieldset > div').eq(i).find('input').val() / 3).toFixed(1)),
            });
        }
    }
    let date = {
        year: parseInt($('#newSimpilDate').val().split('-')[0]),
        month: parseInt($('#newSimpilDate').val().split('-')[1]) - 1,
        day: parseInt($('#newSimpilDate').val().split('-')[2]),
    }
    let newSimpil = {
        date: new Date(Date.UTC(date.year, date.month, date.day, 0, 0, 0)),
        mission: $('#newSimpilMission').val(),
        totalDuration: returnValueOrZero($('#newSimpilDuration').val()).toFixed(1),
        nightDuration: returnValueOrZero(($('#newSimpilDuration').val() /3).toFixed(1)),
        pilots: pilots
    }
    if ( await postFetchRequest('http://localhost:3000/api/simpil/save', newSimpil) === 'success'){
        showToast('#enteredSimpilToast');
        resetForm('#newSimpilForm');
    }
}
async function loadSelects(){
    let groupArray = new Array;
    loadPilotSelect($('#CDAName'), '');
    loadPilotSelect($('#PiloteName'), '');
    loadPilotSelect($('#newSimpilCDAName', ''));
    loadPilotSelect($('#newSimpilPiloteName', ''));
    const groups = await getFetchRequest('http://localhost:3000/api/group');
    const areas = await getFetchRequest('http://localhost:3000/api/area');
    const type = await getFetchRequest('http://localhost:3000/api/type');
    for ( let i = 0 ; i < groups.length ; i++ ) {
        if ( groupArray.includes(groups[i].underGroup) === false){
            groupArray.push(groups[i].underGroup);
            $('#Group').append(new Option(groups[i].underGroup, groups[i].underGroup));
        }
    }
    for ( let i = 0 ; i < areas.length ; i++) $('#area').append(new Option(areas[i].name, areas[i].name));
    for ( let i = 0 ; i < type.length ; i++) $('#type').append(new Option(type[i].name, type[i].name));
}
async function loadClientAndManager(group){
    let clientsArray = new Array;
    let managerArray = new Array;
    const allGroups = await postFetchRequest('http://localhost:3000/api/group/findUnderGroup', {underGroup:group});
    $('#Client').empty();
    $('#Manager').empty();
    for ( let i = 0 ; i < allGroups.length ; i++ ){
        if ( clientsArray.includes(allGroups[i].client) === false){
            clientsArray.push(allGroups[i].client);
            $('#Client').append(new Option(allGroups[i].client, allGroups[i].client));
        }
        if ( managerArray.includes(allGroups[i].manager) === false){
            managerArray.push(allGroups[i].manager);
            $('#Manager').append(new Option(allGroups[i].manager, allGroups[i].manager));
        }
    }
}
async function loadClient(group, manager){
    let clientsArray = new Array;
    const allGroups = await postFetchRequest('http://localhost:3000/api/group/findManager', {underGroup:group, manager:manager});
    $('#Client').empty();
    for ( let i = 0 ; i < allGroups.length ; i++ ){
        if ( clientsArray.includes(allGroups[i].client) === false){
            clientsArray.push(allGroups[i].client);
            $('#Client').append(new Option(allGroups[i].client, allGroups[i].client));
        }
    }
}
async function loadManager(group, client){
    let managerArray = new Array;
    const allGroups = await postFetchRequest('http://localhost:3000/api/group/findClient', {underGroup:group, client:client});
    $('#Manager').empty();
    for ( let i = 0 ; i < allGroups.length ; i++ ){
        if ( managerArray.includes(allGroups[i].manager) === false){
            managerArray.push(allGroups[i].manager);
            $('#Manager').append(new Option(allGroups[i].manager, allGroups[i].manager));
        }
    }
}
function displayBDVFormModify(){
    $('#flightSection').removeClass('d-none');
    $('#typeChoiceFormGroup').addClass('d-none');
    $('#flightForm').removeClass('d-none');
    $('#newSimpilForm').addClass('d-none');
    $('#newFlightButtonForm').addClass('d-none');
    $('#newSimpilButtonForm').addClass('d-none');
    $('#bdvForm').removeClass('d-none');
    $('#validateButtonsForm').addClass('d-none');
    $('#modifybuttonForm').removeClass('d-none');
    resetForm('#flightForm');
}
function displayBDVFormValidate(){
    $('#flightSection').removeClass('d-none');
    $('#typeChoiceFormGroup').addClass('d-none');
    $('#flightForm').removeClass('d-none');
    $('#newSimpilForm').addClass('d-none');
    $('#newFlightButtonForm').addClass('d-none');
    $('#newSimpilButtonForm').addClass('d-none');
    $('#bdvForm').removeClass('d-none');
    $('#validateButtonsForm').removeClass('d-none');
    $('#modifybuttonForm').addClass('d-none');
    resetForm('#flightForm');
}
function displayflightForm(){
    $('#typeChoiceFormGroup').removeClass('d-none');
    $('#flightTypeButton').addClass('bg-primary');
    $('#flightTypeButton').addClass('text-light');
    $('#SimpiTypeButton').removeClass('bg-primary');
    $('#SimpiTypeButton').removeClass('text-light');
    $('#flightForm').removeClass('d-none');
    $('#newSimpilForm').addClass('d-none');
    $('#newFlightButtonForm').removeClass('d-none');
    $('#newSimpilButtonForm').addClass('d-none');
    $('#bdvForm').addClass('d-none');
    $('#validateButtonsForm').addClass('d-none');
    $('#modifybuttonForm').addClass('d-none');
    resetForm('#flightForm');
}
function displaySimpilForm(){
    $('#typeChoiceFormGroup').removeClass('d-none');
    $('#flightTypeButton').removeClass('bg-primary');
    $('#flightTypeButton').removeClass('text-light');
    $('#SimpiTypeButton').addClass('bg-primary');
    $('#SimpiTypeButton').addClass('text-light');
    $('#flightForm').addClass('d-none');
    $('#newSimpilForm').removeClass('d-none');
    $('#newFlightButtonForm').addClass('d-none');
    $('#newSimpilButtonForm').removeClass('d-none');
    $('#bdvForm').addClass('d-none');
    $('#validateButtonsForm').addClass('d-none');
    $('#modifybuttonForm').addClass('d-none');
    resetForm('#newSimpilForm');
}
$(document).ready(function(){
    loadSelects();
    $('#flightTypeButton').click(displayflightForm);
    $('#SimpiTypeButton').click(displaySimpilForm);
    $('#flightForm input').keyup(fulllcheckFlightForm);
    $('#flightForm input').change(fulllcheckFlightForm);
    $('#flightForm select').change(fulllcheckFlightForm);
    $('#insertNewPiloteButton').click(function(){insertNewPiloteinFlight('', '', '');});
    $('#newFlightButton').click(insertNewFlight);
    $('#newSimpilForm input').keyup(fullcheckSimpilForm);
    $('#newSimpilForm input').change(fullcheckSimpilForm);
    $('#newSimpilForm select').change(fullcheckSimpilForm);
    $('#insertNewPiloteButtonSimpil').click(function(){insertNewPiloteinSimpil('');});
    $('#newSimpilButton').click(insertNewSimpil);
    $('#Group').change(function(){loadClientAndManager($('#Group').val());});
    $('#Client').change(function(){loadManager($('#Group').val(), $('#Client').val());});
    $('#Manager').change(function(){loadClient($('#Group').val(), $('#Manager').val());});
    $('#Done').change(function(){( $('#Done').val() !== 'ME') ? $('#Cause').prop('disabled', false) : $('#Cause').prop('disabled', true);});
    $('#validateFlightButton').click(function(){validateFlight($('#flightForm').attr('data-id'))});
    $('#validateFlightReturnButton').click(function(){
        $('#validateFlight').removeClass('d-none');
        $('#flightForm').addClass('d-none');
        $('#bdvForm').addClass('d-none');
        $('#validateButtonsForm').addClass('d-none');
    });
    $('#mnodifyFlightReturnButton').click(function(){
        $('#modifyFlight').removeClass('d-none');
        $('#flightForm').addClass('d-none');
        $('#bdvForm').addClass('d-none');
        $('#modifybuttonForm').addClass('d-none');
    });

})