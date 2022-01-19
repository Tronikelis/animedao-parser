"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bypassGogo = exports.between = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const between = (a, b, str) => {
    return str.slice(str.indexOf(a) + a.length, b ? str.indexOf(b) : str.length);
};
exports.between = between;
// credits to: https://github.com/MeemeeLab/node-anime-viewer
const bypassGogo = ($, id) => {
    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const f_random = (length) => {
        let i = length, str = "";
        while (i > 0x0) {
            i--, (str += getRandomInt(0, 9));
        }
        return str;
    };
    const value6 = $("script[data-name=\x27ts\x27]").data("value");
    const value5 = $("[name='crypto']").attr("content");
    const value1 = crypto_js_1.default.enc.Utf8.stringify(crypto_js_1.default.AES.decrypt($("script[data-name=\x27crypto\x27]").data("value"), crypto_js_1.default.enc.Utf8.parse(value6.toString() + value6.toString()), {
        iv: crypto_js_1.default.enc.Utf8.parse(value6),
    }));
    const value4 = crypto_js_1.default.AES.decrypt(value5, crypto_js_1.default.enc.Utf8.parse(value1), {
        iv: crypto_js_1.default.enc.Utf8.parse(value6),
    });
    const value3 = crypto_js_1.default.enc.Utf8.stringify(value4);
    const value2 = f_random(16);
    return ("id=" +
        crypto_js_1.default.AES.encrypt(id, crypto_js_1.default.enc.Utf8.parse(value1), {
            iv: crypto_js_1.default.enc.Utf8.parse(value2),
        }).toString() +
        "&time=" +
        "00" +
        value2 +
        "00" +
        value3.substring(value3.indexOf("&")));
};
exports.bypassGogo = bypassGogo;
