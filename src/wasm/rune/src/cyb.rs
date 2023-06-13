use rune::{ContextError, Module};
use js_sys::Promise;
use rune::runtime::{VmResult, VmError, Object, Value as VmValue};
use wasm_bindgen_futures::JsFuture;
use wasm_bindgen::prelude::*;
use serde_json::Value as SerdeValue;
use crate::helpers::map_to_rune_value;

#[wasm_bindgen(module = "/scripting.js")]
extern "C" {
    fn js_detectCybContentType(mime: &str)-> String;
    fn js_getPassportByNickname(nickname: &str)-> Promise;
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

pub fn detect_cyb_content_type(arg: &str) -> VmResult<String> {
    let res = js_detectCybContentType(arg);
     log(res.as_str());
     VmResult::Ok(res)
 }

// pub async fn get_passport_by_nickname(nickname: &str) -> VmResult<String> {
//     let js_value =  JsFuture::from(js_getPassportByNickname(nickname))
//         .await;
//     match  js_value {
//         Ok(js_value) => {
//             log(&format!("js_value match1 {}", nickname.to_string()));
//             let v: SerdeValue = serde_wasm_bindgen::from_value(js_value).unwrap();
//             log(&format!("js_value match1 {} {}", nickname.to_string(), v.to_string()));

//             let c = v.pointer("/extension/particle");
//             match c {
//                 Some(c_value) =>{
//                     let result = c_value.as_str().unwrap_or("");
//                     log(format!(" val {}", result).as_str());
//                     VmResult::Ok(result.to_string())
//                 },
//                 None => VmResult::Ok("".to_string()),

//             }
//         },
//         Err(_) => VmResult::Ok("".to_string()),
//         //        Err(e) => VmResult::Err(VmError::from(e)),
//     }
// }

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

/// The wasm 'cyb' module.
pub fn module(params: SerdeValue) -> Result<Module, ContextError> {
    let mut module = Module::with_crate("cyb");
    // module.function(["detect_cyb_content_type"], detect_cyb_content_type)?;
    module.function(["get_passport_by_nickname"], get_passport_by_nickname)?;
    module.function(["log"], log)?;
    module.constant(["context"], map_to_rune_value(&params))?;
    Ok(module)
}