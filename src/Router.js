import Router from 'ampersand-router';

export default Router.extend({
  routes: {
    'home': 'home',
    ':timestamp': 'detail'
  },
  home: function() {
    if (this.detailView == null) {
      return;
    }
    this.detailView.hide();
  },
  detail: function(timestamp) {
    if (this.detailView == null) {
      return;
    }
    if (this.resultsByTimestamp == null) {
      return this.redirectTo('home');
    }

    const result = this.resultsByTimestamp[timestamp];
    if (result == null) {
      return this.redirectTo('home');
    }

    this.detailView.render(result);
    this.detailView.show();
  }
});
