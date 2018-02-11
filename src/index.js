import DetailView from './DetailView/DetailView';
import FilterControl from './FilterControl/FilterControl';
import ResultsView from './ResultsView/ResultsView';
import Router from './Router';

const Tabletop = window.Tabletop;

const router = new Router();
function onShowDetail(result) {
  router.navigate(result._lookupTimestamp, {trigger: false, replace: true});
}
function onHideDetail() {
  router.navigate('home', {trigger: false, replace: true});
}

const detailElem = document.getElementById('detail');
const detailView = new DetailView(detailElem, onShowDetail, onHideDetail);
router.detailView = detailView;

function showDetails(result) {
  detailView.render(result);
  detailView.show();
}

const resultsElem = document.getElementById('results');
const resultsView = new ResultsView(resultsElem, showDetails);

const filterElem = document.getElementById('filters');
const filterControl = new FilterControl(
  filterElem, resultsView.render.bind(resultsView));
filterControl.render();

function initialSort(data) {
  data.forEach(function(result) {
    result._distance = parseFloat(result['Miles from hotel']);
  });
  return data.sort(function(a, b) {
    const aDist = a._distance;
    const bDist = b._distance;
    if ((isNaN(aDist) && isNaN(bDist)) || (aDist === bDist)) {
      return 0;
    }
    if (isNaN(bDist) || (aDist < bDist)) {
      return -1;
    }
    if (isNaN(aDist) || (aDist > bDist)) {
      return 1;
    }
    return 0;
  });
}

function init(data) {
  const sorted = initialSort(data);
  filterControl.setResults(sorted);
  filterControl.applyFilters();

  router.resultsByTimestamp = resultsView.results;

  const initialURLMatches = router.history.start({pushState: false});
  if (!initialURLMatches) {
    router.navigate('home', {trigger: false, replace: true});
  }
}

Tabletop.init({
  key: '1vpMSccei8cyvg6zPU5vtppV8hvNtLxeSH_jvo5MnHbM',
  callback: init,
  simpleSheet: true
});
