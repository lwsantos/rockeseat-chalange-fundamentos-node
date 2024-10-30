export function extractQueryParams(query){
    query = query.substr(1);

    const params = query.split('&');

    return params.reduce((queryParams, param) => {
        const [key, value] = param.split('=');
        queryParams[key] = value;

        return queryParams;
    }, {})
}