export interface JupyterGlobalSettings {
  host: string;
  port: string;
  serverToken: string;
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
      `http://${settings.host}:${settings.port}/api/contents?token=${settings.serverToken}`,
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

export interface Session {
  id: string;
  kernelId: string;
  kernelName: string;
  path: string;
  notebookName: string;
}

async function recursivelyFetchNotebooks(
  settings: JupyterGlobalSettings,
  path = '',
  depth = 0,
) {
  const notebookResponse = await fetch(
    `http://${settings.host}:${settings.port}/api/contents/${path}?token=${settings.serverToken}`,
  );
  const notebookData = await notebookResponse.json();

  if (!notebookData.content || depth > 3) {
    return [];
  } else {
    let resList: any[] = [];
    for (const contentItem of notebookData.content) {
      if (contentItem.type === 'directory') {
        const dirData = await recursivelyFetchNotebooks(
          settings,
          contentItem.path,
          depth + 1,
        );
        console.log();
        // @ts-ignore
        resList = resList.concat(dirData);
      } else if (contentItem.type === 'notebook') {
        resList.push(contentItem);
      }
    }
    return resList;
  }
}

export async function getAvailableSessions(settings: JupyterGlobalSettings) {
  try {
    const notebooks = await recursivelyFetchNotebooks(settings, '', 0);
    const sessionsResponse = await fetch(
      `http://${settings.host}:${settings.port}/api/sessions?token=${settings.serverToken}`,
    );
    const data = await sessionsResponse.json();
    const sessions: Session[] = data.map((session: any) => {
      let regex = /^(.*?)-jvsc-/;
      let match = session.notebook.path.match(regex);
      let path = session.notebook.path;
      let name = session.notebook.name;

      if (match && match[1]) {
        let originalName = match[1] + '.ipynb';
        name = originalName + ' (from VS Code)';
        path = notebooks.find((n: any) => n.name == originalName).path;
        console.log(originalName);
      }

      return {
        id: session.id,
        path: path,
        kernelId: session.kernel.id,
        kernelName: session.kernel.name,
        notebookName: name,
      };
    });
    return sessions;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
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
    console.log(data.content);
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
      const m = JSON.parse(event.data.toString());
      if (m.msg_type == 'execute_result') {
        content.cells[cellIndex].execution_count += 1;
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
      } else if (m.msg_type == 'display_data') {
        content.cells[cellIndex].execution_count += 1;
        content.cells[cellIndex].outputs.push({
          output_type: 'display_data',
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
      } else {
        console.log('unknown message type');
        console.log({ m });
      }
    });
  });
}
