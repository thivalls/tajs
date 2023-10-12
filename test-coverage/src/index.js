import Task from "./task.js";

const oneSecond = 1000;
const taskOneSec = new Date(Date.now() + oneSecond);
const taskTwoSec = new Date(Date.now() + oneSecond * 2);
const taskThreeSec = new Date(Date.now() + oneSecond * 3);
const taskFourSec = new Date(Date.now() + oneSecond * 4);

const task = new Task();

task.save({
    name: 'Task 1',
    dueAt: taskOneSec,
    fn: () => { console.log('task 1 executed') }
})

task.save({
    name: 'Task 2',
    dueAt: taskTwoSec,
    fn: () => { console.log('task 2 executed') }
})

task.save({
    name: 'Task 3',
    dueAt: taskThreeSec,
    fn: () => { console.log('task 3 executed') }
})

task.save({
    name: 'Task 3',
    dueAt: taskFourSec,
    fn: () => { console.log('task 4 executed') }
})

task.run(oneSecond)
