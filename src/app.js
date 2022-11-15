const express = require('express');
const dotenv = require('dotenv');
require('./db/mongoose');
const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

dotenv.config({ path: './.env' });
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

// routes
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`server is up on ${port}`);
})