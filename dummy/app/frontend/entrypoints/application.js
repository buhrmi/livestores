import axios from 'axios'

import { createInertiaApp } from '@inertiajs/inertia-svelte'
import { InertiaProgress } from '@inertiajs/progress'

const pages = import.meta.glob('../pages/**/*.svelte')

const csrfToken = document.querySelector('meta[name=csrf-token]').content
axios.defaults.headers.common['X-CSRF-Token'] = csrfToken

InertiaProgress.init()

createInertiaApp({ 
  resolve: name => pages[`../pages/${name}.svelte`](),
  setup({ el, App, props }) {
    new App({ target: el, props })
  },
})