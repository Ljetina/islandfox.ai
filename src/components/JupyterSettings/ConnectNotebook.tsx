import React, { useCallback, useContext, useEffect, useState } from 'react';

import Spinner from '../Spinner/Spinner';

import { ChatContext } from '@/app/chat/chat.provider';
import {
  getAvailableKernels,
  getAvailableNotebooks,
  getAvailableSessions,
} from '@/lib/jupyter';

interface ConversationSettingsProps {}

interface Notebook {
  path: string;
  name: string;
}

interface Kernel {
  id: string;
  name: string;
}

interface Session {
  id: string;
  name: string;
}

const ConnectNotebook: React.FC<ConversationSettingsProps> = ({}) => {
  const {
    state: { jupyterSettings, notebookSettings },
    saveNotebookSettings,
  } = useContext(ChatContext);

  const [isConnectingNotebook, setIsConnectingNotebook] = useState(false);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [kernels, setKernels] = useState<Kernel[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedNotebook, setSelectedNotebook] = useState<
    Notebook | undefined
  >(undefined);
  const [selectedKernel, setSelectedKernel] = useState<Kernel | undefined>(
    undefined,
  );
  const [selectedSession, setSelectedSession] = useState<Session | undefined>(
    undefined,
  );

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedKernel(
      kernels.find((k) => k.id === notebookSettings?.kernel_id),
    );
    setSelectedNotebook(
      notebooks.find((n) => n.path === notebookSettings?.notebook_path),
    );
    setSelectedSession(
      sessions.find((s) => s.id === notebookSettings?.session_id),
    );
  }, [notebookSettings, kernels, notebooks, sessions]);

  useEffect(() => {
    if (jupyterSettings.host !== '' && isConnectingNotebook) {
      const settings = jupyterSettings;

      getAvailableNotebooks(settings).then(setNotebooks);
      getAvailableKernels(settings).then(setKernels);
      getAvailableSessions(settings).then(setSessions);
    }
  }, [jupyterSettings, isConnectingNotebook]);

  const handleNotebookChange = useCallback(
    (event: any) => {
      const path = event.target.value;
      const foundBook = notebooks.find((n) => n.path === path);
      setSelectedNotebook(foundBook);
    },
    [notebooks, setSelectedNotebook],
  );

  const handleKernelChange = useCallback(
    (event: any) => {
      const id = event.target.value;
      const foundKernel = kernels.find((k) => k.id === id);
      setSelectedKernel(foundKernel);
    },
    [kernels, setSelectedKernel],
  );

  const handleSessionChange = useCallback(
    (event: any) => {
      const id = event.target.value;
      const foundSession = sessions.find((s) => s.id === id);
      console.log({ id, foundSession });
      setSelectedSession(foundSession);
    },
    [sessions, setSelectedSession],
  );

  const onSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await saveNotebookSettings({
        kernelId: selectedKernel?.id || '',
        sessionId: selectedSession?.id || '',
        notebookName: selectedNotebook?.name || '',
        notebookPath: selectedNotebook?.path || '',
      });
      setIsConnectingNotebook(false);
    } catch (e) {
      console.error('error saving notebook settings');
    } finally {
      setIsSaving(false);
    }
  }, [selectedKernel, selectedNotebook, selectedSession, setIsSaving]);

  const onClear = useCallback(async () => {
    try {
      setIsSaving(true);
      await saveNotebookSettings({});
      setIsConnectingNotebook(false);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return (
    <>
      {isConnectingNotebook ? (
        <>
          <p>Connect this conversation to a notebook on a Jupyter server</p>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Notebook
            </label>
            <select
              value={selectedNotebook?.path || ''}
              onChange={handleNotebookChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="" disabled>
                Select a notebook
              </option>
              {notebooks.map((notebook) => (
                <option key={notebook.path} value={notebook.path}>
                  {notebook.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Kernel
            </label>
            <select
              value={selectedKernel?.id || ''}
              onChange={handleKernelChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="" disabled>
                Select a kernel
              </option>
              {kernels.map((kernel) => (
                <option key={kernel.id} value={kernel.id}>
                  {kernel.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Session
            </label>
            <select
              value={selectedSession?.id || ''}
              onChange={handleSessionChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="" disabled>
                Select a session
              </option>
              {sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end mt-4">
            {isSaving ? (
              <Spinner />
            ) : (
              <>
                <button
                  onClick={() => setIsConnectingNotebook(false)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={onClear}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-2"
                >
                  Clear
                </button>
                <button
                  onClick={onSave}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Notebook Settings
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <button
          onClick={() => setIsConnectingNotebook(true)}
          className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <img
            src="/assets/img/logo/jupyter.png"
            height={45}
            width={45}
            alt="Jupyter Icon"
            className="inline-block mr-2"
          />
          {notebookSettings?.notebook_name
            ? notebookSettings.notebook_name
            : 'Connect to notebook'}
        </button>
      )}
    </>
  );
};

export default ConnectNotebook;
