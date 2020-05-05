/*
This should eventually initialize the view

document.getElementById(...)

*/

const addDataToList = (listObj, data) => {
    deleteDataInList(listObj);

    data.forEach((hospital) => {
        // NOTE: because these objects are elements. The components are still mutable and a "const" can be used
        const hospitalDiv = document.createElement("div");
        const hospitalLink = document.createElement("a");

        // you don't want to change the link so keep it a const
        const currLink = hospital.website + "";

        hospitalLink.setAttribute("href", currLink);
        hospitalLink.setAttribute("class", "summary-title-link");
        // console.log(hospital);
        hospitalLink.innerHTML = hospital.name;

        hospitalDiv.appendChild(hospitalLink);

        const bedDataDiv = document.createElement("div");
        bedDataDiv.setAttribute("class", "summary-excerpt");

        const bedDataParagraph = document.createElement("p");
        bedDataDiv.innerHTML = "Intensivbetten verfügbar: " + hospital.freebeds + "<br>" + "Intensivbetten gesamt: " + hospital.bedcount;
        bedDataDiv.appendChild(bedDataParagraph);

        listObj.appendChild(hospitalLink);
        listObj.appendChild(bedDataDiv);
    })
}

const getHospitalData = () => {
    const selectedRegion = document.getElementById("region-selector").value;

    const selectedSortInstruction = document.getElementById("instruction-selector").value;

    /* assuming value follows the format: "freie-betten-aufsteigend"
        --> split the string at every "-" and create a list
            NOTE: that list will have three elements... [ "freie", "betten", "aufsteigend" ]

        --> dissassemble that list into its unique components
            NOTE: only care about the first and
    */
    const [ rawAttribute, _ , rawDirection ] = selectedSortInstruction.toLowerCase().split("-");

    // console.log(rawAttribute, bettenFiller, rawDirection);
    attributeTranslator = {
        "freie" : "freebeds",
        "anzahl" : "bedcount"
    };

    directionTranslator = {
        "aufsteigend" : "asc",
        "absteigend" : "desc"
    };

    const attribute = attributeTranslator[rawAttribute];
    const direction = directionTranslator[rawDirection];

    // console.log(attribute, direction)

    const fetch_url = '/hospitals/' + selectedRegion + '/' + direction + '/' + attribute;

    // console.log("The fetch URL is: " + fetch_url);

    return fetch(fetch_url).then(response => response.json()).catch(() => null);
}

const deleteDataInList = (valList) => {
    if (valList) {
        // while there is a child, delete that child
        while (valList.firstChild) {
            valList.removeChild(valList.firstChild);
        }
    }
}

const updateList = () => {
    const hospitalList = document.getElementById("hospital-list");
    // console.log(hospitalList.childNodes);
    
    getHospitalData()
    .then(data => addDataToList(hospitalList, data))
    .catch(err => {
        // console.error(err);
        deleteDataInList(hospitalList);
    });
}


function init() {
    updateList();
}

init();