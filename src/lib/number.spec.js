"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ava_1 = __importDefault(require("ava"));
var number_1 = require("./number");
ava_1["default"]('double', function (t) {
    t.is(number_1.double(2), 4);
});
ava_1["default"]('power', function (t) {
    t.is(number_1.power(2, 4), 16);
});
