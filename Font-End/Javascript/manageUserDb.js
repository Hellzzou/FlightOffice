async function addAUserline(document, TR){
    Object.entries(document).forEach(([key, value]) => {
        if ( key === 'name'){
            let TD = $('<TD>').appendTo(TR);
            let input = $('<input>',{class:"form-control bg-dark text-center text-light rounded is-valid", type:'text'}).appendTo(TD);
            input.attr('data-key', key).val(value).keyup(checkTypeForm);
        }
        if ( key === 'responsability'){
            let TD = $('<TD>').appendTo(TR);
            let select = $('<select>', {class:"form-select bg-dark text-light rounded is-valid"}).appendTo(TD);
            select.append(new Option('Pilote', 'Pilote'));
            select.append(new Option('Membre', 'Membre'));
            select.append(new Option('Admin', 'Admin'));
            select.attr('data-key', key).val(value)
        }
    });
    let deleteTD = $('<TD>').appendTo(TR);
    const user = await postFetchRequest('http://localhost:3000/api/user/getOne');
    if ( document.name !== user.name){
        $('<button>', {type:'button', class:'col-12 btn btn-danger rounded fw-bold', html:'Supprimer cet utilisateur'}).appendTo(deleteTD).click(function(){
            $('#deleteRank').val(document.rank);
            $('#deleteName').val(document.name);
            $('#deleteFunction').val(document.responsability);
            $('#deleteUserModal').modal('show');
            $('#deleteModalButton').click(async function(){
                const res = await deleteFetchRequest('http://localhost:3000/api/user', {name:document.name});
                if ( res === 'success'){
                    TR.remove();
                    checkUserForm();
                    showToast('#deleteUserToast');
                }
                $('#deleteUserModal').modal('hide');
            });
        });
    }
}
async function displayUserForm(){
    $('#cards').addClass('d-none');
    $('#dbForms').removeClass('d-none');
    $('#dbForms > div').addClass('d-none');
    $('#usersDiv').removeClass('d-none');
    $('#usersTbody tr').remove();
    const documents = await getFetchRequest('http://localhost:3000/api/user');
    documents.forEach(document => {
        let newTR = $('<TR>', {id:document._id}).appendTo($('#usersTbody'));
        addAUserline(document, newTR);
    });
}
async function checkUserForm(){
    for(let i = 0 ; i < $('#usersTbody input').length ; i++){
        if ( typeof($('#usersTbody input').eq(i).val()) !== 'undefined'){
            if ( $('#usersTbody input').eq(i).val().length === 0 )  $('#usersTbody input').eq(i).removeClass('is-valid').addClass('is-invalid');
            else $('#usersTbody input').eq(i).addClass('is-valid').removeClass('is-invalid');
        }
    }
    let enable = true;
    for ( let i = 0 ; i < $('#usersTbody input').length ; i++) enable = enable && ( $('#usersTbody input').eq(i).attr('class').indexOf("is-invalid") === -1 );
    $('#userModifyButton').prop('disabled', !enable)
}
function addNewUser(){
    $('#newUserModal').modal('show');
    $('#newUserModal input').keyup(function(){
        let enable = true;
        for ( let i = 0 ; i < $('#newUserModal input').length ; i++){
            if ( isValid($('#newUserModal input').eq(i))) $('#newUserModal input').eq(i).removeClass('is-invalid').addClass('is-valid');
            else $('#newUserModal input').eq(i).addClass('is-invalid').removeClass('is-valid');
            if ( $('#newUserModal input').eq(i).attr('id') === 'confirmPassword'){
                if ( $('#newUserModal input').eq(i).val() === $('#newPassword').val()) $('#newUserModal input').eq(i).removeClass('is-invalid').addClass('is-valid');
                else $('#newUserModal input').eq(i).addClass('is-invalid').removeClass('is-valid');
            }
            enable = enable && ( $('#newUserModal input').eq(i).attr('class').indexOf("is-invalid") === -1 );
        }
        $('#addNewUserButton').prop('disabled', !enable);
    });
    $('#addNewUserButton').click(async function(){
        let access = 0;
        if ($('#newFunction').val() === 'Membre du BDV' ) access = 1;
        if ($('#newFunction').val() === 'Admin' ) access = 2;
        const response = await postFetchRequest('http://localhost:3000/api/user/signup', {
            rank: $('#newRank').val(),
            name: $('#newName').val(),
            login: $('#newLogin').val(),
            password: $('#newPassword').val(),
            responsability: $('#newFunction').val(),
            access: access
        });
        if ( response === 'Utilisateur crée'){
            showToast('#addNewUserToast');
            $('#newUserModal').modal('hide');
            displayUserForm();
        }
    });
}
(function(){
    $('#displayUsersDiv').click(displayUserForm);
    $('#userReturnButton').click(function(){displayCards()});
    $('#userModifyButton').click(addNewUser);
})();