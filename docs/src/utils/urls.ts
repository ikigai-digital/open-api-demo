export const serializeSearch = (searchMap: Record<string, any>) => {
  return Object.keys(searchMap)
    .map((k: any) => {
      return encodeURIComponent(k) + '=' + encodeURIComponent(searchMap[k])
    })
    .join('&')
}

export const parseSearch = () => {
  let map: Record<string, any> = {}
  let search = window.location.search

  if (!search) return {}

  if (search !== '') {
    let params = search.substr(1).split('&')

    for (let i in params) {
      if (!Object.prototype.hasOwnProperty.call(params, i)) {
        continue
      }
      // @ts-ignore
      i = params[i].split('=')
      // @ts-ignore
      map[decodeURIComponent(i[0])] = (i[1] && decodeURIComponent(i[1])) || ''
    }
  }

  return map
}
