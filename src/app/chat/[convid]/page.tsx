import { OpenAIModelID } from "@/types/openai";
import ChatHome from "../ChatHome";

export default function ChatHomePage({params}: {params: {convid: string}}) {
    return <ChatHome conversationId={params.convid} serverSideApiKeyIsSet={false} serverSidePluginKeysSet={false} defaultModelId={OpenAIModelID.GPT_3_5}/>
}