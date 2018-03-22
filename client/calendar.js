(function() {
  /* global Backbone, underscore, _ */
  var CalendarView = Backbone.View.extend({
    tagName: 'table',
    className: '',
    events: {
      "click td" : "openAppointmentDialog"
    },
    initialize: function() {
      this.template = $('#table-template').html();
      this.listenTo(this.model, "change", this.render);
      this.render();
    },
    render: function() {
      var tpl = _.template(this.template);
      this.$el.html(tpl(this.model));
    },
    openAppointmentDialog: function() {
      var $dialog = $('#dialog');
      $('#dialog').dialog({autoOpen: false});
      $dialog.dialog('open');
    }
  });
  $(function() {
    var model = {
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      hours: Array.from({length: 24}, function(v, i) { return i; })
    };
    var appointments = Backbone.Model.extend({
    });
    new CalendarView({el: '#calendar', model: model});
  });
}());
