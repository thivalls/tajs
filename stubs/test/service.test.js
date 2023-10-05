import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import Service from "../src/service.js";
import fs from 'node:fs/promises';
import fsCheck from 'node:fs';

describe('# Suite for stub service', () => {
    
    let _service 
    const filename = 'filename.ndjson';

    beforeEach(() => {
        _service = new Service({filename})
    });

    describe('# Suite for read', () => {
        function dbData() {
            return [
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
        }

        function usersStub(data) {
            return data
                .map(item => JSON.stringify(item).concat('\n')).join('')
        }

        it('should return empty array if it has no results and file exist', async () => {
            jest.spyOn(fsCheck, 'existsSync').mockResolvedValueOnce(true);
            const fsSpy = jest.spyOn(fs, fs.readFile.name).mockResolvedValue('');
            const results = await _service.read();
            expect(results).toEqual([]);
        });

        it('should return empty array if file does not exists', async () => {
            jest.spyOn(fsCheck, 'existsSync').mockResolvedValueOnce(false);
            const fsSpy = jest.spyOn(fs, 'readFile');
            const results = await _service.read();
            expect(results).toEqual([]);
            expect(fsSpy).not.toHaveBeenCalled();
        });

        it('Should return user data without password in response', async () => {
            const items = dbData();

            jest.spyOn(fsCheck, 'existsSync').mockResolvedValueOnce(true);
            const fsSpy = jest.spyOn(fs, 'readFile').mockResolvedValue(usersStub(items));

            const results = await _service.read();
            const expected = items.map(({password, ...rest}) => ({...rest}));
            
            expect(results).toStrictEqual(expected);
            expect(fsSpy).toBeCalledTimes(1);
        });
    });
});