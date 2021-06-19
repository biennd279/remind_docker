# remind_docker

## Brief
## Requirement
## Install 
1. Create ```.env``` file follow ```.env.example```
2. Run ```docker-compose up -d``` to run all container.
3. (Optional) Generate database ```docker-compose exec node npm run migrate:up```
4. (Optional) Generate sample data ```docker-compose exec node npm run seed:run```
5. Request to localhost:3000 to test server.
