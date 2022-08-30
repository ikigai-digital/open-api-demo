import { get, groupBy } from 'lodash'
import React, { useEffect, useState } from 'react'

import { useChangeUrl } from '../../hooks/useChangeUrl'
import { AuthActions, GetConfigs, SpecActions, Url } from '../../types/SwaggerUILayout'
import './Sidebar.css'

interface SidebarProps {
  authActions: AuthActions
  specActions: SpecActions
  getConfigs: GetConfigs
}

const Sidebar: React.FC<SidebarProps> = ({ authActions, getConfigs, specActions }) => {
  const [sections, setSections] = useState<Record<string, Url[]>>({})
  const [urls, setUrls] = useState<Url[]>([])
  const { loadSpec, setSelectedUrl, selectedIndex } = useChangeUrl({
    getConfigs,
    authActions,
    specActions,
  })

  useEffect(() => {
    const urls = getConfigs().urls || []
    const newSections = groupBy(urls, (url) => get(url, 'boundedContext', 'Others'))

    setUrls(urls)
    setSections(newSections)
  }, [getConfigs])

  const onUrlSelect = (url: string) => {
    loadSpec(url)
    setSelectedUrl(url)
  }

  return (
    <div className="sidebar">
      {Object.keys(sections)?.length > 0 && (
        <ul className="boundedContextList">
          {Object.keys(sections).map((key: string) => (
            <li key={key}>
              <h4>{key}</h4>
              {sections[key]?.length > 0 && (
                <ul className="apiList">
                  {sections[key].map((url) => (
                    <li key={url.name}>
                      <p
                        className={urls[selectedIndex].url === url.url ? 'isSelected' : ''}
                        onClick={() => onUrlSelect(url.url)}
                      >
                        {url.name}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Create the plugin that provides our layout component
export const SidebarPlugin = () => {
  return {
    components: {
      Sidebar,
    },
  }
}
