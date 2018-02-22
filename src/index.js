import DetailView from './DetailView/DetailView';
import FilterControl from './FilterControl/FilterControl';
import FooterView from './FooterView/FooterView';
import ResultsView from './ResultsView/ResultsView';
import Router from './Router';
import sortByDistance from './utils/sortByDistance';

const Tabletop = window.Tabletop;

// =-=-=-=-=-=-=-=-=-=-=-=-= ROUTER/RESULTS WIRING =-=-=-=-=-=-=-=-=-=-=-=-=-=-

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

// =-=-=-=-=-=-=-=-=-=-=-=- REMAINING UI COMPONENTS -=-=-=-=-=-=-=-=-=-=-=-=-=-

const resultsElem = document.getElementById('results');
const resultsView = new ResultsView(resultsElem, showDetails);

const filterElem = document.getElementById('filters');
const filterControl = new FilterControl(
  filterElem, resultsView.render.bind(resultsView));
filterControl.render();

const footerElem = document.getElementById('footer');
const footerView = new FooterView(footerElem);

// =-=-=-=-=-=-=-=-=-=-=- DATA REQUEST AND FINAL INIT -=-=-=-=-=-=-=-=-=-=-=-=-

function init(data) {
  const sorted = sortByDistance(data);
  filterControl.setResults(sorted);
  filterControl.applyFilters();

  router.resultsByTimestamp = resultsView.results;

  const initialURLMatches = router.history.start({pushState: false});
  if (!initialURLMatches) {
    router.navigate('home', {trigger: false, replace: true});
  }

  footerView.render();
}

Tabletop.init({
  endpoint: 'https://myersjustinc-tabletop-cache.herokuapp.com/sheets',
  key: '1vpMSccei8cyvg6zPU5vtppV8hvNtLxeSH_jvo5MnHbM',
  callback: init,
  simpleSheet: true
});
