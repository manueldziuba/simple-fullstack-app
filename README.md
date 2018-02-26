# Simple Fullstack App

This projects gives you a simple full-stack app, with
* Node.js backend (RESTful API)
* Postgres database
* Angular 4 frontend

Follow the instructions to get it running with Docker.

## Requirements

To run this app, make sure Docker (+ CLI) is installed on your system.

## Installation

To run the app, simple change your current directory to the project folder 
(where this README lives) and run the following command:

	docker-compose up

When Docker has installed all services, you can access the frontend via

	http://localhost:8099/

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

