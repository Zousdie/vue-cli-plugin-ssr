---
extend: '@vue/cli-service/generator/vuex/template/src/store.js'
replace:
  - !!js/regexp /export default new Vuex\.Store/
  - !!js/regexp /state[^]*?\},/
---

<%# REPLACE %>
export default (context) => new Vuex.Store
<%# END_REPLACE %>

<%# REPLACE %>
state() { },
<%# END_REPLACE %>
