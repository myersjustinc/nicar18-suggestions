import DetailView from './DetailView/DetailView';
import FilterControl from './FilterControl/FilterControl';
import ResultsView from './ResultsView/ResultsView';

const Tabletop = window.Tabletop;

const detailElem = document.getElementById('detail');
const detailView = new DetailView(detailElem);

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

function init(data) {
  filterControl.setResults(data);
  filterControl.applyFilters();
}

Tabletop.init({
  key: '1vpMSccei8cyvg6zPU5vtppV8hvNtLxeSH_jvo5MnHbM',
  callback: init,
  simpleSheet: true
});
