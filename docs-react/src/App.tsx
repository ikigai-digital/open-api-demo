import SwaggerUIReact from 'swagger-ui-react'
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist'
import 'swagger-ui-react/swagger-ui.css'

export const App = () => (
  <SwaggerUIReact
    url="https://petstore.swagger.io/v2/swagger.json"
    // @ts-ignore
    urls={[
      {
        url: 'specs/petstoreV1.json',
        name: 'PetstoreV1',
      },
      {
        url: 'specs/petstoreV2.json',
        name: 'PetstoreV2',
      },
    ]}
    deepLinking
    // @ts-ignore
    presets={[SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset.SwaggerUIStandalonePreset]}
    // @ts-ignore
    plugins={[SwaggerUIBundle.plugins.DownloadUrl]}
    layout="StandaloneLayout"
  />
)
