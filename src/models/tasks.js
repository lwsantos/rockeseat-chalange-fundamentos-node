export class Task {
    id;
    title;
    description;
    completed_at;
    created_at;
    updated_at;

    constructor(id, title, description){
        this.id = id;
        this.title = title;
        this.description = description;
    }
}