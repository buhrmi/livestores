import axios from 'axios'

import { createInertiaApp } from '@inertiajs/svelte'
import { mount } from 'svelte'
const pages = import.meta.glob('../pages/**/*.svelte')

const csrfToken = document.querySelector('meta[name=csrf-token]').content
axios.defaults.headers.common['X-CSRF-Token'] = csrfToken


createInertiaApp({ 
  resolve: name => pages[`../pages/${name}.svelte`](),
  setup({ el, App, props }) {
    mount(App, { target: el, props })
  },
})