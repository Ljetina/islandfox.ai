import { useContext } from 'react';

import {
  addCell,
  executeCell,
  getNotebookContent,
  updateNotebookContent,
} from '../lib/jupyter';

import { ChatContext } from '@/app/chat/chat.provider';

function emitNotebookUpdate(sendMessage: (m: string) => void, content: any) {
  sendMessage(
    JSON.stringify({
      action: 'notebook_updated',
      text: JSON.stringify(
        content.cells.map(
          (c: { cell_type: string; source: string }, i: number) => ({
            cell_type: c.cell_type,
            source: c.source,
            index: i,
          }),
        ),
      ),
    }),
  );
}

export function useFunctions(): {
  functions: { [key: string]: (args: any) => Promise<unknown> };
} {
  const {
    state: { jupyterSettings, notebookSettings },
  } = useContext(ChatContext);

  async function addCellFunction({
    code,
    cell_type,
    sendMessage,
  }: {
    code: string;
    cell_type: 'code' | 'markdown';
    sendMessage: (message: string) => void;
  }): Promise<string> {
    if (!notebookSettings) {
      return 'unable to connect to notebook';
    }
    const content = await getNotebookContent(
      notebookSettings?.notebook_path as string,
      jupyterSettings,
    );
    await addCell(
      notebookSettings?.notebook_path as string,
      content,
      code,
      cell_type,
      jupyterSettings,
    );
    emitNotebookUpdate(sendMessage, content);

    const result = await executeCell(
      content,
      content.cells.length - 1,
      notebookSettings,
      jupyterSettings,
    );
    return 'Cell has been added. Output of execution: ' + result || '';
  }

  async function updateCellFunction({
    code,
    index,
    sendMessage,
  }: {
    code: string;
    index: number;
    sendMessage: (message: string) => void;
  }) {
    if (!notebookSettings) {
      return 'unable to connect to notebook';
    }
    const content = await getNotebookContent(
      notebookSettings?.notebook_path as string,
      jupyterSettings,
    );
    content.cells[index].source = code;
    content.cells[index].outputs = [];
    emitNotebookUpdate(sendMessage, content);
    await updateNotebookContent(
      notebookSettings.notebook_path,
      content,
      jupyterSettings,
    );
  }

  async function deleteCellFunction({
    index,
    sendMessage,
  }: {
    index: number;
    sendMessage: (message: string) => void;
  }) {
    if (!notebookSettings) {
      return 'unable to connect to notebook';
    }
    const content = await getNotebookContent(
      notebookSettings?.notebook_path as string,
      jupyterSettings,
    );
    // delete cell at index
    if (index >= 0 && index < content.cells.length) {
      content.cells.splice(index, 1);
      emitNotebookUpdate(sendMessage, content);
      await updateNotebookContent(
        notebookSettings.notebook_path,
        content,
        jupyterSettings,
      );
      return 'the cell has been deleted';
    } else {
      return `Invalid index: ${index}. No cell deleted.`;
    }
  }

  async function readCells({
    sendMessage,
  }: {
    sendMessage: (message: string) => void;
  }) {
    if (!notebookSettings) {
      return 'unable to connect to notebook';
    }

    const content = await getNotebookContent(
      notebookSettings?.notebook_path as string,
      jupyterSettings,
    );

    emitNotebookUpdate(sendMessage, content);
    return 'new content has been emitted';
  }

  return {
    functions: {
      add_cell: addCellFunction,
      update_cell: updateCellFunction,
      delete_cell: deleteCellFunction,
      read_cells: readCells,
    },
  };
}
