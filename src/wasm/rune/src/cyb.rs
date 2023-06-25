use rune::{ContextError, Module};
use js_sys::Promise;
use rune::runtime::{VmResult, Value as VmValue};
use wasm_bindgen::prelude::*;
use serde_json::Value as SerdeValue;
use crate::helpers::{map_to_rune_value, execute_promise};

#[wasm_bindgen(module = "/scripting.js")]
extern "C" {
    // fn js_detectCybContentType(mime: &str)-> String;
    fn js_getPassportByNickname(nickname: &str)-> Promise;
    fn js_promptToOpenAI(prompt: &str)-> Promise;
    fn js_getIpfsTextContent(cid: &str)-> Promise;
    fn js_cyberLinksFrom(cid: &str)-> Promise;
    fn js_cyberLinksTo(cid: &str)-> Promise;
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// pub fn detect_cyb_content_type(arg: &str) -> VmResult<String> {
//     let res = js_detectCybContentType(arg);
//      log(res.as_str());
//      VmResult::Ok(res)
//  }

pub async fn get_passport_by_nickname(nickname: &str) ->  VmResult<VmValue> {
    execute_promise(|| js_getPassportByNickname(nickname)).await
}

pub async fn open_ai_prompt(prompt: &str) ->  VmResult<VmValue> {
    execute_promise(|| js_promptToOpenAI(prompt)).await
}

pub async fn get_text_from_cid(cid: &str) ->  VmResult<VmValue> {
    execute_promise(|| js_getIpfsTextContent(cid)).await
}

pub async fn get_cyberlinks_from_cid(cid: &str) ->  VmResult<VmValue> {
    execute_promise(|| js_cyberLinksFrom(cid)).await
}

pub async fn get_cyberlinks_to_cid(cid: &str) ->  VmResult<VmValue> {
    execute_promise(|| js_cyberLinksTo(cid)).await
}

/// The wasm 'cyb' module.
pub fn module(params: SerdeValue) -> Result<Module, ContextError> {
    let mut module = Module::with_crate("cyb");
    // module.function(["detect_cyb_content_type"], detect_cyb_content_type)?;
    module.function(["get_passport_by_nickname"], get_passport_by_nickname)?;
    module.function(["open_ai_prompt"], open_ai_prompt)?;
    module.function(["get_text_from_cid"], get_text_from_cid)?;
    module.function(["get_cyberlinks_from_cid"], get_cyberlinks_from_cid)?;
    module.function(["get_cyberlinks_to_cid"], get_cyberlinks_to_cid)?;
    module.function(["log"], log)?;
    module.constant(["context"], map_to_rune_value(&params))?;
    Ok(module)
}