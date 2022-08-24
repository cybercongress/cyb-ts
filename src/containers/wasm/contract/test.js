import Ajv from 'ajv';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';
import test from './query_msg.json';

const ajv = new Ajv({ allErrors: true, useDefaults: true, $data: true });
ajv.addKeyword('uniforms');
ajv.addFormat('uint32', /\d+/);
ajv.addFormat('uint64', /\d+/);

function createValidator(schema) {
  const validator = ajv.compile(schema);

  return (model) => {
    validator(model);
    return validator.errors?.length ? { details: validator.errors } : null;
  };
}

const makeBridge = (schema) => {
  const schemaValidator = createValidator(schema);
  const bridge = new JSONSchemaBridge(schema, schemaValidator);
  return bridge;
};

export default makeBridge;
