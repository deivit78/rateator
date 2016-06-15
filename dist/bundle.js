/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var main_1 = __webpack_require__(1);
	var settings = new main_1.Settings("settings.prop");


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/// <reference path="../typings/node.d.ts" />
	var fs = __webpack_require__(2);
	var PropertiesReader = __webpack_require__(3);
	var Settings = (function () {
	    function Settings(pathSettings) {
	        this.pathSettings = pathSettings;
	        var properties = PropertiesReader(pathSettings);
	        this.mongoServer = properties.get('mongo.server');
	        this.mongoPort = properties.get('mongo.port');
	        console.log("Mongo Connection: " + this.mongoServer + ":" + this.mongoPort);
	    }
	    return Settings;
	}());
	exports.Settings = Settings;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	(function() {

	    "use strict";

	    var fs = __webpack_require__(2);

	    /**
	     *
	     * @param {String} sourceFile
	     * @constructor
	     * @name {PropertiesReader}
	     */
	    function PropertiesReader(sourceFile) {
	        this._properties = {};
	        this._propertiesExpanded = {};
	        this.append(sourceFile);
	    }

	    /**
	     * @type {String} The name of a section that should be prefixed on an property as it is added
	     * @ignore
	     */
	    PropertiesReader.prototype._section = '';

	    /**
	     * Gets the number of properties that have been read into this PropertiesReader.
	     *
	     * @name PropertiesReader#length
	     * @type {Number}
	     */
	    Object.defineProperty(PropertiesReader.prototype, 'length', {
	        configurable: false,
	        enumerable: false,
	        get: function() {
	            return Object.keys(this._properties).length;
	        },
	        set: function() {
	            throw new Error("Cannot set length of PropertiesReader properties");
	        }
	    });

	    /**
	     * Append a file to the properties into the PropertiesReader
	     * @param {string} sourceFile
	     * @return {PropertiesReader} this instance
	     */
	    PropertiesReader.prototype.append = function (sourceFile) {
	        if (sourceFile) {
	            this.read(fs.readFileSync(sourceFile, 'utf-8'));
	        }
	        return this;
	    };

	    /**
	     * Reads any string input into the PropertiesReader
	     *
	     * @param {String} input
	     * @return {PropertiesReader} this instance
	     */
	    PropertiesReader.prototype.read = function(input) {
	        delete this._section;
	        ('' + input).split('\n').forEach(this._readLine, this);
	        return this;
	    };

	    /**
	     * Used as a processor for the array of input lines when reading from a source file
	     * @param {String} propertyString
	     */
	    PropertiesReader.prototype._readLine = function(propertyString) {
	        if (!!(propertyString = propertyString.trim())) {
	            var section = /^\[([^=]+)\]$/.exec(propertyString);
	            var property = !section && /^([^#=]+)(={0,1})(.*)$/.exec(propertyString);

	            if (section) {
	                this._section = section[1];
	            }
	            else if (property) {
	                section = this._section ? this._section + '.' : '';
	                this.set(section + property[1].trim(), property[3].trim());
	            }
	        }
	    };

	    /**
	     * Calls the supplied function for each property
	     *
	     * @param {Function} fn
	     * @param {Object} scope
	     * @return {PropertiesReader}
	     */
	    PropertiesReader.prototype.each = function(fn, scope) {
	        for (var key in this._properties) {
	            if (this._properties.hasOwnProperty(key)) {
	                fn.call(scope || this, key, this._properties[key]);
	            }
	        }
	        return this;
	    };

	    /**
	     * Given the supplied raw value, returns the parsed value
	     */
	    PropertiesReader.prototype._parsed = function(value) {
	        var parsedValue = value;
	        if (value !== null && !isNaN(value)) {
	            parsedValue = +value;
	        }
	        else if (value === 'true' || value === 'false') {
	            parsedValue = (value === 'true');
	        }
	        else if (typeof value === "string") {
	            var replacements = {'\\n': '\n', '\\r': '\r', '\\t': '\t'};
	            parsedValue = value.replace(/\\[nrt]/g, function (key) {
	                return replacements[key];
	            });
	        }

	        return parsedValue;
	    };

	    /**
	     * Gets a single property value based on the full string key. When the property is not found in the
	     * PropertiesReader, the return value will be null.
	     *
	     * @param {String} key
	     * @return {*}
	     */
	    PropertiesReader.prototype.get = function(key) {
	        return this._parsed(this.getRaw(key));
	    };

	    /**
	     * Gets the string representation as it was read from the properties file without coercions for type recognition.
	     *
	     * @param {string} key
	     * @returns {string}
	     */
	    PropertiesReader.prototype.getRaw = function(key) {
	        return this._properties.hasOwnProperty(key) ? this._properties[key] : null;
	    };

	    /**
	     * Sets the supplied key in the properties store with the supplied value, the value can be any string representation
	     * that would be valid in a properties file (eg: true and false or numbers are converted to their real values).
	     *
	     * @param {String} key
	     * @param {String} value
	     * @return {PropertiesReader}
	     */
	    PropertiesReader.prototype.set = function(key, value) {
	        var parsedValue = ('' + value).trim();

	        this._properties[key] = parsedValue;

	        var expanded = key.split('.');
	        var source = this._propertiesExpanded;
	        while (expanded.length > 1) {
	            var step = expanded.shift();
	            if (expanded.length >= 1 && typeof source[step] === 'string') {
	                source[step] = {'':source[step]};
	            }
	            source = (source[step] = source[step] || {});
	        }
	        if (typeof parsedValue === 'string' && typeof  source[expanded[0]] === 'object') {
	            source[expanded[0]][''] = parsedValue;
	        }
	        else {
	            source[expanded[0]] = parsedValue;
	        }

	        return this;
	    };

	    /**
	     * Gets the object that represents the exploded properties.
	     *
	     * Note that this object is currently mutable without the option to persist or interrogate changes.
	     *
	     * @return {*}
	     */
	    PropertiesReader.prototype.path = function() {
	        return this._propertiesExpanded;
	    };

	    /**
	     * Gets the object that represents all properties.
	     *
	     * @returns {Object}
	     */
	    PropertiesReader.prototype.getAllProperties = function() {
	        var properties = {};
	        this.each(function (key, value) {
	            properties[key] = value;
	        });
	        return properties;
	    };

	    /**
	     * Creates and returns a new PropertiesReader based on the values in this instance.
	     * @return {PropertiesReader}
	     */
	    PropertiesReader.prototype.clone = function() {
	        var propertiesReader = new PropertiesReader(null);
	        this.each(propertiesReader.set, propertiesReader);

	        return propertiesReader;
	    };

	    /**
	     * Return a json from a root properties
	     * @param root
	     * @returns {{}}
	     */
	    PropertiesReader.prototype.getByRoot = function(root){
	        var keys = Object.keys(this._properties);
	        var outObj = {};

	        for (var i = 0, prefixLength = String(root).length; i < keys.length; i++) {
	            var key = keys[i];

	            if (key.indexOf(root) === 0 && key.charAt(prefixLength) === '.') {
	                outObj[key.substr(prefixLength + 1)] = this.get(key);
	            }
	        }

	        return outObj;
	    };

	    /**
	     * Binds the current properties object and all values in it to the supplied express app.
	     *
	     * @param {Object} app The express app (or any object that has a `set` function)
	     * @param {String} [basePath] The absolute prefix to use for all path properties - defaults to the cwd.
	     * @param {Boolean} [makePaths=false] When true will attempt to create the directory structure to any path property
	     */
	    PropertiesReader.prototype.bindToExpress = function(app, basePath, makePaths) {
	        var Path = __webpack_require__(4);

	        if (!/\/$/.test(basePath = basePath || process.cwd())) {
	            basePath += '/';
	        }

	        this.each(function (key, value) {
	            if (value && /\.(path|dir)$/.test(key)) {
	                value = Path.join(basePath, Path.relative(basePath, value));
	                this.set(key, value);

	                try {
	                    var directoryPath = /dir$/.test(key) ? value : Path.dirname(value);
	                    if (makePaths) {
	                        __webpack_require__(5).sync(directoryPath);
	                    }
	                    else if (!__webpack_require__(2).statSync(directoryPath).isDirectory()) {
	                        throw new Error("Path is not a directory that already exists");
	                    }
	                }
	                catch (e) {
	                    throw new Error("Unable to create directory " + value);
	                }
	            }

	            app.set(key, this.get(key));

	            if(/^browser\./.test(key)) {
	                app.locals[key.substr(8)] = this.get(key);
	            }
	        }, this);

	        app.set('properties', this);

	        return this;
	    };

	    PropertiesReader.builder = function(sourceFile) {
	        return new PropertiesReader(sourceFile);
	    };

	    module.exports = PropertiesReader.builder;
	}());


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var path = __webpack_require__(4);
	var fs = __webpack_require__(2);

	module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

	function mkdirP (p, mode, f, made) {
	    if (typeof mode === 'function' || mode === undefined) {
	        f = mode;
	        mode = 0777 & (~process.umask());
	    }
	    if (!made) made = null;

	    var cb = f || function () {};
	    if (typeof mode === 'string') mode = parseInt(mode, 8);
	    p = path.resolve(p);

	    fs.mkdir(p, mode, function (er) {
	        if (!er) {
	            made = made || p;
	            return cb(null, made);
	        }
	        switch (er.code) {
	            case 'ENOENT':
	                mkdirP(path.dirname(p), mode, function (er, made) {
	                    if (er) cb(er, made);
	                    else mkdirP(p, mode, cb, made);
	                });
	                break;

	            // In the case of any other error, just see if there's a dir
	            // there already.  If so, then hooray!  If not, then something
	            // is borked.
	            default:
	                fs.stat(p, function (er2, stat) {
	                    // if the stat fails, then that's super weird.
	                    // let the original error be the failure reason.
	                    if (er2 || !stat.isDirectory()) cb(er, made)
	                    else cb(null, made);
	                });
	                break;
	        }
	    });
	}

	mkdirP.sync = function sync (p, mode, made) {
	    if (mode === undefined) {
	        mode = 0777 & (~process.umask());
	    }
	    if (!made) made = null;

	    if (typeof mode === 'string') mode = parseInt(mode, 8);
	    p = path.resolve(p);

	    try {
	        fs.mkdirSync(p, mode);
	        made = made || p;
	    }
	    catch (err0) {
	        switch (err0.code) {
	            case 'ENOENT' :
	                made = sync(path.dirname(p), mode, made);
	                sync(p, mode, made);
	                break;

	            // In the case of any other error, just see if there's a dir
	            // there already.  If so, then hooray!  If not, then something
	            // is borked.
	            default:
	                var stat;
	                try {
	                    stat = fs.statSync(p);
	                }
	                catch (err1) {
	                    throw err0;
	                }
	                if (!stat.isDirectory()) throw err0;
	                break;
	        }
	    }

	    return made;
	};


/***/ }
/******/ ]);