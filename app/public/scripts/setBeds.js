
const putIntensive = () => {
    const krankenhaus = document.getElementsByName("krankenhaus");

    krankenhaus.entries().forEach((arg, ind) => {
        console.log(arg)});
    console.log("The krank" + krankenhaus.entries())

    alert("I want to see the output" + Array.from(krankenhaus)) 

    const endpoint = '/setBettenanzahl' + krankenhaus.innerHTML

    return fetch(endpoint, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .catch(err => console.error(err))
}

const init = () => {
    const bettButton = document.getElementById('iBettButton');

    const krankenhaus = document.getElementsByName("krankenhaus")[0];
    console.log(krankenhaus.value)
    // bettButton.addEventListener('click', putIntensive);
    // console.log(bettButton);

    // console.log(bettForm.childNodes);
    // .addEventListener('action', putIntensive);
}

init();