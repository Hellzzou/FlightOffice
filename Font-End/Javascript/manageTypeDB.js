async function addATypeline(document, TR){
    Object.entries(document).forEach(([key, value]) => {
        if ( key !== '_id' && key !== '__v'){
            let TD = $('<TD>').appendTo(TR);
            let input = $('<input>',{class:"form-control bg-dark text-center text-light rounded is-valid", type:'text'}).appendTo(TD);
            input.attr('data-key', key).val(value).keyup(checkTypeForm);
        }
    });
    let addTD = $('<TD>').appendTo(TR);
    $('<button>', {type:'button', class:'col-12 btn btn-primary rounded fw-bold', html:'Ajouter un type de vol'}).appendTo(addTD).click(function(){
        let addedTR = $('<TR>');
        TR.after(addedTR);
        addATypeline({name:''},addedTR)});
        checkTypeForm();
    let deleteTD = $('<TD>').appendTo(TR);
    $('<button>', {type:'button', class:'col-12 btn btn-danger rounded fw-bold', html:'Supprimer ce type de vol'}).appendTo(deleteTD).click(function(){
        TR.remove();
        checkTypeForm();
    });

}
async function displayTypeForm(){
    $('#cards').addClass('d-none');
    $('#dbForms').removeClass('d-none');
    $('#dbForms > div').addClass('d-none');
    $('#typeDiv').removeClass('d-none');
    $('#typesTbody tr').remove();
    const documents = await getFetchRequest('http://localhost:3000/api/type');
    documents.forEach(document => {
        let newTR = $('<TR>', {id:document._id}).appendTo($('#typesTbody'));
        addATypeline(document, newTR);
    });
}
async function checkTypeForm(){
    for(let i = 0 ; i < $('#typesTbody input').length ; i++){
        if ( typeof($('#typesTbody input').eq(i).val()) !== 'undefined'){
            if ( $('#typesTbody input').eq(i).val().length === 0 )  $('#typesTbody input').eq(i).removeClass('is-valid').addClass('is-invalid');
            else $('#typesTbody input').eq(i).addClass('is-valid').removeClass('is-invalid');
        }
    }
    let enable = true;
    for ( let i = 0 ; i < $('#typesTbody input').length ; i++) enable = enable && ( $('#typesTbody input').eq(i).attr('class').indexOf("is-invalid") === -1 );
    $('#typeModifyButton').prop('disabled', !enable)
}
async function updateTypeDb(){
    await deleteFetchRequest('http://localhost:3000/api/type', {id:'', access:2});
    for(let i = 0 ; i < $('#typesTbody tr').length ; i++){
        let type = {
            name: $('#typesTbody tr').eq(i).find('input[data-key=name]').val(),
        }
        let response = await postFetchRequest('http://localhost:3000/api/type', {type:type, access:2});
        if ( response === 'success') showToast('#UpdatedTypesToast');
    }
    displayCards();
}
(function(){
    $('#displayTypesDiv').click(displayTypeForm);
    $('#typeReturnButton').click(function(){displayCards()});
    $('#typeModifyButton').click(updateTypeDb);
})();