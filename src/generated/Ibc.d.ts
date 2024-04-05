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
export declare class Ibc<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name DenomTraces
   * @summary DenomTraces queries all denomination traces.
   * @request GET:/ibc/applications/transfer/v1beta1/denom_traces
   */
  denomTraces: (
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
      /** denom_traces returns all denominations trace information. */
      denom_traces?: {
        /**
         * path defines the chain of port/channel identifiers used for tracing the
         * source of the fungible token.
         */
        path?: string;
        /** base denomination of the relayed fungible token. */
        base_denom?: string;
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
   * @name DenomTrace
   * @summary DenomTrace queries a denomination trace information.
   * @request GET:/ibc/applications/transfer/v1beta1/denom_traces/{hash}
   */
  denomTrace: (
    hash: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /**
       * DenomTrace contains the base denomination for ICS20 fungible tokens and the
       * source tracing information path.
       */
      denom_trace?: {
        /**
         * path defines the chain of port/channel identifiers used for tracing the
         * source of the fungible token.
         */
        path?: string;
        /** base denomination of the relayed fungible token. */
        base_denom?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name IbcTransferParams
   * @summary Params queries all parameters of the ibc-transfer module.
   * @request GET:/ibc/applications/transfer/v1beta1/params
   */
  ibcTransferParams: (params?: RequestParams) => Promise<
    AxiosResponse<{
      /** params defines the parameters of the module. */
      params?: {
        /**
         * send_enabled enables or disables all cross-chain token transfers from this
         * chain.
         */
        send_enabled?: boolean;
        /**
         * receive_enabled enables or disables all cross-chain token transfers to this
         * chain.
         */
        receive_enabled?: boolean;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Channels
   * @summary Channels queries all the IBC channels of a chain.
   * @request GET:/ibc/core/channel/v1beta1/channels
   */
  channels: (
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
      /** list of stored channels of the chain. */
      channels?: {
        /**
         * current state of the channel end
         * State defines if a channel is in one of the following states:
         * CLOSED, INIT, TRYOPEN, OPEN or UNINITIALIZED.
         *
         *  - STATE_UNINITIALIZED_UNSPECIFIED: Default State
         *  - STATE_INIT: A channel has just started the opening handshake.
         *  - STATE_TRYOPEN: A channel has acknowledged the handshake step on the counterparty chain.
         *  - STATE_OPEN: A channel has completed the handshake. Open channels are
         * ready to send and receive packets.
         *  - STATE_CLOSED: A channel has been closed and can no longer be used to send or receive
         * packets.
         * @default "STATE_UNINITIALIZED_UNSPECIFIED"
         */
        state?: 'STATE_UNINITIALIZED_UNSPECIFIED' | 'STATE_INIT' | 'STATE_TRYOPEN' | 'STATE_OPEN' | 'STATE_CLOSED';
        /**
         * whether the channel is ordered or unordered
         * - ORDER_NONE_UNSPECIFIED: zero-value for channel ordering
         *  - ORDER_UNORDERED: packets can be delivered in any order, which may differ from the order in
         * which they were sent.
         *  - ORDER_ORDERED: packets are delivered exactly in the order which they were sent
         * @default "ORDER_NONE_UNSPECIFIED"
         */
        ordering?: 'ORDER_NONE_UNSPECIFIED' | 'ORDER_UNORDERED' | 'ORDER_ORDERED';
        /** counterparty channel end */
        counterparty?: {
          /** port on the counterparty chain which owns the other end of the channel. */
          port_id?: string;
          /** channel end on the counterparty chain */
          channel_id?: string;
        };
        /**
         * list of connection identifiers, in order, along which packets sent on
         * this channel will travel
         */
        connection_hops?: string[];
        /** opaque channel version, which is agreed upon during the handshake */
        version?: string;
        /** port identifier */
        port_id?: string;
        /** channel identifier */
        channel_id?: string;
      }[];
      /**
       * pagination response
       * PageResponse is to be embedded in gRPC response messages where the
       * corresponding request message has used PageRequest.
       *
       *  message SomeResponse {
       *          repeated Bar results = 1;
       *          PageResponse page = 2;
       *  }
       */
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
      /**
       * query block height
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Channel
   * @summary Channel queries an IBC Channel.
   * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}
   */
  channel: (
    channelId: string,
    portId: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /**
       * channel associated with the request identifiers
       * Channel defines pipeline for exactly-once packet delivery between specific
       * modules on separate blockchains, which has at least one end capable of
       * sending packets and one end capable of receiving packets.
       */
      channel?: {
        /**
         * current state of the channel end
         * State defines if a channel is in one of the following states:
         * CLOSED, INIT, TRYOPEN, OPEN or UNINITIALIZED.
         *
         *  - STATE_UNINITIALIZED_UNSPECIFIED: Default State
         *  - STATE_INIT: A channel has just started the opening handshake.
         *  - STATE_TRYOPEN: A channel has acknowledged the handshake step on the counterparty chain.
         *  - STATE_OPEN: A channel has completed the handshake. Open channels are
         * ready to send and receive packets.
         *  - STATE_CLOSED: A channel has been closed and can no longer be used to send or receive
         * packets.
         * @default "STATE_UNINITIALIZED_UNSPECIFIED"
         */
        state?: 'STATE_UNINITIALIZED_UNSPECIFIED' | 'STATE_INIT' | 'STATE_TRYOPEN' | 'STATE_OPEN' | 'STATE_CLOSED';
        /**
         * whether the channel is ordered or unordered
         * - ORDER_NONE_UNSPECIFIED: zero-value for channel ordering
         *  - ORDER_UNORDERED: packets can be delivered in any order, which may differ from the order in
         * which they were sent.
         *  - ORDER_ORDERED: packets are delivered exactly in the order which they were sent
         * @default "ORDER_NONE_UNSPECIFIED"
         */
        ordering?: 'ORDER_NONE_UNSPECIFIED' | 'ORDER_UNORDERED' | 'ORDER_ORDERED';
        /** counterparty channel end */
        counterparty?: {
          /** port on the counterparty chain which owns the other end of the channel. */
          port_id?: string;
          /** channel end on the counterparty chain */
          channel_id?: string;
        };
        /**
         * list of connection identifiers, in order, along which packets sent on
         * this channel will travel
         */
        connection_hops?: string[];
        /** opaque channel version, which is agreed upon during the handshake */
        version?: string;
      };
      /**
       * merkle proof of existence
       * @format byte
       */
      proof?: string;
      /**
       * height at which the proof was retrieved
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      proof_height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
* No description
*
* @tags Query
* @name ChannelClientState
* @summary ChannelClientState queries for the client state for the channel associated
with the provided channel identifiers.
* @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/client_state
*/
  channelClientState: (
    channelId: string,
    portId: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /**
       * client state associated with the channel
       * IdentifiedClientState defines a client state with an additional client
       * identifier field.
       */
      identified_client_state?: {
        /** client identifier */
        client_id?: string;
        /**
         * client state
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
        client_state?: {
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
      /**
       * merkle proof of existence
       * @format byte
       */
      proof?: string;
      /**
       * height at which the proof was retrieved
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      proof_height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
* No description
*
* @tags Query
* @name ChannelConsensusState
* @summary ChannelConsensusState queries for the consensus state for the channel
associated with the provided channel identifiers.
* @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/consensus_state/revision/{revision_number}/height/{revision_height}
*/
  channelConsensusState: (
    channelId: string,
    portId: string,
    revisionNumber: string,
    revisionHeight: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /**
       * consensus state associated with the channel
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
      consensus_state?: {
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
      /** client ID associated with the consensus state */
      client_id?: string;
      /**
       * merkle proof of existence
       * @format byte
       */
      proof?: string;
      /**
       * height at which the proof was retrieved
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      proof_height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name NextSequenceReceive
   * @summary NextSequenceReceive returns the next receive sequence for a given channel.
   * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/next_sequence
   */
  nextSequenceReceive: (
    channelId: string,
    portId: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /**
       * next sequence receive number
       * @format uint64
       */
      next_sequence_receive?: string;
      /**
       * merkle proof of existence
       * @format byte
       */
      proof?: string;
      /**
       * height at which the proof was retrieved
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      proof_height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
* No description
*
* @tags Query
* @name PacketAcknowledgements
* @summary PacketAcknowledgements returns all the packet acknowledgements associated
with a channel.
* @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/packet_acknowledgements
*/
  packetAcknowledgements: (
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
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      acknowledgements?: {
        /** channel port identifier. */
        port_id?: string;
        /** channel unique identifier. */
        channel_id?: string;
        /**
         * packet sequence.
         * @format uint64
         */
        sequence?: string;
        /**
         * embedded data that represents packet state.
         * @format byte
         */
        data?: string;
      }[];
      /**
       * pagination response
       * PageResponse is to be embedded in gRPC response messages where the
       * corresponding request message has used PageRequest.
       *
       *  message SomeResponse {
       *          repeated Bar results = 1;
       *          PageResponse page = 2;
       *  }
       */
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
      /**
       * query block height
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name PacketAcknowledgement
   * @summary PacketAcknowledgement queries a stored packet acknowledgement hash.
   * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/packet_acks/{sequence}
   */
  packetAcknowledgement: (
    channelId: string,
    portId: string,
    sequence: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /**
       * packet associated with the request fields
       * @format byte
       */
      acknowledgement?: string;
      /**
       * merkle proof of existence
       * @format byte
       */
      proof?: string;
      /**
       * height at which the proof was retrieved
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      proof_height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
* No description
*
* @tags Query
* @name PacketCommitments
* @summary PacketCommitments returns all the packet commitments hashes associated
with a channel.
* @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/packet_commitments
*/
  packetCommitments: (
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
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      commitments?: {
        /** channel port identifier. */
        port_id?: string;
        /** channel unique identifier. */
        channel_id?: string;
        /**
         * packet sequence.
         * @format uint64
         */
        sequence?: string;
        /**
         * embedded data that represents packet state.
         * @format byte
         */
        data?: string;
      }[];
      /**
       * pagination response
       * PageResponse is to be embedded in gRPC response messages where the
       * corresponding request message has used PageRequest.
       *
       *  message SomeResponse {
       *          repeated Bar results = 1;
       *          PageResponse page = 2;
       *  }
       */
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
      /**
       * query block height
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
* No description
*
* @tags Query
* @name UnreceivedAcks
* @summary UnreceivedAcks returns all the unreceived IBC acknowledgements associated with a
channel and sequences.
* @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/packet_commitments/{packet_ack_sequences}/unreceived_acks
*/
  unreceivedAcks: (
    channelId: string,
    portId: string,
    packetAckSequences: string[],
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /** list of unreceived acknowledgement sequences */
      sequences?: string[];
      /**
       * query block height
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
* No description
*
* @tags Query
* @name UnreceivedPackets
* @summary UnreceivedPackets returns all the unreceived IBC packets associated with a
channel and sequences.
* @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/packet_commitments/{packet_commitment_sequences}/unreceived_packets
*/
  unreceivedPackets: (
    channelId: string,
    portId: string,
    packetCommitmentSequences: string[],
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /** list of unreceived packet sequences */
      sequences?: string[];
      /**
       * query block height
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name PacketCommitment
   * @summary PacketCommitment queries a stored packet commitment hash.
   * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/packet_commitments/{sequence}
   */
  packetCommitment: (
    channelId: string,
    portId: string,
    sequence: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /**
       * packet associated with the request fields
       * @format byte
       */
      commitment?: string;
      /**
       * merkle proof of existence
       * @format byte
       */
      proof?: string;
      /**
       * height at which the proof was retrieved
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      proof_height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name PacketReceipt
   * @summary PacketReceipt queries if a given packet sequence has been received on the queried chain
   * @request GET:/ibc/core/channel/v1beta1/channels/{channel_id}/ports/{port_id}/packet_receipts/{sequence}
   */
  packetReceipt: (
    channelId: string,
    portId: string,
    sequence: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /** success flag for if receipt exists */
      received?: boolean;
      /**
       * merkle proof of existence
       * @format byte
       */
      proof?: string;
      /**
       * height at which the proof was retrieved
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      proof_height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
* No description
*
* @tags Query
* @name ConnectionChannels
* @summary ConnectionChannels queries all the channels associated with a connection
end.
* @request GET:/ibc/core/channel/v1beta1/connections/{connection}/channels
*/
  connectionChannels: (
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
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /** list of channels associated with a connection. */
      channels?: {
        /**
         * current state of the channel end
         * State defines if a channel is in one of the following states:
         * CLOSED, INIT, TRYOPEN, OPEN or UNINITIALIZED.
         *
         *  - STATE_UNINITIALIZED_UNSPECIFIED: Default State
         *  - STATE_INIT: A channel has just started the opening handshake.
         *  - STATE_TRYOPEN: A channel has acknowledged the handshake step on the counterparty chain.
         *  - STATE_OPEN: A channel has completed the handshake. Open channels are
         * ready to send and receive packets.
         *  - STATE_CLOSED: A channel has been closed and can no longer be used to send or receive
         * packets.
         * @default "STATE_UNINITIALIZED_UNSPECIFIED"
         */
        state?: 'STATE_UNINITIALIZED_UNSPECIFIED' | 'STATE_INIT' | 'STATE_TRYOPEN' | 'STATE_OPEN' | 'STATE_CLOSED';
        /**
         * whether the channel is ordered or unordered
         * - ORDER_NONE_UNSPECIFIED: zero-value for channel ordering
         *  - ORDER_UNORDERED: packets can be delivered in any order, which may differ from the order in
         * which they were sent.
         *  - ORDER_ORDERED: packets are delivered exactly in the order which they were sent
         * @default "ORDER_NONE_UNSPECIFIED"
         */
        ordering?: 'ORDER_NONE_UNSPECIFIED' | 'ORDER_UNORDERED' | 'ORDER_ORDERED';
        /** counterparty channel end */
        counterparty?: {
          /** port on the counterparty chain which owns the other end of the channel. */
          port_id?: string;
          /** channel end on the counterparty chain */
          channel_id?: string;
        };
        /**
         * list of connection identifiers, in order, along which packets sent on
         * this channel will travel
         */
        connection_hops?: string[];
        /** opaque channel version, which is agreed upon during the handshake */
        version?: string;
        /** port identifier */
        port_id?: string;
        /** channel identifier */
        channel_id?: string;
      }[];
      /**
       * pagination response
       * PageResponse is to be embedded in gRPC response messages where the
       * corresponding request message has used PageRequest.
       *
       *  message SomeResponse {
       *          repeated Bar results = 1;
       *          PageResponse page = 2;
       *  }
       */
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
      /**
       * query block height
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name ClientParams
   * @summary ClientParams queries all parameters of the ibc client.
   * @request GET:/ibc/client/v1beta1/params
   */
  clientParams: (params?: RequestParams) => Promise<
    AxiosResponse<{
      /** params defines the parameters of the module. */
      params?: {
        /** allowed_clients defines the list of allowed client state types. */
        allowed_clients?: string[];
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name ClientStates
   * @summary ClientStates queries all the IBC light clients of a chain.
   * @request GET:/ibc/core/client/v1beta1/client_states
   */
  clientStates: (
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
      /** list of stored ClientStates of the chain. */
      client_states?: {
        /** client identifier */
        client_id?: string;
        /**
         * client state
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
        client_state?: {
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
      }[];
      /**
       * pagination response
       * PageResponse is to be embedded in gRPC response messages where the
       * corresponding request message has used PageRequest.
       *
       *  message SomeResponse {
       *          repeated Bar results = 1;
       *          PageResponse page = 2;
       *  }
       */
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
   * @name ClientState
   * @summary ClientState queries an IBC light client.
   * @request GET:/ibc/core/client/v1beta1/client_states/{client_id}
   */
  clientState: (
    clientId: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /**
       * client state associated with the request identifier
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
      client_state?: {
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
      /**
       * merkle proof of existence
       * @format byte
       */
      proof?: string;
      /**
       * height at which the proof was retrieved
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      proof_height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
* No description
*
* @tags Query
* @name ConsensusStates
* @summary ConsensusStates queries all the consensus state associated with a given
client.
* @request GET:/ibc/core/client/v1beta1/consensus_states/{client_id}
*/
  consensusStates: (
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
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /** consensus states associated with the identifier */
      consensus_states?: {
        /**
         * consensus state height
         * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
         * the same. However some consensus algorithms may choose to reset the
         * height in certain conditions e.g. hard forks, state-machine breaking changes
         * In these cases, the RevisionNumber is incremented so that height continues to
         * be monitonically increasing even as the RevisionHeight gets reset
         */
        height?: {
          /**
           * the revision that the client is currently on
           * @format uint64
           */
          revision_number?: string;
          /**
           * the height within the given revision
           * @format uint64
           */
          revision_height?: string;
        };
        /**
         * consensus state
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
        consensus_state?: {
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
      }[];
      /**
       * pagination response
       * PageResponse is to be embedded in gRPC response messages where the
       * corresponding request message has used PageRequest.
       *
       *  message SomeResponse {
       *          repeated Bar results = 1;
       *          PageResponse page = 2;
       *  }
       */
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
* @name ConsensusState
* @summary ConsensusState queries a consensus state associated with a client state at
a given height.
* @request GET:/ibc/core/client/v1beta1/consensus_states/{client_id}/revision/{revision_number}/height/{revision_height}
*/
  consensusState: (
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
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /**
       * consensus state associated with the client identifier at the given height
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
      consensus_state?: {
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
      /**
       * merkle proof of existence
       * @format byte
       */
      proof?: string;
      /**
       * height at which the proof was retrieved
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      proof_height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
* No description
*
* @tags Query
* @name ClientConnections
* @summary ClientConnections queries the connection paths associated with a client
state.
* @request GET:/ibc/core/connection/v1beta1/client_connections/{client_id}
*/
  clientConnections: (
    clientId: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /** slice of all the connection paths associated with a client. */
      connection_paths?: string[];
      /**
       * merkle proof of existence
       * @format byte
       */
      proof?: string;
      /**
       * height at which the proof was generated
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      proof_height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Connections
   * @summary Connections queries all the IBC connections of a chain.
   * @request GET:/ibc/core/connection/v1beta1/connections
   */
  connections: (
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
      /** list of stored connections of the chain. */
      connections?: {
        /** connection identifier. */
        id?: string;
        /** client associated with this connection. */
        client_id?: string;
        /**
         * IBC version which can be utilised to determine encodings or protocols for
         * channels or packets utilising this connection
         */
        versions?: {
          /** unique version identifier */
          identifier?: string;
          /** list of features compatible with the specified identifier */
          features?: string[];
        }[];
        /**
         * current state of the connection end.
         * @default "STATE_UNINITIALIZED_UNSPECIFIED"
         */
        state?: 'STATE_UNINITIALIZED_UNSPECIFIED' | 'STATE_INIT' | 'STATE_TRYOPEN' | 'STATE_OPEN';
        /** counterparty chain associated with this connection. */
        counterparty?: {
          /**
           * identifies the client on the counterparty chain associated with a given
           * connection.
           */
          client_id?: string;
          /**
           * identifies the connection end on the counterparty chain associated with a
           * given connection.
           */
          connection_id?: string;
          /**
           * MerklePrefix is merkle path prefixed to the key.
           * The constructed key from the Path and the key will be append(Path.KeyPath,
           * append(Path.KeyPrefix, key...))
           * commitment merkle prefix of the counterparty chain.
           */
          prefix?: {
            /** @format byte */
            key_prefix?: string;
          };
        };
        /**
         * delay period associated with this connection.
         * @format uint64
         */
        delay_period?: string;
      }[];
      /**
       * pagination response
       * PageResponse is to be embedded in gRPC response messages where the
       * corresponding request message has used PageRequest.
       *
       *  message SomeResponse {
       *          repeated Bar results = 1;
       *          PageResponse page = 2;
       *  }
       */
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
      /**
       * query block height
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Connection
   * @summary Connection queries an IBC connection end.
   * @request GET:/ibc/core/connection/v1beta1/connections/{connection_id}
   */
  connection: (
    connectionId: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /**
       * connection associated with the request identifier
       * ConnectionEnd defines a stateful object on a chain connected to another
       * separate one.
       * NOTE: there must only be 2 defined ConnectionEnds to establish
       * a connection between two chains.
       */
      connection?: {
        /** client associated with this connection. */
        client_id?: string;
        /**
         * IBC version which can be utilised to determine encodings or protocols for
         * channels or packets utilising this connection.
         */
        versions?: {
          /** unique version identifier */
          identifier?: string;
          /** list of features compatible with the specified identifier */
          features?: string[];
        }[];
        /**
         * current state of the connection end.
         * @default "STATE_UNINITIALIZED_UNSPECIFIED"
         */
        state?: 'STATE_UNINITIALIZED_UNSPECIFIED' | 'STATE_INIT' | 'STATE_TRYOPEN' | 'STATE_OPEN';
        /** counterparty chain associated with this connection. */
        counterparty?: {
          /**
           * identifies the client on the counterparty chain associated with a given
           * connection.
           */
          client_id?: string;
          /**
           * identifies the connection end on the counterparty chain associated with a
           * given connection.
           */
          connection_id?: string;
          /**
           * MerklePrefix is merkle path prefixed to the key.
           * The constructed key from the Path and the key will be append(Path.KeyPath,
           * append(Path.KeyPrefix, key...))
           * commitment merkle prefix of the counterparty chain.
           */
          prefix?: {
            /** @format byte */
            key_prefix?: string;
          };
        };
        /**
         * delay period that must pass before a consensus state can be used for packet-verification
         * NOTE: delay period logic is only implemented by some clients.
         * @format uint64
         */
        delay_period?: string;
      };
      /**
       * merkle proof of existence
       * @format byte
       */
      proof?: string;
      /**
       * height at which the proof was retrieved
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      proof_height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
* No description
*
* @tags Query
* @name ConnectionClientState
* @summary ConnectionClientState queries the client state associated with the
connection.
* @request GET:/ibc/core/connection/v1beta1/connections/{connection_id}/client_state
*/
  connectionClientState: (
    connectionId: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /**
       * client state associated with the channel
       * IdentifiedClientState defines a client state with an additional client
       * identifier field.
       */
      identified_client_state?: {
        /** client identifier */
        client_id?: string;
        /**
         * client state
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
        client_state?: {
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
      /**
       * merkle proof of existence
       * @format byte
       */
      proof?: string;
      /**
       * height at which the proof was retrieved
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      proof_height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
  /**
* No description
*
* @tags Query
* @name ConnectionConsensusState
* @summary ConnectionConsensusState queries the consensus state associated with the
connection.
* @request GET:/ibc/core/connection/v1beta1/connections/{connection_id}/consensus_state/revision/{revision_number}/height/{revision_height}
*/
  connectionConsensusState: (
    connectionId: string,
    revisionNumber: string,
    revisionHeight: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /**
       * consensus state associated with the channel
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
      consensus_state?: {
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
      /** client ID associated with the consensus state */
      client_id?: string;
      /**
       * merkle proof of existence
       * @format byte
       */
      proof?: string;
      /**
       * height at which the proof was retrieved
       * Normally the RevisionHeight is incremented at each height while keeping RevisionNumber
       * the same. However some consensus algorithms may choose to reset the
       * height in certain conditions e.g. hard forks, state-machine breaking changes
       * In these cases, the RevisionNumber is incremented so that height continues to
       * be monitonically increasing even as the RevisionHeight gets reset
       */
      proof_height?: {
        /**
         * the revision that the client is currently on
         * @format uint64
         */
        revision_number?: string;
        /**
         * the height within the given revision
         * @format uint64
         */
        revision_height?: string;
      };
    }>
  >;
}
