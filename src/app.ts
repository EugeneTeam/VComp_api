import dotEnv from 'dotenv';
dotEnv.config();

import {server} from './server';

server.listen(process.env.PORT || 4000).then(() => {
    console.log('SERVER START')
})
