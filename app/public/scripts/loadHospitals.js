/*
This should eventually initialize the view

document.getElementById(...)

*/

const addDataToList = (listObj, data) => {
    data.forEach((hospital) => {
        var hospitalName = document.createElement("div");
        var hospitalLink = document.createElement("a");
        hospitalLink.setAttribute("href", "https://www.mri.tum.de/");
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
    var citySelector = document.getElementById("selected-city");
    var city = citySelector.options[citySelector.selectedIndex].value;
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

    var fetch_url = '/hospitals/' + city + '/' + direction + '/' + attribute;
    console.log(fetch_url)

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
        for (var child in valList.childNodes) {
            valList.removeChild(child);
        }
    }
}

const updateList = () => {
    var hospitalList = document.getElementById("hospital-list");

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