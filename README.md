# Inscribe Blog Platform

A modern, full-stack blogging platform that enables users to manage blog posts, with authentication and validation. Built using **React** for the frontend, **Cloudflare Workers** for the backend, **Prisma** ORM with **PostgreSQL** for data management, and **JWT** for secure authentication.

## Features

- **User Authentication**: Secure user login and registration.
- **Blog Management**: View, create, and publish blog posts.
- **Search Functionality**: Easily search for posts by title or content.
- **Validation**: Zod for input validation, ensuring data integrity.
- **Responsive Design**: Optimized for various screen sizes.
- **Efficient Database Operations**: Prisma Accelerate for optimized data fetching.

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Cloudflare Workers, Hono, JWT
- **Database**: PostgreSQL (via Prisma)
- **ORM**: Prisma with Accelerate extension
- **Authentication**: JWT

## Environment Variables

In order to run this project, the following environment variables are required:

### Backend

- `JWT_SECRET`: Secret key for JWT authentication.
- `DATABASE_URL`: Database URL for PostgreSQL instance.
- `DATABASE_URL`: URL for Prisma Accelerate, defined in `wrangler.toml`.

### Frontend

- `DATABASE_URL`: Endpoint pointing to the backend API hosted on Cloudflare.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
