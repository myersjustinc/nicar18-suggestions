import footerHTML from './FooterView.html';
import footerCSS from './FooterView.css';  // jshint unused:false

export default class FooterView {
  constructor(elem, showDetails) {
    this.elem = elem;
  }

  // =-=-=-=-=-=-=-=-=-=-=-= PUBLIC METHODS FOLLOW =-=-=-=-=-=-=-=-=-=-=-=-=-=-

  render(results) {
    this.elem.classList.add('footer-view');
    this.elem.innerHTML = footerHTML;
    return this;
  }
}
