import Axios from "axios"
import qs from "qs"
import { NSRequest } from "types/ns"

export const restlet = '/app/site/hosting/restlet.nl?script=customscript_mru_mru_rl&deploy=1'

export const REST = {
  get: ({ action, data, errorPolicy }: NSRequest) =>
    (errorPolicy === "all" ? resolveReqAll : resolveReqNone)(
      Axios.get(`${restlet}&action=${action}${data ? "&" + qs.stringify(data) : ""}`)
    ),
  post: ({ action, data = {}, errorPolicy }: NSRequest) =>
    (errorPolicy === "all" ? resolveReqAll : resolveReqNone)(Axios.post(restlet, { ...data, action })),
}

export const resolveReqNone = async (deferred: Promise<any>): Promise<any> =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await deferred
      const data = tryParse(res.data)
      if (data.success) resolve(data.data as any)

      reject(data as any)
    } catch (e) {
      reject(e as any)
    }
  })

export const resolveReqAll = async (deferred: Promise<any>) => {
  try {
    const res = await deferred
    const data = tryParse(res.data)
    if (data.success) return { data: data.data, error: null }

    return { data: null, error: data }
  } catch (e) {
    return { data: null, error: e }
  }
}

export function tryParse(data: any) {
  try {
    const parsedData = JSON.parse(data)
    return parsedData
  } catch (e) {
    return data
  }
}
