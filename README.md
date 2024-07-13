## Example of a File Storage With Next.js, PostgreSQL, and Minio S3

This is the code for the articles:

- [Building a Local Development Environment: Running a Next.js Full-Stack App with PostgreSQL and Minio S3 Using Docker](https://blog.alexefimenko.com/posts/nextjs-postgres-s3-locally)

- [Building a file storage with Next.js, PostgreSQL, and Minio S3](https://blog.alexefimenko.com/posts/file-storage-nextjs-postgres-s3)

To run the application, use the following command:

```bash copy
docker-compose -f compose/docker-compose.yml --env-file .env up
```

After you run the application, you can access it at `http://localhost:3000`.
The Minio S3 will be available at `http://localhost:9000`. You can use the access key `minio` and the secret key `miniosecret` to log in.

You will see something like this:

![File storage app](https://blog.alexefimenko.com/blog-assets/file-storage-nextjs-postgres-s3/app-screenshot.png)

The application is built with Next.js, PostgreSQL, and Minio S3. It allows you to upload, download, and delete files. The application is built with Docker, so you can run it locally without installing any dependencies.
