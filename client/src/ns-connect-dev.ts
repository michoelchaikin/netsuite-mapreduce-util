import crypto from "crypto-js"
import qs from "qs"
import * as R from "ramda"

const {
  VUE_APP_NS_ACCOUNT_ID,
  VUE_APP_NS_TOKEN_ID,
  VUE_APP_NS_TOKEN_SECRET,
  VUE_APP_NS_CONSUMER_KEY,
  VUE_APP_NS_CONSUMER_SECRET,
} = process.env
// var NS_DEPLOYMENT_ID = '1'
const restletURL = `https://${VUE_APP_NS_ACCOUNT_ID.replace(
  "_",
  "-"
).toLowerCase()}.restlets.api.netsuite.com/app/site/hosting/restlet.nl`

const oauth = (req: any) => {
  const HTTP_METHOD = req.method.toUpperCase()
  const query = qs.parse(req.url.split("?")[1])

  const OAUTH_VERSION = "1.0"
  const OAUTH_NONCE = getNonce(32)
  const TIME_STAMP = Math.round(+new Date() / 1000)

  let unsortedData: any = {
    ...{
      oauth_consumer_key: VUE_APP_NS_CONSUMER_KEY,
      oauth_nonce: OAUTH_NONCE,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: TIME_STAMP,
      oauth_token: VUE_APP_NS_TOKEN_ID,
      oauth_version: OAUTH_VERSION,
    },
    ...query,
  }

  const sortedPairs = R.pipe(
    R.toPairs,
    R.sortBy((a) => a[0])
  )(unsortedData) as any[][]

  const data = qs.stringify(R.zipObj(R.map(R.nth(0), sortedPairs), R.map(R.nth(1), sortedPairs)))

  const crpt = crypto as any
  const completeData = HTTP_METHOD + "&" + encodeURIComponent(restletURL) + "&" + encodeURIComponent(data)
  const hmac = crpt.algo.HMAC.create(crypto.algo.SHA1, VUE_APP_NS_CONSUMER_SECRET + "&" + VUE_APP_NS_TOKEN_SECRET)
    .update(completeData)
    .finalize()
  const oauth_signature = encodeURIComponent(crypto.enc.Base64.stringify(hmac))

  return (
    `OAuth realm="${VUE_APP_NS_ACCOUNT_ID.replace("-", "_").toUpperCase()}",` +
    `oauth_token="${VUE_APP_NS_TOKEN_ID}",` +
    `oauth_consumer_key="${VUE_APP_NS_CONSUMER_KEY}",` +
    `oauth_nonce="${OAUTH_NONCE}",` +
    `oauth_timestamp="${TIME_STAMP}",` +
    `oauth_signature_method="HMAC-SHA1",` +
    `oauth_version="${OAUTH_VERSION}",` +
    `oauth_signature="${oauth_signature}"`
  )
}

//Get unique Value to be pass in header
function getNonce(length: number) {
  let text = ""
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export default oauth
