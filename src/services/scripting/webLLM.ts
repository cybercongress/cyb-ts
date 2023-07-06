/* eslint-disable no-underscore-dangle */
// import {
//   LLMEngine,
//   ResFromWorkerMessageEventData,
//   SendToWorkerMessageEventData,
// } from '@/types/web-llm';
import * as webllm from '@mlc-ai/web-llm';
// import { prebuiltAppConfig } from '@mlc-ai/web-llm/config';

import { GenerateProgressCallback, AppConfig } from '@mlc-ai/web-llm/types';
import Worker from 'worker-loader!src/services/scripting/worker.ts';

const chatOpts = {
  repetition_penalty: 1.01,
};

const prebuiltAppConfig: AppConfig = {
  model_list: [
    {
      model_url:
        'https://huggingface.co/mlc-ai/mlc-chat-RedPajama-INCITE-Chat-3B-v1-q4f32_0/resolve/main/',
      local_id: 'RedPajama-INCITE-Chat-3B-v1-q4f32_0',
    },
    {
      model_url:
        'https://huggingface.co/mlc-ai/mlc-chat-vicuna-v1-7b-q4f32_0/resolve/main/',
      local_id: 'vicuna-v1-7b-q4f32_0',
    },
  ],
  model_lib_map: {
    'vicuna-v1-7b-q4f32_0':
      'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/vicuna-v1-7b-q4f32_0-webgpu.wasm',
    'RedPajama-INCITE-Chat-3B-v1-q4f32_0':
      'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1-q4f32_0-webgpu.wasm',
  },
};

export type BotConfig = {
  name: string;
  model: string;
  params: string;
};

class WebLLM {
  private _worker?: Worker = undefined;

  private _chat?: webllm.ChatWorkerClient = undefined;

  private isInitialized = false;

  private _config: BotConfig = {} as BotConfig;

  public get config() {
    return this._config;
  }

  constructor() {
    this._worker = new Worker();
    this._chat = new webllm.ChatWorkerClient(this._worker);
    this.loadConfig();
  }

  private loadConfig() {
    const config = localStorage.getItem('chat_bot_config');
    this._config = config
      ? (JSON.parse(config) as BotConfig)
      : {
          name: 'Trotsky Bot',
          model:
            'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/vicuna-v1-7b-q4f32_0-webgpu.wasm',
          params:
            'https://huggingface.co/mlc-ai/mlc-chat-vicuna-v1-7b-q4f32_0/resolve/main/',
        };
  }

  public updateConfig(config: BotConfig) {
    this._config = config;
    localStorage.setItem('chat_bot_config', JSON.stringify(config));
  }

  public async load(
    progressCallback?: (report: webllm.InitProgressReport) => void
  ): Promise<void> {
    this._chat?.setInitProgressCallback((report: webllm.InitProgressReport) => {
      console.log('Init model', report, report.text);
      progressCallback?.(report);
    });

    await this._chat?.reload('vicuna-v1-7b-q4f32_0');

    // const { name, params, model } = this._config;
    // await this._chat?.reload(
    //   // 'vicuna-v1-7b-q4f32_0',
    //   name,
    //   chatOpts,
    //   {
    //     model_list: [
    //       {
    //         model_url: model,
    //         local_id: name,
    //       },
    //     ],
    //     model_lib_map: { [name]: params },
    //   }
    // );

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
    progressCallback?: GenerateProgressCallback
  ): Promise<string> {
    if (!this.isInitialized || !this._chat) {
      throw new Error('WebLLM not initialized');
    }

    const generateProgressCallback = (step: number, message: string) => {
      console.log('generate', step, message);
      progressCallback?.(step, message);
    };

    console.log('------chat', this._chat, prompt);
    // const prompt0 = 'What is the capital of Canada?';
    const reply = await this._chat.generate(prompt, generateProgressCallback);
    return reply;
  }

  public async resetChat(): Promise<void> {
    await this._chat?.resetChat();
  }

  public async interruptGenerate() {
    await this._chat?.interruptGenerate();
  }

  public async getChatHistory(): Promise<string[]> {
    throw new Error('Not implemented');
  }

  public async runtimeStatsText(): Promise<string | undefined> {
    return this._chat?.runtimeStatsText();
  }
}

const WebLLMInstance = new WebLLM();
window.webLLM = WebLLMInstance;
export { WebLLMInstance };
