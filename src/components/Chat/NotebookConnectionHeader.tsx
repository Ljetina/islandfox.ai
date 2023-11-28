import { FC, useCallback, useContext, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { useEvent } from '@/hooks/useEvents';

import { ChatContext } from '@/app/chat/chat.provider';

interface Props {}

export const NotebookConnectionHeader: FC<Props> = ({}) => {
  const {
    state: { notebookSettings, jupyterSettings },
  } = useContext(ChatContext);

  const { lastMessage, readyState } = useWebSocket(
    `ws://${jupyterSettings.host}:${jupyterSettings.port}/api/kernels/${notebookSettings?.kernel_id}/channels?token=${jupyterSettings.serverToken}`,
    {},
    !!notebookSettings?.kernel_id && !!jupyterSettings.serverToken,
  );

  const [notebookTokenSize, setNotebookTokenSize] = useState(0);
  const [notebookCellCount, setNotebookCellCount] = useState(0);
  const onNotebookCacheUpdate = useCallback(
    (update: { size: number; cells: number }) => {
      setNotebookTokenSize(update.size);
      setNotebookCellCount(update.cells);
    },

    [setNotebookTokenSize, setNotebookCellCount],
  );

  useEvent('notebook_cache', onNotebookCacheUpdate);

  const [kernelStatus, setKernelStatus] = useState('unknown');
  const [execResult, setExecResult] = useState(null);
  const [execHtml, setExecHtml] = useState(null);
  const [execError, setExecError] = useState(null);
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (lastMessage?.data) {
      const data = JSON.parse(lastMessage?.data);
      if (data.msg_type === 'status') {
        setKernelStatus(data.content.execution_state);
      } else if (data.msg_type === 'error') {
        setExecError(data.content);
      } else if (data.msg_type === 'execute_result') {
        if ('text/html' in data.content.data) {
          setExecHtml(data.content.data['text/html']);
        }
        if ('text/plain' in data.content.data) {
          setExecResult(data.content.data['text/plain']);
        }
      } else if (data.msg_type === 'display_data') {
        setImage(data.content.data['image/png']);
      }
    }
  }, [lastMessage]);

  if (!notebookSettings?.session_id) {
    return null;
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div className="overflow-auto mr-8 ml-8">
      <div className="flex justify-between items-center bg-gray-300 p-2 rounded-md my-2">
        <div className="text-sm text-gray-700">
          <span className="font-bold">Notebook cells:</span>{' '}
          <p>{notebookCellCount}</p>
        </div>
        <div className="text-sm text-gray-700">
          <span className={`font-bold`}>Tokens in notebook:</span>{' '}
          <p>
            <span
              className={
                notebookTokenSize > 3000 ? 'text-red-700' : 'text-gray-700'
              }
            >
              {notebookTokenSize}
            </span>{' '}
            / 3000
          </p>
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-bold">Kernel Status:</span>{' '}
          <p>{kernelStatus}</p>
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-bold">Server Connection:</span>{' '}
          <p>{connectionStatus}</p>
        </div>
      </div>
    </div>
  );
};
