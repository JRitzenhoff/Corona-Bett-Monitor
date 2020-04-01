/*
This should eventually initialize the view

document.getElementById(...)

*/

const addDataToList = (listObj, data) => {

    deleteDataInList(listObj);

    data.forEach((hospital) => {
        var hospitalName = document.createElement("div");
        var hospitalLink = document.createElement("a");
        var currLink = hospital.website + "";

        hospitalLink.setAttribute("href", currLink);
        hospitalLink.setAttribute("class", "summary-title-link");
        // console.log(hospital);
        hospitalLink.innerHTML = hospital.name;
        hospitalName.appendChild(hospitalLink);

        var bedsData = document.createElement("div");
        bedsData.setAttribute("class", "summary-excerpt");

        var bedsDataPara = document.createElement("p");
        bedsData.innerHTML = "Intensivbetten gesamt: " + hospital.bedcount + "<br>Intensivbetten verfügbar: " + hospital.freebeds;
        bedsData.appendChild(bedsDataPara);

        listObj.appendChild(hospitalLink);
        listObj.appendChild(bedsData);
    })
}

const getHospitalData = () => {
    var regionSelector = document.getElementById("selected-region");
    var region = regionSelector.options[regionSelector.selectedIndex].value;
    console.log("The Region is:" + region);
    var filtersIndex = document.getElementById("selected-filter").selectedIndex;

    var direction = "";
    var attribute = "";

    if(filtersIndex === 0){
        direction = "asc";
        attribute = "freebeds";
    }else if (filtersIndex === 1){
        direction = "desc";
        attribute = "freebeds";
    }else if (filtersIndex === 2){
        direction = "asc";
        attribute = "bedcount";
    } else if (filtersIndex ===3){
        direction = "asc";
        attribute = "bedcount";
    }

    var fetch_url = '/hospitals/' + region + '/' + direction + '/' + attribute;
    console.log("The fetch URL is: " + fetch_url);

    return fetch(fetch_url)
      .then((response) => {
        return response.json();
      })
      .catch(() => {
        return null;
      });
}

const deleteDataInList = (valList) => {
    if (valList) {
        while (valList.firstChild) {
            valList.removeChild(valList.firstChild);
        }
    }
}

const updateList = () => {
    var hospitalList = document.getElementById("hospital-list");

    // console.log(hospitalList.childNodes);
    
    getHospitalData()
    .then(data => addDataToList(hospitalList, data))
    .catch(err => {
        // console.error(err))
        deleteDataInList(hospitalList);
    });
        
}


function init() {
    updateList();
}

init();