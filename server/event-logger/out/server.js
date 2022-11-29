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
const cors_1 = __importDefault(require("cors"));
const helper = __importStar(require("./helper.js"));
const dotenv = __importStar(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
dotenv.config({ path: '../../.env' });
const app = (0, express_1.default)();
const port = 4003;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.post('/logevent', (req, res) => {
    const event = req.body;
    const ignoredTypes = ['LoginAttempt', 'GetEventLogs', 'GetEventTypes', 'AuthenticateUser'];
    if (!ignoredTypes.includes(event.type)) {
        try {
            if (event.data.password) {
                delete event.data.password;
            }
            helper.logEvent(event);
        }
        catch (error) {
            console.log('\nThere was an error logging the event');
        }
    }
    res.send(null);
});
app.get('/getlogs', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send({ events: yield helper.getEventLogs() });
        return;
    }
    catch (error) {
        console.log('\nThere was an error getting the event logs');
    }
    res.send(null);
}));
app.get('/gettypes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send({ eventTypes: yield helper.getEventTypes() });
        return;
    }
    catch (error) {
        console.log('\nThere was an error getting the event types');
    }
    res.send(null);
}));
app.listen(port, () => {
    console.log(`Event logger listening on ${port}`);
});
