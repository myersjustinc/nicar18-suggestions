import { Delegate } from 'dom-delegate';

import generateMapLink from '../utils/generateMapLink';
import sanitizeFormValue from '../utils/sanitizeFormValue';

import detailHTML from './DetailView.html';
import detailCSS from './DetailView.css';  // jshint unused:false

export default class DetailView {
  constructor(elem) {
    this.elem = elem;
    this.handlersBound = false;
  }

  // =-=-=-=-=-=-=-=-=-=-=-= PUBLIC METHODS FOLLOW =-=-=-=-=-=-=-=-=-=-=-=-=-=-

  hide() {
    this.elem.classList.add('detail-view--hidden');
  }
  render(result) {
    this.bindHandlers();
    this.elem.classList.add('detail-view');
    this.elem.innerHTML = detailHTML;
    this.renderResult(result);
    return this;
  }
  show() {
    const modalBackground = this.elem.querySelector(
      '.detail--modal--background');
    const tableWrapper = this.elem.querySelector('.detail--wrapper');
    modalBackground.style.height = window.innerHeight + 'px';
    tableWrapper.style.maxHeight = (window.innerHeight * 0.7) + 'px';
    this.elem.classList.remove('detail-view--hidden');
  }

  // =-=-=-=-=-=-=-=-=-=-=- INTERNAL METHODS FOLLOW -=-=-=-=-=-=-=-=-=-=-=-=-=-

  bindHandlers() {
    const delegate = new Delegate(document.body);
    delegate.on('click', '.detail--close', this.hide.bind(this));
    delegate.on('click', '.detail--modal--background', this.hide.bind(this));
    this.handlersBound = true;
  }
  renderResult(result) {
    const thisElem = this.elem;
    function fillProperty(columnName, selector) {
      const detailElem = thisElem.querySelector(selector);
      detailElem.innerHTML = sanitizeFormValue(result[columnName]);
    }
    fillProperty('Recommendation Name', '.detail--name');
    fillProperty('Location', '.detail--details--location--link');
    fillProperty('Quick Description', '.detail--details--description');
    fillProperty('Type', '.detail--details--type');
    fillProperty('Good for...', '.detail--details--categories');
    fillProperty('Cost (Approximate, Per Person)', '.detail--details--cost');
    fillProperty('How to get there?', '.detail--details--transit');
    fillProperty('Recommender', '.detail--details--credit');
    this.elem.querySelector('.detail--details--location--link').href = (
      generateMapLink(result.Location));
  }
}
