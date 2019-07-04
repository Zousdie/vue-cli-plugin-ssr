---
extend: '@vue/cli-service/generator/template/src/App.vue'
replace: !!js/regexp /<router-view\/>/
---

<h2>Vue SSR Project</h2>
<router-view/>
