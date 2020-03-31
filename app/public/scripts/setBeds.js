
const getURLHospital = () => {
    const hospInp = document.getElementById("krankenhaus");

    console.log(hospInp)

    const hospString = hospInp.value;
    return encodeURI(hospString)
}

// Fetch the data from the existing hospital
const getHospitalDataPromise = (baseURL) => {
    const currHospital = getURLHospital();
    console.log(baseURL + currHospital);
    return fetch(baseURL + currHospital).then((resp) => resp.json());
}


const setHospitalDataPromise = (baseURL, value) => {
    // Get the hospital (URL friendly)
    const currHospital = getURLHospital();

    const numValue = parseInt(value);
    const requestBody = JSON.stringify({"amount":numValue});
    
    // Make a PUT to the endpoint
    return fetch(baseURL + currHospital, 
        {
            method: "PUT",   
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        });
}

const initInputForm = (formData, getBaseURL, setBaseURL) => {
    const getBedInput = () => { 
        const inpVal = formData.getElementsByTagName("INPUT")[0];
        console.log(inpVal.value)
        return inpVal;
    };

    getHospitalDataPromise(getBaseURL)
    .then((resp) => {
        // pull out the dict from the response
        const response = resp[0]

        // pull out the value (do this because the key is different)
        const bedcount = Object.keys(response).map((key) => response[key])

        // set the value
        const bedInp = getBedInput();
        bedInp.value = bedcount;
    })
    .catch((err) => {
        const bedInp = getBedInput();
        bedInp.value = null;
        // gesamtBettenObj.value = "Unknown Data"
    });


    // Add the onclick handler for the button
    const bedButton = formData.getElementsByTagName("BUTTON")[0];

    console.log(bedButton);

    const buttonOnClick = () => {
        setHospitalDataPromise(setBaseURL, getBedInput().value)
        .then((resp) => {}).catch((err) => {});

        // this prevents the window from refreshing
        return false;
    }

    bedButton.onclick = buttonOnClick
}

const initForms = () => {
    const gesamtForm = document.getElementById("gesamtForm");

    const getGesamtBettenBaseURL = "/getBettenanzahl/";
    const setGesamtBettenBaseURL = "/setBettenanzahl/"; 
    initInputForm(gesamtForm, getGesamtBettenBaseURL, setGesamtBettenBaseURL);

    
    const freiForm = document.getElementById("freieForm");
    
    const getFreiBettenBaseURL = "/getFreieBetten/";
    const setFreiBettenBaseURL = "/setFreieBetten/"; 
    initInputForm(freiForm, getFreiBettenBaseURL, setFreiBettenBaseURL);

    return false;
}

const init = () => {
    const hospButton = document.getElementById("krankenhausButt");
    hospButton.onclick = initForms;
}

init();