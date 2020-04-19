const init = () => {
    const endpointTranslator = {
        "krankenValue" : "/getHospitalName",
        "gesamtValue" : "/getBettenanzahl",
        "freieValue" : "/getFreieBetten"
    }

    Object.keys(endpointTranslator).forEach(elementId => {
        endpoint = endpointTranslator[elementId];

        fetch(endpoint)
        .then(rawResp => rawResp.json())
        .then(jsonResp => {
            resp = jsonResp[0];
            const val = Object.keys(resp).map(key => resp[key]);
            document.getElementById(elementId).innerHTML = val;
        })
        .catch(
            document.getElementById(elementId).innerHTML = ""
        )
    })
}

const createbuttonHandler = (endpoint, element) => {
    return () => {
        fetch(endpoint,
            {
                method: "PUT",   
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"amount":element.value})
            })
        
        // if False, don't refresh page
        return true;
    }
    
}

init();