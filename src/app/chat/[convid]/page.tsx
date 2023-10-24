import ChatHome from '../ChatHome';

export default async function ChatHomePage({
  params,
}: {
  params: { convid: string };
}) {
  return <ChatHome />;
}
