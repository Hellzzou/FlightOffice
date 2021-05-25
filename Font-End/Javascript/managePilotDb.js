function displayCards(){
    $('#cards').removeClass('d-none');
    $('#dbForms').addClass('d-none');
}
async function addAline(document, TR){
    const norms = await getFetchRequest('http://localhost:3000/api/norm');
    let normsNames = new Array();
    norms.forEach(norm => normsNames.push(norm.name));
    Object.entries(document).forEach(([key, value]) => {
        switch(key){
            case 'name' :
                let nameTD = $('<TD>').appendTo(TR);
                let nameInput = $('<input>',{class:"form-control bg-dark text-center text-light rounded is-valid", type:'text'}).appendTo(nameTD);
                nameInput.attr('data-key', key).val(value).keyup(checkPilForm);
                break;
            case 'crew' :
                let crewTD = $('<TD>').appendTo(TR);
                let crewInput = $('<input>',{class:"form-control bg-dark text-center text-light rounded is-valid", type:'text'}).appendTo(crewTD);
                crewInput.attr('data-key', key).attr('data-type', 'crew').keyup(checkPilForm);
                let crewValue = ( value === 'Hors 23F') ? '' : value;
                crewInput.val(crewValue);
                break;
            case 'norme' :
                let normTD = $('<TD>').appendTo(TR);
                let normSelect = $('<select>',{class:"form-select bg-dark text-center text-light rounded is-valid"}).appendTo(normTD);
                normsNames.forEach(name => normSelect.append(new Option(name, name)));
                normSelect.attr('data-key', key).val(value).change(checkPilForm);
                break;
            case 'belonging' :
                let belongingTD = $('<TD>').appendTo(TR);
                let belongingSelect = $('<select>',{class:"form-select bg-dark text-center text-light rounded is-valid"}).appendTo(belongingTD);
                belongingSelect.append(new Option('23F', '23F'));
                belongingSelect.append(new Option('21F', '21F'));
                belongingSelect.append(new Option('Hors flotille', 'Hors flotille'));
                belongingSelect.attr('data-key', key).val(value).change(checkPilForm);
                break;
            default :
                break;
        }
    });
    let addTD = $('<TD>').appendTo(TR);
    $('<button>', {type:'button', class:'col-12 btn btn-primary rounded fw-bold', html:'Ajouter un pilote'}).appendTo(addTD).click(function(){
        let addedTR = $('<TR>');
        TR.after(addedTR);
        addAline({name:'', norme:'A', belonging:'23F', crew:''},addedTR)});
        checkPilForm();
    let deleteTD = $('<TD>').appendTo(TR);
    $('<button>', {type:'button', class:'col-12 btn btn-danger rounded fw-bold', html:'Supprimer ce pilote'}).appendTo(deleteTD).click(function(){
        TR.remove();
        checkPilForm();
    });
}
async function displayPilForm(){
    $('#cards').addClass('d-none');
    $('#dbForms').removeClass('d-none');
    $('#dbForms > div').addClass('d-none');
    $('#pilotsDiv').removeClass('d-none');
    $('#pilotsTbody tr').remove();
    const documents = await getFetchRequest('http://localhost:3000/api/pilot');
    documents.forEach(document => {
        let newTR = $('<TR>', {id:document._id}).appendTo($('#pilotsTbody'));
        addAline(document, newTR);
    });
}
async function checkPilForm(){
    for(let i = 0 ; i < $('#pilotsTbody tr').length ; i++){
        if ( typeof($('#pilotsTbody tr').eq(i).find('input[data-key=name]').val()) !== 'undefined'){
            if ( $('#pilotsTbody tr').eq(i).find('input[data-key=name]').val().length === 0 )  $('#pilotsTbody tr').eq(i).find('input[data-key=name]').removeClass('is-valid').addClass('is-invalid');
            else $('#pilotsTbody tr').eq(i).find('input[data-key=name]').addClass('is-valid').removeClass('is-invalid');
        }
        if ( $('#pilotsTbody tr').eq(i).find('select[data-key=belonging]').val() === '23F'){
            if ( !isValid($('#pilotsTbody tr').eq(i).find('input[data-key=crew]')) ) $('#pilotsTbody tr').eq(i).find('input[data-key=crew]').removeClass('is-valid').addClass('is-invalid');
            else $('#pilotsTbody tr').eq(i).find('input[data-key=crew]').addClass('is-valid').removeClass('is-invalid');
        }
        else $('#pilotsTbody tr').eq(i).find('input[data-key=crew]').addClass('is-valid').removeClass('is-invalid');
    }
    let enable = true;
    for ( let i = 0 ; i < $('#pilotsTbody input').length ; i++) enable = enable && ( $('#pilotsTbody input').eq(i).attr('class').indexOf("is-invalid") === -1 );
    $('#pilModifyButton').prop('disabled', !enable)

}
async function updatePilDb(){
    await deleteFetchRequest('http://localhost:3000/api/pilot', {id:'', access:2});
    for(let i = 0 ; i < $('#pilotsTbody tr').length ; i++){
        let pilot = {
            name: $('#pilotsTbody tr').eq(i).find('input[data-key=name]').val(),
            norme: $('#pilotsTbody tr').eq(i).find('select[data-key=norme]').val(),
            belonging: $('#pilotsTbody tr').eq(i).find('select[data-key=belonging]').val(),
            crew: ($('#pilotsTbody tr').eq(i).find('input[data-key=crew]').val() === '' ) ? 'Hors 23F' : $('#pilotsTbody tr').eq(i).find('input[data-key=crew]').val()
        }
        let response = await postFetchRequest('http://localhost:3000/api/pilot/save', {pilot:pilot, access:2});
        if ( response === 'success') showToast('#UpdatedPilotsToast');
    }
    displayCards();
}
(function(){
    $('#displayPilotsDiv').click(displayPilForm);
    $('#pilReturnButton').click(displayCards);
    $('#pilModifyButton').click(updatePilDb);
})();