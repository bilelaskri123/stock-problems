const app = require("./src/app");
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
    console.log("Shutting down server...");
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    server.close(() => {
        process.exit(1);
    });
});

// Handle SIGTERM for graceful shutdown in production environments
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down server...");
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});

module.exports = server; // Export the server for testing purposes