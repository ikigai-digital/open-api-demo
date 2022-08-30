import { useCallback, useContext } from 'react'

import { SelectedIndexContext } from '../contexts/SelectedIndexContext'
import { AuthActions, GetConfigs, SpecActions, Url } from '../types/SwaggerUILayout'
import { parseSearch, serializeSearch } from '../utils/urls'

type Props = {
  authActions: AuthActions
  specActions: SpecActions
  getConfigs: GetConfigs
}

export const useChangeUrl = ({ getConfigs, authActions, specActions }: Props) => {
  const { setSelectedIndex, selectedIndex } = useContext(SelectedIndexContext)

  const setSearch = (spec: Url) => {
    let search = parseSearch()
    search['urls.primaryName'] = spec.name
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
    if (window && window.history) {
      window.history.replaceState(null, '', `${newUrl}?${serializeSearch(search)}`)
    }
  }
  const setSelectedUrl = (selectedUrl: string) => {
    const configs = getConfigs()
    const urls = configs.urls || []

    if (urls && urls.length) {
      if (selectedUrl) {
        urls.forEach((spec: Url, i: number) => {
          if (spec.url === selectedUrl) {
            setSelectedIndex(i)
            setSearch(spec)
          }
        })
      }
    }
  }
  const flushAuthData = useCallback(() => {
    const { persistAuthorization } = getConfigs()
    if (persistAuthorization) {
      return
    }

    authActions.restoreAuthorization({
      authorized: {},
    })
  }, [authActions, getConfigs])

  const loadSpec = useCallback(
    (newUrl: string) => {
      flushAuthData()
      specActions.updateUrl(newUrl)
      specActions.download(newUrl)
    },
    [flushAuthData, specActions],
  )

  return {
    selectedIndex,
    setSelectedUrl,
    loadSpec,
  }
}
