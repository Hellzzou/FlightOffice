function addAnInput(TR, key, value, type, min, max){
    let TD = $('<TD>').appendTo(TR);
    let input = $('<input>',{class:"form-control bg-dark text-center text-light rounded is-valid", type:type}).appendTo(TD);
    input.attr('data-key', key).attr('data-type', type).attr('data-min', min).attr('data-max', max).val(value).keyup(checkGroupForm);
}
function addAGroupline(document, TR){
    addAnInput(TR, 'group', document.group, 'number', 1, 9);
    addAnInput(TR, 'underGroup', document.underGroup, 'number', 100, 999);
    addAnInput(TR, 'mission', document.mission, 'text', 1, 70);
    addAnInput(TR, 'context', document.context, 'text', 0, 1000);
    addAnInput(TR, 'client', document.client, 'text', 1, 9);
    addAnInput(TR, 'manager', document.manager, 'text', 1, 9);
    addAnInput(TR, 'allocation', document.allocation, 'number', -1, 3000);
    let addTD = $('<TD>').appendTo(TR);
    $('<button>', {type:'button', class:'col-12 btn btn-primary rounded fw-bold', html:'Ajouter'}).appendTo(addTD).click(function(){
        let addedTR = $('<TR>');
        TR.after(addedTR);
        addAGroupline({context:[''], group:'', underGroup:'', mission:'', client:'', manager:'', allocation:''},addedTR);
        checkGroupForm();
    });
    let deleteTD = $('<TD>').appendTo(TR);
    $('<button>', {type:'button', class:'col-12 btn btn-danger rounded fw-bold', html:'Supprimer'}).appendTo(deleteTD).click(function(){
        TR.remove();
        console.log('checked delete')
        checkGroupForm();
    });
}
async function displayGroupForm(){
    $('#cards').addClass('d-none');
    $('#dbForms').removeClass('d-none');
    $('#dbForms > div').addClass('d-none');
    $('#groupsDiv').removeClass('d-none');
    $('#groupsTbody tr').remove();
    $('#spinner').removeClass('d-none');
    const documents = await getFetchRequest('http://localhost:3000/api/group');
    documents.forEach(document => {
        let newTR = $('<TR>', {id:document._id}).appendTo($('#groupsTbody'));
        addAGroupline(document, newTR);
    });
    $('#spinner').addClass('d-none');
}
async function checkGroupForm(){
    for(let i = 0 ; i < $('#groupsTbody tr').length ; i++){
        if ( isValid($('#groupsTbody tr').eq(i).find('input[data-key=group]'))) $('#groupsTbody tr').eq(i).find('input[data-key=group]').addClass('is-valid').removeClass('is-invalid');
        else $('#groupsTbody tr').eq(i).find('input[data-key=group]').removeClass('is-valid').addClass('is-invalid');
        if ( isValid($('#groupsTbody tr').eq(i).find('input[data-key=underGroup]')) && $('#groupsTbody tr').eq(i).find('input[data-key=underGroup]').val()[0] === $('#groupsTbody tr').eq(i).find('input[data-key=group]').val()){
            $('#groupsTbody tr').eq(i).find('input[data-key=underGroup]').addClass('is-valid').removeClass('is-invalid');
        }
        else $('#groupsTbody tr').eq(i).find('input[data-key=underGroup]').removeClass('is-valid').addClass('is-invalid');
        if ( isValid($('#groupsTbody tr').eq(i).find('input[data-key=mission]'))) $('#groupsTbody tr').eq(i).find('input[data-key=mission]').addClass('is-valid').removeClass('is-invalid');
        else $('#groupsTbody tr').eq(i).find('input[data-key=mission]').removeClass('is-valid').addClass('is-invalid');
        if ( isValid($('#groupsTbody tr').eq(i).find('input[data-key=client]'))) $('#groupsTbody tr').eq(i).find('input[data-key=client]').addClass('is-valid').removeClass('is-invalid');
        else $('#groupsTbody tr').eq(i).find('input[data-key=client]').removeClass('is-valid').addClass('is-invalid');
        if ( isValid($('#groupsTbody tr').eq(i).find('input[data-key=manager]'))) $('#groupsTbody tr').eq(i).find('input[data-key=manager]').addClass('is-valid').removeClass('is-invalid');
        else $('#groupsTbody tr').eq(i).find('input[data-key=manager]').removeClass('is-valid').addClass('is-invalid');
        if ( isValid($('#groupsTbody tr').eq(i).find('input[data-key=allocation]'))) $('#groupsTbody tr').eq(i).find('input[data-key=allocation]').addClass('is-valid').removeClass('is-invalid');
        else $('#groupsTbody tr').eq(i).find('input[data-key=allocation]').removeClass('is-valid').addClass('is-invalid');
        if ($('#groupsTbody tr').length > 1){
            if ( i === 0){
                if ( $('#groupsTbody tr').eq(i+1).find('input[data-key=underGroup]').val() === $('#groupsTbody tr').eq(i).find('input[data-key=underGroup]').val() && 
                    $('#groupsTbody tr').eq(i+1).find('input[data-key=client]').val() === $('#groupsTbody tr').eq(i).find('input[data-key=client]').val() &&
                    $('#groupsTbody tr').eq(i+1).find('input[data-key=manager]').val() === $('#groupsTbody tr').eq(i).find('input[data-key=manager]').val()){
                        if ( $('#groupsTbody tr').eq(i).find('input[data-key=context]').val().length !== 0 ) $('#groupsTbody tr').eq(i).find('input[data-key=context]').addClass('is-valid').removeClass('is-invalid');
                        else $('#groupsTbody tr').eq(i).find('input[data-key=context]').removeClass('is-valid').addClass('is-invalid');
                    }
                else {
                    if ( $('#groupsTbody tr').eq(i).find('input[data-key=context]').val().length === 0 ) $('#groupsTbody tr').eq(i).find('input[data-key=context]').addClass('is-valid').removeClass('is-invalid');
                    else $('#groupsTbody tr').eq(i).find('input[data-key=context]').removeClass('is-valid').addClass('is-invalid');
                }
            }
            else if ( i === $('#groupsTbody tr').length -1){
                if ( $('#groupsTbody tr').eq(i-1).find('input[data-key=underGroup]').val() === $('#groupsTbody tr').eq(i).find('input[data-key=underGroup]').val() && 
                    $('#groupsTbody tr').eq(i-1).find('input[data-key=client]').val() === $('#groupsTbody tr').eq(i).find('input[data-key=client]').val() &&
                    $('#groupsTbody tr').eq(i-1).find('input[data-key=manager]').val() === $('#groupsTbody tr').eq(i).find('input[data-key=manager]').val()){
                        if ( $('#groupsTbody tr').eq(i).find('input[data-key=context]').val().length !== 0 ) $('#groupsTbody tr').eq(i).find('input[data-key=context]').addClass('is-valid').removeClass('is-invalid');
                        else $('#groupsTbody tr').eq(i).find('input[data-key=context]').removeClass('is-valid').addClass('is-invalid');
                    }
                else {
                    if ( $('#groupsTbody tr').eq(i).find('input[data-key=context]').val().length === 0 ) $('#groupsTbody tr').eq(i).find('input[data-key=context]').addClass('is-valid').removeClass('is-invalid');
                    else $('#groupsTbody tr').eq(i).find('input[data-key=context]').removeClass('is-valid').addClass('is-invalid');
                }
            }
            else {
                if ( ($('#groupsTbody tr').eq(i+1).find('input[data-key=underGroup]').val() === $('#groupsTbody tr').eq(i).find('input[data-key=underGroup]').val() && 
                    $('#groupsTbody tr').eq(i+1).find('input[data-key=client]').val() === $('#groupsTbody tr').eq(i).find('input[data-key=client]').val() &&
                    $('#groupsTbody tr').eq(i+1).find('input[data-key=manager]').val() === $('#groupsTbody tr').eq(i).find('input[data-key=manager]').val()) ||
                    ($('#groupsTbody tr').eq(i-1).find('input[data-key=underGroup]').val() === $('#groupsTbody tr').eq(i).find('input[data-key=underGroup]').val() && 
                    $('#groupsTbody tr').eq(i-1).find('input[data-key=client]').val() === $('#groupsTbody tr').eq(i).find('input[data-key=client]').val() &&
                    $('#groupsTbody tr').eq(i-1).find('input[data-key=manager]').val() === $('#groupsTbody tr').eq(i).find('input[data-key=manager]').val())){
                        if ( $('#groupsTbody tr').eq(i).find('input[data-key=context]').val().length !== 0 ) $('#groupsTbody tr').eq(i).find('input[data-key=context]').addClass('is-valid').removeClass('is-invalid');
                        else $('#groupsTbody tr').eq(i).find('input[data-key=context]').removeClass('is-valid').addClass('is-invalid');
                    }
                else {
                    if ( $('#groupsTbody tr').eq(i).find('input[data-key=context]').val().length === 0 ) $('#groupsTbody tr').eq(i).find('input[data-key=context]').addClass('is-valid').removeClass('is-invalid');
                    else $('#groupsTbody tr').eq(i).find('input[data-key=context]').removeClass('is-valid').addClass('is-invalid');
                }
            }
        }
    }
    let enable = true;
    for ( let i = 0 ; i < $('#groupsTbody input').length ; i++) enable = enable && ( $('#groupsTbody input').eq(i).attr('class').indexOf("is-invalid") === -1 );
    $('#groupsModifyButton').prop('disabled', !enable)
}
async function updateGroupDb(){
    await deleteFetchRequest('http://localhost:3000/group', {id:'', access:2});
    for(let i = 0 ; i < $('#groupsTbody tr').length ; i++){
        let group = {
            group: parseInt($('#groupsTbody tr').eq(i).find('input[data-key=group]').val()),
            underGroup: $('#groupsTbody tr').eq(i).find('select[data-key=underGroup]').val(),
            mission: $('#groupsTbody tr').eq(i).find('select[data-key=mission]').val(),
            client: $('#groupsTbody tr').eq(i).find('input[data-key=client]').val(),
            manager: $('#groupsTbody tr').eq(i).find('input[data-key=manager]').val(),
            allocation: parseInt($('#groupsTbody tr').eq(i).find('input[data-key=allocation]').val()),
        }
        let response = await postFetchRequest('http://localhost:3000/api/group/save', {group:group, access:2});
        if ( response === 'success') showToast('#UpdatedGroupsToast');
    }
    displayCards();
}
(function(){
    $('#displayGroupsDiv').click(displayGroupForm);
    $('#groupsReturnButton').click(function(){displayCards()});
    $('#groupsModifyButton').click(updateGroupDb);
})();