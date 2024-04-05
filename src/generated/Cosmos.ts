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
  AccountData,
  AllBalancesData,
  AllEvidenceData,
  AnnualProvisionsData,
  AppliedPlanData,
  AuthParamsData,
  BalanceData,
  BankParamsData,
  BroadcastTxData,
  CommunityPoolData,
  CosmosTxV1Beta1SimulateRequest,
  CurrentPlanData,
  DelegationData,
  DelegationRewardsData,
  DelegationTotalRewardsData,
  DelegatorDelegationsData,
  DelegatorUnbondingDelegationsData,
  DelegatorValidatorData,
  DelegatorValidatorsData,
  DelegatorWithdrawAddressData,
  DenomMetadataData,
  DenomsMetadataData,
  DepositData,
  DepositsData,
  DistributionParamsData,
  EvidenceData,
  GetBlockByHeightData,
  GetLatestBlockData,
  GetLatestValidatorSetData,
  GetNodeInfoData,
  GetSyncingData,
  GetTxData,
  GetTxsEventData,
  GetValidatorSetByHeightData,
  GovParamsData,
  HistoricalInfoData,
  InflationData,
  MintParamsData,
  ParamsData,
  PoolData,
  ProposalData,
  ProposalsData,
  RedelegationsData,
  SigningInfoData,
  SigningInfosData,
  SimulateData,
  SlashingParamsData,
  StakingDelegatorValidatorsData,
  StakingParamsData,
  SupplyOfData,
  TallyResultData,
  TotalSupplyData,
  UnbondingDelegationData,
  UpgradedConsensusStateData,
  ValidatorCommissionData,
  ValidatorData,
  ValidatorDelegationsData,
  ValidatorOutstandingRewardsData,
  ValidatorSlashesData,
  ValidatorUnbondingDelegationsData,
  ValidatorsData,
  VoteData,
  VotesData,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Cosmos<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name Account
   * @summary Account returns account details based on address.
   * @request GET:/cosmos/auth/v1beta1/accounts/{address}
   */
  account = (address: string, params: RequestParams = {}) =>
    this.request<
      AccountData,
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
      path: `/cosmos/auth/v1beta1/accounts/${address}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name AuthParams
   * @summary Params queries all parameters.
   * @request GET:/cosmos/auth/v1beta1/params
   */
  authParams = (params: RequestParams = {}) =>
    this.request<
      AuthParamsData,
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
      path: `/cosmos/auth/v1beta1/params`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name AllBalances
   * @summary AllBalances queries the balance of all coins for a single account.
   * @request GET:/cosmos/bank/v1beta1/balances/{address}
   */
  allBalances = (
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
      AllBalancesData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/bank/v1beta1/balances/${address}`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Balance
   * @summary Balance queries the balance of a single coin for a single account.
   * @request GET:/cosmos/bank/v1beta1/balances/{address}/{denom}
   */
  balance = (address: string, denom: string, params: RequestParams = {}) =>
    this.request<
      BalanceData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/bank/v1beta1/balances/${address}/${denom}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name DenomsMetadata
   * @summary DenomsMetadata queries the client metadata for all registered coin denominations.
   * @request GET:/cosmos/bank/v1beta1/denoms_metadata
   */
  denomsMetadata = (
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
      DenomsMetadataData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/bank/v1beta1/denoms_metadata`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name DenomMetadata
   * @summary DenomsMetadata queries the client metadata of a given coin denomination.
   * @request GET:/cosmos/bank/v1beta1/denoms_metadata/{denom}
   */
  denomMetadata = (denom: string, params: RequestParams = {}) =>
    this.request<
      DenomMetadataData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/bank/v1beta1/denoms_metadata/${denom}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name BankParams
   * @summary Params queries the parameters of x/bank module.
   * @request GET:/cosmos/bank/v1beta1/params
   */
  bankParams = (params: RequestParams = {}) =>
    this.request<
      BankParamsData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/bank/v1beta1/params`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name TotalSupply
   * @summary TotalSupply queries the total supply of all coins.
   * @request GET:/cosmos/bank/v1beta1/supply
   */
  totalSupply = (params: RequestParams = {}) =>
    this.request<
      TotalSupplyData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/bank/v1beta1/supply`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name SupplyOf
   * @summary SupplyOf queries the supply of a single coin.
   * @request GET:/cosmos/bank/v1beta1/supply/{denom}
   */
  supplyOf = (denom: string, params: RequestParams = {}) =>
    this.request<
      SupplyOfData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/bank/v1beta1/supply/${denom}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Service
   * @name GetLatestBlock
   * @summary GetLatestBlock returns the latest block.
   * @request GET:/cosmos/base/tendermint/v1beta1/blocks/latest
   */
  getLatestBlock = (params: RequestParams = {}) =>
    this.request<
      GetLatestBlockData,
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
      path: `/cosmos/base/tendermint/v1beta1/blocks/latest`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Service
   * @name GetBlockByHeight
   * @summary GetBlockByHeight queries block for given height.
   * @request GET:/cosmos/base/tendermint/v1beta1/blocks/{height}
   */
  getBlockByHeight = (height: string, params: RequestParams = {}) =>
    this.request<
      GetBlockByHeightData,
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
      path: `/cosmos/base/tendermint/v1beta1/blocks/${height}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Service
   * @name GetNodeInfo
   * @summary GetNodeInfo queries the current node info.
   * @request GET:/cosmos/base/tendermint/v1beta1/node_info
   */
  getNodeInfo = (params: RequestParams = {}) =>
    this.request<
      GetNodeInfoData,
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
      path: `/cosmos/base/tendermint/v1beta1/node_info`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Service
   * @name GetSyncing
   * @summary GetSyncing queries node syncing.
   * @request GET:/cosmos/base/tendermint/v1beta1/syncing
   */
  getSyncing = (params: RequestParams = {}) =>
    this.request<
      GetSyncingData,
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
      path: `/cosmos/base/tendermint/v1beta1/syncing`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Service
   * @name GetLatestValidatorSet
   * @summary GetLatestValidatorSet queries latest validator-set.
   * @request GET:/cosmos/base/tendermint/v1beta1/validatorsets/latest
   */
  getLatestValidatorSet = (
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
      GetLatestValidatorSetData,
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
      path: `/cosmos/base/tendermint/v1beta1/validatorsets/latest`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Service
   * @name GetValidatorSetByHeight
   * @summary GetValidatorSetByHeight queries validator-set at a given height.
   * @request GET:/cosmos/base/tendermint/v1beta1/validatorsets/{height}
   */
  getValidatorSetByHeight = (
    height: string,
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
      GetValidatorSetByHeightData,
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
      path: `/cosmos/base/tendermint/v1beta1/validatorsets/${height}`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name CommunityPool
   * @summary CommunityPool queries the community pool coins.
   * @request GET:/cosmos/distribution/v1beta1/community_pool
   */
  communityPool = (params: RequestParams = {}) =>
    this.request<
      CommunityPoolData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/distribution/v1beta1/community_pool`,
      method: 'GET',
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name DelegationTotalRewards
 * @summary DelegationTotalRewards queries the total rewards accrued by a each
validator.
 * @request GET:/cosmos/distribution/v1beta1/delegators/{delegator_address}/rewards
 */
  delegationTotalRewards = (delegatorAddress: string, params: RequestParams = {}) =>
    this.request<
      DelegationTotalRewardsData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/distribution/v1beta1/delegators/${delegatorAddress}/rewards`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name DelegationRewards
   * @summary DelegationRewards queries the total rewards accrued by a delegation.
   * @request GET:/cosmos/distribution/v1beta1/delegators/{delegator_address}/rewards/{validator_address}
   */
  delegationRewards = (delegatorAddress: string, validatorAddress: string, params: RequestParams = {}) =>
    this.request<
      DelegationRewardsData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/distribution/v1beta1/delegators/${delegatorAddress}/rewards/${validatorAddress}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name DelegatorValidators
   * @summary DelegatorValidators queries the validators of a delegator.
   * @request GET:/cosmos/distribution/v1beta1/delegators/{delegator_address}/validators
   */
  delegatorValidators = (delegatorAddress: string, params: RequestParams = {}) =>
    this.request<
      DelegatorValidatorsData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/distribution/v1beta1/delegators/${delegatorAddress}/validators`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name DelegatorWithdrawAddress
   * @summary DelegatorWithdrawAddress queries withdraw address of a delegator.
   * @request GET:/cosmos/distribution/v1beta1/delegators/{delegator_address}/withdraw_address
   */
  delegatorWithdrawAddress = (delegatorAddress: string, params: RequestParams = {}) =>
    this.request<
      DelegatorWithdrawAddressData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/distribution/v1beta1/delegators/${delegatorAddress}/withdraw_address`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name DistributionParams
   * @summary Params queries params of the distribution module.
   * @request GET:/cosmos/distribution/v1beta1/params
   */
  distributionParams = (params: RequestParams = {}) =>
    this.request<
      DistributionParamsData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/distribution/v1beta1/params`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ValidatorCommission
   * @summary ValidatorCommission queries accumulated commission for a validator.
   * @request GET:/cosmos/distribution/v1beta1/validators/{validator_address}/commission
   */
  validatorCommission = (validatorAddress: string, params: RequestParams = {}) =>
    this.request<
      ValidatorCommissionData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/distribution/v1beta1/validators/${validatorAddress}/commission`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ValidatorOutstandingRewards
   * @summary ValidatorOutstandingRewards queries rewards of a validator address.
   * @request GET:/cosmos/distribution/v1beta1/validators/{validator_address}/outstanding_rewards
   */
  validatorOutstandingRewards = (validatorAddress: string, params: RequestParams = {}) =>
    this.request<
      ValidatorOutstandingRewardsData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/distribution/v1beta1/validators/${validatorAddress}/outstanding_rewards`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ValidatorSlashes
   * @summary ValidatorSlashes queries slash events of a validator.
   * @request GET:/cosmos/distribution/v1beta1/validators/{validator_address}/slashes
   */
  validatorSlashes = (
    validatorAddress: string,
    query?: {
      /**
       * starting_height defines the optional starting height to query the slashes.
       * @format uint64
       */
      starting_height?: string;
      /**
       * starting_height defines the optional ending height to query the slashes.
       * @format uint64
       */
      ending_height?: string;
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
      ValidatorSlashesData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/distribution/v1beta1/validators/${validatorAddress}/slashes`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name AllEvidence
   * @summary AllEvidence queries all evidence.
   * @request GET:/cosmos/evidence/v1beta1/evidence
   */
  allEvidence = (
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
      AllEvidenceData,
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
      path: `/cosmos/evidence/v1beta1/evidence`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Evidence
   * @summary Evidence queries evidence based on evidence hash.
   * @request GET:/cosmos/evidence/v1beta1/evidence/{evidence_hash}
   */
  evidence = (evidenceHash: string, params: RequestParams = {}) =>
    this.request<
      EvidenceData,
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
      path: `/cosmos/evidence/v1beta1/evidence/${evidenceHash}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name GovParams
   * @summary Params queries all parameters of the gov module.
   * @request GET:/cosmos/gov/v1beta1/params/{params_type}
   */
  govParams = (paramsType: string, params: RequestParams = {}) =>
    this.request<
      GovParamsData,
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
      path: `/cosmos/gov/v1beta1/params/${paramsType}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Proposals
   * @summary Proposals queries all proposals based on given status.
   * @request GET:/cosmos/gov/v1beta1/proposals
   */
  proposals = (
    query?: {
      /**
       * proposal_status defines the status of the proposals.
       *
       *  - PROPOSAL_STATUS_UNSPECIFIED: PROPOSAL_STATUS_UNSPECIFIED defines the default propopsal status.
       *  - PROPOSAL_STATUS_DEPOSIT_PERIOD: PROPOSAL_STATUS_DEPOSIT_PERIOD defines a proposal status during the deposit
       * period.
       *  - PROPOSAL_STATUS_VOTING_PERIOD: PROPOSAL_STATUS_VOTING_PERIOD defines a proposal status during the voting
       * period.
       *  - PROPOSAL_STATUS_PASSED: PROPOSAL_STATUS_PASSED defines a proposal status of a proposal that has
       * passed.
       *  - PROPOSAL_STATUS_REJECTED: PROPOSAL_STATUS_REJECTED defines a proposal status of a proposal that has
       * been rejected.
       *  - PROPOSAL_STATUS_FAILED: PROPOSAL_STATUS_FAILED defines a proposal status of a proposal that has
       * failed.
       * @default "PROPOSAL_STATUS_UNSPECIFIED"
       */
      proposal_status?:
        | 'PROPOSAL_STATUS_UNSPECIFIED'
        | 'PROPOSAL_STATUS_DEPOSIT_PERIOD'
        | 'PROPOSAL_STATUS_VOTING_PERIOD'
        | 'PROPOSAL_STATUS_PASSED'
        | 'PROPOSAL_STATUS_REJECTED'
        | 'PROPOSAL_STATUS_FAILED';
      /** voter defines the voter address for the proposals. */
      voter?: string;
      /** depositor defines the deposit addresses from the proposals. */
      depositor?: string;
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
      ProposalsData,
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
      path: `/cosmos/gov/v1beta1/proposals`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Proposal
   * @summary Proposal queries proposal details based on ProposalID.
   * @request GET:/cosmos/gov/v1beta1/proposals/{proposal_id}
   */
  proposal = (proposalId: string, params: RequestParams = {}) =>
    this.request<
      ProposalData,
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
      path: `/cosmos/gov/v1beta1/proposals/${proposalId}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Deposits
   * @summary Deposits queries all deposits of a single proposal.
   * @request GET:/cosmos/gov/v1beta1/proposals/{proposal_id}/deposits
   */
  deposits = (
    proposalId: string,
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
      DepositsData,
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
      path: `/cosmos/gov/v1beta1/proposals/${proposalId}/deposits`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Deposit
   * @summary Deposit queries single deposit information based proposalID, depositAddr.
   * @request GET:/cosmos/gov/v1beta1/proposals/{proposal_id}/deposits/{depositor}
   */
  deposit = (proposalId: string, depositor: string, params: RequestParams = {}) =>
    this.request<
      DepositData,
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
      path: `/cosmos/gov/v1beta1/proposals/${proposalId}/deposits/${depositor}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name TallyResult
   * @summary TallyResult queries the tally of a proposal vote.
   * @request GET:/cosmos/gov/v1beta1/proposals/{proposal_id}/tally
   */
  tallyResult = (proposalId: string, params: RequestParams = {}) =>
    this.request<
      TallyResultData,
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
      path: `/cosmos/gov/v1beta1/proposals/${proposalId}/tally`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Votes
   * @summary Votes queries votes of a given proposal.
   * @request GET:/cosmos/gov/v1beta1/proposals/{proposal_id}/votes
   */
  votes = (
    proposalId: string,
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
      VotesData,
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
      path: `/cosmos/gov/v1beta1/proposals/${proposalId}/votes`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Vote
   * @summary Vote queries voted information based on proposalID, voterAddr.
   * @request GET:/cosmos/gov/v1beta1/proposals/{proposal_id}/votes/{voter}
   */
  vote = (proposalId: string, voter: string, params: RequestParams = {}) =>
    this.request<
      VoteData,
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
      path: `/cosmos/gov/v1beta1/proposals/${proposalId}/votes/${voter}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name AnnualProvisions
   * @summary AnnualProvisions current minting annual provisions value.
   * @request GET:/cosmos/mint/v1beta1/annual_provisions
   */
  annualProvisions = (params: RequestParams = {}) =>
    this.request<
      AnnualProvisionsData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/mint/v1beta1/annual_provisions`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Inflation
   * @summary Inflation returns the current minting inflation value.
   * @request GET:/cosmos/mint/v1beta1/inflation
   */
  inflation = (params: RequestParams = {}) =>
    this.request<
      InflationData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/mint/v1beta1/inflation`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name MintParams
   * @summary Params returns the total set of minting parameters.
   * @request GET:/cosmos/mint/v1beta1/params
   */
  mintParams = (params: RequestParams = {}) =>
    this.request<
      MintParamsData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/mint/v1beta1/params`,
      method: 'GET',
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name Params
 * @summary Params queries a specific parameter of a module, given its subspace and
key.
 * @request GET:/cosmos/params/v1beta1/params
 */
  params = (
    query?: {
      /** subspace defines the module to query the parameter for. */
      subspace?: string;
      /** key defines the key of the parameter in the subspace. */
      key?: string;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      ParamsData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/params/v1beta1/params`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name SlashingParams
   * @summary Params queries the parameters of slashing module
   * @request GET:/cosmos/slashing/v1beta1/params
   */
  slashingParams = (params: RequestParams = {}) =>
    this.request<
      SlashingParamsData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/slashing/v1beta1/params`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name SigningInfos
   * @summary SigningInfos queries signing info of all validators
   * @request GET:/cosmos/slashing/v1beta1/signing_infos
   */
  signingInfos = (
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
      SigningInfosData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/slashing/v1beta1/signing_infos`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name SigningInfo
   * @summary SigningInfo queries the signing info of given cons address
   * @request GET:/cosmos/slashing/v1beta1/signing_infos/{cons_address}
   */
  signingInfo = (consAddress: string, params: RequestParams = {}) =>
    this.request<
      SigningInfoData,
      {
        error?: string;
        /** @format int32 */
        code?: number;
        message?: string;
        details?: {
          type_url?: string;
          /** @format byte */
          value?: string;
        }[];
      }
    >({
      path: `/cosmos/slashing/v1beta1/signing_infos/${consAddress}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name DelegatorDelegations
   * @summary DelegatorDelegations queries all delegations of a given delegator address.
   * @request GET:/cosmos/staking/v1beta1/delegations/{delegator_addr}
   */
  delegatorDelegations = (
    delegatorAddr: string,
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
      DelegatorDelegationsData,
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
      path: `/cosmos/staking/v1beta1/delegations/${delegatorAddr}`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Redelegations
   * @summary Redelegations queries redelegations of given address.
   * @request GET:/cosmos/staking/v1beta1/delegators/{delegator_addr}/redelegations
   */
  redelegations = (
    delegatorAddr: string,
    query?: {
      /** src_validator_addr defines the validator address to redelegate from. */
      src_validator_addr?: string;
      /** dst_validator_addr defines the validator address to redelegate to. */
      dst_validator_addr?: string;
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
      RedelegationsData,
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
      path: `/cosmos/staking/v1beta1/delegators/${delegatorAddr}/redelegations`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name DelegatorUnbondingDelegations
 * @summary DelegatorUnbondingDelegations queries all unbonding delegations of a given
delegator address.
 * @request GET:/cosmos/staking/v1beta1/delegators/{delegator_addr}/unbonding_delegations
 */
  delegatorUnbondingDelegations = (
    delegatorAddr: string,
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
      DelegatorUnbondingDelegationsData,
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
      path: `/cosmos/staking/v1beta1/delegators/${delegatorAddr}/unbonding_delegations`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name StakingDelegatorValidators
 * @summary DelegatorValidators queries all validators info for given delegator
address.
 * @request GET:/cosmos/staking/v1beta1/delegators/{delegator_addr}/validators
 */
  stakingDelegatorValidators = (
    delegatorAddr: string,
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
      StakingDelegatorValidatorsData,
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
      path: `/cosmos/staking/v1beta1/delegators/${delegatorAddr}/validators`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name DelegatorValidator
 * @summary DelegatorValidator queries validator info for given delegator validator
pair.
 * @request GET:/cosmos/staking/v1beta1/delegators/{delegator_addr}/validators/{validator_addr}
 */
  delegatorValidator = (delegatorAddr: string, validatorAddr: string, params: RequestParams = {}) =>
    this.request<
      DelegatorValidatorData,
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
      path: `/cosmos/staking/v1beta1/delegators/${delegatorAddr}/validators/${validatorAddr}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name HistoricalInfo
   * @summary HistoricalInfo queries the historical info for given height.
   * @request GET:/cosmos/staking/v1beta1/historical_info/{height}
   */
  historicalInfo = (height: string, params: RequestParams = {}) =>
    this.request<
      HistoricalInfoData,
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
      path: `/cosmos/staking/v1beta1/historical_info/${height}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name StakingParams
   * @summary Parameters queries the staking parameters.
   * @request GET:/cosmos/staking/v1beta1/params
   */
  stakingParams = (params: RequestParams = {}) =>
    this.request<
      StakingParamsData,
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
      path: `/cosmos/staking/v1beta1/params`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Pool
   * @summary Pool queries the pool info.
   * @request GET:/cosmos/staking/v1beta1/pool
   */
  pool = (params: RequestParams = {}) =>
    this.request<
      PoolData,
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
      path: `/cosmos/staking/v1beta1/pool`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Validators
   * @summary Validators queries all validators that match the given status.
   * @request GET:/cosmos/staking/v1beta1/validators
   */
  validators = (
    query?: {
      /** status enables to query for validators matching a given status. */
      status?: string;
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
      ValidatorsData,
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
      path: `/cosmos/staking/v1beta1/validators`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Validator
   * @summary Validator queries validator info for given validator address.
   * @request GET:/cosmos/staking/v1beta1/validators/{validator_addr}
   */
  validator = (validatorAddr: string, params: RequestParams = {}) =>
    this.request<
      ValidatorData,
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
      path: `/cosmos/staking/v1beta1/validators/${validatorAddr}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ValidatorDelegations
   * @summary ValidatorDelegations queries delegate info for given validator.
   * @request GET:/cosmos/staking/v1beta1/validators/{validator_addr}/delegations
   */
  validatorDelegations = (
    validatorAddr: string,
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
      ValidatorDelegationsData,
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
      path: `/cosmos/staking/v1beta1/validators/${validatorAddr}/delegations`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Delegation
   * @summary Delegation queries delegate info for given validator delegator pair.
   * @request GET:/cosmos/staking/v1beta1/validators/{validator_addr}/delegations/{delegator_addr}
   */
  delegation = (validatorAddr: string, delegatorAddr: string, params: RequestParams = {}) =>
    this.request<
      DelegationData,
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
      path: `/cosmos/staking/v1beta1/validators/${validatorAddr}/delegations/${delegatorAddr}`,
      method: 'GET',
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name UnbondingDelegation
 * @summary UnbondingDelegation queries unbonding info for given validator delegator
pair.
 * @request GET:/cosmos/staking/v1beta1/validators/{validator_addr}/delegations/{delegator_addr}/unbonding_delegation
 */
  unbondingDelegation = (validatorAddr: string, delegatorAddr: string, params: RequestParams = {}) =>
    this.request<
      UnbondingDelegationData,
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
      path: `/cosmos/staking/v1beta1/validators/${validatorAddr}/delegations/${delegatorAddr}/unbonding_delegation`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ValidatorUnbondingDelegations
   * @summary ValidatorUnbondingDelegations queries unbonding delegations of a validator.
   * @request GET:/cosmos/staking/v1beta1/validators/{validator_addr}/unbonding_delegations
   */
  validatorUnbondingDelegations = (
    validatorAddr: string,
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
      ValidatorUnbondingDelegationsData,
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
      path: `/cosmos/staking/v1beta1/validators/${validatorAddr}/unbonding_delegations`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Service
   * @name Simulate
   * @summary Simulate simulates executing a transaction for estimating gas usage.
   * @request POST:/cosmos/tx/v1beta1/simulate
   */
  simulate = (body: CosmosTxV1Beta1SimulateRequest, params: RequestParams = {}) =>
    this.request<
      SimulateData,
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
      path: `/cosmos/tx/v1beta1/simulate`,
      method: 'POST',
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Service
   * @name GetTxsEvent
   * @summary GetTxsEvent fetches txs by event.
   * @request GET:/cosmos/tx/v1beta1/txs
   */
  getTxsEvent = (
    query?: {
      /** events is the list of transaction event type. */
      events?: string[];
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
      /**
       *  - ORDER_BY_UNSPECIFIED: ORDER_BY_UNSPECIFIED specifies an unknown sorting order. OrderBy defaults to ASC in this case.
       *  - ORDER_BY_ASC: ORDER_BY_ASC defines ascending order
       *  - ORDER_BY_DESC: ORDER_BY_DESC defines descending order
       * @default "ORDER_BY_UNSPECIFIED"
       */
      order_by?: 'ORDER_BY_UNSPECIFIED' | 'ORDER_BY_ASC' | 'ORDER_BY_DESC';
    },
    params: RequestParams = {}
  ) =>
    this.request<
      GetTxsEventData,
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
      path: `/cosmos/tx/v1beta1/txs`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Service
   * @name BroadcastTx
   * @summary BroadcastTx broadcast transaction.
   * @request POST:/cosmos/tx/v1beta1/txs
   */
  broadcastTx = (
    body: {
      /**
       * tx_bytes is the raw transaction.
       * @format byte
       */
      tx_bytes?: string;
      /**
       * BroadcastMode specifies the broadcast mode for the TxService.Broadcast RPC method.
       *
       *  - BROADCAST_MODE_UNSPECIFIED: zero-value for mode ordering
       *  - BROADCAST_MODE_BLOCK: BROADCAST_MODE_BLOCK defines a tx broadcasting mode where the client waits for
       * the tx to be committed in a block.
       *  - BROADCAST_MODE_SYNC: BROADCAST_MODE_SYNC defines a tx broadcasting mode where the client waits for
       * a CheckTx execution response only.
       *  - BROADCAST_MODE_ASYNC: BROADCAST_MODE_ASYNC defines a tx broadcasting mode where the client returns
       * immediately.
       * @default "BROADCAST_MODE_UNSPECIFIED"
       */
      mode?: 'BROADCAST_MODE_UNSPECIFIED' | 'BROADCAST_MODE_BLOCK' | 'BROADCAST_MODE_SYNC' | 'BROADCAST_MODE_ASYNC';
    },
    params: RequestParams = {}
  ) =>
    this.request<
      BroadcastTxData,
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
      path: `/cosmos/tx/v1beta1/txs`,
      method: 'POST',
      body: body,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Service
   * @name GetTx
   * @summary GetTx fetches a tx by hash.
   * @request GET:/cosmos/tx/v1beta1/txs/{hash}
   */
  getTx = (hash: string, params: RequestParams = {}) =>
    this.request<
      GetTxData,
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
      path: `/cosmos/tx/v1beta1/txs/${hash}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name AppliedPlan
   * @summary AppliedPlan queries a previously applied upgrade plan by its name.
   * @request GET:/cosmos/upgrade/v1beta1/applied_plan/{name}
   */
  appliedPlan = (name: string, params: RequestParams = {}) =>
    this.request<
      AppliedPlanData,
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
      path: `/cosmos/upgrade/v1beta1/applied_plan/${name}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name CurrentPlan
   * @summary CurrentPlan queries the current upgrade plan.
   * @request GET:/cosmos/upgrade/v1beta1/current_plan
   */
  currentPlan = (params: RequestParams = {}) =>
    this.request<
      CurrentPlanData,
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
      path: `/cosmos/upgrade/v1beta1/current_plan`,
      method: 'GET',
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name UpgradedConsensusState
 * @summary UpgradedConsensusState queries the consensus state that will serve
as a trusted kernel for the next version of this chain. It will only be
stored at the last height of this chain.
UpgradedConsensusState RPC not supported with legacy querier
 * @request GET:/cosmos/upgrade/v1beta1/upgraded_consensus_state/{last_height}
 */
  upgradedConsensusState = (lastHeight: string, params: RequestParams = {}) =>
    this.request<
      UpgradedConsensusStateData,
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
      path: `/cosmos/upgrade/v1beta1/upgraded_consensus_state/${lastHeight}`,
      method: 'GET',
      ...params,
    });
}
