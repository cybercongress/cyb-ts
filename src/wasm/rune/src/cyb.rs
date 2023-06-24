use rune::{ContextError, Module};
use js_sys::Promise;
use rune::runtime::{VmResult, Value as VmValue};
use wasm_bindgen_futures::JsFuture;
use wasm_bindgen::prelude::*;
use serde_json::Value as SerdeValue;
use crate::helpers::map_to_rune_value;

#[wasm_bindgen(module = "/scripting.js")]
extern "C" {
    // fn js_detectCybContentType(mime: &str)-> String;
    fn js_getPassportByNickname(nickname: &str)-> Promise;
    fn js_promptToOpenAI(prompt: &str)-> Promise;
    fn js_getIpfsTextContent(cid: &str)-> Promise;
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
    let js_value = JsFuture::from(js_getPassportByNickname(nickname)).await;
    match  js_value {
        Ok(js_value) => {
            let v: SerdeValue = serde_wasm_bindgen::from_value(js_value).unwrap();
            VmResult::Ok(map_to_rune_value(&v))
        },
        Err(_) => VmResult::Ok(VmValue::Unit),
    }
}

pub async fn open_ai_prompt(prompt: &str) ->  VmResult<VmValue> {
    let js_value = JsFuture::from(js_promptToOpenAI(prompt)).await;
    match  js_value {
        Ok(js_value) => {
            let v: SerdeValue = serde_wasm_bindgen::from_value(js_value).unwrap();
            VmResult::Ok(map_to_rune_value(&v))
        },
        Err(_) => VmResult::Ok(VmValue::Unit),
    }
}

pub async fn get_text_from_cid(cid: &str) ->  VmResult<VmValue> {
    let js_value = JsFuture::from(js_getIpfsTextContent(cid)).await;
    match  js_value {
        Ok(js_value) => {
            let v: SerdeValue = serde_wasm_bindgen::from_value(js_value).unwrap();
            VmResult::Ok(map_to_rune_value(&v))
        },
        Err(_) => VmResult::Ok(VmValue::Unit),
    }
}

/// The wasm 'cyb' module.
pub fn module(params: SerdeValue) -> Result<Module, ContextError> {
    let mut module = Module::with_crate("cyb");
    // module.function(["detect_cyb_content_type"], detect_cyb_content_type)?;
    module.function(["get_passport_by_nickname"], get_passport_by_nickname)?;
    module.function(["open_ai_prompt"], open_ai_prompt)?;
    module.function(["get_text_from_cid"], get_text_from_cid)?;
    module.function(["log"], log)?;
    module.constant(["context"], map_to_rune_value(&params))?;
    Ok(module)
}