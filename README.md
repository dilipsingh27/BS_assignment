# How to use

### The database used for this app is Postgres. Backend Framework is Nodejs with javascript
## Installations

**Step 1.** Clone the repository from Github:
```bash
git clone https://github.com/dilipsingh27/BS_assignment.git
```
**Step 2.** Naviagte to BS_assignment directory:
```bash
cd BS_assignment
```
**Step 3.** Install dependencies using npm:
```bash
npm install
```
**Step 4.** I've dockerized the app making sure all the dependencies are handled (such as database, migrations, etc.) and is runnable with one single command
```bash
docker compose up
```

:::caution
The exposed port for identifying endpoint is 
:::

:::caution
The endpoint to hit is, It's a **POST** route:
```bash
http://localhost:8080/identify
```
:::

:::caution
The request body is of this format: 
```bash
{
	"email": "lorraine@hillvalley.edu",
	"phoneNumber": "123456"
}
```
:::
