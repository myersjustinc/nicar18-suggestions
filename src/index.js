const Tabletop = window.Tabletop;

function init(data) {
  console.log(data);
}

Tabletop.init({
  key: '1vpMSccei8cyvg6zPU5vtppV8hvNtLxeSH_jvo5MnHbM',
  callback: init,
  simpleSheet: true
});
