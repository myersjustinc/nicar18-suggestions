import DetailView from './DetailView/DetailView';
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

function init(data) {
  resultsView.render(data);
}

Tabletop.init({
  key: '1vpMSccei8cyvg6zPU5vtppV8hvNtLxeSH_jvo5MnHbM',
  callback: init,
  simpleSheet: true
});
