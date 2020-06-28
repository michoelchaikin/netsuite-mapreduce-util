/**
 *@NApiVersion 2.1
 *@NModuleScope Public
 */

import * as runtime from "N/runtime"
import * as search from "N/search"
import * as record from "N/record"

import { getUrls, succResponse, getAllResults } from "../../utils/index"
import { SearchLookupFieldsOptions, SearchResultSetGetRangeOptions } from "../../types/ns"

export const getCurrentUser = () => runtime.getCurrentUser()
export const getAppUrls = () => getUrls
export const runSearch = ({
  searchOptions,
  searchRange,
}: {
  searchOptions: search.SearchCreateOptions
  searchRange: SearchResultSetGetRangeOptions
}) => {
  const srch = search.create({
    type: searchOptions.type,
    filters: searchOptions.filters,
    columns: searchOptions.columns,
  })

  const mapResults = (results) =>
    results.map((m) => {
      const values = m.getAllValues()
      return { id: m.id, recordType: m.recordType, ...values}
    })

  if (searchRange) return mapResults(srch.run().getRange(searchRange))

  return mapResults(getAllResults(srch))
}

export const runLookup = (searchData: SearchLookupFieldsOptions) => search.lookupFields(searchData)
