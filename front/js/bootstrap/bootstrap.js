try {
  const $ = require("jquery");
  window.$ = window.jQuery = $;
  window.Popper = require("popper.js");
  require("bootstrap");
  require("bootstrap-notify");
  // require('dropzone');
  require("select2/dist/js/select2.full.js");
  require("bootstrap-notify");
  // inits
  window._ = require("lodash");
  window.axios = require("axios");
  window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  // === libs
  // inits
  $(function () {
    $("ul.navbar-nav li.dropdown").hover(
      function () {
        $(this)
          .find(".dropdown-menu")
          .stop(true, true)
          .delay(50)
          .slideDown("fast");
      },
      function () {
        $(this)
          .find(".dropdown-menu")
          .stop(true, true)
          .delay(50)
          .slideUp("fast");
      }
    );
  });

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  // s2
  $.fn.select2.defaults.set("theme", "bootstrap4");
} catch (e) {
  console.log("Vue Boostrap Error", e);
}
