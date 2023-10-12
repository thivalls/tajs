export function mapPerson(json) {
    const {name, age} = JSON.parse(json);
    const birthday = new Date();
    return {name, age, birthday};
}