const { AppError } = require("../utils/AppError");

const notFoundHandler = (req, res, next) => {
    res.status(404).json({ success: false, error: "Not found" });
};

const errorHandler = (err, req, res, next) => {
    console.log(err);

    // Sequelize validation error
    if (err.name === "SequelizeValidationError") {
        const messages = err.errors.map((e) => e.message);
        return res.status(400).json({ success: false, error: messages });
    }

    // Sequelize unique constraint error
    if (err.name === "SequelizeUniqueConstraintError") {
        const messages = err.errors.map((e) => e.message);
        return res.status(409).json({ success: false, error: messages });
    }

    // Custom application error
    if (err instanceof AppError) {
        return res
            .status(err.statusCode)
            .json({ success: false, error: err.message });
    }

    // Generic server error
    res.status(500).json({ success: false, error: "Internal server error" });
};

module.exports = {
    notFoundHandler,
    errorHandler,
};