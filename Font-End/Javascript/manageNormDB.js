async function addANormline(document, TR){
    Object.entries(document).forEach(([key, value]) => {
        if ( key !== '_id' && key !== '__v'){
            if ( key === 'name'){
                let TD = $('<TD>').appendTo(TR);
                let input = $('<input>',{class:"form-control bg-dark text-center text-light rounded is-valid", type:'text', placeholder:'Une seule lettre majuscule'}).appendTo(TD);
                input.attr('data-key', key).val(value).keyup(checkNormForm);
            }
            if ( key === 'hoursToDo' || key === 'nightToDo'){
                let TD = $('<TD>').appendTo(TR);
                let input = $('<input>',{class:"form-control bg-dark text-center text-light rounded is-valid", type:'number', placeholder:'entre 1 et 300'}).appendTo(TD);
                input.attr('data-key', key).attr('data-type', 'number').attr('data-max', 300).attr('data-min', 1).val(value).keyup(checkNormForm);
            }
            if ( key === 'duration'){
                let TD = $('<TD>').appendTo(TR);
                let input = $('<input>',{class:"form-control bg-dark text-center text-light rounded is-valid", type:'number', placeholder:'entre 1 et 12'}).appendTo(TD);
                input.attr('data-key', key).attr('data-type', 'number').attr('data-max', 12).attr('data-min', 1).val(value).keyup(checkNormForm);
            }
        }
    });
    let addTD = $('<TD>').appendTo(TR);
    $('<button>', {type:'button', class:'col-12 btn btn-primary rounded fw-bold', html:'Ajouter une norme'}).appendTo(addTD).click(function(){
        let addedTR = $('<TR>');
        TR.after(addedTR);
        addANormline({name:'', hoursToDo:'', nightToDo:'', duration:''},addedTR)});
        checkNormForm();
    let deleteTD = $('<TD>').appendTo(TR);
    $('<button>', {type:'button', class:'col-12 btn btn-danger rounded fw-bold', html:'Supprimer cette norme'}).appendTo(deleteTD).click(function(){
        TR.remove();
        checkNormForm();
    });
}
async function displayNormForm(){
    $('#cards').addClass('d-none');
    $('#dbForms').removeClass('d-none');
    $('#dbForms > div').addClass('d-none');
    $('#normsDiv').removeClass('d-none');
    $('#normsTbody tr').remove();
    const documents = await getFetchRequest('http://localhost:3000/api/norm');
    documents.forEach(document => {
        let newTR = $('<TR>', {id:document._id}).appendTo($('#normsTbody'));
        addANormline(document, newTR);
    });
}
async function checkNormForm(){
    for(let i = 0 ; i < $('#normsTbody input').length ; i++){
        if ($('#normsTbody input').eq(i).attr('data-key') === 'name'){
            if ( (/^[A-Z]{1}/).test($('#normsTbody input').eq(i).val()) === false || $('#normsTbody input').eq(i).val().length !== 1)  $('#normsTbody input').eq(i).removeClass('is-valid').addClass('is-invalid');
            else $('#normsTbody input').eq(i).addClass('is-valid').removeClass('is-invalid');
        }
        else {
            if ( isValid($('#normsTbody input').eq(i))) $('#normsTbody input').eq(i).addClass('is-valid').removeClass('is-invalid');
            else $('#normsTbody input').eq(i).removeClass('is-valid').addClass('is-invalid');
        }
    }
    let enable = true;
    for ( let i = 0 ; i < $('#normsTbody input').length ; i++) enable = enable && ( $('#normsTbody input').eq(i).attr('class').indexOf("is-invalid") === -1 );
    $('#normModifyButton').prop('disabled', !enable)
}
async function updateNormDb(){
    await deleteFetchRequest('http://localhost:3000/api/norm', {id:'', access:2});
    for(let i = 0 ; i < $('#normsTbody tr').length ; i++){
        let norm = {
            name: $('#normsTbody tr').eq(i).find('input[data-key=name]').val(),
            hoursToDo: parseInt($('#normsTbody tr').eq(i).find('input[data-key=hoursToDo]').val()),
            nightToDo: parseInt($('#normsTbody tr').eq(i).find('input[data-key=nightToDo]').val()),
            duration: parseInt($('#normsTbody tr').eq(i).find('input[data-key=duration]').val())
        }
        let response = await postFetchRequest('http://localhost:3000/api/norm/save', {norm:norm, access:2});
        if ( response === 'success') showToast('#UpdatedNormsToast');
    }
    displayCards();
}
(function(){
    $('#displayNormsDiv').click(displayNormForm);
    $('#normReturnButton').click(function(){displayCards()});
    $('#normModifyButton').click(updateNormDb);
})();