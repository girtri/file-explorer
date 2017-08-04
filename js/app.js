
const { TitleBarActionsView } = require("./js/View/TitleBarActions");
new TitleBarActionsView(document.querySelector("[data-bind=titlebar]"));

const { DirService } = require( "./js/Service/Dir" ),
	{ DirListView } = require( "./js/View/DirList" ),
	dirService = new DirService();

new DirListView( document.querySelector( "[data-bind=dirList]" ), dirService );
dirService.notify();

const { FileListView } = require( "./js/View/FileList" );
new FileListView( document.querySelector( "[data-bind=fileList]" ), dirService );

const { TitleBarPathView } = require( "./js/View/TitleBarPath" );
new TitleBarPathView( document.querySelector( "[data-bind=path]" ), dirService );
