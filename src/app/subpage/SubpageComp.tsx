'use client';

import { useEffect, useState } from 'react';

function SubpageComp() {
  const [messages, setMessages] = useState(null);
  const conversation_id = 'fef6c0e1-78fa-4858-8cd9-f2697c82adc0'; // Replace with actual conversation_id

  useEffect(() => {
    setTimeout(async () => {
      const res = await fetch(`/api/conversations/${conversation_id}/messages`);
      const data = await res.json();
      setMessages(data);
    }, 2000);
  }, []);

  if (!messages) {
    return <div>Loading...</div>;
  }

  return <div>{JSON.stringify(messages)}</div>;
}

export default SubpageComp;
