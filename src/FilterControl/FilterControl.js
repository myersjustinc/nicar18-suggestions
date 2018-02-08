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
      this.buildCategoryFilter(),
      this.buildCostFilter(),
      this.buildTransitFilter(),
      this.buildTypeFilter()
    ];
  }

  // =-=-=-=-=-=-=-=-=-=-=- FILTER BUILDERS FOLLOW =-=-=-=-=-=-=-=-=-=-=-=-=-=-

  buildCategoryFilter() {
    const checkedCategoryInputs = this.elem.querySelectorAll(
      '.filters--field--option input[name="category"]:checked');

    // Allow anything if we haven't checked any type options.
    if (!checkedCategoryInputs.length) {
      return (result => true);
    }

    const acceptableValues = Array.prototype.map.call(
      checkedCategoryInputs, inputElem => inputElem.value.trim());
    let categoryTestFunctions = acceptableValues.filter(
      value => value !== '').map(value => (function(resultCategory) {
        return resultCategory.includes(value);
      }));

    if (acceptableValues.includes('')) {
      const nonEmptyInputs = this.elem.querySelectorAll(
        '.filters--field--option input[name="category"]:not([value=""])');
      const nonEmptyValues = Array.prototype.map.call(
        nonEmptyInputs, inputElem => inputElem.value.trim());
      categoryTestFunctions.push(function(resultCategory) {
        return nonEmptyValues.reduce(function(passing, nonEmptyValue) {
          return passing && !resultCategory.includes(nonEmptyValue);
        }, true);
      });
    }

    return function(result) {
      const resultCategory = result['Good for...'];
      return categoryTestFunctions.reduce(function(passing, testFunction) {
        return passing || testFunction(resultCategory);
      }, false);
    };
  }
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
      return acceptableValues.includes(resultCost);
    };
  }
  buildTransitFilter() {
    const checkedTransitInputs = this.elem.querySelectorAll(
      '.filters--field--option input[name="transit"]:checked');

    // Allow anything if we haven't checked any cost options.
    if (!checkedTransitInputs.length) {
      return (result => true);
    }

    const acceptableValues = Array.prototype.map.call(
      checkedTransitInputs, inputElem => inputElem.value);
    const acceptableExps = acceptableValues.map(function(inputValue) {
      return new RegExp('\\b' + inputValue.replace(/\//g, '\\/') + '\\b');
    });
    return function(result) {
      const resultCost = result['How to get there?'];
      return acceptableExps.reduce(function(passing, acceptableExp) {
        return passing || acceptableExp.test(resultCost);
      }, false);
    };
  }
  buildTypeFilter() {
    const checkedTypeInputs = this.elem.querySelectorAll(
      '.filters--field--option input[name="type"]:checked');

    // Allow anything if we haven't checked any type options.
    if (!checkedTypeInputs.length) {
      return (result => true);
    }

    function stringToRegExp(inputValue) {
      if (inputValue === '') {
        return null;  // We'll deal with this later.
      }
      return new RegExp('(^|[\\b\\/])' + inputValue + '($|[\\b\\/])');
    }

    const acceptableValues = Array.prototype.map.call(
      checkedTypeInputs, inputElem => inputElem.value.trim());
    const acceptableExps = acceptableValues.map(
      stringToRegExp).filter(exp => exp != null);
    let typeTestFunctions = acceptableExps.map(exp => exp.test.bind(exp));

    if (acceptableValues.includes('')) {
      const nonEmptyInputs = this.elem.querySelectorAll(
        '.filters--field--option input[name="type"]:not([value=""])');
      const nonEmptyValues = Array.prototype.map.call(
        nonEmptyInputs, inputElem => inputElem.value.trim());
      const nonEmptyExps = nonEmptyValues.map(stringToRegExp);
      typeTestFunctions.push(function(resultType) {
        return nonEmptyExps.reduce(function(passing, nonEmptyExp) {
          return passing && !nonEmptyExp.test(resultType);
        }, true);
      });
    }

    return function(result) {
      const resultType = result.Type;
      return typeTestFunctions.reduce(function(passing, typeTestFunction) {
        return passing || typeTestFunction(resultType);
      }, false);
    };
  }
}
