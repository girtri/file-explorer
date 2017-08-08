
const { I18nService } = require( "./js/Service/I18n" ),
	{ DirService } = require( "./js/Service/Dir" ),
	{ TitleBarActionsView } = require( "./js/View/TitleBarActions" ),
	{ DirListView } = require( "./js/View/DirList" ),
	{ FileListView } = require( "./js/View/FileList" ),
	{ TitleBarPathView } = require( "./js/View/TitleBarPath" ),
	{ LangSelectorView } = require( "./js/View/LangSelector" ),
	{ dictionary } = require( "./js/Data/dictionary" ),
	{ FileService } = require( "./js/Service/File" ),
	{ ContextMenuView } = require("./js/View/ContextMenu"),
	{ TrayView } = require( "./js/View/Tray" );

const argv = require( "minimist" )( nw.App.argv ),
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
