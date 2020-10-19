import FlexSearch from 'flexsearch'

export default (options = []) => {
  const index = FlexSearch.create()

  options.forEach((opt, idx) => index.add(idx, opt))

  async function fullMatch(query) {
    const [responseIndex] = await index.search(query)
    return options[responseIndex]
  }

  async function partialMatch(query) {
    const parsedQuery = query.replace(/\b[a-z]{1,3}\b/gi, '')
    const [responseIndex] = await index.search(parsedQuery)

    return options[responseIndex]
  }

  return {
    find: async (query) => {
      const result = await fullMatch(query)

      if (result) return result

      return partialMatch(query)
    },
  }
}
