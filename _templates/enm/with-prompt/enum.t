---
to: server/models/<%= name %>.js
inject: true
after: "// inject"
---
// <%= enumName %>
<% enumFields.forEach(function(field) { -%>
const <%= enumName.toUpperCase() %>_<%= field.toUpperCase() %> = <%= enumIsInt ? '0' : '""' %>;
<% }); -%>

<% enumFields.forEach(function(field) { -%>
exports.<%= enumName.toUpperCase() %>_<%= field.toUpperCase() %> = <%= enumName.toUpperCase() %>_<%= field.toUpperCase() %>;
<% }); -%>
exports.<%= enumName.toUpperCase() %>_ALL = [<% enumFields.forEach(function(field) { -%><%= enumName.toUpperCase() %>_<%= field.toUpperCase() %>, <% }); %>];

const <%= enumName %>ToString = (value) => {
<% if (enumIsInt) { -%>
  switch (parseInt(value)) {
<% } else { -%>
  switch (value) {
<% } -%>
<% enumFields.forEach(function(field) { -%>
    case <%= enumName.toUpperCase() %>_<%= field.toUpperCase() %>:
        return "<%= field.toUpperCase() %>";

<% }); -%>
  }
  return "Desconhecido";
};
exports.<%= enumName %>ToString = <%= enumName %>ToString;

// <%= enumName %>Desc: {
//   type: new DataTypes.VIRTUAL(DataTypes.STRING, ["<%= enumName %>"]),
//   get: function () {
//     return <%= enumName %>ToString(this.get("<%= enumName %>"));
//   },
// },