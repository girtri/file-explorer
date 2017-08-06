
const filesize = require( "filesize" );

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
