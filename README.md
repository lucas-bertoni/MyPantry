# Project Description
This was a project for a class I took called "Scalable Web Systems" which focused on a microservice based server arcitechture.
I had one team mate for this project but who wrote what code is commented at the top of each file.

Each service has its own directory and inside each directory folder there is a README further explaining what each service does.

I (Lucas Bertoni) created the following services:
- Event Bus
- Authentication
- Event Logger
- Share
- Some of the client service (the parts which are relevant to the back end services I wrote)

I also got everything working with Docker Compose so the project can be deployed in a containerized environment.

## Highlights of this project
- It uses a microservice based server arcitechture and the services communicate using an event bus (created by me)
- We used independent Postgres Docker containers to store data for each service
- React was used to create a scalable front end service
