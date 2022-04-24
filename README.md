# prime
A simple chat API for a blog

**API** built with Node + TypeScript + Postgres + Docker + Prisma Express + Jest

## You can find the complete API documentation on [Postman](https://documenter.getpostman.com/view/15084009/UyrBhvHY)
## You can check out the deployed application on [heroku](https://prime-blog-backend.herokuapp.com/)


## HTTP Status Codes
HTTP status codes was used to indicate success or failure of a request

### Success codes
- 200 OK - Request succeeded. Response included in JSON 
- 201 Created - Resource created. Response included in JSON 
- 204 No Content - Request succeeded, but no response body

### Error codes
- 400 Bad Request - Could not parse request. Response with appropriate error message
- 401 Unauthorized - No authentication credentials provided or authentication failed
- 403 Forbidden - Authenticated user does not have access
- 404 Not Found - Resource not found. If you hit an endpoint that is not available
- 500, 501, 502, 503, etc - An internal server error occured


## Philosophy Implored

#### Friendly and informative error message
When users send a request that is not well formatted, missing or invalid, an appropriate status code with error message is thrown to enable the user to easily navigate to the source of problem. 

#### Separation of concerns
This style as been gaining fame in the backend development world. It allows other programmers to easily interact with the code with little amount of time and effort, making them free of the fear  of breaking the application.


#### TypeScript
A very interesting question type might be asked is why typescript could be a philosophy. JavaScript is a very popular programming language characterized with easy to learn and use. Thus, there’s always a price to pay for that – runtime error and complexity in making changes.

#### Versioning
Versioning API is among the best practices that a backend engineer should pick up during development 

#### Linting
A careful coding style with appropriate linting is very import for good software


## Architecture
During the development of the application, the modular architectural pattern was used to structure the code.


## How to use project
- Clone repo `https://github.com/Abu-Abdillah1/prime.git`
- Install NPM modules `npm install`
- Build project `npm run build`
 


## Core Structure
    super-exchange
      ├── .github
      ├── @types
      ├── src 
      │   ├── auth
      │   │   ├── auth.controller.ts
      │   │   ├── auth.middleware.ts
      │   │   ├── auth.router.ts
      │   │   └── auth.util.ts
      │   │ 
      │   ├── comments
      │   │   ├── comments.controller.ts
      │   │   ├── comments.model.ts
      │   │   ├── comments.router.ts
      │   │   ├── comments.test.ts
      │   │   └── comments.util.ts
      │   ├── error
      │   │   ├── error.middleware.ts
      │   │   ├── http-exception.ts
      │   │   └── not-found.middleware.ts
      │   │
      │   ├── posts
      │   │   ├── posts.controller.ts
      │   │   ├── posts.model.ts
      │   │   ├── posts.router.ts
      │   │   ├── posts.test.ts
      │   │   └── posts.util.ts
      │   │
      │   ├── users
      │   │   ├── users.controller.ts
      │   │   ├── users.interface.ts
      │   │   ├── users.model.ts
      │   │   ├── users.router.ts
      │   │   ├── users.test.ts
      │   │   └── users.util.ts
      │   │
      │   ├── app.ts
      │   └── index.ts
      │
      ├── .dockerignore
      ├── .env
      ├── .eslintignore
      ├── .eslintrc
      ├── .gitignore
      ├── docker-compose.yml
      ├── Dockerfile
      ├── jest.config.js
      ├── package-lock.json
      ├── package.json
      ├── README.md
      └── tsconfig.json

## Author
Abu Abdillah olamide14044@gmail.com

Copyright (c) 2022 Abu Abdillah https://github.com/Abu-Abdillah1/

