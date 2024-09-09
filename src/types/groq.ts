export interface GroqModel {
    id: string;
    name: string;
    maxLength: number; // maximum length of a message
    tokenLimit: number;
}

export enum GroqModelID {
    LLAMA3_8_B = 'llama3-8b-8192',
    LLAMA3_70_B = 'llama3-70b-8192',
    // MIXTRAL = 'mixtral-8x7b-32768',
    // GEMMA = 'gemma-7b-it',
}


export const GroqModels: Record<GroqModelID, GroqModel> = {
    [GroqModelID.LLAMA3_8_B]: {
        id: GroqModelID.LLAMA3_8_B,
        name: 'LLaMA3 8b',
        maxLength: 24000,
        tokenLimit: 8000,
    },
    [GroqModelID.LLAMA3_70_B]: {
        id: GroqModelID.LLAMA3_70_B,
        name: 'LLaMA3 70b',
        maxLength: 24000,
        tokenLimit: 8000,
    },
    // [GroqModelID.MIXTRAL]: {
    //     id: GroqModelID.MIXTRAL,
    //     name: 'Mixtral',
    //     maxLength: 24000,
    //     tokenLimit: 8000,
    // },
    // [GroqModelID.GEMMA]: {
    //     id: GroqModelID.GEMMA,
    //     name: 'Gemma',
    //     maxLength: 24000,
    //     tokenLimit: 8000,
    // },
};
