import { format } from 'd3-format';
import { Delegate } from 'dom-delegate';

import formatTimestamp from '../utils/formatTimestamp';
import generateMapLink from '../utils/generateMapLink';
import sanitizeFormValue from '../utils/sanitizeFormValue';

import resultsHTML from './ResultsView.html';
import resultsCSS from './ResultsView.css';  // jshint unused:false

const distanceFormat = format('.2f');

export default class ResultsView {
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
    function addAbbr(title, codePoint) {
      components.push([
        '<abbr title="', title, '">',
          String.fromCodePoint(codePoint),
        '</abbr>'
      ].join(''));
    }
    if (canWalk) {
      addAbbr('Walking distance', 0x1f6b6);
    }
    if (canTrain) {
      addAbbr('Train', 0x1f687);
    }
    if (canBus) {
      addAbbr('Bus', 0x1f68c);
    }
    if (canCar) {
      addAbbr('Uber/Lyft/Taxi', 0x1f695);
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
          '<span class="results--result--distance">',
            distanceFormat(result['Miles from hotel']), ' mi',
          '</span>',
        '</td>',
        '<td class="results--result--map">',
          '<a ',
            'href="', generateMapLink(result.Location),'" ',
            'target="_blank" rel="noopener noreferrer"',
          '>',
            '<abbr title="Open map in new window">&#x21f1;</abbr>',
          '</a>',
        '</td>',
      '</tr>'
    ].join('');
  }
}
