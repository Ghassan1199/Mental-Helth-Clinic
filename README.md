# Smart Clinic Graduation Project

This project is a smart clinic management system built using TypeScript and Node.js. It provides comprehensive functionalities to manage clinic operations efficiently.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)


## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Version 18.x or higher
- **npm**: Package manager for installing dependencies
- **TypeScript**: Installed globally (`npm install -g typescript`)
- **MySQL/PostgreSQL**: Database server for storing data

## Installation

To get started with this project, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/yourusername/smart-clinic.git
cd smart-clinic
```

2. Install the dependencies:

```bash 
npm install
```

3. Set up environment variables:
    Create a .env file in the root directory and configure it

    ```ini
    NODE_ENV: Environment type (e.g., dev, prod)
    DB_TYPE: Type of database (e.g., mysql, postgresql)
    DB_NAME: Name of the database
    DB_USER: Database user
    DB_PASSWORD: Database password
    DB_HOST: Database host
    DB_PORT: Database port
    TOKEN_SECRET: Secret key for JWT token generation
    EMAIL: Email address for sending emails
    EMAIL_PASSWORD: Password for the email account
    ACCESS_TOKEN_SECRET: Secret key for access tokens
    ACCESS_TOKEN_EXPIRES_IN: Expiration time for access tokens (in minutes)
    REFRESH_TOKEN_SECRET: Secret key for refresh tokens
    REFRESH_TOKEN_EXPIRES_IN: Expiration time for refresh tokens (in days)
    ADMIN_ACCESS_SECRET_KEY: Secret key for admin access
    ```

# Usage
# Development

Start the development server with hot-reloading enabled:
``` bash
npm run start 
```

# Build
Compile the TypeScript code to JavaScript:

``` bash
npm run tsc
```
# Serve
Run the compiled JavaScript files:

``` bash
npm run serve
```

# Seed the Database
Seed the database with initial data:

```bash
npm run seed
```

# Project Structure
The project follows a modular structure:

```
└───src
    ├───application
    │   ├───services
    │   │   ├───admin
    │   │   ├───appointment
    │   │   ├───block
    │   │   ├───bot-score
    │   │   ├───category
    │   │   ├───chat
    │   │   ├───city
    │   │   ├───codes
    │   │   ├───medical-record
    │   │   ├───patient
    │   │   ├───registration
    │   │   ├───report
    │   │   ├───sessionInfo
    │   │   ├───specs
    │   │   └───withdraw
    │   ├───utils
    │   └───validation
    ├───configuration
    ├───domain
    │   ├───entities
    │   └───interfaces
    │       ├───repositories
    │       │   ├───admin
    │       │   ├───appointment
    │       │   ├───assigment
    │       │   ├───blockings
    │       │   ├───bot-score
    │       │   ├───category
    │       │   ├───certifications
    │       │   ├───city
    │       │   ├───code
    │       │   ├───medical-record
    │       │   ├───registration
    │       │   ├───report
    │       │   ├───sessionInfo
    │       │   ├───specs
    │       │   └───withdraw
    │       └───utils
    ├───infrastructure
    │   └───database
    │       ├───migrations
    │       ├───repositories
    │       │   ├───mongodb
    │       │   └───mysql
    │       │       ├───admin
    │       │       ├───appointment
    │       │       ├───assignment
    │       │       ├───blockings
    │       │       ├───bot-score
    │       │       ├───category
    │       │       ├───certifications
    │       │       ├───city
    │       │       ├───code
    │       │       ├───medical-record
    │       │       ├───registration
    │       │       ├───report
    │       │       ├───sessionInfo
    │       │       ├───specs
    │       │       └───withdraw
    │       └───seeder
    │           └───Appointment
    ├───presentation
    │   ├───containers
    │   ├───controllers
    │   │   ├───admin
    │   │   ├───appointment
    │   │   ├───block
    │   │   ├───bot-score
    │   │   ├───category
    │   │   ├───city
    │   │   ├───code
    │   │   ├───medical-record
    │   │   ├───registration
    │   │   ├───report
    │   │   ├───sessionInfo
    │   │   ├───specs
    │   │   ├───userRedeem
    │   │   └───withdraw
    │   ├───middlewares
    │   │   ├───auth
    │   │   └───handlers
    │   ├───request
    │   ├───resources
    │   ├───routes
    │   │   ├───admin
    │   │   ├───admin-report
    │   │   ├───appointment
    │   │   ├───assignment
    │   │   ├───block
    │   │   ├───bot-score
    │   │   ├───category
    │   │   ├───chat
    │   │   ├───city
    │   │   ├───code
    │   │   ├───otp
    │   │   ├───registration
    │   │   ├───report
    │   │   ├───sessionInfo
    │   │   ├───specs
    │   │   ├───user
    │   │   └───withdraw
    │   └───utils
    └───tasks
```

