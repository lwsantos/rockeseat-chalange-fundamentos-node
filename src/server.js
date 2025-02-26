import http from 'node:http';
import { json } from './middleware/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer(async (request, response) => {

    await json(request, response);

    const {method, url} = request;
    const route = routes.find(route => route.method === method && route.path.test(url));

    if(route){
        const routeParams = url.match(route.path);
        const {query, ...params} = routeParams.groups;

        request.params = params;
        request.query = query ? extractQueryParams(query) : {};

        return route.handler(request, response);
    }
    

    return response.writeHead(404).end();
})

server.listen(3030);