use rune::runtime::{Shared, Object, Value as VmValue, Vec as VmVec};
use serde_json::Value as SerdeValue;

pub fn map_to_rune_value(serde_value: &SerdeValue) -> VmValue {
    match serde_value {
        SerdeValue::Null => VmValue::Unit,
        SerdeValue::Bool(b) => VmValue::from(*b),
        SerdeValue::Number(n) => {
            if let Some(i) = n.as_i64() {
                VmValue::from(i)
            } else if let Some(f) = n.as_f64() {
                VmValue::from(f)
            } else {
                VmValue::Unit // or handle this case differently
            }
        },
        SerdeValue::String(s) => VmValue::String(Shared::new(s.clone())),
        SerdeValue::Array(a) => {
            let rune_array: Vec<VmValue> = a.iter().map(|v| map_to_rune_value(v)).collect();
            VmValue::Vec(Shared::new(VmVec::from(rune_array)))
        },
        SerdeValue::Object(o) => {
            // let rune_object: HashMap<String, VmValue> = o.iter().map(|(k, v)| (k.clone(), convert_serde_value_to_rune_value(v))).collect();
            // VmValue::Object(Shared::new(rune::runtime::Object::from(rune_object)))
            let std_object: Object = o.iter().map(|(k, v)| (k.clone(), map_to_rune_value(v))).collect::<Object>();
            // let mut object = rune::runtime::Object::new();
            // for (key, v) in std_object {
            //     object.insert(key, v);
            // }

            // let object = std_object.into_iter().collect::<Object>();

            VmValue::Object(Shared::new(std_object))
        },
    }
}