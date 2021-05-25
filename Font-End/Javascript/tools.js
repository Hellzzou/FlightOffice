function showToast(toastID){
    var toastElList = [].slice.call(document.querySelectorAll(toastID));
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
    });
    toastList.forEach( toast => toast.show());
}
async function postFetchRequest(url, body){
	try{
		const res = await fetch(url, {
			method: "POST",
			headers: { 
                "Content-Type": "application/json",
                Authorization: "Bearer: "+sessionStorage.getItem('token')
                            },
			body:JSON.stringify(body)
		});
		if (!res) throw new Error(res.status);
		return await res.json();
	}
	catch(error){console.log(error);}
}
async function getFetchRequest(url){
	try{
		const res = await fetch(url,{
            method:"GET",
            headers :{
                Authorization: "Bearer: "+sessionStorage.getItem('token')
            }
        });
		if (!res) throw new Error(res.status);
		return await res.json();
	}
	catch(error){console.log(error);}
}
async function deleteFetchRequest(url, body){
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                Authorization: "Bearer: "+sessionStorage.getItem('token')
            },
            body:JSON.stringify(body)
        });
        if (!res) throw new Error(res.status);
        return await res.json();
    }
    catch(error){console.log(error);}
}
async function putFetchRequest(url, body){
    try{
        const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            body:JSON.stringify(body)
        });
        if (!res) throw new Error(res.status);
        return await res.json();
    }
    catch(error){console.log(error);}
}