class Person {

    static validate(person) {
        if(!person.name) throw new Error('Name is required');
        if(!person.cpf) throw new Error('CPF is required');
    }

    static format(person) {
        const [name, ...lastName] = person.name.split(' ');
        return {
            cpf: person.cpf.replace(/\D/g, ''),
            name,
            lastName: lastName.join(' ')
        }
    }

    static save(person) {
        if(!['cpf', 'name', 'lastName'].every(prop => person[prop])) {
            throw new Error(`Error while save in database ${JSON.stringify(person)}`);
        }

        console.log('Registrado com sucesso', person);
    }

    static process(person) {
        this.validate(person);
        person = this.format(person);
        this.save(person);
        return 'ok';
    }
}

// Person.process({
//     name: 'Zezin da Vila',
//     cpf: '123.222.333-02'
// })
export default Person;