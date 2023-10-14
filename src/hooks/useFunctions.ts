import { useContext } from 'react';

import { addCell, executeCell, getNotebookContent } from '../lib/jupyter';

import { ChatContext } from '@/app/chat/chat.provider';

export function useFunctions(): {
  functions: { [key: string]: (args: any) => Promise<unknown> };
} {
  const {
    state: { jupyterSettings, notebookSettings },
  } = useContext(ChatContext);

  async function addCellFunction({
    code,
    cell_type,
  }: {
    code: string;
    cell_type: 'code' | 'markdown';
  }): Promise<string> {
    console.log({code, cell_type})
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
    const result = await executeCell(
      content,
      content.cells.length - 1,
      notebookSettings,
      jupyterSettings,
    );
    return result as string;
  }

  async function updateCellFunction() {}

  return {
    functions: {
      add_cell: addCellFunction,
      update_cell: updateCellFunction,
    },
  };
}
