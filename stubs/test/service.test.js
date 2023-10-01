import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import Service from "../src/service.js";
import fs from 'node:fs/promises';

describe('# Suite for stub service', () => {
    
    let _service 
    const filename = 'filename.ndjson';

    beforeEach(() => {
        _service = new Service({filename})
    });

    describe('# Suite for read', () => {
        it('should read users from file', async () => {
            jest.spyOn(fs, fs.readFile.name).mockResolvedValue('');
            const results = await _service.read();
            expect(results).toEqual([]);
        });

        it('Should return user data without password in response', async () => {
            const dbData = [
                { 
                    username: 'user1', 
                    password: 'pass1', 
                    createdAt: new Date().toISOString() 
                },
                { 
                    username: 'user2', 
                    password: 'pass2', 
                    createdAt: new Date().toISOString() 
                },
            ];

            const fileContent = dbData
                .map(item => JSON.stringify(item).concat('\n')).join('')

            jest.spyOn(fs, 'readFile').mockResolvedValue(fileContent);

            const results = await _service.read();
            const expected = dbData.map(({password, ...rest}) => ({...rest}));
            
            expect(results).toStrictEqual(expected);
        });
    });
});