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

import {
  AllContractStateData,
  CodeData,
  CodesData,
  ContractHistoryData,
  ContractInfoData,
  ContractsByCodeData,
  RawContractStateData,
  SmartContractStateData,
} from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class Wasm<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name Codes
   * @summary Codes gets the metadata for all stored wasm codes
   * @request GET:/wasm/v1beta1/code
   */
  codes = (
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
    params: RequestParams = {}
  ) =>
    this.request<
      CodesData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
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
        }[];
      }
    >({
      path: `/wasm/v1beta1/code`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Code
   * @summary Code gets the binary code and metadata for a singe wasm code
   * @request GET:/wasm/v1beta1/code/{code_id}
   */
  code = (codeId: string, params: RequestParams = {}) =>
    this.request<
      CodeData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
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
        }[];
      }
    >({
      path: `/wasm/v1beta1/code/${codeId}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ContractsByCode
   * @summary ContractsByCode lists all smart contracts for a code id
   * @request GET:/wasm/v1beta1/code/{code_id}/contracts
   */
  contractsByCode = (
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
    params: RequestParams = {}
  ) =>
    this.request<
      ContractsByCodeData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
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
        }[];
      }
    >({
      path: `/wasm/v1beta1/code/${codeId}/contracts`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ContractInfo
   * @summary ContractInfo gets the contract meta data
   * @request GET:/wasm/v1beta1/contract/{address}
   */
  contractInfo = (address: string, params: RequestParams = {}) =>
    this.request<
      ContractInfoData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
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
        }[];
      }
    >({
      path: `/wasm/v1beta1/contract/${address}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ContractHistory
   * @summary ContractHistory gets the contract code history
   * @request GET:/wasm/v1beta1/contract/{address}/history
   */
  contractHistory = (
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
    params: RequestParams = {}
  ) =>
    this.request<
      ContractHistoryData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
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
        }[];
      }
    >({
      path: `/wasm/v1beta1/contract/${address}/history`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name RawContractState
   * @summary RawContractState gets single key from the raw store data of a contract
   * @request GET:/wasm/v1beta1/contract/{address}/raw/{query_data}
   */
  rawContractState = (address: string, queryData: string, params: RequestParams = {}) =>
    this.request<
      RawContractStateData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
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
        }[];
      }
    >({
      path: `/wasm/v1beta1/contract/${address}/raw/${queryData}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name SmartContractState
   * @summary SmartContractState get smart query result from the contract
   * @request GET:/wasm/v1beta1/contract/{address}/smart/{query_data}
   */
  smartContractState = (address: string, queryData: string, params: RequestParams = {}) =>
    this.request<
      SmartContractStateData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
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
        }[];
      }
    >({
      path: `/wasm/v1beta1/contract/${address}/smart/${queryData}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name AllContractState
   * @summary AllContractState gets all raw store data for a single contract
   * @request GET:/wasm/v1beta1/contract/{address}/state
   */
  allContractState = (
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
    params: RequestParams = {}
  ) =>
    this.request<
      AllContractStateData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
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
        }[];
      }
    >({
      path: `/wasm/v1beta1/contract/${address}/state`,
      method: 'GET',
      query: query,
      ...params,
    });
}
