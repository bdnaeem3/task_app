const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.ENVIRONMENT === 'local' ? process.env.LOCAL_DATABASE : process.env.PROD_DATABASE, {
    useNewUrlParser: true,
})