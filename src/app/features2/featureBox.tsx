import { StaticChatMessage } from './StaticChatMessage';

import { loadDemoConversation } from '@/lib/db';

export async function FeaturesBox() {
  const messages = await loadDemoConversation();

  return (
    <section>
      {/* TODO Attempt to make the class work similar to the homepage to fix the shadow around the text */}
      {/* <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h2
              className="title ah-headline"
              style={{ textAlign: 'center', marginBottom: '30px' }}
            >
              GPT-4 combined with powerful always-on plugin
            </h2>
          </div>
        </div>
      </div> */}
      <div className="flex flex-column items-center justify-center min-h-screen">
        <h2
          className="title ah-headline"
          style={{
            marginTop: '205px',
            textAlign: 'center',
            marginBottom: '60px',
          }}
        >
          GPT-4 combined with powerful always-on plugins
        </h2>
        <div
          className="w-full max-w-2xl mx-auto overflow-hidden dark shadow-2xl rounded-lg"
          style={{ marginBottom: '150px' }}
        >
          {messages.map((message, index) => {
            return <StaticChatMessage key={message.id} message={message} />;
          })}
        </div>
      </div>
    </section>
  );
}
