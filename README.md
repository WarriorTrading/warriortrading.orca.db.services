## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/warriortrading.orca.db.services
    npm install
   
3. Make sure you have installed docker service and start docker service.
4. Modify local_db/docker-compose.yaml, modify the port mapping,username,password and db name, run docker-compose up -d
5. Modify config/default.json. Modify pg's connection info as your local pg's connection info.
   Modify knexfile.js file, remove following code:
   ```
   ssl: {
      rejectUnauthorized: false,
    },
   ```
   set following environment variables as your local db pg info.
   ```
   ORCA_PG_USER,
   ORCA_PG_PASSWORD,
   ORCA_PG_HOST,
   ORCA_PG_PORT,
   ORCA_PG_DATABASE
   ```
6. start app
    ```
    npm run compile # Compile TypeScript source
    npm run migrate # Run migrations to set up the database
    npm start
    ```