import ResultsView from './ResultsView/ResultsView';

const Tabletop = window.Tabletop;

const resultsElem = document.getElementById('results');
const resultsView = new ResultsView(resultsElem);

function init(data) {
  console.log(data);
  resultsView.render(data);
}

Tabletop.init({
  key: '1vpMSccei8cyvg6zPU5vtppV8hvNtLxeSH_jvo5MnHbM',
  callback: init,
  simpleSheet: true
});
