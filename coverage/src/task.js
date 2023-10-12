export default class Task {
    #tasks = new Set();

    save({name, dueAt, fn}) {
        console.log(`Adding new task ${name} as ${new Date(dueAt).toISOString()}`);
        this.#tasks.add({name, dueAt, fn});
    }

    run(everyMs) {
        const intervalRef = setInterval(() => {
            const now = new Date();

            if(this.#tasks.size === 0) {
                console.log('Tasks finished')
                clearInterval(intervalRef);
                return;
            }
            
            for(const task of this.#tasks) {
                if(task.dueAt <= now) {
                    task.fn()
                    this.#tasks.delete(task)
                }
            }

        }, everyMs)
    }
}