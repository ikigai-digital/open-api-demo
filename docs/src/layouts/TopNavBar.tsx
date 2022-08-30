import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import React, { cloneElement, useState, useEffect, useMemo, useCallback } from 'react'

import { parseSearch, serializeSearch } from '../utils/urls'
import {
  AuthActions,
  GenericLayout,
  GetConfigs,
  SpecActions,
  SpecSelectors,
  Url,
} from '../types/SwaggerUILayout'

type Props = {
  authActions: AuthActions
  specSelectors: SpecSelectors
  specActions: SpecActions
  getComponent: GenericLayout['getComponent']
  getConfigs: GetConfigs
}

export const TopNavBar: React.FC<Props> = ({
  authActions,
  specSelectors,
  getConfigs,
  specActions,
  getComponent,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const urlFromProps = useMemo(() => specSelectors.url(), [specSelectors])

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
  useEffect(() => {}, [urlFromProps])

  useEffect(() => {
    const configs = getConfigs()
    const urls = configs.urls || []

    if (urls && urls.length) {
      var targetIndex = selectedIndex
      loadSpec(urls[targetIndex].url)
    }
  }, [getConfigs, loadSpec, selectedIndex])

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

  const onUrlSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let url = e.target.value
    loadSpec(url)
    setSelectedUrl(url)
    e.preventDefault()
  }

  const setSearch = (spec: any) => {
    let search = parseSearch()
    search['urls.primaryName'] = spec.name
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
    if (window && window.history) {
      window.history.replaceState(null, '', `${newUrl}?${serializeSearch(search)}`)
    }
  }

  let isLoading = specSelectors.loadingStatus() === 'loading'
  let isFailed = specSelectors.loadingStatus() === 'failed'

  const classNames = ['download-url-input']
  if (isFailed) classNames.push('failed')
  if (isLoading) classNames.push('loading')

  const { urls } = getConfigs()
  let control = []

  if (urls) {
    const sections = groupBy(urls, (url) => get(url, 'boundedContext', 'Others'))
    // groupBy(urls, 'boundedContext')
    // const sectionComp
    console.log({ sections })

    control.push(
      <label className="select-label" htmlFor="select">
        <span>Select a definition</span>
        <select
          id="select"
          disabled={isLoading}
          onChange={onUrlSelect}
          value={urls[selectedIndex].url}
        >
          {Object.keys(sections).map((key: string) => (
            <optgroup key={key} label={key}>
              {sections[key].map((link: Url) => (
                <option key={link.name} value={link.url}>
                  {link.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>,
    )
  }
  return (
    <div className="topbar">
      <div className="wrapper">
        <div className="topbar-wrapper">
          <img height={60} src="/ikigai_logo.webp" alt="Ikigai Logo" />
          <form className="download-url-wrapper">
            {control.map((el, i) => cloneElement(el, { key: i }))}
          </form>
        </div>
      </div>
    </div>
  )
}

export const CustomTopbarPlugin = () => {
  return {
    components: {
      Topbar: TopNavBar,
    },
  }
}
