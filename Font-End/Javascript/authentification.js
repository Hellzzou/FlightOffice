async function update(){
    const startDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth() - 2, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0));
    const validatedFlights = await postFetchRequest('http://localhost:3000/api/validatedFlight/byDate', {'startDate':startDate, 'endDate':endDate});
    validatedFlights.sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    const year = new Date(validatedFlights[validatedFlights.length -1].date).getFullYear();
    const month = (((new Date(validatedFlights[validatedFlights.length -1].date).getMonth()+1)) < 10) ? '0'+(new Date(validatedFlights[validatedFlights.length -1].date).getMonth()+1) : new Date(validatedFlights[validatedFlights.length -1].date).getMonth()+1;
    const day = ((new Date(validatedFlights[validatedFlights.length -1].date).getDate()) < 10) ? '0'+(new Date(validatedFlights[validatedFlights.length -1].date).getDate()) : new Date(validatedFlights[validatedFlights.length -1].date).getDate();
    $('#update').html(day+'-'+month+'-'+year);
}
async function addBDVAdmins(){
    const admins = await postFetchRequest('http://localhost:3000/api/user/getAdmins', {responsability:'Admin'});
    admins.forEach(admin => {$('<div>', {class:"text-center fw-light text-dark", html:admin.rank+' '+admin.name}).appendTo($('#adminBDV'));});
}
function disconnect(){
    $('#navbarNav').addClass('d-none');
    for ( let i = 0 ; i < $('section').length ; i++) $('section').eq(i).addClass('d-none');
    $('#loginSection').removeClass('d-none');
    $('#disconnect').addClass('d-none');
    $('#idetnSpan').html('');
    $('#login').val('');
    $('#password').val('');
}
(function(){
    addBDVAdmins();
    $('#checkLoginButton').click(async function(){
        const user = await postFetchRequest('http://localhost:3000/api/user/login', {login:$('#login').val(), password: $('#password').val()});
        if ( typeof(user.userID) !== 'undefined' ){
            $('#idetnSpan').html(user.userRank+' '+user.userName+' : '+user.userResponsability);
            sessionStorage.setItem('token', user.token);
            $('#navbarNav').removeClass('d-none');
            $('#loginSection').addClass('d-none');
            $('#flightSection').removeClass('d-none');
            $('#disconnect').removeClass('d-none');
            $('#disconnect').click(disconnect);
            $('#error').html('');
            for ( let i = 0 ; i < $('#navbarNav a').length ; i++) $('#navbarNav a').eq(i).removeClass('active');
            $('a[data-link=flightSection').addClass('active');
            update();
            displayflightForm();
            $('#navbarNav a').click(function(){
                let month = (((new Date().getMonth()+1)) < 10) ? '0'+(new Date().getMonth()+1) : new Date().getMonth()+1;
                let day = ((new Date().getDate()) < 10) ? '0'+(new Date().getDate()) : new Date().getDate();
                $('#startDate').val(new Date().getFullYear()+'-'+month+'-01');
                $('#endDdate').val(new Date().getFullYear()+'-'+month+'-'+day);
                $('#ValidateFlightsstartDate').val(new Date().getFullYear()+'-'+month+'-01');
                $('#ValidateFlightsendDdate').val(new Date().getFullYear()+'-'+month+'-'+day);
                $('#AllFlightssstartDate').val(new Date().getFullYear()+'-'+month+'-01');
                $('#AllFlightssendDdate').val(new Date().getFullYear()+'-'+month+'-'+day);
                for ( let i = 0 ; i < $('#navbarNav a').length ; i++) $('#navbarNav a').eq(i).removeClass('active');
                this.classList.add('active');
                for ( let i = 0 ; i < $('section').length ; i++) ( $('section').eq(i).attr('id') === this.getAttribute('data-link') ) ? $('section').eq(i).removeClass('d-none') : $('section').eq(i).addClass('d-none');
                if ( this.getAttribute('data-link') === 'flightSection') displayflightForm();
                if ( this.getAttribute('data-link') === 'summary') displayPilotsHoursInTable();
                if ( this.getAttribute('data-link') === 'consultMyhours')displayMyHours($('#startDate').val(), $('#endDdate').val());
                if ( this.getAttribute('data-link') === 'validateFlight' ){
                    if ( user.userAccess > 0) displayUnValidatedFlight();
                    else $('#validateFlightAuth').removeClass('d-none');
                }
                if ( this.getAttribute('data-link') === 'consultHours' ){
                    if ( user.userAccess > 0) displayValidatedFlights($('#ValidateFlightsstartDate').val(), $('#ValidateFlightsendDdate').val());
                    else $('#ConsultHoursAuth').removeClass('d-none');
                }
                if ( this.getAttribute('data-link') === 'modifyFlight' ){
                    if ( user.userAccess > 1) displayAllFlights($('#AllFlightssstartDate').val(), $('#AllFlightssendDdate').val());
                    else $('#ModifyFlightAuth').removeClass('d-none');
                }
                if ( this.getAttribute('data-link') === 'consultQOG' ){
                    if( user.userAccess > 0) displayQOG();
                    else $('#ConsultQOGAuth').removeClass('d-none');
                }
                if ( this.getAttribute('data-link') === 'managedb' )
                    if( user.userAccess > 1) displayCards();
                    else $('#ModifyDBAuth').removeClass('d-none');
                if ( this.getAttribute('data-link') === 'managedb' ) displayStatsCard();
            });
        }
        else {
            $('#error').html(user.error);
        }
    });
})();
