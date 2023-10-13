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
