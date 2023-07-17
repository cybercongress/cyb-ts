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

type LLMParams = {
  name: string;
  modelUrl: string;
  paramsUrl: string;
};

type LLMParamsMap = {
  [id: string]: LLMParams;
};

const chatOpts = {
  repetition_penalty: 1.01,
};

class WebLLM {
  private _worker?: Worker = undefined;

  private _chat?: webllm.ChatWorkerClient = undefined;

  private isInitialized = false;

  private _config: AppConfig;

  public get config() {
    return this._config;
  }

  constructor() {
    this._worker = new Worker();
    this._chat = new webllm.ChatWorkerClient(this._worker);
  }

  public updateConfig(botList: LLMParamsMap) {
    const items = Object.values(botList);
    const model_lib_map = Object.fromEntries(
      items.map((i) => [i.name, i.modelUrl])
    );
    const model_list = items.map((i) => ({
      model_url: i.paramsUrl,
      local_id: i.name,
    }));

    this._config = { model_lib_map, model_list };
  }

  public async load(
    modelName: string,
    progressCallback?: (report: webllm.InitProgressReport) => void
  ): Promise<void> {
    this._chat?.setInitProgressCallback((report: webllm.InitProgressReport) => {
      console.log('Init model', report, report.text);
      progressCallback?.(report);
    });
    await this._chat?.reload(modelName, chatOpts, this.config);

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
export { WebLLMInstance, LLMParamsMap };
