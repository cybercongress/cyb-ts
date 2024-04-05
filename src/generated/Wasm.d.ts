/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { HttpClient, RequestParams } from './http-client';
export declare class Wasm<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name Codes
   * @summary Codes gets the metadata for all stored wasm codes
   * @request GET:/wasm/v1beta1/code
   */
  codes: (
    query?: {
      /**
       * key is a value returned in PageResponse.next_key to begin
       * querying the next page most efficiently. Only one of offset or key
       * should be set.
       * @format byte
       */
      paginationKey?: string;
      /**
       * offset is a numeric offset that can be used when key is unavailable.
       * It is less efficient than using key. Only one of offset or key should
       * be set.
       * @format uint64
       */
      paginationOffset?: string;
      /**
       * limit is the total number of results to be returned in the result page.
       * If left empty it will default to a value to be set by each app.
       * @format uint64
       */
      paginationLimit?: string;
      /**
       * count_total is set to true  to indicate that the result set should include
       * a count of the total number of items available for pagination in UIs.
       * count_total is only respected when offset is used. It is ignored when key
       * is set.
       */
      paginationCountTotal?: boolean;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      code_infos?: {
        /** @format uint64 */
        code_id?: string;
        creator?: string;
        /** @format byte */
        data_hash?: string;
        source?: string;
        builder?: string;
      }[];
      /** pagination defines the pagination in the response. */
      pagination?: {
        /**
         * next_key is the key to be passed to PageRequest.key to
         * query the next page most efficiently
         * @format byte
         */
        next_key?: string;
        /**
         * total is total number of results available if PageRequest.count_total
         * was set, its value is undefined otherwise
         * @format uint64
         */
        total?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Code
   * @summary Code gets the binary code and metadata for a singe wasm code
   * @request GET:/wasm/v1beta1/code/{code_id}
   */
  code: (
    codeId: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /** CodeInfoResponse contains code meta data from CodeInfo */
      code_info?: {
        /** @format uint64 */
        code_id?: string;
        creator?: string;
        /** @format byte */
        data_hash?: string;
        source?: string;
        builder?: string;
      };
      /** @format byte */
      data?: string;
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name ContractsByCode
   * @summary ContractsByCode lists all smart contracts for a code id
   * @request GET:/wasm/v1beta1/code/{code_id}/contracts
   */
  contractsByCode: (
    codeId: string,
    query?: {
      /**
       * key is a value returned in PageResponse.next_key to begin
       * querying the next page most efficiently. Only one of offset or key
       * should be set.
       * @format byte
       */
      paginationKey?: string;
      /**
       * offset is a numeric offset that can be used when key is unavailable.
       * It is less efficient than using key. Only one of offset or key should
       * be set.
       * @format uint64
       */
      paginationOffset?: string;
      /**
       * limit is the total number of results to be returned in the result page.
       * If left empty it will default to a value to be set by each app.
       * @format uint64
       */
      paginationLimit?: string;
      /**
       * count_total is set to true  to indicate that the result set should include
       * a count of the total number of items available for pagination in UIs.
       * count_total is only respected when offset is used. It is ignored when key
       * is set.
       */
      paginationCountTotal?: boolean;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /** contracts are a set of contract addresses */
      contracts?: string[];
      /** pagination defines the pagination in the response. */
      pagination?: {
        /**
         * next_key is the key to be passed to PageRequest.key to
         * query the next page most efficiently
         * @format byte
         */
        next_key?: string;
        /**
         * total is total number of results available if PageRequest.count_total
         * was set, its value is undefined otherwise
         * @format uint64
         */
        total?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name ContractInfo
   * @summary ContractInfo gets the contract meta data
   * @request GET:/wasm/v1beta1/contract/{address}
   */
  contractInfo: (
    address: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /** address is the address of the contract */
      address?: string;
      /** ContractInfo stores a WASM contract instance */
      contract_info?: {
        /**
         * CodeID is the reference to the stored Wasm code
         * @format uint64
         */
        code_id?: string;
        /** Creator address who initially instantiated the contract */
        creator?: string;
        /** Admin is an optional address that can execute migrations */
        admin?: string;
        /** Label is optional metadata to be stored with a contract instance. */
        label?: string;
        /**
         * Created Tx position when the contract was instantiated.
         * This data should kept internal and not be exposed via query results. Just
         * use for sorting
         * AbsoluteTxPosition is a unique transaction position that allows for global
         * ordering of transactions.
         */
        created?: {
          /**
           * BlockHeight is the block the contract was created at
           * @format uint64
           */
          block_height?: string;
          /**
           * TxIndex is a monotonic counter within the block (actual transaction index,
           * or gas consumed)
           * @format uint64
           */
          tx_index?: string;
        };
        ibc_port_id?: string;
        /**
         * `Any` contains an arbitrary serialized protocol buffer message along with a
         * URL that describes the type of the serialized message.
         *
         * Protobuf library provides support to pack/unpack Any values in the form
         * of utility functions or additional generated methods of the Any type.
         *
         * Example 1: Pack and unpack a message in C++.
         *
         *     Foo foo = ...;
         *     Any any;
         *     any.PackFrom(foo);
         *     ...
         *     if (any.UnpackTo(&foo)) {
         *       ...
         *     }
         *
         * Example 2: Pack and unpack a message in Java.
         *
         *     Foo foo = ...;
         *     Any any = Any.pack(foo);
         *     ...
         *     if (any.is(Foo.class)) {
         *       foo = any.unpack(Foo.class);
         *     }
         *
         *  Example 3: Pack and unpack a message in Python.
         *
         *     foo = Foo(...)
         *     any = Any()
         *     any.Pack(foo)
         *     ...
         *     if any.Is(Foo.DESCRIPTOR):
         *       any.Unpack(foo)
         *       ...
         *
         *  Example 4: Pack and unpack a message in Go
         *
         *      foo := &pb.Foo{...}
         *      any, err := ptypes.MarshalAny(foo)
         *      ...
         *      foo := &pb.Foo{}
         *      if err := ptypes.UnmarshalAny(any, foo); err != nil {
         *        ...
         *      }
         *
         * The pack methods provided by protobuf library will by default use
         * 'type.googleapis.com/full.type.name' as the type URL and the unpack
         * methods only use the fully qualified type name after the last '/'
         * in the type URL, for example "foo.bar.com/x/y.z" will yield type
         * name "y.z".
         *
         *
         * JSON
         * ====
         * The JSON representation of an `Any` value uses the regular
         * representation of the deserialized, embedded message, with an
         * additional field `@type` which contains the type URL. Example:
         *
         *     package google.profile;
         *     message Person {
         *       string first_name = 1;
         *       string last_name = 2;
         *     }
         *
         *     {
         *       "@type": "type.googleapis.com/google.profile.Person",
         *       "firstName": <string>,
         *       "lastName": <string>
         *     }
         *
         * If the embedded message type is well-known and has a custom JSON
         * representation, that representation will be embedded adding a field
         * `value` which holds the custom JSON in addition to the `@type`
         * field. Example (for message [google.protobuf.Duration][]):
         *
         *     {
         *       "@type": "type.googleapis.com/google.protobuf.Duration",
         *       "value": "1.212s"
         *     }
         */
        extension?: {
          /**
           * A URL/resource name that uniquely identifies the type of the serialized
           * protocol buffer message. This string must contain at least
           * one "/" character. The last segment of the URL's path must represent
           * the fully qualified name of the type (as in
           * `path/google.protobuf.Duration`). The name should be in a canonical form
           * (e.g., leading "." is not accepted).
           *
           * In practice, teams usually precompile into the binary all types that they
           * expect it to use in the context of Any. However, for URLs which use the
           * scheme `http`, `https`, or no scheme, one can optionally set up a type
           * server that maps type URLs to message definitions as follows:
           *
           * * If no scheme is provided, `https` is assumed.
           * * An HTTP GET on the URL must yield a [google.protobuf.Type][]
           *   value in binary format, or produce an error.
           * * Applications are allowed to cache lookup results based on the
           *   URL, or have them precompiled into a binary to avoid any
           *   lookup. Therefore, binary compatibility needs to be preserved
           *   on changes to types. (Use versioned type names to manage
           *   breaking changes.)
           *
           * Note: this functionality is not currently available in the official
           * protobuf release, and it is not used for type URLs beginning with
           * type.googleapis.com.
           *
           * Schemes other than `http`, `https` (or the empty scheme) might be
           * used with implementation specific semantics.
           */
          type_url?: string;
          /**
           * Must be a valid serialized protocol buffer of the above specified type.
           * @format byte
           */
          value?: string;
        };
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name ContractHistory
   * @summary ContractHistory gets the contract code history
   * @request GET:/wasm/v1beta1/contract/{address}/history
   */
  contractHistory: (
    address: string,
    query?: {
      /**
       * key is a value returned in PageResponse.next_key to begin
       * querying the next page most efficiently. Only one of offset or key
       * should be set.
       * @format byte
       */
      paginationKey?: string;
      /**
       * offset is a numeric offset that can be used when key is unavailable.
       * It is less efficient than using key. Only one of offset or key should
       * be set.
       * @format uint64
       */
      paginationOffset?: string;
      /**
       * limit is the total number of results to be returned in the result page.
       * If left empty it will default to a value to be set by each app.
       * @format uint64
       */
      paginationLimit?: string;
      /**
       * count_total is set to true  to indicate that the result set should include
       * a count of the total number of items available for pagination in UIs.
       * count_total is only respected when offset is used. It is ignored when key
       * is set.
       */
      paginationCountTotal?: boolean;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      entries?: {
        /**
         * ContractCodeHistoryOperationType actions that caused a code change
         * - CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED: ContractCodeHistoryOperationTypeUnspecified placeholder for empty value
         *  - CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT: ContractCodeHistoryOperationTypeInit on chain contract instantiation
         *  - CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE: ContractCodeHistoryOperationTypeMigrate code migration
         *  - CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS: ContractCodeHistoryOperationTypeGenesis based on genesis data
         * @default "CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED"
         */
        operation?:
          | 'CONTRACT_CODE_HISTORY_OPERATION_TYPE_UNSPECIFIED'
          | 'CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT'
          | 'CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE'
          | 'CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS';
        /**
         * CodeID is the reference to the stored WASM code
         * @format uint64
         */
        code_id?: string;
        /** Updated Tx position when the operation was executed. */
        updated?: {
          /**
           * BlockHeight is the block the contract was created at
           * @format uint64
           */
          block_height?: string;
          /**
           * TxIndex is a monotonic counter within the block (actual transaction index,
           * or gas consumed)
           * @format uint64
           */
          tx_index?: string;
        };
        /** @format byte */
        msg?: string;
      }[];
      /** pagination defines the pagination in the response. */
      pagination?: {
        /**
         * next_key is the key to be passed to PageRequest.key to
         * query the next page most efficiently
         * @format byte
         */
        next_key?: string;
        /**
         * total is total number of results available if PageRequest.count_total
         * was set, its value is undefined otherwise
         * @format uint64
         */
        total?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name RawContractState
   * @summary RawContractState gets single key from the raw store data of a contract
   * @request GET:/wasm/v1beta1/contract/{address}/raw/{query_data}
   */
  rawContractState: (
    address: string,
    queryData: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /**
       * Data contains the raw store data
       * @format byte
       */
      data?: string;
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name SmartContractState
   * @summary SmartContractState get smart query result from the contract
   * @request GET:/wasm/v1beta1/contract/{address}/smart/{query_data}
   */
  smartContractState: (
    address: string,
    queryData: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /**
       * Data contains the json data returned from the smart contract
       * @format byte
       */
      data?: string;
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name AllContractState
   * @summary AllContractState gets all raw store data for a single contract
   * @request GET:/wasm/v1beta1/contract/{address}/state
   */
  allContractState: (
    address: string,
    query?: {
      /**
       * key is a value returned in PageResponse.next_key to begin
       * querying the next page most efficiently. Only one of offset or key
       * should be set.
       * @format byte
       */
      paginationKey?: string;
      /**
       * offset is a numeric offset that can be used when key is unavailable.
       * It is less efficient than using key. Only one of offset or key should
       * be set.
       * @format uint64
       */
      paginationOffset?: string;
      /**
       * limit is the total number of results to be returned in the result page.
       * If left empty it will default to a value to be set by each app.
       * @format uint64
       */
      paginationLimit?: string;
      /**
       * count_total is set to true  to indicate that the result set should include
       * a count of the total number of items available for pagination in UIs.
       * count_total is only respected when offset is used. It is ignored when key
       * is set.
       */
      paginationCountTotal?: boolean;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      models?: {
        /**
         * hex-encode key to read it better (this is often ascii)
         * @format byte
         */
        key?: string;
        /**
         * base64-encode raw value
         * @format byte
         */
        value?: string;
      }[];
      /** pagination defines the pagination in the response. */
      pagination?: {
        /**
         * next_key is the key to be passed to PageRequest.key to
         * query the next page most efficiently
         * @format byte
         */
        next_key?: string;
        /**
         * total is total number of results available if PageRequest.count_total
         * was set, its value is undefined otherwise
         * @format uint64
         */
        total?: string;
      };
    }>
  >;
}
