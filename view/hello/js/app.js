$(function(){
  SearchView = Backbone.View.extend({

    initialize: function(){
        this.render();
    },

    render: function(){
        var template = _.template( $("#hello_form_template").html(), {} );
        this.$el.html( template );
    },

    events: {
      "click #submit_button": "doHello",
      "focus #name_input": "doHighlight"
    },

    doHello: function(){            
      var name =  $("#name_input").val();
      $("#divprinthello").html("Hello " + name + ", welcome to backbone world!");
    },

    doHighlight: function( event ){
      //you can access the current element on focus with event.currentTarget
      $(event.currentTarget).css("background-color","#cccccc");
    }

  });

  var hello_view = new SearchView({ el: $("#hello_form_container") });
});