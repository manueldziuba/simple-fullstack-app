# Simple Fullstack App

This projects gives you a simple full-stack app, with
* Node.js backend (RESTful API)
* Postgres database
* Angular 4 frontend

Follow the instructions to get it running with Docker.

## Requirements

Make sure Docker (+ CLI) is installed on your system.
For local development, you also need the npm package `@angular/cli` globally installed:

	npm install -g @angular/cli

## Run the app

To run the app, simple run the following command in the projects root folder:

	docker-compose up

When Docker has installed all services, you can access the frontend via

	http://localhost:5000/

Do a

	docker-compose down

to halt the containers again.

## Development 

For development, you also do only need Docker - no Node.js etc!
There is a special `docker-compose.debug.yml` file that can be used to start a Docker stack for your local environment, where the code is directly linked into. Simply do:

	docker-compose -f docker-compose.debug.yml up -d
	docker logs -f simplefullstackapp_app_1

Docker will start up with a Postgres database container and a container running Node.js and the app (server + client).
The second command shows the application logs.

To directly see made changes in Angular (client), you can use the following command (in the project's root folder) to bring up a separated webserver with watcher:

	ng serve --port 5001

So you can open http://localhost:5001/ for the frontend and http://localhost:5000/api/data for the backend in parallel (running in Docker)!