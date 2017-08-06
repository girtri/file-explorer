const fs = require("fs"), path = require("path");

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

	copy(file) {
		this.copiedFile = this.dir.getFile( file );
	}

	open(file) {
		nw.Shell.openItem(this.dir.getFile( file ));
	}

	showInFolder(file) {
		nw.Shell.showItemInFolder(this.dir.getFile( file ));
	}
};

exports.FileService = FileService;
