import { Delegate } from 'dom-delegate';

import filterHTML from './FilterControl.html';
import filterCSS from './FilterControl.css';  // jshint unused:false

export default class FilterControl {
  constructor(elem, callback) {
    this.elem = elem;
    this.allResults = [];
    this.callback = callback;
    this.handlersBound = false;
  }

  // =-=-=-=-=-=-=-=-=-=-=-= PUBLIC METHODS FOLLOW =-=-=-=-=-=-=-=-=-=-=-=-=-=-

  applyFilters() {
    const filters = this.getActiveFilters();
    const newResults = this.filterResults(filters);
    this.callback(newResults);
  }
  render(results) {
    this.bindHandlers();
    this.elem.classList.add('filter-control');
    this.elem.innerHTML = filterHTML;
    return this;
  }
  setResults(results) {
    this.allResults = results;
  }

  // =-=-=-=-=-=-=-=-=-=-=- INTERNAL METHODS FOLLOW -=-=-=-=-=-=-=-=-=-=-=-=-=-

  bindHandlers() {
    const delegate = new Delegate(document.body);
    delegate.on('change', '.filters--filters', this.applyFilters.bind(this));
    this.handlersBound = true;
  }
  filterResults(filters) {
    function allFiltersPass(result) {
      return filters.reduce(
        (passing, filter) => passing && filter(result),
        true);
    }
    return this.allResults.filter(result => allFiltersPass(result));
  }
  getActiveFilters() {
    return [
      this.buildCostFilter()
    ];
  }

  // =-=-=-=-=-=-=-=-=-=-=- FILTER BUILDERS FOLLOW =-=-=-=-=-=-=-=-=-=-=-=-=-=-

  buildCostFilter() {
    const checkedCostInputs = this.elem.querySelectorAll(
      '.filters--field--option input[name="cost"]:checked');

    // Allow anything if we haven't checked any cost options.
    if (!checkedCostInputs.length) {
      return (result => true);
    }

    const acceptableValues = Array.prototype.map.call(
      checkedCostInputs, inputElem => inputElem.value);
    return function(result) {
      const resultCost = result['Cost (Approximate, Per Person)'];
      return acceptableValues.reduce(function(passing, acceptableValue) {
        return passing || acceptableValues.includes(resultCost);
      }, false);
    };
  }
}
