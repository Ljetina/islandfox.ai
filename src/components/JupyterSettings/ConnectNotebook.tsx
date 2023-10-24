import React, { useCallback, useContext, useEffect, useState } from 'react';

import Spinner from '../Spinner/Spinner';
import styles from './ConnectNotebook.module.css';

import { ChatContext } from '@/app/chat/chat.provider';
import { Session, getAvailableSessions } from '@/lib/jupyter';

interface ConversationSettingsProps {}

const ConnectNotebook: React.FC<ConversationSettingsProps> = ({}) => {
  const {
    state: { jupyterSettings, notebookSettings },
    saveNotebookSettings,
  } = useContext(ChatContext);

  const [isConnectingNotebook, setIsConnectingNotebook] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | undefined>(
    undefined,
  );

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedSession(
      sessions.find((s) => s.id === notebookSettings?.session_id),
    );
  }, [notebookSettings, sessions]);

  useEffect(() => {
    if (jupyterSettings.host !== '' && isConnectingNotebook) {
      const settings = jupyterSettings;
      getAvailableSessions(settings).then(setSessions);
    }
  }, [jupyterSettings, isConnectingNotebook]);
  const handleSessionChange = useCallback(
    (event: any) => {
      const id = event.target.value;
      const foundSession = sessions.find((s) => s.id === id);

      setSelectedSession(foundSession);
    },
    [sessions, setSelectedSession],
  );

  const onSave = useCallback(async () => {
    try {
      setIsSaving(true);
      await saveNotebookSettings({
        kernelId: selectedSession?.kernelId || '',
        sessionId: selectedSession?.id || '',
        notebookName: selectedSession?.notebookName || '',
        notebookPath: selectedSession?.path || '',
      });
      setIsConnectingNotebook(false);
    } catch (e) {
      console.error('error saving notebook settings');
    } finally {
      setIsSaving(false);
    }
  }, [selectedSession, setIsSaving]);

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
        <div className={styles.connectNotebook}>
          <p>
            Connect this conversation to an active notebook session on a Jupyter
            server. Please refer to the <a href="/docs">documentation</a> for
            more details.
          </p>

          <div className='mt-8'>
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
                  {session.notebookName + ' ' + session.kernelName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end mt-16">
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
        </div>
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
