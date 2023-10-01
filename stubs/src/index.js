import Service from "./service.js"

const data = {
    username: `fulano-${Date.now()}`,
    password: 'minhasenhasecreta'
}

const service = new Service({ filename: './users.ndjson' });
service.create(data)

console.log(await service.read());