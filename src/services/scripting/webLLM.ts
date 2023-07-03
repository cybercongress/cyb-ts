// import {
//   LLMEngine,
//   ResFromWorkerMessageEventData,
//   SendToWorkerMessageEventData,
// } from '@/types/web-llm';
import * as webllm from '@mlc-ai/web-llm';
import Worker from 'worker-loader!src/services/scripting/worker.ts';

// const prebuiltAppConfig = {
//   model_list: [
//       {
//           "model_url": "https://huggingface.co/mlc-ai/mlc-chat-RedPajama-INCITE-Chat-3B-v1-q4f32_0/resolve/main/",
//           "local_id": "RedPajama-INCITE-Chat-3B-v1-q4f32_0"
//       },
//       {
//           "model_url": "https://huggingface.co/mlc-ai/mlc-chat-vicuna-v1-7b-q4f32_0/resolve/main/",
//           "local_id": "vicuna-v1-7b-q4f32_0"
//       }
//   ],
//   model_lib_map: {
//       "vicuna-v1-7b-q4f32_0": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/vicuna-v1-7b-q4f32_0-webgpu.wasm",
//       "RedPajama-INCITE-Chat-3B-v1-q4f32_0": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1-q4f32_0-webgpu.wasm"
//   }
// };
class WebLLM {
  private _worker?: Worker = undefined;
  private _chat?: webllm.ChatWorkerClient = undefined;
  private isInitialized = false;

  constructor() {
    this._worker = new Worker();
    this._chat = new webllm.ChatWorkerClient(this._worker);
  }

  public async load(
    progressCallback?: (report: webllm.InitProgressReport) => void
  ): Promise<void> {
    this._chat?.setInitProgressCallback((report: webllm.InitProgressReport) => {
      console.log('Init model', report, report.text);
      progressCallback?.(report);
    });

    await this._chat?.reload('vicuna-v1-7b-q4f32_0');
    this.isInitialized = true;
  }

  public async unload() {
    await this._chat?.unload();
  }

  public async destroy(): Promise<void> {
    this.isInitialized = false;
    await this._chat?.unload();
    this._worker?.terminate();
  }

  public async chat(
    prompt: string,
    progressCallback?: Function
  ): Promise<string> {
    if (!this.isInitialized || !this._chat) {
      throw new Error('WebLLM not initialized');
    }

    const generateProgressCallback = (_step: number, message: string) => {
      console.log('generate-label', message);
    };

    // const prompt0 = 'What is the capital of Canada?';
    const reply = await this._chat.generate(prompt, generateProgressCallback);
    return reply;
  }

  public async resetChat(): Promise<void> {
    await this._chat?.resetChat();
  }

  public async getChatHistory(): Promise<string[]> {
    throw new Error('Not implemented');
  }

  public async runtimeStatsText(): Promise<string | undefined> {
    return await this._chat?.runtimeStatsText();
  }
}

const WebLLMInstance = new WebLLM();
export { WebLLMInstance };
