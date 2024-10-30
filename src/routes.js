import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {

            const {search} = request.query;

            const tasks = database.select('tasks', search ? {
                title: search, description: search
            } : null);

            return response.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            const {title, description} = request.body;

            if(!title || !description){
                return response.writeHead(400).end('Titulo e descrição são obrigatórios');
            }

            const task = {
                title,
                description,
                created_at: new Date(),
                updated_at: new Date(),
                completed_at: null
            };

            database.insert('tasks', task);
            return response.writeHead(201).end(JSON.stringify(task));
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: ((request, response) => {
            const {title, description} = request.body;

            if(!title || !description){
                return response.writeHead(400).end('Titulo e descrição são obrigatórios');
            }

            const {id} = request.params;
            let task = database.select('tasks', {id})[0];

            if(!task){
                return response.writeHead(404).end('Tarefa não encontrada');
            }

            task.title = title;
            task.description = description;
            task.updated_at = new Date();

            database.update('tasks', task);

            return response.writeHead(201).end(JSON.stringify(task));
        })
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (request, response) => {
            const {id} = request.params;
            let task = database.select('tasks', {id})[0];

            if(!task){
                return response.writeHead(404).end('Tarefa não encontrada');
            }

            task.updated_at = new Date();
            task.completed_at = new Date();

            database.update('tasks', task);

            return response.writeHead(201).end(JSON.stringify(task));
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const {id} = request.params;
            const task = database.select('tasks', {id})[0];

            if(!task){
                return response.writeHead(404).end('Tarefa não encontrada');
            }

            database.delete('tasks', id);
            return response.writeHead(204).end();
        }
    }
]