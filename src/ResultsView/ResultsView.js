import apNumber from '../utils/apNumber';

import resultsHTML from './ResultsView.html';
import resultsCSS from './ResultsView.css';  // jshint unused:false

export default class PremiumsView {
  constructor(elem) {
    this.elem = elem;
  }

  // =-=-=-=-=-=-=-=-=-=-=-= PUBLIC METHODS FOLLOW =-=-=-=-=-=-=-=-=-=-=-=-=-=-

  render(results) {
    this.elem.classList.add('results-view');
    this.elem.innerHTML = resultsHTML;
    this.renderSummary(results);
    this.renderResults(results);
    return this;
  }

  // =-=-=-=-=-=-=-=-=-=-=- INTERNAL METHODS FOLLOW -=-=-=-=-=-=-=-=-=-=-=-=-=-

  renderResults(results) {
  }
  renderSummary(results) {
    const resultsCount = results.length;
    const countElem = this.elem.querySelector('.results--summary--count');
    const countFormatted = apNumber(resultsCount);
    const resultUnits = resultsCount === 1 ? 'result' : 'results';
    countElem.textContent = countFormatted + ' ' + resultUnits;
  }
}
