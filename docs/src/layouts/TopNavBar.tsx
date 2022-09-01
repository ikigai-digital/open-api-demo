import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import React, { cloneElement, useEffect } from 'react'

import logo from '../assets/images/logo.png'
import { AuthActions, GetConfigs, SpecActions, SpecSelectors, Url } from '../types/SwaggerUILayout'
import { useChangeUrl } from '../hooks/useChangeUrl'

type Props = {
  authActions: AuthActions
  specSelectors: SpecSelectors
  specActions: SpecActions
  getConfigs: GetConfigs
}

export const TopNavBar: React.FC<Props> = ({
  authActions,
  specSelectors,
  getConfigs,
  specActions,
}) => {
  const { loadSpec, selectedIndex, setSelectedUrl } = useChangeUrl({
    authActions,
    getConfigs,
    specActions,
  })

  useEffect(() => {
    const configs = getConfigs()
    const urls = configs.urls || []

    if (urls && urls.length) {
      var targetIndex = selectedIndex
      loadSpec(urls[targetIndex].url)
    }
  }, [getConfigs, loadSpec, selectedIndex])

  const onUrlSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let url = e.target.value
    loadSpec(url)
    setSelectedUrl(url)
    e.preventDefault()
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
          <img height={40} src={logo} alt="Ikigai Logo" />
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
