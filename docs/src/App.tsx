// Swagger UI
import SwaggerUI from 'swagger-ui'
import 'swagger-ui/dist/swagger-ui.css'

import { config } from './config'
import { CustomLayoutPlugin } from './layouts/CustomLayout'
import { SidebarPlugin } from './layouts/Sidebar'
import { CustomTopbarPlugin } from './layouts/TopNavBar'
import './App.css'

const swaggerUiConfig = SwaggerUI({
  urls: config.urls,
  deepLinking: true,
  presets: [
    // @ts-ignore
    SwaggerUI.presets.apis,
    CustomLayoutPlugin,
    CustomTopbarPlugin,
    SidebarPlugin,
  ],
  layout: 'CustomLayout',
})
// @ts-ignore
const UI = swaggerUiConfig.getComponent('App', 'root')

export const App = () => (
  <div className="App">
    <UI />
  </div>
)
