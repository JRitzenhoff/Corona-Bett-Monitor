/*
This should eventually initialize the view

document.getElementById(...)

*/

const addDataToTable = (listObj, data, dataTranslator) => {
    // get the table header and body
    //  there can technically be more than one so just get the first
    // var tableHeader = tableObj.getElementsByTagName("thead")[0];
    // var tableHeaderRow = tableHeader.getElementsByTagName("tr")[0];
    // var tableHeaderCols = tableHeaderRow.getElementsByTagName("th");

    // Get an ARRAY of TableHeaders
    // var tableColNames = Array.from(tableHeaderCols).map((col) => col.innerHTML);

    // Get the body object
    //var tableBody = tableObj.getElementsByTagName("tbody")[0];

    // iterate through the data
    // data.forEach((dataVal, dataInd) => {
    //     var tableRow = tableBody.insertRow(dataInd);

    //     tableColNames.forEach((name, nameIndex) => {
    //         var fieldName = dataTranslator[name]

    //         var cell = tableRow.insertCell(nameIndex);
    //         cell.innerHTML = dataVal[fieldName];
    //     });

    //     tableBody.appendChild(tableRow);
    // })

    data.forEach((dataVal) => {
        console.log(dataVal);
        console.log("i am a dadasd");
        var hospitalItem = document.createElement("li");

        var hospitalName = document.createElement("h2");
        hospitalName.innerHTML = dataVal.name;
        var bedsData = document.createElement("p");
        bedsData.innerHTML = "Intensivbetten gesamt:" + dataVal.bedcount + "<br>Intensivbetten verfügbar:" + dataVal.freebeds;
        
        hospitalItem.appendChild(hospitalName);
        hospitalItem.appendChild(bedsData);

        listObj.appendChild(hospitalItem);
    })
}

const getHospitalData = () => {
    return fetch(`/top10FreeBeds`)
      .then((response) => {
        return response.json();
      })
      .catch(() => {
        return null;
      });
}

const updateHospitalTable = () => {
    // Get the body of the table... The head has already been initialized in the HTML
    var hospitalList = document.getElementById("hospital-list");
    
    // Translate the TABLE values into QUERY values
    const hospitalTranslator = {
        "Name": "name",
        "Intensivbetten verfügbar" : "freebeds",
        "Intensivbetten gesamt" : "bedcount"
    }

    getHospitalData()
    .then(data => addDataToTable(hospitalList, data, hospitalTranslator))
    .catch(err => console.error(err));
}


function init() {
    updateHospitalTable()
}

init();