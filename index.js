import app from './src/app.js';
import { createServer } from './src/config/server.js';

const PORT = process.env.PORT || 3000;

const server = createServer(app);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
