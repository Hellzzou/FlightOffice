async function addAArealine(document, TR){
    Object.entries(document).forEach(([key, value]) => {
        if ( key !== '_id' && key !== '__v'){
            let TD = $('<TD>').appendTo(TR);
            let input = $('<input>',{class:"form-control bg-dark text-center text-light rounded is-valid", type:'text'}).appendTo(TD);
            input.attr('data-key', key).val(value).keyup(checkAreaForm);
        }
    });
    let addTD = $('<TD>').appendTo(TR);
    $('<button>', {type:'button', class:'col-12 btn btn-primary rounded fw-bold', html:'Ajouter une zone de vol'}).appendTo(addTD).click(function(){
        let addedTR = $('<TR>');
        TR.after(addedTR);
        addAArealine({name:''},addedTR)});
        checkAreaForm();
    let deleteTD = $('<TD>').appendTo(TR);
    $('<button>', {type:'button', class:'col-12 btn btn-danger rounded fw-bold', html:'Supprimer une zone de vol'}).appendTo(deleteTD).click(function(){
        TR.remove();
        checkAreaForm();
    });

}
async function displayAreaForm(){
    $('#cards').addClass('d-none');
    $('#dbForms').removeClass('d-none');
    $('#dbForms > div').addClass('d-none');
    $('#areaDiv').removeClass('d-none');
    $('#areasTbody tr').remove();
    const documents = await getFetchRequest('http://localhost:3000/api/area');
    documents.forEach(document => {
        let newTR = $('<TR>', {id:document._id}).appendTo($('#areasTbody'));
        addAArealine(document, newTR);
    });
}
async function checkAreaForm(){
    for(let i = 0 ; i < $('#areasTbody input').length ; i++){
        if ( typeof($('#areasTbody input').eq(i).val()) !== 'undefined'){
            if ( $('#areasTbody input').eq(i).val().length === 0 )  $('#areasTbody input').eq(i).removeClass('is-valid').addClass('is-invalid');
            else $('#areasTbody input').eq(i).addClass('is-valid').removeClass('is-invalid');
        }
    }
    let enable = true;
    for ( let i = 0 ; i < $('#areasTbody input').length ; i++) enable = enable && ( $('#areasTbody input').eq(i).attr('class').indexOf("is-invalid") === -1 );
    $('#areasModifyButton').prop('disabled', !enable)
}
async function updateAreaDb(){
    await deleteFetchRequest('http://localhost:3000/api/area', {id:'', access:2});
    for(let i = 0 ; i < $('#areasTbody tr').length ; i++){
        let area = {
            name: $('#areasTbody tr').eq(i).find('input[data-key=name]').val(),
        }
        let response = await postFetchRequest('http://localhost:3000/api/area', {area:area, access:2});
        if ( response === 'success') showToast('#UpdatedAreasToast');
    }
    displayCards();
}
(function(){
    $('#displayAreasDiv').click(displayAreaForm);
    $('#areasReturnButton').click(function(){displayCards()});
    $('#areasModifyButton').click(updateAreaDb);
})();