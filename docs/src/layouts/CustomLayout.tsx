import { GenericLayout } from '../types/SwaggerUILayout'

const CustomLayout: React.FC<GenericLayout> = ({ getComponent }) => {
  const Container = getComponent('Container')
  const Topbar = getComponent('Topbar', true)
  const BaseLayout = getComponent('BaseLayout', true)

  return (
    <Container className="swagger-ui">
      <Topbar />
      <BaseLayout />
    </Container>
  )
}

// Create the plugin that provides our layout component
export const CustomLayoutPlugin = () => {
  return {
    components: {
      AugmentingLayout: CustomLayout,
    },
  }
}
