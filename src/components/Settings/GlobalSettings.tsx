import React, { FC, useCallback, useContext, useEffect, useState } from 'react';

import Spinner from '../Spinner';

import { ChatContext } from '@/app/chat/chat.provider';
import { JupyterGlobalSettings } from '@/lib/jupyter';

interface Props {
  open: boolean;
  onClose: () => any;
  onSave: () => any;
}

const SettingDialog: FC<Props> = ({ open, onClose, onSave }) => {
  const {
    setNotebookSettings,
    state: { jupyterSettings },
  } = useContext(ChatContext);
  const [settings, setSettings] =
    useState<JupyterGlobalSettings>(jupyterSettings);

  useEffect(() => {
    setSettings(jupyterSettings);
  }, [jupyterSettings, setSettings]);

  const [isSaving, setIsSaving] = useState(false);
  const [canConnect, setCanConnect] = useState(true);

  const handleSave = useCallback(async () => {
    setCanConnect(true);
    setIsSaving(true);
    const testConnectionResult = await setNotebookSettings({
      host: settings.host,
      port: settings.port,
      serverToken: settings.serverToken,
      notebookFolderPath: settings.notebookFolderPath,
    });
    if (testConnectionResult) {
      setIsSaving(false);
      setCanConnect(true);
      onClose();
    } else {
      setIsSaving(false);
      setCanConnect(false);
    }
  }, [setIsSaving, setCanConnect, onClose, settings]);

  const handleChange = useCallback(
    (e: any) => {
      const { name, value } = e.target;
      setSettings((prevSettings) => ({
        ...prevSettings,
        [name]: value,
      }));
    },
    [setSettings],
  );

  const handleInsideClick = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={`${
        open ? 'block' : 'hidden'
      } fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white w-96 p-6 rounded shadow"
        onClick={handleInsideClick}
      >
        <h2 className="text-2xl font-bold mb-4">Jupyter Settings</h2>
        {!canConnect && (
          <div className="bg-red-500 text-white p-2 mb-4 rounded">
            Failed to connect with the current settings. Please check your
            inputs.
          </div>
        )}
        <div className="mb-2">
          <label className="block text-sm mb-1 text-white" htmlFor="host">
            Host:
          </label>
          <input
            className="w-full border border-gray-300 rounded p-2 bg-gray-700 text-white"
            type="text"
            name="host"
            value={settings.host}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm mb-1 text-white" htmlFor="port">
            Port:
          </label>
          <input
            className="w-full border border-gray-300 rounded p-2 bg-gray-700 text-white"
            type="text"
            name="port"
            value={settings.port}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label
            className="block text-sm mb-1 text-white"
            htmlFor="serverToken"
          >
            Server Token:
          </label>
          <input
            className="w-full border border-gray-300 rounded p-2 bg-gray-700 text-white"
            type="text"
            name="serverToken"
            value={settings.serverToken}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label
            className="block text-sm mb-1 text-white"
            htmlFor="notebookFolderPath"
          >
            Notebook Folder Path:
          </label>
          <input
            className="w-full border border-gray-300 rounded p-2 bg-gray-700 text-white"
            type="text"
            name="notebookFolderPath"
            value={settings.notebookFolderPath}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end mt-4">
          {isSaving ? (
            <Spinner />
          ) : (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
              onClick={handleSave}
            >
              Save
            </button>
          )}
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingDialog;
