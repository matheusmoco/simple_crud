import express from 'express';

const server = express();

server.use(express.json()); //usar json com express

const projects = [];

//Check if a project exists
function checkProjectExists(req, res, next) {
    const { id } = req.params;

    const project = projects.find(p => p.id == id);

    if (!project.tasks) {
        return res.status(400).json({ error: "Project not found!" });
    }

    return next();
};

//Count number of server requests
function countServerRequests(req, res, next) {
    console.count("Number of requests");

    return next();
}

//List all projects
server.get('/projects', countServerRequests, (req, res) => {
    return res.json(projects);
});

//Create a project
server.post('/projects', countServerRequests, (req, res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.json(project);
});

//Create a new task
server.post('/projects/:id/tasks', checkProjectExists, countServerRequests, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.send();
});

//Update a project title
server.put('/projects/:id', checkProjectExists, countServerRequests, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;

    return res.send();
});

//Delete a project
server.delete('/projects/:id', checkProjectExists, countServerRequests, (req, res) => {
    const { id } = req.params;

    const project = projects.find(p => p.id == id);

    projects.splice(project);

    return res.send();
});

//Delete a task
server.delete('/projects/:id/tasks/:index', checkProjectExists, countServerRequests, (req, res) => {
    const { id, index } = req.params;

    const project = projects.find(p => p.id == id);

    project.tasks.splice(project.tasks[index], 1);

    return res.json(project);
});

server.listen(5000);

