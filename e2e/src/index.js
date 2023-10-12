import server from "./server.js";

if(process.env.NODE_ENV !== 'test') {
    server.listen(process.env.PORT, () => {
        const serverInfo = server.address();
        console.log(`server running at ${serverInfo.address}:${serverInfo.port}`);
    })
}

export default server;

/*
    curl \
    -i \
    -X POST \
    -H 'Content-Type application/json' \
    -d '{"name": "Xuxa da Silva", "cpf": "123.222.333-02"}' \
    http://localhost:3000/persons
*/