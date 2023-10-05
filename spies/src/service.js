import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import fsCheck from 'node:fs';

export default class Service {

    #filename
    constructor({filename}) {
        this.#filename = filename;
    }

    #hashPassword(password) {
        return crypto
            .createHash('sha256')
            .update(password)
            .digest('hex'); 
    }

    async create({username, password}) {
        if(! (await fsCheck.existsSync(this.#filename))) throw new Error('File does not exist');

        const data = JSON.stringify({
            username,
            password: this.#hashPassword(password),
            createdAt: new Date().toISOString()
        }).concat('\n');

        return await fs.appendFile(this.#filename, data);
    }

    async read() {
        if (! (await fsCheck.existsSync(this.#filename)) ) return [];

        const lines = (await fs.readFile(this.#filename, 'utf-8'))
            .split('\n')
            .filter(line => !!line);
        
        if (!lines.length) return [];

        return lines
            .map(line => JSON.parse(line))
            .map(({password, ...rest}) => ({...rest}));
    }
}
