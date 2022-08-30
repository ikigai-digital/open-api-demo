import React from 'react'

import { SelectedIndexProvider } from '../../contexts/SelectedIndexContext'
import { GenericLayout } from '../../types/SwaggerUILayout'
import './CustomLayout.css'

const CustomLayout: React.FC<GenericLayout> = ({ getComponent }) => {
  const Container = getComponent('Container')
  const Topbar = getComponent('Topbar', true)
  const Sidebar = getComponent('Sidebar', true)
  const BaseLayout = getComponent('BaseLayout', true)

  return (
    <SelectedIndexProvider>
      <Container className="swagger-ui">
        <Topbar />
        <div className="contentContainer">
          <Sidebar />
          <BaseLayout />
        </div>
      </Container>
    </SelectedIndexProvider>
  )
}

// Create the plugin that provides our layout component
export const CustomLayoutPlugin = () => {
  return {
    components: {
      CustomLayout,
    },
  }
}
