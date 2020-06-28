/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 * @author Mayer Lench
 */

import * as search from "N/search"
import * as runtime from "N/runtime"
import * as file from "N/file"
import * as url from "N/url"
import * as R from "../libs/ramda.js"

export const getClient = () => {
  const STATIC_FOLDER_NAME =  runtime.getCurrentScript().getParameter({name:'custscript_mru_build_folder'}) as string
  const RESTLET_DEPLOYMENT =  runtime.getCurrentScript().getParameter({name:"custscript_mru_rl_deployment_id"}) as string
  const RESTLET_SCRIPT =  runtime.getCurrentScript().getParameter({name:"custscript_mru_rl_script_id"}) as string

  try {
    if (!STATIC_FOLDER_NAME || !RESTLET_DEPLOYMENT || !RESTLET_SCRIPT)
    throw "Please set all script parameters (REACT UNIQUE FOLDER NAME/ RESTLET DEPLOYMENTID / RESTLET SCRIPTID)"

    const files = getStaticFiles(STATIC_FOLDER_NAME)
    const htmlId = R.find(R.propEq("name", "index.html"), files).id
    const html = file
      .load({ id: htmlId })
      .getContents()
      //.replace("</body>", `<script> window.APP_RESTLET_ID = ${APP_RESTLET_ID}</script></body>`) no longer needed
      .replace(/\/static\/js\//g, "")
      .replace(/\/static\/css\//g, "")
      .replace(/\/js\//g, "")
      .replace(/\/css\//g, "")
      .replace(/\/manifest/, "manifest")
      .replace(/\/favicon/, "favicon")

    return R.reduce(
      (pre, cur) => {
        return (pre = replaceGlobally(pre, cur.name, cur.url))
      },
      html,
      files
    )
  } catch (e) {
    throw "Cannot load Client. Please contact app administrator"
  }
}

const replaceGlobally = (original, searchTxt, replaceTxt) => {
  const regex = new RegExp(searchTxt, "g")
  return original.replace(regex, replaceTxt)
}

const getStaticFiles = (folderName) => {
  var folderSearch = R.head(
    search
      .create({
        type: "folder",
        filters: [["name", "startswith", folderName]],
      })
      .run()
      .getRange({ start: 0, end: 1 })
  )

  return search
    .create({
      type: "file",
      filters: [["folder", "anyof", folderSearch.id]],
      columns: ["name", "url"],
    })
    .run()
    .getRange({ start: 0, end: 1000 })
    .map((m) => {
      return {
        id: m.id,
        name: m.getValue("name"),
        url: m.getValue("url"),
      }
    })
}

export function getUrls() {
  const RESTLET_DEPLOYMENT =  runtime.getCurrentScript().getParameter({name:"custscript_mru_rl_deployment_id"}) as string
  const RESTLET_SCRIPT =  runtime.getCurrentScript().getParameter({name:"custscript_mru_rl_script_id"}) as string
  //Getting urls like api or any other urls you would want for app start up
  //This is done here to avoid changing envrironments without having to rebuild app
  var api = url.resolveScript({
    scriptId: RESTLET_SCRIPT,
    deploymentId: RESTLET_DEPLOYMENT,
  })

  return [{ name: "api", url: api, ref: "api" }]
}