import { HfInference } from '@huggingface/inference'

export const inference = new HfInference(process.env.HF_ACCESS_TOKEN)
