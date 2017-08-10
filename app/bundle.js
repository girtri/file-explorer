/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function (args, opts) {
    if (!opts) opts = {};
    
    var flags = { bools : {}, strings : {}, unknownFn: null };

    if (typeof opts['unknown'] === 'function') {
        flags.unknownFn = opts['unknown'];
    }

    if (typeof opts['boolean'] === 'boolean' && opts['boolean']) {
      flags.allBools = true;
    } else {
      [].concat(opts['boolean']).filter(Boolean).forEach(function (key) {
          flags.bools[key] = true;
      });
    }
    
    var aliases = {};
    Object.keys(opts.alias || {}).forEach(function (key) {
        aliases[key] = [].concat(opts.alias[key]);
        aliases[key].forEach(function (x) {
            aliases[x] = [key].concat(aliases[key].filter(function (y) {
                return x !== y;
            }));
        });
    });

    [].concat(opts.string).filter(Boolean).forEach(function (key) {
        flags.strings[key] = true;
        if (aliases[key]) {
            flags.strings[aliases[key]] = true;
        }
     });

    var defaults = opts['default'] || {};
    
    var argv = { _ : [] };
    Object.keys(flags.bools).forEach(function (key) {
        setArg(key, defaults[key] === undefined ? false : defaults[key]);
    });
    
    var notFlags = [];

    if (args.indexOf('--') !== -1) {
        notFlags = args.slice(args.indexOf('--')+1);
        args = args.slice(0, args.indexOf('--'));
    }

    function argDefined(key, arg) {
        return (flags.allBools && /^--[^=]+$/.test(arg)) ||
            flags.strings[key] || flags.bools[key] || aliases[key];
    }

    function setArg (key, val, arg) {
        if (arg && flags.unknownFn && !argDefined(key, arg)) {
            if (flags.unknownFn(arg) === false) return;
        }

        var value = !flags.strings[key] && isNumber(val)
            ? Number(val) : val
        ;
        setKey(argv, key.split('.'), value);
        
        (aliases[key] || []).forEach(function (x) {
            setKey(argv, x.split('.'), value);
        });
    }

    function setKey (obj, keys, value) {
        var o = obj;
        keys.slice(0,-1).forEach(function (key) {
            if (o[key] === undefined) o[key] = {};
            o = o[key];
        });

        var key = keys[keys.length - 1];
        if (o[key] === undefined || flags.bools[key] || typeof o[key] === 'boolean') {
            o[key] = value;
        }
        else if (Array.isArray(o[key])) {
            o[key].push(value);
        }
        else {
            o[key] = [ o[key], value ];
        }
    }
    
    function aliasIsBoolean(key) {
      return aliases[key].some(function (x) {
          return flags.bools[x];
      });
    }

    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        
        if (/^--.+=/.test(arg)) {
            // Using [\s\S] instead of . because js doesn't support the
            // 'dotall' regex modifier. See:
            // http://stackoverflow.com/a/1068308/13216
            var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
            var key = m[1];
            var value = m[2];
            if (flags.bools[key]) {
                value = value !== 'false';
            }
            setArg(key, value, arg);
        }
        else if (/^--no-.+/.test(arg)) {
            var key = arg.match(/^--no-(.+)/)[1];
            setArg(key, false, arg);
        }
        else if (/^--.+/.test(arg)) {
            var key = arg.match(/^--(.+)/)[1];
            var next = args[i + 1];
            if (next !== undefined && !/^-/.test(next)
            && !flags.bools[key]
            && !flags.allBools
            && (aliases[key] ? !aliasIsBoolean(key) : true)) {
                setArg(key, next, arg);
                i++;
            }
            else if (/^(true|false)$/.test(next)) {
                setArg(key, next === 'true', arg);
                i++;
            }
            else {
                setArg(key, flags.strings[key] ? '' : true, arg);
            }
        }
        else if (/^-[^-]+/.test(arg)) {
            var letters = arg.slice(1,-1).split('');
            
            var broken = false;
            for (var j = 0; j < letters.length; j++) {
                var next = arg.slice(j+2);
                
                if (next === '-') {
                    setArg(letters[j], next, arg)
                    continue;
                }
                
                if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
                    setArg(letters[j], next.split('=')[1], arg);
                    broken = true;
                    break;
                }
                
                if (/[A-Za-z]/.test(letters[j])
                && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                    setArg(letters[j], next, arg);
                    broken = true;
                    break;
                }
                
                if (letters[j+1] && letters[j+1].match(/\W/)) {
                    setArg(letters[j], arg.slice(j+2), arg);
                    broken = true;
                    break;
                }
                else {
                    setArg(letters[j], flags.strings[letters[j]] ? '' : true, arg);
                }
            }
            
            var key = arg.slice(-1)[0];
            if (!broken && key !== '-') {
                if (args[i+1] && !/^(-|--)[^-]/.test(args[i+1])
                && !flags.bools[key]
                && (aliases[key] ? !aliasIsBoolean(key) : true)) {
                    setArg(key, args[i+1], arg);
                    i++;
                }
                else if (args[i+1] && /true|false/.test(args[i+1])) {
                    setArg(key, args[i+1] === 'true', arg);
                    i++;
                }
                else {
                    setArg(key, flags.strings[key] ? '' : true, arg);
                }
            }
        }
        else {
            if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
                argv._.push(
                    flags.strings['_'] || !isNumber(arg) ? arg : Number(arg)
                );
            }
            if (opts.stopEarly) {
                argv._.push.apply(argv._, args.slice(i + 1));
                break;
            }
        }
    }
    
    Object.keys(defaults).forEach(function (key) {
        if (!hasKey(argv, key.split('.'))) {
            setKey(argv, key.split('.'), defaults[key]);
            
            (aliases[key] || []).forEach(function (x) {
                setKey(argv, x.split('.'), defaults[key]);
            });
        }
    });
    
    if (opts['--']) {
        argv['--'] = new Array();
        notFlags.forEach(function(key) {
            argv['--'].push(key);
        });
    }
    else {
        notFlags.forEach(function(key) {
            argv._.push(key);
        });
    }

    return argv;
};

function hasKey (obj, keys) {
    var o = obj;
    keys.slice(0,-1).forEach(function (key) {
        o = (o[key] || {});
    });

    var key = keys[keys.length - 1];
    return key in o;
}

function isNumber (x) {
    if (typeof x === 'number') return true;
    if (/^0x[0-9a-f]+$/i.test(x)) return true;
    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
}



/***/ }),
/* 4 */
/***/ (function(module, exports) {


exports.dictionary = {
	"en-US": {
		NAME: "Name",
		SIZE: "Size",
		MODIFIED: "Modified",
		MINIMIZE_WIN: "Minimize window",
		RESTORE_WIN: "Restore window",
		MAXIMIZE_WIN: "Maximize window",
		CLOSE_WIN: "Close window"
	},
	"de-DE": {
		NAME: "Dateiname",
		SIZE: "Grösse",
		MODIFIED: "Geändert am",
		MINIMIZE_WIN: "Fenster minimieren",
		RESTORE_WIN: "Fenster wiederherstellen",
		MAXIMIZE_WIN: "Fenster maximieren",
		CLOSE_WIN: "Fenster schliessen"
	}
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {


const fs = __webpack_require__( 1 ),
      { join, parse } = __webpack_require__( 2 ),
      EventEmitter = __webpack_require__( 0 );

class DirService extends EventEmitter
{
	constructor( dir = null ) {
		super();
		this.dir = dir || process.cwd();
	}

	setDir(dir = "") {
		let newDir = join(this.dir, dir);
		// Early exit
		if ( DirService.getStats( newDir ) === false ) {
			return;
		}
		this.dir = newDir;
		this.notify();
	}

	notify() {
		this.emit( "update" );
	}

	static readDir( dir ) {
		const fInfoArr = fs.readdirSync(dir, "utf-8").map(( fileName ) => {
			const filePath = join(dir, fileName), stats = DirService.getStats(filePath);
			if ( stats === false ) {
				return false;
			}
			return {fileName, stats};
		});
		return fInfoArr.filter( item => item !== false );
	}

	getDirList() {
		const collection = DirService.readDir( this.dir ).filter(( fInfo ) => fInfo.stats.isDirectory() );
		if ( !this.isRoot() ) {
			collection.unshift({ fileName: ".." });
		}
		return collection;
	}

	getFileList() {
		return DirService.readDir( this.dir ).filter(( fInfo ) => fInfo.stats.isFile() );
	}

	isRoot() {
		const { root } = parse( this.dir );
		return ( root === this.dir );
	}

	static getStats( filePath ) {
		try {
			return fs.statSync( filePath );
		} catch( e ) {
			return false;
		}
	}

	getDir() {
    	return this.dir;
  	}

	getFile(file) {
    	return join( this.dir, file );
	}
};

exports.DirService = DirService;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const fs = __webpack_require__(1), path = __webpack_require__(2);

// Copy file helper
const cp = (from, toDir, done ) => {
	const basename = path.basename(from),
		to = path.join(toDir, basename),
		write = fs.createWriteStream(to);
	fs.createReadStream(from).pipe(write);
	write.on("finish", done);
};

class FileService 
{
	constructor(dirService) {
		this.dir = dirService;
		this.copiedFile = null;
	}

	remove(file) {
		fs.unlinkSync(this.dir.getFile( file ));
		this.dir.notify();
	}

	paste() {
		const file = this.copiedFile;
		if (fs.lstatSync(file).isFile()) {
			cp(file, this.dir.getDir(), () => this.dir.notify());
		}
	}

	copyImage( file, type ){
	    const clip = nw.Clipboard.get(),
	          // load file content as BASE64
	          data = fs.readFileSync( file ).toString( "base64" ),
	          // image as HTML
	          html = `<img src="file:///${encodeURI( data.replace( /^\//, "" ) )}">`;

	    // write both options (raw image and HTML) to the clipboard
	    clip.set([
	      { type, data: data, raw: true },
	      { type: "html", data: html }
	    ]);
	}

	copy(file) {
		this.copiedFile = this.dir.getFile(file);
		const ext = path.parse(this.copiedFile).ext.substr(1);
		switch (ext) {
			case "jpg":
			case "jpeg":
				return this.copyImage(this.copiedFile, "jpeg");
			case "png":
				return this.copyImage(this.copiedFile, "png");
		}
	}

	open(file) {
		nw.Shell.openItem(this.dir.getFile( file ));
	}

	showInFolder(file) {
		nw.Shell.showItemInFolder(this.dir.getFile( file ));
	}

	hasImageInClipboard() {
		const clip = nw.Clipboard.get();
		return clip.readAvailableTypes().indexOf("png") !== -1;
	}

	pasteFromClipboard() {
		const clip = nw.Clipboard.get();

		if ( this.hasImageInClipboard() ) {
			const base64 = clip.get("png", true),
			binary = Buffer.from(base64, "base64"),
			filename = Date.now() + "--img.png";
			fs.writeFileSync(this.dir.getFile(filename), binary);
			this.dir.notify();
		}
	}
};

exports.FileService = FileService;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {


const EventEmitter = __webpack_require__( 0 );

class I18nService extends EventEmitter 
{
	constructor(dictionary) {
		super();
		this.dictionary = dictionary;
		this._locale = "en-US";
	}

	get locale() {
		return this._locale;
	}

	set locale(locale) {
		// validate locale..
		this._locale = locale;
	}

	notify() {
		this.emit("update");
	}

	translate(token, defaultValue) {
		const dictionary = this.dictionary[this._locale];
		return dictionary[token] || defaultValue;
	}
}

exports.I18nService = I18nService;


/***/ }),
/* 8 */
/***/ (function(module, exports) {


class ContextMenuView 
{
	constructor( fileService, i18nService ) {
		this.file = fileService;
		this.i18n = i18nService;
		this.attach();
	}

	getItems( fileName ) {
		const file = this.file,
			isCopied = Boolean( file.copiedFile );
		return [
			{
				label: this.i18n.translate( "SHOW_FILE_IN_FOLDER", "Show Item in the Folder" ),
				enabled: Boolean( fileName ),
				click: () => file.showInFolder( fileName )
			},
			{
				type: "separator"
			},
			{
				label: this.i18n.translate( "COPY", "Copy" ),
				enabled: Boolean( fileName ),
				click: () => file.copy( fileName )
			},
			{
				label:
				this.i18n.translate( "PASTE", "Paste" ),
				enabled: isCopied,
				click: () => file.paste()
			},
			{
				label: this.i18n.translate( "PASTE_FROM_CLIPBOARD", "Paste image from clipboard"),
				enabled: file.hasImageInClipboard(),
				click: () => file.pasteFromClipboard()
			},
			{
				type: "separator"
			},
			{
				label: this.i18n.translate( "DELETE", "Delete" ),
				enabled: Boolean( fileName ),
				click: () => file.remove( fileName )
			}
		];
	}

	render( fileName ) {
		const menu = new nw.Menu();
		this.getItems( fileName ).forEach(( item ) => menu.append( new nw.MenuItem( item )));
		return menu;
	}

	attach() {
		document.addEventListener("contextmenu", ( e ) => {
			const el = e.target;
			if ( !( el instanceof HTMLElement ) ) {
				return;
			}
			if ( el.classList.contains( "file-list" ) ) {
				e.preventDefault();
				this.render().popup( e.x, e.y );
			}
			// If a child of an element matching [data-file]
			if (el.parentNode.dataset.file ) {
				e.preventDefault();
				this.render( el.parentNode.dataset.file ).popup( e.x, e.y );
			}
		});
	}
}

exports.ContextMenuView = ContextMenuView;


/***/ }),
/* 9 */
/***/ (function(module, exports) {


class DirListView 
{
	constructor( boundingEl, dirService ) {
		this.el = boundingEl;
		this.dir = dirService;
		// Subscribe on DirService updates
		dirService.on("update", () => this.update( dirService.getDirList() ));
	}

	onOpenDir(e) {
		e.preventDefault();
		this.dir.setDir( e.target.dataset.file );
	}

	update( collection ) {
	    this.el.innerHTML = "";
	    collection.forEach(( fInfo ) => {
	      this.el.insertAdjacentHTML( "beforeend",
	        `<li class="dir-list__li" data-file="${fInfo.fileName}">
	         <i class="icon">folder</i> ${fInfo.fileName}</li>` );
	    });
	    this.bindUi();
	}

	/*
	update(collection) {
		this.el.innerHTML = "";
		collection.forEach(( fInfo ) => {
			this.el.insertAdjacentHTML( "beforeend",
			'<li class="dir-list__li" data-file="${fInfo.fileName}"><i class="icon">folder</i> ${fInfo.fileName}</li>');
		});
		this.bindUi();
	}*/

	bindUi() {
		const liArr = Array.from( this.el.querySelectorAll( "li[data-file]" ));
		liArr.forEach(( el ) => {
			el.addEventListener( "click", e => this.onOpenDir(e), false );
		});
	}
}

exports.DirListView = DirListView;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {


const filesize = __webpack_require__( 15 );

class FileListView 
{
  constructor( boundingEl, dirService, i18nService, fileService ) {
    this.dir = dirService;
    this.el = boundingEl;
    this.i18n = i18nService;
    this.file = fileService;
    // Subscribe on DirService updates
    dirService.on("update", () => this.update( dirService.getFileList() ) );
    // Subscribe on i18nService updates
    i18nService.on("update", () => this.update( dirService.getFileList() ));
  }

  static formatTime( timeString, locale ) {
    const date = new Date(Date.parse(timeString));
    const options = {year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false};
    return date.toLocaleString(locale, options);
  }

  update( collection ) {
    this.el.innerHTML = `<li class="file-list__li file-list__head">
        <span class="file-list__li__name">${this.i18n.translate( "NAME", "Name")}</span>
        <span class="file-list__li__size">${this.i18n.translate( "SIZE", "Size")}</span>
        <span class="file-list__li__time">${this.i18n.translate( "MODIFIED", "Modified")}</span>
      </li>`;
    collection.forEach(( fInfo ) => {
      this.el.insertAdjacentHTML( "beforeend", `<li class="file-list__li" data-file="${fInfo.fileName}">
        <span class="file-list__li__name">${fInfo.fileName}</span>
        <span class="file-list__li__size">${filesize(fInfo.stats.size)}</span>
        <span class="file-list__li__time">${FileListView.formatTime(fInfo.stats.mtime, this.i18n.locale)}</span>
      </li>` );
    });
    this.bindUi();
  }

  bindUi(){
    Array.from( this.el.querySelectorAll( ".file-list__li" ) ).forEach(( el ) => {
      el.addEventListener( "click", ( e ) => {
        e.preventDefault();
        this.file.open( el.dataset.file );
      }, false );
    });
  }
}

exports.FileListView = FileListView;


/***/ }),
/* 11 */
/***/ (function(module, exports) {


class LangSelectorView 
{
	constructor(boundingEl, i18n) {
		boundingEl.addEventListener("change", this.onChanged.bind(this), false);
		this.i18n = i18n;
	}

	onChanged(e) {
		const selectEl = e.target;
		this.i18n.locale = selectEl.value;
		this.i18n.notify();
	}
}

exports.LangSelectorView = LangSelectorView;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

const appWindow = nw.Window.get();

class TitleBarActionsView {
  constructor( boundingEl, i18nService ){
    this.i18n = i18nService;
    this.unmaximizeEl = boundingEl.querySelector( "[data-bind=unmaximize]" );
    this.maximizeEl = boundingEl.querySelector( "[data-bind=maximize]" );
    this.minimizeEl = boundingEl.querySelector( "[data-bind=minimize]" );
    this.closeEl = boundingEl.querySelector( "[data-bind=close]" );
    this.bindUi();
    // Subscribe on i18nService updates
    i18nService.on( "update", () => this.translate() );

    // subscribe to window events
    appWindow.on("maximize", () => this.toggleButtons( false ) );
    appWindow.on("minimize", () => this.toggleButtons( false ) );
    appWindow.on("restore", () => this.toggleButtons( true ) );
  }

  translate() {
    this.unmaximizeEl.title = this.i18n.translate( "RESTORE_WIN", "Restore window" );
    this.maximizeEl.title = this.i18n.translate( "MAXIMIZE_WIN", "Maximize window" );
    this.minimizeEl.title = this.i18n.translate( "MINIMIZE_WIN", "Minimize window" );
    this.closeEl.title = this.i18n.translate( "CLOSE_WIN", "Close window" );
  }

  bindUi() {
    this.closeEl.addEventListener( "click", this.onClose.bind( this ), false );
    this.minimizeEl.addEventListener( "click", this.onMinimize.bind( this ), false );
    this.maximizeEl.addEventListener( "click", this.onMaximize.bind( this ), false );
    this.unmaximizeEl.addEventListener( "click", this.onRestore.bind( this ), false );
  }

  toggleButtons( reset ) {
    this.maximizeEl.classList.toggle( "is-hidden", !reset );
    this.unmaximizeEl.classList.toggle( "is-hidden", reset );
    this.minimizeEl.classList.toggle( "is-hidden", !reset );
  }

  onRestore( e ) {
    e.preventDefault();
    appWindow.restore();
  }

  onMaximize( e ) {
    e.preventDefault();
    appWindow.maximize();
  }

  onMinimize( e ) {
    e.preventDefault();
    appWindow.minimize();
  }

  onClose( e ) {
    e.preventDefault();
    appWindow.close();
  }
}

exports.TitleBarActionsView = TitleBarActionsView;


/***/ }),
/* 13 */
/***/ (function(module, exports) {


class TitleBarPathView 
{
  constructor( boundingEl, dirService ) {
    this.el = boundingEl;
    dirService.on( "update", () => this.render( dirService.getDir() ) );
  }

  render( dir ) {
    this.el.innerHTML = dir;
  }
}

exports.TitleBarPathView = TitleBarPathView;


/***/ }),
/* 14 */
/***/ (function(module, exports) {


const appWindow = nw.Window.get();

class TrayView 
{
	constructor(title) {
		this.tray = null;
		this.title = title;
		// subscribe to window events
		appWindow.on("maximize", () => this.render( false ));
		appWindow.on("minimize", () => this.render( false ));
		appWindow.on("restore", () => this.render( true ));

		this.removeOnExit();
		this.render(true);
	}

	getItems(reset){
		return [
			{
				label: "Minimize",
				enabled: reset,
				click: () => appWindow.minimize()
			},
			{
				label: "Maximize",
				enabled: reset,
				click: () => appWindow.maximize()
			},
			{
				label: "Restore",
				enabled: !reset,
				click: () => appWindow.restore()
			},
			{
				type: "separator"
			},
			{
				label: "Exit",
				click: () => appWindow.close()
			}
		];
	}

	render(reset) {
		if ( this.tray ) {
			this.tray.remove();
		}

		const icon = (process.platform === "linux" ? "icon-48x48.png" : "icon-32x32.png" );

		this.tray = new nw.Tray({
			title: this.title,
			icon: icon,
			iconsAreTemplates: false
		});

		const menu = new nw.Menu();
		this.getItems(reset).forEach(( item ) => menu.append( new nw.MenuItem(item )));
		this.tray.menu = menu;
	}

	removeOnExit() {
		appWindow.on("close", () => {
			this.tray.remove();
			appWindow.hide(); // Pretend to be closed already
			appWindow.close( true );
		});
	}
}

exports.TrayView = TrayView;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * filesize
 *
 * @copyright 2017 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 3.5.10
 */
(function (global) {
	var b = /^(b|B)$/,
	    symbol = {
		iec: {
			bits: ["b", "Kib", "Mib", "Gib", "Tib", "Pib", "Eib", "Zib", "Yib"],
			bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
		},
		jedec: {
			bits: ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"],
			bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
		}
	},
	    fullform = {
		iec: ["", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi"],
		jedec: ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"]
	};

	/**
  * filesize
  *
  * @method filesize
  * @param  {Mixed}   arg        String, Int or Float to transform
  * @param  {Object}  descriptor [Optional] Flags
  * @return {String}             Readable file size String
  */
	function filesize(arg) {
		var descriptor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		var result = [],
		    val = 0,
		    e = void 0,
		    base = void 0,
		    bits = void 0,
		    ceil = void 0,
		    full = void 0,
		    fullforms = void 0,
		    neg = void 0,
		    num = void 0,
		    output = void 0,
		    round = void 0,
		    unix = void 0,
		    spacer = void 0,
		    standard = void 0,
		    symbols = void 0;

		if (isNaN(arg)) {
			throw new Error("Invalid arguments");
		}

		bits = descriptor.bits === true;
		unix = descriptor.unix === true;
		base = descriptor.base || 2;
		round = descriptor.round !== undefined ? descriptor.round : unix ? 1 : 2;
		spacer = descriptor.spacer !== undefined ? descriptor.spacer : unix ? "" : " ";
		symbols = descriptor.symbols || descriptor.suffixes || {};
		standard = base === 2 ? descriptor.standard || "jedec" : "jedec";
		output = descriptor.output || "string";
		full = descriptor.fullform === true;
		fullforms = descriptor.fullforms instanceof Array ? descriptor.fullforms : [];
		e = descriptor.exponent !== undefined ? descriptor.exponent : -1;
		num = Number(arg);
		neg = num < 0;
		ceil = base > 2 ? 1000 : 1024;

		// Flipping a negative number to determine the size
		if (neg) {
			num = -num;
		}

		// Determining the exponent
		if (e === -1 || isNaN(e)) {
			e = Math.floor(Math.log(num) / Math.log(ceil));

			if (e < 0) {
				e = 0;
			}
		}

		// Exceeding supported length, time to reduce & multiply
		if (e > 8) {
			e = 8;
		}

		// Zero is now a special case because bytes divide by 1
		if (num === 0) {
			result[0] = 0;
			result[1] = unix ? "" : symbol[standard][bits ? "bits" : "bytes"][e];
		} else {
			val = num / (base === 2 ? Math.pow(2, e * 10) : Math.pow(1000, e));

			if (bits) {
				val = val * 8;

				if (val >= ceil && e < 8) {
					val = val / ceil;
					e++;
				}
			}

			result[0] = Number(val.toFixed(e > 0 ? round : 0));
			result[1] = base === 10 && e === 1 ? bits ? "kb" : "kB" : symbol[standard][bits ? "bits" : "bytes"][e];

			if (unix) {
				result[1] = standard === "jedec" ? result[1].charAt(0) : e > 0 ? result[1].replace(/B$/, "") : result[1];

				if (b.test(result[1])) {
					result[0] = Math.floor(result[0]);
					result[1] = "";
				}
			}
		}

		// Decorating a 'diff'
		if (neg) {
			result[0] = -result[0];
		}

		// Applying custom symbol
		result[1] = symbols[result[1]] || result[1];

		// Returning Array, Object, or String (default)
		if (output === "array") {
			return result;
		}

		if (output === "exponent") {
			return e;
		}

		if (output === "object") {
			return { value: result[0], suffix: result[1], symbol: result[1] };
		}

		if (full) {
			result[1] = fullforms[e] ? fullforms[e] : fullform[standard][e] + (bits ? "bit" : "byte") + (result[0] === 1 ? "" : "s");
		}

		return result.join(spacer);
	}

	// Partial application for functional programming
	filesize.partial = function (opt) {
		return function (arg) {
			return filesize(arg, opt);
		};
	};

	// CommonJS, AMD, script tag
	if (true) {
		module.exports = filesize;
	} else if (typeof define === "function" && define.amd) {
		define(function () {
			return filesize;
		});
	} else {
		global.filesize = filesize;
	}
})(typeof window !== "undefined" ? window : global);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {


const { I18nService } = __webpack_require__( 7 ),
	{ DirService } = __webpack_require__( 5 ),
	{ TitleBarActionsView } = __webpack_require__( 12 ),
	{ DirListView } = __webpack_require__( 9 ),
	{ FileListView } = __webpack_require__( 10 ),
	{ TitleBarPathView } = __webpack_require__( 13 ),
	{ LangSelectorView } = __webpack_require__( 11 ),
	{ dictionary } = __webpack_require__( 4 ),
	{ FileService } = __webpack_require__( 6 ),
	{ ContextMenuView } = __webpack_require__(8),
	{ TrayView } = __webpack_require__( 14 );

const argv = __webpack_require__( 3 )( nw.App.argv ),
	dirService = new DirService( argv._[ 0 ] );

const i18nService = new I18nService(dictionary),
    fileService = new FileService(dirService);

new TitleBarActionsView( document.querySelector( "[data-bind=titlebar]" ), i18nService );
new DirListView( document.querySelector( "[data-bind=dirList]" ), dirService );
new FileListView( document.querySelector( "[data-bind=fileList]" ), dirService, i18nService );
new TitleBarPathView( document.querySelector( "[data-bind=path]" ), dirService );
new LangSelectorView( document.querySelector( "[data-bind=langSelector]" ), i18nService );
new FileListView(document.querySelector( "[data-bind=fileList]" ), dirService, i18nService, fileService );
new ContextMenuView(fileService, i18nService );
new TrayView( "File Explorer" );

//nw.Window.get().showDevTools();
dirService.notify();

/*
 per il command line funziona questo comando di avvio!?
 nw . \temp --maximize (il secondo pa)
 NB: il secondo parametro non viene letto se uso: npm start \temp --maximize 
*/
if ( argv.maximize ) {
	nw.Window.get().maximize();
} else if ( argv.minimize ) {
	nw.Window.get().minimize();	
}


/***/ })
/******/ ]);