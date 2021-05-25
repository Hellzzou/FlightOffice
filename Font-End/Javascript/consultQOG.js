async function displayQOG(){
    const startDate = new Date(Date.UTC(new Date().getFullYear(), 0, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0));
    const groupe1 = await postFetchRequest('http://localhost:3000/api/group/findGroup', {group:1, access:1});
    const groupe2 = await postFetchRequest('http://localhost:3000/api/group/findGroup', {group:2, access:1});
    const groupe3 = await postFetchRequest('http://localhost:3000/api/group/findGroup', {group:3, access:1});
    const groups = [groupe1, groupe2, groupe3];
    const flightOfTheYear = await postFetchRequest('http://localhost:3000/api/validatedFlight/byDate', {'startDate':startDate, 'endDate':endDate, access:1});

    $('#QOGTBody tr').remove();
    $('#QOGTFoot tr').remove();
    let sums = {
        group: {
            allocation : 0,
            total :[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            totalyear: 0
        },
        totalGroup: {
            allocation : 0,
            total :[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            totalyear: 0
        },
        totalnight: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
    // Boucle sur les tous les groupes de vol
    for ( let j = 0 ; j < groups.length ; j++ ){
        sums.group.allocation = 0;
        sums.group.total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        sums.group.totalyear = 0;
        // Boucle sur tous les sous-groupes de vol
        for ( let i = 0 ; i < groups[j].length ; i++){
            let count = 1;                                              
            if ( groups[j][i].allocation !== -1 ) {                                                                 
                sums.totalGroup.allocation += groups[j][i].allocation;
                sums.group.allocation += groups[j][i].allocation;
            }
            let newTR = $('<TR>').appendTo($('#QOGTBody'));
            // Au premier sous-groupe, affiche en première colonne le numéro du groupe sur toutes les lignes de celui-ci + 1 pour le total du groupe
            if ( i === 0) $('<TD>', {html:groups[j][i].group, rowspan:(groups[j].length + 1)}).appendTo(newTR);
            // affiche dans tous les cas les colonnes 2, 3, 4, 5 correspondant aux sous-groupe, rubrique, gestionnaire et client
            $('<TD>', {html:groups[j][i].underGroup}).appendTo(newTR);
            $('<TD>', {html:groups[j][i].mission}).appendTo(newTR);
            $('<TD>', {html:groups[j][i].client}).appendTo(newTR);
            $('<TD>', {html:groups[j][i].manager}).appendTo(newTR);
            // si l'allocation du sous-groupe est a -1 cela veut dire que son alloc est groupée avec les sous-groupes suivants
            if ( groups[j][i].allocation === -1){
                let k = i;
                // boucle pour determiner la taille du regroupement des allocations
                while(groups[j][k].allocation === -1) {
                    count++;
                    k++;
                }
            }
            if ( i !== 0){
                if ( groups[j][i-1].allocation !== -1 ) {
                    $('<TD>', {html:groups[j][i+count-1].allocation.toFixed(1), rowspan:count}).appendTo(newTR);
                }
            }
            
            else $('<TD>', {html:groups[j][i+count-1].allocation.toFixed(1), rowspan:count}).appendTo(newTR);
            // boucle sur les 12 mois de l'années pour les colonnes suivantes

            let yearSum = 0;
            let groupedAllocation = 0;
            for ( let z = 0 ; z < 12 ; z++){
                let monthSum = 0;
                for ( let y = 0 ; y < flightOfTheYear.length ; y++){
                    if ( groups[j][i].allocation === -1){
                        let k = i;
                        if ( new Date(flightOfTheYear[y].date).getMonth() === z && flightOfTheYear[y].group === groups[j][k].underGroup && flightOfTheYear[y].client === groups[j][k].client && flightOfTheYear[y].manager === groups[j][k].manager) {
                            if ( typeof(flightOfTheYear[y].exercice) === 'undefined' || groups[j][i].context.includes(flightOfTheYear[y].exercice) ){
                                monthSum += flightOfTheYear[y].dayDuration + flightOfTheYear[y].nightDuration;
                                sums.totalnight[z] += flightOfTheYear[y].nightDuration;
                                yearSum += flightOfTheYear[y].dayDuration + flightOfTheYear[y].nightDuration;
                            }
                        }

                        // boucle pour determiner la taille du regroupement des allocations
                        while(groups[j][k].allocation === -1) {
                            if ( new Date(flightOfTheYear[y].date).getMonth() === z && flightOfTheYear[y].group === groups[j][k].underGroup && flightOfTheYear[y].client === groups[j][k].client && flightOfTheYear[y].manager === groups[j][k].manager) {
                                if ( typeof(flightOfTheYear[y].exercice) === 'undefined' || groups[j][i].context.includes(flightOfTheYear[y].exercice) ){
                                    groupedAllocation += flightOfTheYear[y].dayDuration + flightOfTheYear[y].nightDuration;
                                }
                            }
                            k++;
                        }
                    }
                    else {
                        if ( new Date(flightOfTheYear[y].date).getMonth() === z && flightOfTheYear[y].group === groups[j][i].underGroup && flightOfTheYear[y].client === groups[j][i].client && flightOfTheYear[y].manager === groups[j][i].manager) {
                            if ( typeof(flightOfTheYear[y].exercice) === 'undefined' || groups[j][i].context.includes(flightOfTheYear[y].exercice) ){
                                monthSum += flightOfTheYear[y].dayDuration + flightOfTheYear[y].nightDuration;
                                sums.totalnight[z] += flightOfTheYear[y].nightDuration;
                                yearSum += flightOfTheYear[y].dayDuration + flightOfTheYear[y].nightDuration;
                            }
                        }
                    }
                }
                $('<TD>', {html:monthSum.toFixed(1)}).appendTo(newTR);
                sums.group.totalyear += monthSum;
                sums.group.total[z] += monthSum;
                sums.totalGroup.total[z] += monthSum;
            }
            $('<TD>', {html:yearSum.toFixed(1)}).appendTo(newTR);
            if ( i !== 0){
                if ( groups[j][i-1].allocation !== -1 ) $('<TD>', {html:(groups[j][i+count-1].allocation - groupedAllocation).toFixed(1), rowspan:count}).appendTo(newTR);
            }
            else $('<TD>', {html:(groups[j][i+count-1].allocation - yearSum).toFixed(1), rowspan:count}).appendTo(newTR);
        }
        sums.totalGroup.totalyear += sums.group.totalyear;
        let totalTR = $('<TR>').appendTo($('#QOGTBody'));
        $('<TD>', {colspan:4, html:'TOTAL GROUPE '+groups[j][0].group+' :'}).appendTo(totalTR);
        $('<TD>', {html:sums.group.allocation.toFixed(1)}).appendTo(totalTR);
        for ( let z = 0; z < 12 ; z++) $('<TD>', {html:sums.group.total[z].toFixed(1)}).appendTo(totalTR);
        $('<TD>', {html:sums.group.totalyear.toFixed(1)}).appendTo(totalTR);
        $('<TD>', {html:(sums.group.allocation - sums.group.totalyear).toFixed(1)}).appendTo(totalTR);
    }
    let sumByGrupTR = $('<TR>', {id: 'sumByGroup', class:'text-success'}).appendTo($('#QOGTFoot'));
    $('<TH>', {html:'TOTAL GENERAL :', colspan: 5}).appendTo(sumByGrupTR);
    $('<TH>', {html:sums.totalGroup.allocation.toFixed(1)}).appendTo(sumByGrupTR);
    let nightTR = $('<TR>', {id:'night', class:'text-danger'}).appendTo($('#QOGTFoot'));
    $('<TH>', {colspan: 4}).appendTo(nightTR);
    $('<TH>', {colspan: 2, html:'DONT NUIT :'}).appendTo(nightTR);
    let previsionTR = $('<TR>', {id: 'prevision'}).appendTo($('#QOGTFoot'));
    $('<TH>', {colspan: 6, html: '<span>Cumul / </span><span class="text-warning">Heures à prevoir pour remplir le contrat</span>'}).appendTo(previsionTR);
    let accumulation = 0;
    for ( let i = 0 ; i < sums.totalGroup.total.length ; i++){
        $('<TH>', {html:sums.totalGroup.total[i].toFixed(1)}).appendTo(sumByGrupTR);
        accumulation += sums.totalGroup.total[i];
        $('<TH>', {html:sums.totalnight[i].toFixed(1)}).appendTo(nightTR);
        (i <= new Date().getMonth() ) ? $('<TH>', {html:accumulation.toFixed(1)}).appendTo(previsionTR) : $('<TH>', {html:((sums.totalGroup.allocation - sums.totalGroup.totalyear) / (11 - new Date().getMonth())).toFixed(1), class:'text-warning'}).appendTo(previsionTR);
    }
    $('<TH>', {html:sums.totalGroup.totalyear.toFixed(1)}).appendTo(sumByGrupTR);
    $('<TH>', {html:(sums.totalGroup.allocation - sums.totalGroup.totalyear).toFixed(1)}).appendTo(sumByGrupTR);
    
}