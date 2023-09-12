"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.API = exports.PrestoAPI = void 0;
var axios_1 = require("axios");
var PrestoStorage_1 = require("./PrestoStorage");
var PrestoAPI = /** @class */ (function () {
    function PrestoAPI(baseUrl) {
        this.baseUrl = baseUrl;
        this.token = null;
        this.email = null;
        this.password = null;
    }
    /// Returns true if the user is logged in, false otherwise
    PrestoAPI.prototype.isLoggedIn = function () {
        return PrestoStorage_1.PrestoStorage.getItem('user_email') !== null && PrestoStorage_1.PrestoStorage.getItem('user_password') !== null;
    };
    /// Logs in the user if they are not logged in already
    PrestoAPI.prototype.loginIfNeeded = function (forced) {
        return __awaiter(this, void 0, void 0, function () {
            var storedEmail, storedPassword, loginData, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.token || forced)) return [3 /*break*/, 6];
                        return [4 /*yield*/, PrestoStorage_1.PrestoStorage.getItem('user_email')];
                    case 1:
                        storedEmail = _a.sent();
                        return [4 /*yield*/, PrestoStorage_1.PrestoStorage.getItem('user_password')];
                    case 2:
                        storedPassword = _a.sent();
                        if (!(storedEmail && storedPassword)) return [3 /*break*/, 6];
                        this.email = storedEmail;
                        this.password = storedPassword;
                        loginData = { email: storedEmail, password: storedPassword };
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, axios_1["default"].post("".concat(this.baseUrl, "/login"), loginData)];
                    case 4:
                        response = _a.sent();
                        this.token = response.data.token;
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /// Registers a new user
    /// Arguments:
    /// username - string;
    // 	email - string;
    // 	password - string;
    PrestoAPI.prototype.register = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, axios_1["default"].post("".concat(this.baseUrl, "/register"), data)];
                    case 1:
                        _a.sent();
                        // Store the provided email and password
                        this.email = data.email;
                        this.password = data.password;
                        return [4 /*yield*/, this.login(this.email, this.password)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /// Logs in the user
    /// Arguments:
    /// email - string;
    /// password - string;
    PrestoAPI.prototype.login = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var loginData, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginData = { email: email, password: password };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1["default"].post("".concat(this.baseUrl, "/login"), loginData)];
                    case 2:
                        response = _a.sent();
                        this.token = response.data.token;
                        this.email = email;
                        this.password = password;
                        // PrestoStorage.setItem('user_email', email);
                        // PrestoStorage.setItem('user_password', password);
                        console.log("Writing data to PrestoStorage...");
                        return [2 /*return*/, true];
                    case 3:
                        error_3 = _a.sent();
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /// Returns the user's data
    /// Returns:
    /// User | null;
    /// Which contains:
    /// id - number;
    /// username - string;
    /// email - string;
    /// phone - string;
    PrestoAPI.prototype.getUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loginIfNeeded()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1["default"].get("".concat(this.baseUrl, "/user"), {
                                headers: { Authorization: "Bearer ".concat(this.token) }
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 4:
                        error_4 = _a.sent();
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /// Edits the user's email
    /// Arguments:
    /// data - EditEmailData;
    /// Which contains:
    /// email - string;
    /// password - string;
    PrestoAPI.prototype.editEmail = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loginIfNeeded()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, axios_1["default"].patch("".concat(this.baseUrl, "/user/editemail"), data, {
                                headers: { Authorization: "Bearer ".concat(this.token) }
                            })];
                    case 3:
                        _a.sent();
                        this.email = data.email;
                        return [4 /*yield*/, this.loginIfNeeded(true)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 5:
                        error_5 = _a.sent();
                        return [2 /*return*/, false];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /// Edits the user's phone number
    /// Arguments:
    /// data - EditPhoneData;
    /// Which contains:
    /// phone - string;
    /// password - string;
    PrestoAPI.prototype.editPhone = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loginIfNeeded()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1["default"].patch("".concat(this.baseUrl, "/user/editphone"), data, {
                                headers: { Authorization: "Bearer ".concat(this.token) }
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4:
                        error_6 = _a.sent();
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /// Creates an order
    /// Arguments:
    /// data - OrderData;
    /// Which contains:
    /// restaurantId - number;
    /// orderItems - OrderItem[];
    /// Which contains:
    /// dishId - number;
    /// notes - string;
    PrestoAPI.prototype.createOrder = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loginIfNeeded()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1["default"].post("".concat(this.baseUrl, "/order"), data, {
                                headers: { Authorization: "Bearer ".concat(this.token) }
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 4:
                        error_7 = _a.sent();
                        console.log(error_7);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /// Deletes the user's account
    /// Arguments:
    /// data - DeleteAccountData;
    /// Which contains:
    /// password - string;
    PrestoAPI.prototype.deleteAccount = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loginIfNeeded()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1["default"]["delete"]("".concat(this.baseUrl, "/user/deleteaccount"), {
                                data: data,
                                headers: { Authorization: "Bearer ".concat(this.token) }
                            })];
                    case 3:
                        _a.sent();
                        // Clear stored credentials on successful account deletion
                        this.token = null;
                        this.email = null;
                        this.password = null;
                        return [2 /*return*/, true];
                    case 4:
                        error_8 = _a.sent();
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /// Gets all restaurants
    /// Returns:
    /// Restaurant[];
    /// Which contains:
    /// id - number;
    /// title - string;
    /// shortdescription - string;
    /// description - string;
    /// address - string;
    /// rating - number;
    /// ratingquantity - number;
    /// images - string[];
    /// tags - string[];
    /// categories - Category[];
    PrestoAPI.prototype.getRestaurants = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1["default"].get("".concat(this.baseUrl, "/restaurants"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_9 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /// Gets a restaurant by ID
    /// Arguments:
    /// id - number;
    /// Returns:
    /// Restaurant | null;
    /// Which contains:
    /// id - number;
    /// title - string;
    /// shortdescription - string;
    /// description - string;
    /// address - string;
    /// rating - number;
    /// ratingquantity - number;
    /// images - string[];
    /// tags - string[];
    /// categories - Category[];
    PrestoAPI.prototype.getRestaurantById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1["default"].get("".concat(this.baseUrl, "/restaurant/id/").concat(id))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_10 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /// Gets a restaurant by title
    /// Arguments:
    /// title - string;
    /// Returns:
    /// Restaurant | null;
    /// Which contains:
    /// id - number;
    /// title - string;
    /// shortdescription - string;
    /// description - string;
    /// description - string;
    /// address - string;
    /// rating - number;
    /// ratingquantity - number;
    /// images - string[];
    /// tags - string[];
    /// categories - Category[];
    PrestoAPI.prototype.getRestaurantByTitle = function (title) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1["default"].get("".concat(this.baseUrl, "/restaurant/").concat(title))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_11 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /// Gets the top restaurants
    /// Arguments:
    /// quantity - number;
    /// Returns:
    /// Restaurant[];
    /// Which contains:
    /// id - number;
    /// title - string;
    /// shortdescription - string;
    /// description - string;
    /// address - string;
    /// rating - number;
    /// ratingquantity - number;
    /// images - string[];
    /// tags - string[];
    /// categories - Category[];
    PrestoAPI.prototype.getTopRestaurants = function (quantity) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1["default"].get("".concat(this.baseUrl, "/restaurants/quantity/").concat(quantity))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_12 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /// Gets restaurants by page and quantity
    /// Arguments:
    /// page - number;
    /// quantity - number;
    /// Returns:
    /// Restaurant[];
    /// Which contains:
    /// id - number;
    /// title - string;
    /// shortdescription - string;
    /// description - string;
    /// address - string;
    /// rating - number;
    /// ratingquantity - number;
    /// images - string[];
    /// tags - string[];
    /// categories - Category[];
    PrestoAPI.prototype.getRestaurantsByPageAndQuantity = function (page, quantity) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1["default"].get("".concat(this.baseUrl, "/restaurants/quantity/").concat(quantity, "/page/").concat(page))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_13 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /// Searches restaurants
    /// Arguments:
    /// query - string;
    /// Returns:
    /// Restaurant[];
    /// Which contains:
    /// id - number;
    /// title - string;
    /// shortdescription - string;
    /// description - string;
    /// address - string;
    /// rating - number;
    /// ratingquantity - number;
    /// images - string[];
    /// tags - string[];
    /// categories - Category[];
    PrestoAPI.prototype.searchRestaurants = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1["default"].get("".concat(this.baseUrl, "/search/").concat(query))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_14 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /// Gets restaurants by tag
    /// Arguments:
    /// tag - string;
    /// Returns:
    /// Restaurant[];
    /// Which contains:
    /// id - number;
    /// title - string;
    /// shortdescription - string;
    /// description - string;
    /// address - string;
    /// rating - number;
    /// ratingquantity - number;
    /// images - string[];
    /// tags - string[];
    /// categories - Category[];
    PrestoAPI.prototype.getRestaurantsByTag = function (tag) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1["default"].get("".concat(this.baseUrl, "/tag/").concat(tag))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_15 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /// Gets an image
    /// Arguments:
    /// name - string;
    /// Returns:
    /// string | null (base64 encoded image);
    PrestoAPI.prototype.getImage = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var response, base64Image, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1["default"].get("".concat(this.baseUrl, "/image/").concat(name), { responseType: 'arraybuffer' })];
                    case 1:
                        response = _a.sent();
                        base64Image = btoa(new Uint8Array(response.data).reduce(function (data, byte) { return data + String.fromCharCode(byte); }, ''));
                        console.log(base64Image);
                        return [2 /*return*/, "data:image/jpeg;base64,".concat(base64Image)];
                    case 2:
                        error_16 = _a.sent();
                        console.log(error_16);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return PrestoAPI;
}());
exports.PrestoAPI = PrestoAPI;
// Usage
exports.API = new PrestoAPI('https://api.prestoreserve.ge');
