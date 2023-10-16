export interface JupyterGlobalSettings {
  host: string;
  port: string;
  serverToken: string;
  notebookFolderPath: string;
}

export interface JupyterConversationSettings {
  conversation_id: string;
  notebook_path: string;
  notebook_name: string;
  kernel_id: string;
  session_id: string;
}
// Fetch notebook content
export async function testConnection(settings: JupyterGlobalSettings) {
  try {
    const response = await fetch(
      `http://${settings.host}:${settings.port}/api/contents/${settings.notebookFolderPath}?token=${settings.serverToken}`,
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error fetching notebooks folder:', error);
    return false;
  }
}

export async function getAvailableNotebookOptions(
  settings: JupyterGlobalSettings,
) {
  const [notebooks, kernels, sessions] = await Promise.all([
    getAvailableNotebooks(settings),
    getAvailableKernels(settings),
    getAvailableSessions(settings),
  ]);
  return { notebooks, kernels, sessions };
}

export async function getAvailableNotebooks(settings: JupyterGlobalSettings) {
  try {
    const notebooksResponse = await fetch(
      `http://${settings.host}:${settings.port}/api/contents/${settings.notebookFolderPath}?token=${settings.serverToken}`,
    );
    const data = await notebooksResponse.json();
    console.log({ notebooks: data });
    data.content.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
    return data.content;
  } catch (error) {
    console.error('Error fetching notebooks:', error);
    return false;
  }
}

export async function getAvailableKernels(settings: JupyterGlobalSettings) {
  try {
    const kernelsResponse = await fetch(
      `http://${settings.host}:${settings.port}/api/kernels?token=${settings.serverToken}`,
    );
    const data = await kernelsResponse.json();
    console.log({ kernels: data });
    return data;
  } catch (error) {
    console.error('Error fetching kernels:', error);
    return false;
  }
}

export async function getAvailableSessions(settings: JupyterGlobalSettings) {
  try {
    const sessionsResponse = await fetch(
      `http://${settings.host}:${settings.port}/api/sessions?token=${settings.serverToken}`,
    );
    const data = await sessionsResponse.json();
    console.log({ sessions: data });
    return data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return false;
  }
}

export async function getNotebookContent(
  notebookPath: string,
  settings: JupyterGlobalSettings,
) {
  try {
    const response = await fetch(
      `http://${settings.host}:${settings.port}/api/contents/${notebookPath}?token=${settings.serverToken}`,
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error fetching notebook:', error);
    return null;
  }
}

export async function updateNotebookContent(
  notebookPath: string,
  content: any,
  settings: JupyterGlobalSettings,
) {
  try {
    const response = await fetch(
      `http://${settings.host}:${settings.port}/api/contents/${notebookPath}?token=${settings.serverToken}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          type: 'notebook',
        }),
      },
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating notebook:', error);
  }
}

export async function addCell(
  notebookPath: string,
  content: any,
  cellSource: string,
  cellType: 'code' | 'markdown',
  settings: JupyterGlobalSettings,
) {
  const newCell = {
    cell_type: cellType,
    execution_count: 0,
    metadata: { trusted: true },
    outputs: [],
    source: cellSource,
  };
  content.cells.push(newCell);
  await updateNotebookContent(notebookPath, content, settings);
}

let lastTaskPromise = Promise.resolve(); // Start with a resolved promise

function queueTask(task: any) {
  lastTaskPromise = lastTaskPromise.then(task).catch(task);
}

export async function executeCell(
  content: any,
  cellIndex: number,
  convSettings: JupyterConversationSettings,
  settings: JupyterGlobalSettings,
) {
  const responseCache = {
    result: '',
  };
  return new Promise((resolve) => {
    // reset output
    content.cells[cellIndex].outputs = [];
    queueTask(
      updateNotebookContent(convSettings.notebook_path, content, settings),
    );
    const ws = new WebSocket(
      `ws://${settings.host}:${settings.port}/api/kernels/${convSettings.kernel_id}/channels?token=${settings.serverToken}`,
    );
    ws.addEventListener('open', function open() {
      const executeRequest = {
        header: {
          msg_id: `execute_${new Date().getTime()}`,
          username: '',
          session: convSettings.session_id,
          msg_type: 'execute_request',
          version: '5.2',
        },
        parent_header: {
          session: convSettings.session_id,
        },
        metadata: { trusted: true },
        content: {
          code: content.cells[cellIndex].source,
          silent: false,
          store_history: true,
          user_expressions: {},
          allow_stdin: false,
        },
      };

      ws.send(JSON.stringify(executeRequest));
    });

    ws.addEventListener('end', function incoming() {
      console.log('END');
    });

    ws.addEventListener('error', function incoming(err) {
      console.log('jupyter ws ERROR');
    });

    ws.addEventListener('message', function incoming(event) {
      console.log({ event });
      // data.
      const m = JSON.parse(event.data.toString());
      // console.log('MESSAGE', m);
      if (m.msg_type == 'execute_result') {
        content.cells[cellIndex].outputs.push({
          output_type: 'execute_result',
          metadata: {},
          execution_count: 1,
          data: {
            ...m.content.data,
          },
        });
        queueTask(
          updateNotebookContent(convSettings.notebook_path, content, settings),
        );
        responseCache.result = m.content.data['text/plain'];
      } else if (m.msg_type == 'stream') {
        content.cells[cellIndex].outputs.push({
          name: 'stdout',
          output_type: 'stream',
          text: m.content.text + '',
        });
        queueTask(
          updateNotebookContent(convSettings.notebook_path, content, settings),
        );
        responseCache.result += m.content.text;
      } else if (m.msg_type == 'execute_reply') {
        resolve(responseCache.result);
        ws.close();
      } else {
        console.log('unknown message type');
        console.log({ m });
      }
    });
  });
}
