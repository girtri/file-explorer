
const { I18nService } = require( "./Service/I18n" ),
	{ DirService } = require( "./Service/Dir" ),
	{ TitleBarActionsView } = require( "./View/TitleBarActions" ),
	{ DirListView } = require( "./View/DirList" ),
	{ FileListView } = require( "./View/FileList" ),
	{ TitleBarPathView } = require( "./View/TitleBarPath" ),
	{ LangSelectorView } = require( "./View/LangSelector" ),
	{ dictionary } = require( "./Data/dictionary" ),
	{ FileService } = require( "./Service/File" ),
	{ ContextMenuView } = require("./View/ContextMenu"),
	{ TrayView } = require( "./View/Tray" );

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
