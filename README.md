# Next.js Full-Stack App with PostgreSQL and Minio S3 Using Docker

## This is the code for the article [Building a Local Development Environment: Running a Next.js Full-Stack App with PostgreSQL and Minio S3 Using Docker](https://dev.to/alexefimenko/building-a-local-development-environment-running-a-nextjs-full-stack-app-with-postgresql-and-minio-s3-using-docker-1e6m)

### To run the app:

1. Clone the repo

2. Optionally, create a `.env` file in the root of the project and add necessary secrets, for example:

```
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

2. Run the following command in the root of the project:

```bash
# If you have docker files in the root of the project
docker-compose up

# In our case, we have dockerfile and docker-compose file in the `compose` folder, so we need to run:
docker-compose -f compose/docker-compose.yml up

# --- Optional ---
# For running the application with secrets ${VARIABLE_NAME} stored in the .env file, we would need to run:
docker-compose -f compose/docker-compose.yml --env-file .env up
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the Next.js app.

4. Open [http://localhost:9000](http://localhost:9000) with your browser to see the Minio S3 UI. Use the following credentials to login:

```
Username: minio
Password: miniosecret

```

5. Connect to the PostgreSQL database using the following credentials:

```
Host: localhost
Port: 5432
Database: myapp-db
Username: postgres
Password: postgres

```
