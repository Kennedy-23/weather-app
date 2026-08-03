async function getUsers() {
    let response = await fetch("https://jsonplaceholder.typicode.com/users");
    let data = await response.json();
    console.log(data);
    console.log(data[0].name);
    console.log(data[0].email);
}

getUsers();