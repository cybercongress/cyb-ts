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
  ChannelClientStateData,
  ChannelConsensusStateData,
  ChannelData,
  ChannelsData,
  ClientConnectionsData,
  ClientParamsData,
  ClientStateData,
  ClientStatesData,
  ConnectionChannelsData,
  ConnectionClientStateData,
  ConnectionConsensusStateData,
  ConnectionData,
  ConnectionsData,
  ConsensusStateData,
  ConsensusStatesData,
  DenomTraceData,
  DenomTracesData,
  IbcTransferParamsData,
  NextSequenceReceiveData,
  PacketAcknowledgementData,
  PacketAcknowledgementsData,
  PacketCommitmentData,
  PacketCommitmentsData,
  PacketReceiptData,
  UnreceivedAcksData,
  UnreceivedPacketsData,
} from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class Ibc<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name DenomTraces
   * @summary DenomTraces queries all denomination traces.
   * @request GET:/ibc/applications/transfer/v1beta1/denom_traces
   */
  denomTraces = (
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
      DenomTracesData,
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
      path: `/ibc/applications/transfer/v1beta1/denom_traces`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name DenomTrace
   * @summary DenomTrace queries a denomination trace information.
   * @request GET:/ibc/applications/transfer/v1beta1/denom_traces/{hash}
   */
  denomTrace = (hash: string, params: RequestParams = {}) =>
    this.request<
      DenomTraceData,
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
      path: `/ibc/applications/transfer/v1beta1/denom_traces/${hash}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name IbcTransferParams
   * @summary Params queries all parameters of the ibc-transfer module.
   * @request GET:/ibc/applications/transfer/v1beta1/params
   */
  ibcTransferParams = (params: RequestParams = {}) =>
    this.request<
      IbcTransferParamsData,
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
      path: `/ibc/applications/transfer/v1beta1/params`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Channels
   * @summary Channels queries all the IBC channels of a chain.
   * @request GET:/ibc/core/channel/v1beta1/channels
   */
  channels = (
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
      ChannelsData,
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
      path: `/ibc/core/channel/v1beta1/channels`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Channel
   * @summary Channel queries an IBC Channel.
   * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}
   */
  channel = (channelId: string, portId: string, params: RequestParams = {}) =>
    this.request<
      ChannelData,
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
      path: `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}`,
      method: 'GET',
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name ChannelClientState
 * @summary ChannelClientState queries for the client state for the channel associated
with the provided channel identifiers.
 * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/client_state
 */
  channelClientState = (channelId: string, portId: string, params: RequestParams = {}) =>
    this.request<
      ChannelClientStateData,
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
      path: `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}/client_state`,
      method: 'GET',
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name ChannelConsensusState
 * @summary ChannelConsensusState queries for the consensus state for the channel
associated with the provided channel identifiers.
 * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/consensus_state/revision/{revision_number}/height/{revision_height}
 */
  channelConsensusState = (
    channelId: string,
    portId: string,
    revisionNumber: string,
    revisionHeight: string,
    params: RequestParams = {}
  ) =>
    this.request<
      ChannelConsensusStateData,
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
      path: `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}/consensus_state/revision/${revisionNumber}/height/${revisionHeight}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name NextSequenceReceive
   * @summary NextSequenceReceive returns the next receive sequence for a given channel.
   * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/next_sequence
   */
  nextSequenceReceive = (channelId: string, portId: string, params: RequestParams = {}) =>
    this.request<
      NextSequenceReceiveData,
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
      path: `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}/next_sequence`,
      method: 'GET',
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name PacketAcknowledgements
 * @summary PacketAcknowledgements returns all the packet acknowledgements associated
with a channel.
 * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/packet_acknowledgements
 */
  packetAcknowledgements = (
    channelId: string,
    portId: string,
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
      PacketAcknowledgementsData,
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
      path: `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}/packet_acknowledgements`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name PacketAcknowledgement
   * @summary PacketAcknowledgement queries a stored packet acknowledgement hash.
   * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/packet_acks/{sequence}
   */
  packetAcknowledgement = (channelId: string, portId: string, sequence: string, params: RequestParams = {}) =>
    this.request<
      PacketAcknowledgementData,
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
      path: `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}/packet_acks/${sequence}`,
      method: 'GET',
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name PacketCommitments
 * @summary PacketCommitments returns all the packet commitments hashes associated
with a channel.
 * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/packet_commitments
 */
  packetCommitments = (
    channelId: string,
    portId: string,
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
      PacketCommitmentsData,
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
      path: `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}/packet_commitments`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name UnreceivedAcks
 * @summary UnreceivedAcks returns all the unreceived IBC acknowledgements associated with a
channel and sequences.
 * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/packet_commitments/{packet_ack_sequences}/unreceived_acks
 */
  unreceivedAcks = (channelId: string, portId: string, packetAckSequences: string[], params: RequestParams = {}) =>
    this.request<
      UnreceivedAcksData,
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
      path: `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}/packet_commitments/${packetAckSequences}/unreceived_acks`,
      method: 'GET',
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name UnreceivedPackets
 * @summary UnreceivedPackets returns all the unreceived IBC packets associated with a
channel and sequences.
 * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/packet_commitments/{packet_commitment_sequences}/unreceived_packets
 */
  unreceivedPackets = (
    channelId: string,
    portId: string,
    packetCommitmentSequences: string[],
    params: RequestParams = {}
  ) =>
    this.request<
      UnreceivedPacketsData,
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
      path: `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}/packet_commitments/${packetCommitmentSequences}/unreceived_packets`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name PacketCommitment
   * @summary PacketCommitment queries a stored packet commitment hash.
   * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/packet_commitments/{sequence}
   */
  packetCommitment = (channelId: string, portId: string, sequence: string, params: RequestParams = {}) =>
    this.request<
      PacketCommitmentData,
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
      path: `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}/packet_commitments/${sequence}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name PacketReceipt
   * @summary PacketReceipt queries if a given packet sequence has been received on the queried chain
   * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/packet_receipts/{sequence}
   */
  packetReceipt = (channelId: string, portId: string, sequence: string, params: RequestParams = {}) =>
    this.request<
      PacketReceiptData,
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
      path: `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}/packet_receipts/${sequence}`,
      method: 'GET',
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name ConnectionChannels
 * @summary ConnectionChannels queries all the channels associated with a connection
end.
 * @request GET:/ibc/core/channel/v1beta1/connections/{connection}/channels
 */
  connectionChannels = (
    connection: string,
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
      ConnectionChannelsData,
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
      path: `/ibc/core/channel/v1beta1/connections/${connection}/channels`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ClientParams
   * @summary ClientParams queries all parameters of the ibc client.
   * @request GET:/ibc/client/v1beta1/params
   */
  clientParams = (params: RequestParams = {}) =>
    this.request<
      ClientParamsData,
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
      path: `/ibc/client/v1beta1/params`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ClientStates
   * @summary ClientStates queries all the IBC light clients of a chain.
   * @request GET:/ibc/core/client/v1beta1/client_states
   */
  clientStates = (
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
      ClientStatesData,
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
      path: `/ibc/core/client/v1beta1/client_states`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ClientState
   * @summary ClientState queries an IBC light client.
   * @request GET:/ibc/core/client/v1beta1/client_states/{client_id}
   */
  clientState = (clientId: string, params: RequestParams = {}) =>
    this.request<
      ClientStateData,
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
      path: `/ibc/core/client/v1beta1/client_states/${clientId}`,
      method: 'GET',
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name ConsensusStates
 * @summary ConsensusStates queries all the consensus state associated with a given
client.
 * @request GET:/ibc/core/client/v1beta1/consensus_states/{client_id}
 */
  consensusStates = (
    clientId: string,
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
      ConsensusStatesData,
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
      path: `/ibc/core/client/v1beta1/consensus_states/${clientId}`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name ConsensusState
 * @summary ConsensusState queries a consensus state associated with a client state at
a given height.
 * @request GET:/ibc/core/client/v1beta1/consensus_states/{client_id}/revision/{revision_number}/height/{revision_height}
 */
  consensusState = (
    clientId: string,
    revisionNumber: string,
    revisionHeight: string,
    query?: {
      /**
       * latest_height overrrides the height field and queries the latest stored
       * ConsensusState.
       */
      latest_height?: boolean;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      ConsensusStateData,
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
      path: `/ibc/core/client/v1beta1/consensus_states/${clientId}/revision/${revisionNumber}/height/${revisionHeight}`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name ClientConnections
 * @summary ClientConnections queries the connection paths associated with a client
state.
 * @request GET:/ibc/core/connection/v1beta1/client_connections/{client_id}
 */
  clientConnections = (clientId: string, params: RequestParams = {}) =>
    this.request<
      ClientConnectionsData,
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
      path: `/ibc/core/connection/v1beta1/client_connections/${clientId}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Connections
   * @summary Connections queries all the IBC connections of a chain.
   * @request GET:/ibc/core/connection/v1beta1/connections
   */
  connections = (
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
      ConnectionsData,
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
      path: `/ibc/core/connection/v1beta1/connections`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Connection
   * @summary Connection queries an IBC connection end.
   * @request GET:/ibc/core/connection/v1beta1/connections/{connection_id}
   */
  connection = (connectionId: string, params: RequestParams = {}) =>
    this.request<
      ConnectionData,
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
      path: `/ibc/core/connection/v1beta1/connections/${connectionId}`,
      method: 'GET',
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name ConnectionClientState
 * @summary ConnectionClientState queries the client state associated with the
connection.
 * @request GET:/ibc/core/connection/v1beta1/connections/{connection_id}/client_state
 */
  connectionClientState = (connectionId: string, params: RequestParams = {}) =>
    this.request<
      ConnectionClientStateData,
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
      path: `/ibc/core/connection/v1beta1/connections/${connectionId}/client_state`,
      method: 'GET',
      ...params,
    });
  /**
 * No description
 *
 * @tags Query
 * @name ConnectionConsensusState
 * @summary ConnectionConsensusState queries the consensus state associated with the
connection.
 * @request GET:/ibc/core/connection/v1beta1/connections/{connection_id}/consensus_state/revision/{revision_number}/height/{revision_height}
 */
  connectionConsensusState = (
    connectionId: string,
    revisionNumber: string,
    revisionHeight: string,
    params: RequestParams = {}
  ) =>
    this.request<
      ConnectionConsensusStateData,
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
      path: `/ibc/core/connection/v1beta1/connections/${connectionId}/consensus_state/revision/${revisionNumber}/height/${revisionHeight}`,
      method: 'GET',
      ...params,
    });
}
