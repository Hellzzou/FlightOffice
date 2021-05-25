async function displayTypeChart(flights){
    const types = await getFetchRequest('http://localhost:3000/api/type');
    $('#statsCards').addClass('d-none');
    $('#chartStats').removeClass('d-none');
    $('#chartStats div').addClass('d-none');
    $('#typeChart').removeClass('d-none');
    $('#typeChart div').removeClass('d-none');
    let dataTypeChart = new Array;
    let dataLabels = new Array;
    let backgrounColor = new Array;
    for ( let i = 0 ; i < types.length ; i++) {
        dataTypeChart[i] = 0;
        dataLabels[i] = types[i].name;
        ( i % 2 === 0 ) ? backgrounColor[i] = 'rgb(84, 180, 247)' : backgrounColor[i] = 'rgb(14, 103, 166)';
    }
    for ( let i = 0 ; i < types.length ; i++){
        flights.forEach(flight => {if (flight.type === types[i].name) dataTypeChart[i] += flight.dayDuration + flight.nightDuration});
    }
    const data = {
        labels:dataLabels,
        datasets:[{
            label:'Répartition des heures par type',
            data:dataTypeChart,
            backgroundColor: backgrounColor,
            hoverOffset: 4
        }]
    };
    new Chart('myTypeChart', {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}
async function displayAreaChart(flights){
    const areas = await getFetchRequest('http://localhost:3000/api/area');
    $('#statsCards').addClass('d-none');
    $('#chartStats').removeClass('d-none');
    $('#chartStats div').addClass('d-none');
    $('#areaChart').removeClass('d-none');
    $('#areaChart div').removeClass('d-none');
    let dataTypeChart = new Array;
    let dataLabels = new Array;
    let backgrounColor = new Array;
    for ( let i = 0 ; i < areas.length ; i++) {
        dataTypeChart[i] = 0;
        dataLabels[i] = areas[i].name;
        ( i % 2 === 0 ) ? backgrounColor[i] = 'rgb(84, 180, 247)' : backgrounColor[i] = 'rgb(14, 103, 166)';
    }
    for ( let i = 0 ; i < areas.length ; i++){
        flights.forEach(flight => {if (flight.area === areas[i].name) dataTypeChart[i] += flight.dayDuration + flight.nightDuration;});
    }
    const data = {
        labels:dataLabels,
        datasets:[{
            label:'Répartition des heures par zone',
            data:dataTypeChart,
            backgroundColor: backgrounColor,
            hoverOffset: 4
        }]
    };
    new Chart('myAreaChart', {
        type: 'bar',
        data: data,
    });
}
function displayCrewChart(flights){
    $('#statsCards').addClass('d-none');
    $('#chartStats').removeClass('d-none');
    $('#chartStats div').addClass('d-none');
    $('#crewChart').removeClass('d-none');
    $('#crewChart div').removeClass('d-none');
    let dataTypeChart = new Array;
    let dataLabels = new Array;
    let backgrounColor = new Array;
    flights.forEach(flight =>{if ( dataLabels.includes(flight.crew) === false ) dataLabels.push(flight.crew);});
    dataLabels.sort(function compare(a,b){
        if ( a < b ) return -1;
        if ( a > b ) return 1;
        return 0;
    });
    for ( let i = 0 ; i < dataLabels.length ; i++){
        dataTypeChart[i] = 0;
        ( i % 2 === 0 ) ? backgrounColor[i] = 'rgb(84, 180, 247)' : backgrounColor[i] = 'rgb(14, 103, 166)';
    }
    for ( let i = 0 ; i < dataLabels.length ; i++){
        flights.forEach(flight => {if ( flight.crew === dataLabels[i] ) dataTypeChart[i] += flight.dayDuration + flight.nightDuration;});
    }
    const data = {
        labels:dataLabels,
        datasets:[{
            label:'Répartition des heures par équipage',
            data:dataTypeChart,
            backgroundColor: backgrounColor,
            hoverOffset: 4
        }]
    };
    new Chart('myCrewChart', {
        type: 'bar',
        data: data,
    });
}
function displayCancelChart(flights){
    $('#statsCards').addClass('d-none');
    $('#chartStats').removeClass('d-none');
    $('#chartStats div').addClass('d-none');
    $('#cancelChart').removeClass('d-none');
    $('#cancelChart div').removeClass('d-none');
    let dataCancelChart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let dataDoneChart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let dataLabels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    for ( let i = 0 ; i < dataLabels.length ; i++){
        flights.forEach(flight => { if ( new Date(flight.date).getMonth() === i ) ( flight.done === 'MNE') ? dataCancelChart[i] ++ : dataDoneChart[i] ++;});
    }
    const data = {
        labels:dataLabels,
        datasets:[
            {
                label:'Vols effectués',
                data:dataDoneChart,
                backgroundColor: ['rgb(27, 163, 91)', 'rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)'],
                stack: 'Stack 0'
            },
            {
                label:'Vols annulés',
                data: dataCancelChart,
                backgroundColor: ['rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)'],
                stack: 'Stack 0'
            },
        ]
    };
    new Chart('myCancelChart', {
        type: 'bar',
        data: data,
    });
}
async function displayDelayChart(flights){
    $('#statsCards').addClass('d-none');
    $('#chartStats').removeClass('d-none');
    $('#chartStats div').addClass('d-none');
    $('#delayChart').removeClass('d-none');
    $('#delayChart div').removeClass('d-none');
    let dataLabels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    let dataDelayChart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for ( let i = 0 ; i < dataLabels.length ; i++){
        let doneFlights = 0;
        flights.forEach(flight => {
            if ( new Date(flight.date).getMonth() === i ){
                let takeoffTime = flight.scheduledDeparture.split(':');
                let scheduledTakeoffDate = new Date (Date.UTC(new Date(flight.date).getFullYear(), new Date(flight.date).getMonth(), new Date(flight.date).getDate(), parseInt(takeoffTime[0]), parseInt(takeoffTime[1]), 0));
                let delay = (new Date(flight.date) - scheduledTakeoffDate) / 60000;
                if (delay > 600) delay -= 24*60;
                if (delay < -600) delay += 24*60;
                dataDelayChart[i] += delay;
                if ( flight.done === 'ME') doneFlights ++;
            }
        });
        if ( doneFlights !== 0 ) dataDelayChart[i] = dataDelayChart[i] / doneFlights;
    }
    const data = {
        labels:dataLabels,
        datasets:[
            {
                label:'Moyenne de retard en minutes par mois',
                data:dataDelayChart,
                backgroundColor: ['rgb(27, 163, 91)', 'rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)'],
            },
        ]
    };
    new Chart('myDelayChart', {
        type: 'bar',
        data: data,
    });
}
async function displayQOGChart(flights){
    const groups = await getFetchRequest('http://localhost:3000/api/group');
    let allocation = 0;
    let cumulated = 0;
    $('#statsCards').addClass('d-none');
    $('#chartStats').removeClass('d-none');
    $('#chartStats div').addClass('d-none');
    $('#QOGChart').removeClass('d-none');
    $('#QOGChart div').removeClass('d-none');
    groups.forEach(group => {if ( group.allocation !== -1 ) allocation += group.allocation});
    let dataLabels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    dataAlloc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    dataCumulated = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for ( let i = 0 ; i < dataLabels.length ; i ++){
        flights.forEach(flight => { if ( new Date(flight.date).getMonth() === i ) cumulated += flight.dayDuration + flight.nightDuration});
        dataAlloc[i] = allocation / 12 * (i+1);
        dataCumulated[i] = cumulated;
    }
    const data = {
        labels:dataLabels,
        datasets:[
            {
                label:'Allocation Flottille',
                data:dataAlloc,
                backgroundColor: ['rgb(27, 163, 91)', 'rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)','rgb(27, 163, 91)'],
            },
            {
                label:'Heures effectuées',
                data: dataCumulated,
                backgroundColor: ['rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)', 'rgb(211, 56, 77)'],
            },
        ]
    };
    new Chart('myQOGChart', {
        type: 'line',
        data: data,
    });
}
function displayStatsCard(){
    $('#chartStats').addClass('d-none');
    $('#statsCards').removeClass('d-none');
}
(async function(){
    const startDate = new Date(Date.UTC(new Date().getFullYear(), 0, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0));
    const flights = await postFetchRequest('http://localhost:3000/api/validatedFlight/byDate', {'startDate':startDate, 'endDate':endDate, 'access':0});
    $('#displayTypeStatsButton').click(function(){displayTypeChart(flights)});
    $('#displayAreaStatsButton').click(function(){displayAreaChart(flights)});
    $('#displayCrewStatsButton').click(function(){displayCrewChart(flights)});
    $('#displayCancelStatsButton').click(function(){displayCancelChart(flights)});
    $('#displayDelayStatsButton').click(function(){displayDelayChart(flights)});
    $('#displayQOGStatsButton').click(function(){displayQOGChart(flights)});
    $('#returnTypeChartButton').click(displayStatsCard);
    $('#returnAreaChartButton').click(displayStatsCard);
    $('#returnCrewChartButton').click(displayStatsCard);
    $('#returnCancelChartButton').click(displayStatsCard);
    $('#returnDelayChartButton').click(displayStatsCard);
    $('#returnQOGChartButton').click(displayStatsCard);
})();
