export type GenericLayout = {
  getComponent: (name: string, isContainer?: boolean) => React.JSXElement
}

export type AuthActions = {
  restoreAuthorization: (props: Record<string, any>) => void
}

export type LayoutActions = {
  updateFilter: (filter: string) => void
}

export type SpecSelectors = {
  url: () => string
  loadingStatus: () => 'loading' | 'failed'
}

export type SpecActions = {
  updateUrl: (url: string) => void
  download: (url: string) => void
}

export type Url = {
  url: string
  name: string
  boundedContext?: string
}

export type GetConfigs = () => {
  persistAuthorization: boolean
  urls: Url[]
}
