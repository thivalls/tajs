import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import Service from "../src/service.js";
import fs from 'node:fs/promises';
import fsCheck from 'node:fs';
import crypto from 'node:crypto';

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
            const fsSpy = jest.spyOn(fs, 'readFile').mockResolvedValue('');
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

    describe('# Suite for create', () => {

        let _service
        const filename = 'filename.ndjson';
        const MOCK_CRYPTO_PASS = 'any_crypto_pass';

        beforeEach(() => {

            jest.spyOn(
                crypto,
                'createHash'
            ).mockReturnValue({
                update: jest.fn().mockReturnThis(),
                digest: jest.fn().mockReturnValue(MOCK_CRYPTO_PASS)
            })

            jest.spyOn(
                fs,
                'appendFile'
            ).mockResolvedValue()

            jest.spyOn(
                fsCheck,
                'existsSync'
            ).mockResolvedValue(true)

            _service = new Service({filename})
        });

        it('should create with correct filename and data', async () => {
            const createdDate = new Date().toISOString();
            jest.spyOn(Date.prototype, Date.prototype.toISOString.name).mockReturnValue(createdDate)
            
            const input = { 
                username: 'user1', 
                password: 'pass1'
            }

            await _service.create(input);

            expect(crypto.createHash ).toHaveBeenCalledTimes(1);
            expect(crypto.createHash ).toHaveBeenCalledWith('sha256');

            const hash = crypto.createHash('sha256');

            expect(hash.update).toHaveBeenCalledWith('pass1');
            expect(hash.digest).toHaveBeenCalledWith('hex');

            const expectResultSaved = JSON.stringify({
                ...input,
                createdAt: createdDate,
                password: MOCK_CRYPTO_PASS
            }).concat('\n');

            expect(fs.appendFile).toHaveBeenCalledWith(filename, expectResultSaved);
        });

        it('Should throw erro if file does not exists', async () => {
            jest.spyOn(
                fsCheck,
                'existsSync'
            ).mockResolvedValueOnce(false)

            const input = { 
                username: 'user1', 
                password: 'pass1'
            }

            await expect(() => _service.create(input)).rejects.toThrow(new Error('File does not exist'));
            expect(fs.appendFile).not.toHaveBeenCalled();
            expect(crypto.createHash).not.toHaveBeenCalled();
        });
    });
});