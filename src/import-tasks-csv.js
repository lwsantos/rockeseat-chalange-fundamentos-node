import fs from 'node:fs';
import { parse } from 'csv-parse';

export async function importTasks(){
    const tasks = [];
    const parser = fs.createReadStream('./import-tasks.csv').pipe(parse({columns: true, delimiter: ';'}));

    for await (const task of parser){
        const {title, description} = task;
        

        const response = await fetch('http://localhost:3030/tasks', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({title, description})
        });

        if(response.ok){
            const taskResponse = await response.json();
            tasks.push(taskResponse);
        }
    }

    return tasks;
}

const tasks = await importTasks();
console.log('Tarefas importadas: ', tasks);