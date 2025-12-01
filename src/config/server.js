export function createServer(app) {
    return {
        listen: (port, callback) => {
            app.listen(port, callback);
        }
    };
}
