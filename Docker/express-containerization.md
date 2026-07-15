# Containerisation Express App

## Containerizing Express App for Development with Docker

## Introduction

Docker has revolutionized the way we build, package, and deploy
applications. By containerizing applications, we ensure consistent
behavior across different environments, whether on a developer's local
machine, a staging environment, or production.

------------------------------------------------------------------------

## Problem Statement

Imagine working on an application on your local machine where everything
works perfectly. However, after deploying it to production, things
break. This inconsistency is often described as:

> "But it works on my machine!"

Docker solves this by packaging your application along with all its
dependencies into a **container**, allowing it to run consistently
across different platforms.

------------------------------------------------------------------------

## Objectives

By the end of this lesson, you should be able to:

1.  Understand the basics of Docker.
2.  Containerize an Express application.
3.  Run the containerized application locally.

------------------------------------------------------------------------

## What is Docker?

Docker is a platform that enables developers to create, deploy, and run
applications inside **containers**.

A container includes everything required to run an application:

-   Source code
-   Runtime
-   System tools
-   System libraries
-   Settings

------------------------------------------------------------------------

# Steps to Containerize the Express App

## 1. Install Docker

Download and install Docker for your operating system from the official
Docker website.

------------------------------------------------------------------------

## 2. Create a Dockerfile

Create the following directory structure:

``` text
docker/
└── development/
    └── Dockerfile
```

Example `Dockerfile`:

``` dockerfile
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5501

CMD ["npm", "run", "dev"]
```

------------------------------------------------------------------------

## 3. Create a `.dockerignore` File

``` text
node_modules
npm-debug.log
.env
```

------------------------------------------------------------------------

## 4. Build the Docker Image

``` bash
docker build -t auth-service:dev -f docker/development/Dockerfile .
```

------------------------------------------------------------------------

## 5. Run the Docker Container

``` bash
docker run --rm -it \
-v $(pwd):/usr/src/app \
-v /usr/src/app/node_modules \
--env-file $(pwd)/.env \
-p 5501:5501 \
-e NODE_ENV=development \
auth-service:dev
```

### Windows

**PowerShell**

``` powershell
${PWD}
```

instead of `$(pwd)`.

**Command Prompt**

``` cmd
%cd%
```

instead of `$(pwd)`.

The application will be available at:

``` text
http://localhost:5501
```

------------------------------------------------------------------------

## 6. Stop the Container

If running interactively:

``` bash
Ctrl + C
```

If running in detached mode:

``` bash
docker ps
docker stop <container-id>
```

------------------------------------------------------------------------

# Conclusion

Docker provides a consistent environment for applications and eliminates
the classic **"it works on my machine"** problem. Once your Express
application is containerized, it can run reliably across development,
staging, and production environments.
