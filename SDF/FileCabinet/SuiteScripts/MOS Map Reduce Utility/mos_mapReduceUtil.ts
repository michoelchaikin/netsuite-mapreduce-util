/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */

import { EntryPoints } from 'N/types';

import * as search from 'N/search';
import * as ui from 'N/ui/serverWidget';
import * as file from 'N/file';
import * as error from 'N/error';
import * as runtime from 'N/runtime';
import * as task from 'N/task';
import * as format from 'N/format';

const ACTIONS = {
  showForm,
  getAsset,
  getDeployments,
  runScript,
  getInstances,
  getLogs,
};

export function onRequest(context: EntryPoints.Suitelet.onRequestContext) {
  try {
    const action = context.request.parameters.cust_action || 'showForm';

    if (ACTIONS.hasOwnProperty(action)) {
      ACTIONS[action](context);
    } else {
      context.response.write(`Invalid action ${action}`);
    }
  } catch (err) {
    context.response.write(JSON.stringify(err));
  }
}

function showForm(context: EntryPoints.Suitelet.onRequestContext) {
  const form = ui.createForm({ title: 'Map Reduce Util' });
  const url =
    '/app/site/hosting/scriptlet.nl?script=customscript_mos_mapreduceutil_sl&deploy=customdeploy_mos_mapreduceutil_sl&cust_action=getAsset&cust_asset=index.html';

  form.addField({
    id: 'content',
    label: 'Content',
    type: ui.FieldType.INLINEHTML,
  }).defaultValue = `<iframe src="${url}" style="display: block; height: 73vh; width: 100%; border: none;"></iframe>`;
  context.response.writePage(form);
}

function getScriptFileId(scriptId) {
  const results = search
    .create({
      type: 'script',
      filters: ['scriptid', search.Operator.IS, scriptId],
      columns: ['scriptfile'],
    })
    .run()
    .getRange({ start: 0, end: 1 });

  if (results.length !== 1) {
    throw error.create({
      name: 'MOS_MAP_REDUCE_UTIL',
      message: 'Unable to determine script file id',
    });
  }

  return results[0].getValue({ name: 'scriptfile' });
}

function getCurrentScriptFilePath() {
  const scriptId = runtime.getCurrentScript().id;
  const scriptFileId = getScriptFileId(scriptId);
  // @ts-ignore
  const scriptFile = file.load({ id: scriptFileId });
  return scriptFile.path;
}

function getCurrentScriptFolderPath() {
  const scriptFilePath = getCurrentScriptFilePath();
  const lastSlash = scriptFilePath.lastIndexOf('/');
  return scriptFilePath.substring(0, lastSlash);
}

function getAsset(context: EntryPoints.Suitelet.onRequestContext) {
  const assetFileName = context.request.parameters.cust_asset;
  const scriptFolderPath = getCurrentScriptFolderPath();
  const assetFile = file.load({
    id: `${scriptFolderPath}/assets/${assetFileName}`,
  });
  context.response.write(assetFile.getContents());
}

function getDeployments(context: EntryPoints.Suitelet.onRequestContext) {
  const results = [];

  search
    .create({
      type: search.Type.SCRIPT_DEPLOYMENT,
      filters: [
        ['script.scripttype', search.Operator.ANYOF, 'MAPREDUCE'],
        'AND',
        ['isdeployed', search.Operator.IS, 'T'],
      ],
      columns: [
        'title',
        'scriptid',
        search.createColumn({ name: 'scriptid', join: 'script' }),
      ],
    })
    .run()
    .each(result => {
      results.push({
        text: result.getValue({ name: 'title' }),
        value: {
          scriptId: result.getValue({ name: 'scriptid', join: 'script' }),
          deploymentId: result.getValue({ name: 'scriptid' }),
          deploymentInternalID: result.id,
        },
      });

      return true;
    });

  context.response.write(JSON.stringify(results));
}

function runScript(context: EntryPoints.Suitelet.onRequestContext) {
  const payload = JSON.parse(context.request.body);

  const taskId = task
    .create({
      taskType: task.TaskType.MAP_REDUCE,
      scriptId: payload.scriptId,
      deploymentId: payload.deploymentId,
    })
    .submit();

  const status = task.checkStatus({ taskId });

  context.response.write({ output: JSON.stringify({ taskId, status }) });
}

function convertPacificDateToEpoch(date) {
  const dateObj = format.parse({
    value: date,
    type: format.Type.DATETIMETZ,
    timezone: format.Timezone.AMERICA_LOS_ANGELES,
  });

  // @ts-ignore
  return typeof dateObj.getTime === 'function' ? dateObj.getTime() : null;
}

function getRecentTasks(deploymentId) {
  const results = [];

  let count = 0;

  search
    .create({
      type: search.Type.SCHEDULED_SCRIPT_INSTANCE,
      filters: [
        ['scriptdeployment.internalid', search.Operator.ANYOF, deploymentId],
      ],
      columns: [
        search.createColumn({
          name: 'taskid',
          summary: search.Summary.GROUP,
        }),
        search.createColumn({
          name: 'datecreated',
          summary: search.Summary.MIN,
          sort: search.Sort.DESC,
        }),
      ],
    })
    .run()
    .each(result => {
      const taskId = result.getValue({
        name: 'taskid',
        summary: search.Summary.GROUP,
      });
      results.push(taskId);
      return ++count < 5;
    });

  return results;
}

function getTasksStageDetails(taskIds: string[]) {
  const results = {};

  const filters = [];

  taskIds.forEach((taskId, index) => {
    filters.push(['taskid', search.Operator.IS, taskId]);
    if (index < taskIds.length - 1) {
      filters.push('OR');
    }
  });

  search
    .create({
      type: search.Type.SCHEDULED_SCRIPT_INSTANCE,
      filters,
      columns: [
        'taskid',
        'datecreated',
        'status',
        'percentcomplete',
        'mapreducestage',
        'startdate',
        'enddate',
      ],
    })
    .run()
    .each(result => {
      const taskId = String(result.getValue({ name: 'taskid' }));

      if (!results.hasOwnProperty(taskId)) {
        results[taskId] = [];
      }

      results[taskId].push({
        stage: result.getValue({ name: 'mapreducestage' }),
        dateCreated: convertPacificDateToEpoch(
          result.getValue({ name: 'datecreated' })
        ),
        startDate: convertPacificDateToEpoch(
          result.getValue({ name: 'startdate' })
        ),
        endDate: convertPacificDateToEpoch(
          result.getValue({ name: 'enddate' })
        ),
        status: result.getValue({ name: 'status' }),
        percentComplete: result.getValue({ name: 'percentcomplete' }),
      });

      return true;
    });

  return results;
}

function getInstances(context: EntryPoints.Suitelet.onRequestContext) {
  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();

  const stagesSortOrder = {
    'Get Input Data': 1,
    Map: 2,
    Reduce: 3,
    Shuffle: 4,
    Summarize: 5,
  };

  const payload = JSON.parse(context.request.body);

  const results = {};

  const recentTasks = getRecentTasks(payload.deploymentInternalID);
  const stageDetails = getTasksStageDetails(recentTasks);

  const tasks = recentTasks.map(taskId => {
    const status = <task.MapReduceScriptTaskStatus>task.checkStatus(taskId);
    const stages = stageDetails[taskId].sort(
      (a, b) => stagesSortOrder[a.stage] - stagesSortOrder[b.stage]
    );

    return {
      taskId,
      dateCreated: stages[0].dateCreated,
      startDate: stages[0].startDate,
      endDate: stages[stages.length - 1].endDate,
      percentComplete: status.getPercentageCompleted(),
      status: capitalize(String(status.status)),
      currentStage: capitalize(String(status.stage)),
      stages,
    };
  });

  context.response.write(JSON.stringify(tasks, null, 2));
}

function getLogs(context: EntryPoints.Suitelet.onRequestContext) {
  const payload = JSON.parse(context.request.body);

  const results = [];

  search
    .create({
      type: 'scriptexecutionlog', // not in search.Type enum
      filters: [
        ['date', search.Operator.WITHIN, 'today'],
        'AND',
        [
          'scriptdeployment.internalid',
          search.Operator.ANYOF,
          payload.deploymentInternalID,
        ],
        'AND',
        ['internalidnumber', search.Operator.GREATERTHAN, payload.lastLogId],
      ],
      columns: [
        'type',
        'date',
        'time',
        'title',
        'detail',
        search.createColumn({
          name: 'internalid',
          sort: search.Sort.ASC,
        }),
      ],
    })
    .run()
    .each(result => {
      results.push({
        id: result.id,
        type: result.getValue({ name: 'type' }),
        date: result.getValue({ name: 'date' }),
        time: result.getValue({ name: 'time' }),
        title: result.getValue({ name: 'title' }),
        detail: result.getValue({ name: 'detail' }),
      });

      return true;
    });

  context.response.write(JSON.stringify(results));
}
