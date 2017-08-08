
class LangSelectorView 
{
	constructor(boundingEl, i18n) {
		boundingEl.addEventListener("change", this.onChanged.bind(this), false);
		this.i18n = i18n;
	}

	onChanged(e) {
		const selectEl = e.target;
		this.i18n.locale = selectEl.value;
		this.i18n.notify();
	}
}

exports.LangSelectorView = LangSelectorView;
