
const { I18nService } = require( "./js/Service/I18n" ),
	{ DirService } = require( "./js/Service/Dir" ),
	{ TitleBarActionsView } = require( "./js/View/TitleBarActions" ),
	{ DirListView } = require( "./js/View/DirList" ),
	{ FileListView } = require( "./js/View/FileList" ),
	{ TitleBarPathView } = require( "./js/View/TitleBarPath" ),
	{ LangSelectorView } = require( "./js/View/LangSelector" ),
	{ dictionary } = require( "./js/Data/dictionary" ),
	{ FileService } = require( "./js/Service/File" ),
	{ ContextMenuView } = require("./js/View/ContextMenu");

const i18nService = new I18nService( dictionary ),
    dirService = new DirService(),
    fileService = new FileService( dirService );

new TitleBarActionsView( document.querySelector( "[data-bind=titlebar]" ), i18nService );
new DirListView( document.querySelector( "[data-bind=dirList]" ), dirService );
new FileListView( document.querySelector( "[data-bind=fileList]" ), dirService, i18nService );
new TitleBarPathView( document.querySelector( "[data-bind=path]" ), dirService );
new LangSelectorView( document.querySelector( "[data-bind=langSelector]" ), i18nService );
new FileListView(document.querySelector( "[data-bind=fileList]" ), dirService, i18nService, fileService );
new ContextMenuView(fileService, i18nService );

dirService.notify();

//nw.Window.get().showDevTools();
