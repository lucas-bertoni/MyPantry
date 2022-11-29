"use strict";
// All written by Lucas Bertoni
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helper = __importStar(require("./helper.js"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: '../../.env' });
const app = (0, express_1.default)();
const port = 4001;
// Put this in .env for real deployment
const TOKEN_KEY = 'thisIsATestTokenKey';
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000'],
    credentials: true,
    exposedHeaders: ['Set-Cookie']
}));
app.use(express_1.default.json());
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.cookie) {
        const token = req.headers.cookie.split('=')[1];
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, TOKEN_KEY);
            req.user = decoded;
            if (!(yield helper.userExists(req.user.email))) {
                return res.status(401).send("Invalid Token");
            }
        }
        catch (err) {
            return res.status(401).send("Invalid Token");
        }
    }
    else {
        return res.status(403).send("A token is required for authentication");
    }
    return next();
});
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send('All fields required');
        return;
    }
    const user = yield helper.userExists(email);
    if (user && (yield helper.matchPassword(password, user.password))) {
        const token = jsonwebtoken_1.default.sign({ userid: user.userid, email: user.email, role: user.role }, TOKEN_KEY, {
            expiresIn: '1hr',
        });
        yield helper.setToken(user.userid, token);
        const url = process.env.NODE_ENV === 'production' ?
            'http://eventbus:4002/events' :
            'http://localhost:4002/events';
        yield axios_1.default.post(url, { type: 'LoginSuccess', data: { userid: user.userid, email: user.email } })
            .catch((axiosError) => {
            console.log('\nThere was an error logging the event');
            console.log(axiosError);
        });
        res.setHeader('Access-Control-Expose-Headers', '*');
        res.setHeader('Set-Cookie', `token=${token}; HttpOnly`);
        res.status(200).json(user);
        return;
    }
    res.status(400).send('Invalid credentials');
}));
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).send('All fields required');
        return;
    }
    if (yield helper.userExists(email)) {
        res.status(401).send('User already exists');
        return;
    }
    const newUser = yield helper.createUser(email, password);
    const token = jsonwebtoken_1.default.sign({ userid: newUser.userid, email: newUser.email, role: newUser.role }, TOKEN_KEY, {
        expiresIn: '1hr',
    });
    yield helper.setToken(newUser.userid, token);
    const user = yield helper.getUserByID(newUser.userid);
    const url = process.env.NODE_ENV === 'production' ?
        'http://eventbus:4002/events' :
        'http://localhost:4002/events';
    yield axios_1.default.post(url, { type: 'RegisterSuccess', data: { userid: user.userid, email: user.email } })
        .catch((axiosError) => {
        console.log('There was an error logging the event');
        console.log(axiosError);
    });
    res.setHeader('Access-Control-Expose-Headers', '*');
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly`);
    res.status(201).json(user);
}));
app.post('/auth', verifyToken, (req, res) => {
    res.status(200).send(req.user);
});
app.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.cookie) === null || _a === void 0 ? void 0 : _a.split('=')[1];
    if (!token) {
        res.status(200).send('Already not logged in');
        return;
    }
    res.setHeader('Set-Cookie', 'token=expired; HttpOnly');
    res.status(200).send('Logged out');
}));
app.listen(port, () => {
    console.log(`Authentication listening on ${port}`);
});
