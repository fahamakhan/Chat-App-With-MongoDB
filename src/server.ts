import * as dotenv from 'dotenv';
dotenv.config();
import app from './app';

const PORT = process.env.PORT || 3005;



import http from 'http'

const server = http.createServer(app);
app.io.attach(server);


server.listen(PORT, () => {
    console.log(`Server Listing Port ${PORT}`);
});
export const basePath = __dirname;