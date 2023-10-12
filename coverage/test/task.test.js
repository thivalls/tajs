import { it, expect, beforeEach, describe, jest } from '@jest/globals'
import Task from '../src/task';
import { mapPerson } from '../src/person';
import { setTimeout } from 'node:timers/promises';

describe('# Suite for task', () => {
    let _task;
    let _logMock;

    beforeEach(() => {
        _logMock = jest.spyOn(console, console.log.name).mockImplementation();
        _task = new Task();
    });

    it('should run tasks without fake timers (slow)', async() => {
        jest.useFakeTimers();

        const tasks = [
            {
                name: 'run-each-5-sec',
                dueAt: new Date(Date.now() + 5000),
                fn: jest.fn()
            },
            {
                name: 'run-each-10-sec',
                dueAt: new Date(Date.now() + 10000),
                fn: jest.fn()
            }
        ];

        // add tasks to class task
        _task.save(tasks.at(0))
        _task.save(tasks.at(1))

        // run task each 200 mSecs
        _task.run(200)

        // advance time to test with faker time
        jest.advanceTimersByTime(4000)

        expect(tasks.at(0).fn).not.toHaveBeenCalled()
        expect(tasks.at(1).fn).not.toHaveBeenCalled()

        // advance time to test with faker time
        jest.advanceTimersByTime(2000)

        expect(tasks.at(0).fn).toHaveBeenCalled()
        expect(tasks.at(1).fn).not.toHaveBeenCalled()

        // advance time to test with faker time
        jest.advanceTimersByTime(4000)

        expect(tasks.at(0).fn).toHaveBeenCalled()
        expect(tasks.at(1).fn).toHaveBeenCalled()
    });
});

describe('# Suite for person', () => {
    it('should map a person with valid json (happy path)', () => {
        const personJson = '{"name":"thiagovalls","age":36}';
        const person = mapPerson(personJson);

        console.log(person);

        expect(person).toEqual({
            name: 'thiagovalls',
            age: 36,
            birthday: expect.any(Date)
        });
        
    });

    it('should not create and throw error with invalid json', () => {
        const personJson = '{"name"';
        expect(() => mapPerson(personJson)).toThrow('Unexpected end of JSON input');
    });

    it('should map a person with undefined values when json is empty', () => {
        const personJson = '{}';
        const person = mapPerson(personJson);

        expect(person).toEqual({
            name: undefined,
            age: undefined,
            birthday: expect.any(Date)
        });
        
    });
});

