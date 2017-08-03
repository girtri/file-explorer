
class TitleBarActionsView
{
	constructor(boundingEl) {
		this.closeEl = boundingEl.querySelector("[data-bind=close]");
		this.unmaximizeEl = boundingEl.querySelector("[data-bind=unmaximize]");
		this.maximizeEl = boundingEl.querySelector("[data-bind=maximize]");
		this.minimizeEl = boundingEl.querySelector("[data-bind=minimize]");
		this.bindUi();
	}

	bindUi() {
		this.closeEl.addEventListener("click", this.onClose.bind(this), false);
		this.minimizeEl.addEventListener("click", this.onMinimize.bind( this ), false);
		this.maximizeEl.addEventListener("click", this.onMaximize.bind( this ), false);
		this.unmaximizeEl.addEventListener("click", this.onUnmaximize.bind( this), false);
	}

	onClose(e) {
		e.preventDefault();
		nw.Window.get().close();
	}

	onMinimize(e) {
		e.preventDefault();
		nw.Window.get().minimize();
	}

	onUnmaximize(e) {
		e.preventDefault();
		nw.Window.get().unmaximize();
		this.toggleMaximize();
	}

	onMaximize(e) {
		e.preventDefault();
		nw.Window.get().maximize();
		this.toggleMaximize();
	}

	toggleMaximize(){
		this.maximizeEl.classList.toggle("is-hidden");
		this.unmaximizeEl.classList.toggle("is-hidden");
	}
}

exports.TitleBarActionsView = TitleBarActionsView;
