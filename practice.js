async function getUsers() {

    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    const data = await response.json();

    for (const user of data) {
    console.log(`${user.name} - ${user.email}`);
}
}
getUsers();
