import Vue from 'vue'
import SvgIcon from '@/components/svg-icon'

Vue.component('svg-icon', SvgIcon)

function requireAll (requireContext) {
  requireContext.keys().map(requireContext)
}

const req = require.context(
  './svg', false, /\.svg$/
)

requireAll(req)
