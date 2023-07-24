# How to use

### The database used for this app is Postgres. Backend Framework is Nodejs with javascript

1. I've dockerized the app making sure all the dependencies are handled (such as database, migrations, etc.) and is runnable with one single command
```bash
docker compose up
```

2. The exposed port for identifying endpoint is 
```bash
8080
```

3. Here's an example `.env` file:
```bash
DB_USER="postgres"
DB_PASSWORD=null
DB_NAME="dilipsingh"
DB_HOST="127.0.0.1"
DB_PORT="5432"
PORT=8080
```

4. The endpoint to hit is, It's a **POST** route:
```bash
http://localhost:8080/identify
```
5. The request body is of this format: 
```bash
{
	"email": "lorraine@hillvalley.edu",
	"phoneNumber": "123456"
}
```
