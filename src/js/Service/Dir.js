
const fs = require( "fs" ),
      { join, parse } = require( "path" ),
      EventEmitter = require( "events" );

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