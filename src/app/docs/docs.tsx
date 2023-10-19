// import { Message } from '@/types/chat';
// import { StaticChatMessage } from './StaticChatMessage';
// import { loadDemoConversation } from '@/lib/api';
import ReactMarkdown from 'react-markdown';

export async function Docs() {
  //   const messages: Message[] = await loadDemoConversation();
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
      <div
        className="flex flex-column items-center justify-center min-h-screen"
        style={{
          paddingTop: '140px',
        }}
      >
        <h2
          className="title feature-content"
          style={{
            marginLeft: '16px',
            marginRight: '16px',
            marginBottom: '60px',
            textAlign: 'center',
            fontSize: '2rem',
            fontFamily: 'var(--tg-heading-font-family)',
            color: 'var(--tg-heading-font-color)',
            marginTop: '0px',
            fontStyle: 'normal',
            lineHeight: 'var(--tg-heading-line-height)',
            fontWeight: 'var(--tg-heading-font-weight)',
            textTransform: 'inherit',
          }}
        ></h2>
        <div
          className="w-full max-w-2xl mx-auto overflow-hidden dark shadow-2xl rounded-lg"
          style={{ marginBottom: '150px' }}
        >
          <ReactMarkdown>## Hello there </ReactMarkdown>
          {/* <p>Hello there</p> */}
          {/* {messages.map((message, index) => {
            return <StaticChatMessage key={message.id} message={message} />;
          })} */}
        </div>
      </div>
    </section>
  );
}

// font-size: 70px;
// letter-spacing: -0.01em;
// width: 90%;
// margin: 0 auto 30px;
