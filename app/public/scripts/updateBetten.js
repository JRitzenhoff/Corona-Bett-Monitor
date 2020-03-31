
const getURLHospital = () => {
    const hospInp = document.getElementById("krankenhaus");

    console.log(hospInp)

    const hospString = hospInp.value;
    return encodeURI(hospString)
}

// Fetch the data from the existing hospital
const getHospitalDataPromise = (baseURL) => {
    
    const currHospital = getURLHospital();
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
        const retVal = inpVal;
        
        return retVal;
    };

    const getCurr = () =>{
        if(formData == document.getElementById("gesamtForm")){
            const currGesamt = document.getElementById("currGesamt");
            return currGesamt;
        }else{
            const currFrei = document.getElementById("currFrei");
            return currFrei;
        }
    }


    console.log("Entered line 43");
    
    getHospitalDataPromise(getBaseURL)
    .then((resp) => {
        // pull out the dict from the response
        const response = resp[0]
        
        // pull out the value (do this because the key is different)
        const bedcount = Object.keys(response).map((key) => response[key])

        // set the value
        const curr = getCurr();
        curr.innerHTML = bedcount;


       // const bedInp = getBedInput();
        //console.log(bedcount);
       // bedInp.value = bedcount;
    })
    .catch((err) => {
        const bedInp = getBedInput();
        bedInp.value = null;
        // gesamtBettenObj.value = "Unknown Data"
    });


    // Add the onclick handler for the button
    const bedButton = formData.getElementsByClassName("form-button-wrapper form-button-wrapper--align-left")[0];

    console.log(bedButton);

    const buttonOnClick = () => {

        const curr = getCurr();
        const currBedInput = getBedInput().value;
        curr.innerHTML = currBedInput;

        setHospitalDataPromise(setBaseURL, currBedInput)
        .then((resp) => {}).catch((err) => {});

       

        // this prevents the window from refreshing
        
        return true;
    }

    bedButton.onclick = buttonOnClick
}

const initForms = () => {
    
    const gesamtForm = document.getElementById("gesamtForm");
    
    const getGesamtBettenBaseURL = "/getBettenanzahl/";
    const setGesamtBettenBaseURL = "/setBettenanzahl/"; 
    initInputForm(gesamtForm, getGesamtBettenBaseURL, setGesamtBettenBaseURL);
    
    const freiForm = document.getElementById("freieForm");
    console.log(freieForm);
    
    const getFreiBettenBaseURL = "/getFreieBetten/";
    const setFreiBettenBaseURL = "/setFreieBetten/";
    initInputForm(freiForm, getFreiBettenBaseURL, setFreiBettenBaseURL);
    
    return false;
    
    
}

const init = () => {
    const hospButton = document.getElementById("krankenhausButt");
    const currGesamt = document.getElementById("currGesamt");
    
    
    hospButton.onclick = initForms;
    
}

init();