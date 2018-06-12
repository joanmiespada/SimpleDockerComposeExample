
### Example

If you want to start the app in containers, you should execute: `docker-compose up`

If you want to start the app locally once your Mongodb instance is running on 27017 port, the you should exec:
```
yarn 
yarn start:dev
```

The app has four parts:

|Parts        | Description         |
|------------|---------------------|
|storedb.js  | Create inserts to mongo database |
|calculate.js| read every document, transaction and store results to mongodb |
|render.js   | read final results of mongodb and print by stdout|
|index.js    | entrypoint |

You'll be able find Dockerfile and .yml in the root folder

### Tech stack

|Description |
|------------|
| Node       |
| Babel      |
| Docker     |
