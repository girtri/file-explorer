
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
