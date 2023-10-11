import { it, expect, beforeEach, describe, jest } from '@jest/globals'
import Task from '../src/task';
import { setTimeout } from 'node:timers/promises';

describe('# Suite for task', () => {
    let _task;
    let _logMock;

    beforeEach(() => {
        _logMock = jest.spyOn(console, console.log.name).mockImplementation();
        _task = new Task();
    });

    it.skip('should run tasks without fake timers (slow)', async() => {
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

        // waiting enough time to wait functions to be executed
        // first wil be executed after 5 sec (5000)
        // secont will be executed after 10 sec (10000)
        await setTimeout(11e3); // waiting 11 to be executed both methods

        expect(tasks.at(0).fn).toHaveBeenCalled()
        expect(tasks.at(1).fn).toHaveBeenCalled()
    }, 12000);

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

