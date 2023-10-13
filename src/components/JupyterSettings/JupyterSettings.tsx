import React, { useState } from 'react';

const JupyterSettingsForm = () => {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [serverToken, setServerToken] = useState('');
  const [notebooksFolderPath, setNotebooksFolderPath] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Make API call to update Jupyter settings
    // Include the form inputs in the request body
    const formData = {
      host,
      port,
      serverToken,
      notebooksFolderPath,
    };

    // Reset the form fields after submitting
    setHost('');
    setPort('');
    setServerToken('');
    setNotebooksFolderPath('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="host"
          >
            Host:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="host"
            type="text"
            placeholder="Enter host"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="port"
          >
            Port:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="port"
            type="text"
            placeholder="Enter port"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="serverToken"
          >
            Server Token:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="serverToken"
            type="text"
            placeholder="Enter server token"
            value={serverToken}
            onChange={(e) => setServerToken(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="notebooksFolderPath"
          >
            Notebooks Folder Path:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="notebooksFolderPath"
            type="text"
            placeholder="Enter notebooks folder path"
            value={notebooksFolderPath}
            onChange={(e) => setNotebooksFolderPath(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Update Jupyter Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default JupyterSettingsForm;
