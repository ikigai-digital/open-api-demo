// Swagger UI
import SwaggerUI from 'swagger-ui'
// @ts-ignore
import SwaggerUIStandalonePreset from 'swagger-ui/dist/swagger-ui-standalone-preset'
import 'swagger-ui/dist/swagger-ui.css'

import { config } from './config'
import { CustomLayoutPlugin } from './layouts/CustomLayout'
import { CustomTopbarPlugin } from './layouts/TopNavBar'
import './App.css'

const swaggerUiConfig = SwaggerUI({
  urls: config.urls,
  deepLinking: true,
  presets: [
    // @ts-ignore
    SwaggerUI.presets.apis,
    SwaggerUIStandalonePreset,
    CustomLayoutPlugin,
    CustomTopbarPlugin,
  ],
  // @ts-ignore
  plugins: [SwaggerUI.plugins.DownloadUrl],
  layout: 'AugmentingLayout',
})
// @ts-ignore
const UI = swaggerUiConfig.getComponent('App', 'root')

export const App = () => (
  <div className="App">
    <UI />
  </div>
)
