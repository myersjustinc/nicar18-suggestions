import ResultsView from './ResultsView/ResultsView';

const Tabletop = window.Tabletop;

function showDetails(result) {
  console.log('Showing details for', result);
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
