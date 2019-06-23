// // @flow
import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './app'

// Draw controls
const mount = document.getElementById('controls')
if (mount) {
  ReactDOM.render(<App />, mount)
}
