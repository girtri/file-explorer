const { dictionary } = require( "./js/Data/dictionary" );
const { I18nService } = require( "./js/Service/I18n" );
const i18nService = new I18nService(dictionary), { LangSelectorView } = require( "./js/View/LangSelector" );
new LangSelectorView( document.querySelector( "[data-bind=langSelector]" ), i18nService );

const { TitleBarActionsView } = require("./js/View/TitleBarActions");
new TitleBarActionsView(document.querySelector("[data-bind=titlebar]", i18nService));

const { DirService } = require( "./js/Service/Dir" ),
	{ DirListView } = require( "./js/View/DirList" ),
	dirService = new DirService();

new DirListView( document.querySelector( "[data-bind=dirList]" ), dirService );
dirService.notify();

const { FileListView } = require( "./js/View/FileList" );
new FileListView(document.querySelector( "[data-bind=fileList]" ), dirService, i18nService);

const { TitleBarPathView } = require( "./js/View/TitleBarPath" );
new TitleBarPathView( document.querySelector( "[data-bind=path]" ), dirService );


