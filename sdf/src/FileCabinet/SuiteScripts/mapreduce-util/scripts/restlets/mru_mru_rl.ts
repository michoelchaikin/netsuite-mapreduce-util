/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@NModuleScope Public
 */

import * as log from "N/log"
import { EntryPoints } from "N/types"
import * as R from "../../libs/ramda.js"
import * as allActions from "../actions/index"
import { errorResponse, succResponse } from "../../utils/index"

const onRequest = (p) => {
  try {
    const action = getAction(p.action)
    return succResponse(action(p))
  } catch (e) {
    log.error(`ACTION: ${p.action}`, JSON.stringify(e))

    const error = R.pathOr("", ["error"], e)
    const message = R.pathOr("", ["message"], e)

    return errorResponse(`ACTION: ${p.action}: ${error}`, message || e)
  }
}

const getAction = (action = "") => {
  const toLowerKey = (num, key) => R.assoc(key.toLowerCase(), num, {})

  const actions = R.compose(R.mergeAll, R.values, R.mapObjIndexed(toLowerKey))(allActions)
  const actionMatch = actions[action.toLowerCase()]

  if (!actionMatch || !action) return noActionFound(action)

  return actionMatch
}

const noActionFound = (action) => errorResponse(`Cannot find action ${action && ":" + action}`)

export let post: EntryPoints.RESTlet.post = onRequest
export let get: EntryPoints.RESTlet.get = onRequest
