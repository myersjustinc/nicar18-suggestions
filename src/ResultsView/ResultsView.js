import { Delegate } from 'dom-delegate';

import apNumber from '../utils/apNumber';
import formatTimestamp from '../utils/formatTimestamp';
import sanitizeFormValue from '../utils/sanitizeFormValue';

import resultsHTML from './ResultsView.html';
import resultsCSS from './ResultsView.css';  // jshint unused:false

export default class PremiumsView {
  constructor(elem, showDetails) {
    this.elem = elem;
    this.showDetails = showDetails;
    this.handlersBound = false;
  }

  // =-=-=-=-=-=-=-=-=-=-=-= PUBLIC METHODS FOLLOW =-=-=-=-=-=-=-=-=-=-=-=-=-=-

  render(results) {
    this.bindHandlers();
    this.elem.classList.add('results-view');
    this.elem.innerHTML = resultsHTML;

    this.cacheResults(results);
    this.renderSummary(results);
    this.renderResults(results);

    return this;
  }

  // =-=-=-=-=-=-=-=-=-=-=- INTERNAL METHODS FOLLOW -=-=-=-=-=-=-=-=-=-=-=-=-=-

  bindHandlers() {
    const delegate = new Delegate(document.body);
    delegate.on(
      'click', '.results--result--show-detail',
      this.handleShowDetailClick.bind(this));
    this.handlersBound = true;
  }
  cacheResults(results) {
    let cached = {};
    results.forEach(result => {
      const timestamp = formatTimestamp(result.Timestamp);
      result._lookupTimestamp = timestamp;
      cached[timestamp] = result;
    });
    this.results = cached;
  }
  formatCost(rawCost) {
    const abbreviation = (function() {
      if (rawCost === 'Free') {
        return '\u2205';
      }
      if (rawCost === '$10 or less') {
        return '$';
      }
      if (rawCost === '$11-20') {
        return '$$';
      }
      if (rawCost === '$21-30') {
        return '$$$';
      }
      if (rawCost === '$31 or more') {
        return '$$$$';
      }
      return '';
    }());
    return [
      '<abbr title="', rawCost, '">',
        abbreviation,
      '</abbr>',
    ].join('');
  }
  formatTransit(rawTransit) {
    const canWalk = /\bWalking distance\b/.test(rawTransit);
    const canTrain = /\bTrain\b/.test(rawTransit);
    const canBus = /\bBus\b/.test(rawTransit);
    const canCar = /\bUber\/Lyft\/Taxi\b/.test(rawTransit);
    let components = [];
    if (canWalk) {
      components.push('<abbr title="Walking distance">\u{1f6b6}</abbr>');
    }
    if (canTrain) {
      components.push('<abbr title="Train">\u{1f687}</abbr>');
    }
    if (canBus) {
      components.push('<abbr title="Bus">\u{1f68c}</abbr>');
    }
    if (canCar) {
      components.push('<abbr title="Uber/Lyft/Taxi">\u{1f695}</abbr>');
    }
    return components.join('');
  }
  handleShowDetailClick(event) {
    const lookupTimestamp = event.target.getAttribute('href').slice(1);
    const result = this.results[lookupTimestamp];
    this.showDetails(result);
    event.preventDefault();
  }
  renderResults(results) {
    const resultsBody = this.elem.querySelector('.results--results tbody');
    resultsBody.innerHTML = results.map(
      result => this.renderRow(result)).join('');
  }
  renderRow(result) {
    return [
      '<tr>',
        '<td class="results--result--name">',
          '<a class="results--result--show-detail" href="#',
            formatTimestamp(result.Timestamp),
          '">',
            sanitizeFormValue(result['Recommendation Name']),
          '</a>',
        '</td>',
        '<td class="results--result--cost">',
          this.formatCost(result['Cost (Approximate, Per Person)']),
        '</td>',
        '<td class="results--result--transit">',
          this.formatTransit(result['How to get there?']),
        '</td>',
      '</tr>'
    ].join('');
  }
  renderSummary(results) {
    const resultsCount = results.length;
    const countElem = this.elem.querySelector('.results--summary--count');
    const countFormatted = apNumber(resultsCount);
    const resultUnits = resultsCount === 1 ? 'result' : 'results';
    countElem.textContent = countFormatted + ' ' + resultUnits;
  }
}
