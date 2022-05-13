"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./utils/db");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const article_route_1 = __importDefault(require("./routes/article.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, express_fileupload_1.default)());
(0, db_1.connectDatabase)();
app.get("/", (req, res) => {
    res.json({ message: "Hai" });
});
app.use("/", auth_route_1.default);
app.use("/articles", article_route_1.default);
app.use("/users", user_route_1.default);
app.use(error_middleware_1.default);
app.listen(config_1.PORT || 3000, () => {
    console.log(`Server started on port ${config_1.PORT || 3000}`);
});
