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
  CosmosTxV1Beta1GetTxResponse,
  CosmosTxV1Beta1GetTxsEventResponse,
  CosmosTxV1Beta1SimulateRequest,
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
      {
        /** account defines the account of the corresponding address. */
        account?: {
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
      },
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
      {
        /** params defines the parameters of the module. */
        params?: {
          /** @format uint64 */
          max_memo_characters?: string;
          /** @format uint64 */
          tx_sig_limit?: string;
          /** @format uint64 */
          tx_size_cost_per_byte?: string;
          /** @format uint64 */
          sig_verify_cost_ed25519?: string;
          /** @format uint64 */
          sig_verify_cost_secp256k1?: string;
        };
      },
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
      {
        /** balances is the balances of all the coins. */
        balances?: {
          denom?: string;
          amount?: string;
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
      },
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
      {
        /**
         * Coin defines a token with a denomination and an amount.
         *
         * NOTE: The amount field is an Int which implements the custom method
         * signatures required by gogoproto.
         */
        balance?: {
          denom?: string;
          amount?: string;
        };
      },
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
      {
        /** metadata provides the client information for all the registered tokens. */
        metadatas?: {
          description?: string;
          /** denom_units represents the list of DenomUnit's for a given coin */
          denom_units?: {
            /** denom represents the string name of the given denom unit (e.g uatom). */
            denom?: string;
            /**
             * exponent represents power of 10 exponent that one must
             * raise the base_denom to in order to equal the given DenomUnit's denom
             * 1 denom = 1^exponent base_denom
             * (e.g. with a base_denom of uatom, one can create a DenomUnit of 'atom' with
             * exponent = 6, thus: 1 atom = 10^6 uatom).
             * @format int64
             */
            exponent?: number;
            /** aliases is a list of string aliases for the given denom */
            aliases?: string[];
          }[];
          /** base represents the base denom (should be the DenomUnit with exponent = 0). */
          base?: string;
          /**
           * display indicates the suggested denom that should be
           * displayed in clients.
           */
          display?: string;
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
      },
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
      {
        /**
         * Metadata represents a struct that describes
         * a basic token.
         */
        metadata?: {
          description?: string;
          /** denom_units represents the list of DenomUnit's for a given coin */
          denom_units?: {
            /** denom represents the string name of the given denom unit (e.g uatom). */
            denom?: string;
            /**
             * exponent represents power of 10 exponent that one must
             * raise the base_denom to in order to equal the given DenomUnit's denom
             * 1 denom = 1^exponent base_denom
             * (e.g. with a base_denom of uatom, one can create a DenomUnit of 'atom' with
             * exponent = 6, thus: 1 atom = 10^6 uatom).
             * @format int64
             */
            exponent?: number;
            /** aliases is a list of string aliases for the given denom */
            aliases?: string[];
          }[];
          /** base represents the base denom (should be the DenomUnit with exponent = 0). */
          base?: string;
          /**
           * display indicates the suggested denom that should be
           * displayed in clients.
           */
          display?: string;
        };
      },
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
      {
        /** Params defines the parameters for the bank module. */
        params?: {
          send_enabled?: {
            denom?: string;
            enabled?: boolean;
          }[];
          default_send_enabled?: boolean;
        };
      },
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
      {
        /** supply is the supply of the coins */
        supply?: {
          denom?: string;
          amount?: string;
        }[];
      },
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
      {
        /**
         * Coin defines a token with a denomination and an amount.
         *
         * NOTE: The amount field is an Int which implements the custom method
         * signatures required by gogoproto.
         */
        amount?: {
          denom?: string;
          amount?: string;
        };
      },
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
      {
        /** BlockID */
        block_id?: {
          /** @format byte */
          hash?: string;
          /** PartsetHeader */
          part_set_header?: {
            /** @format int64 */
            total?: number;
            /** @format byte */
            hash?: string;
          };
        };
        block?: {
          /** Header defines the structure of a Tendermint block header. */
          header?: {
            /**
             * basic block info
             * Consensus captures the consensus rules for processing a block in the blockchain,
             * including all blockchain data structures and the rules of the application's
             * state transition machine.
             */
            version?: {
              /** @format uint64 */
              block?: string;
              /** @format uint64 */
              app?: string;
            };
            chain_id?: string;
            /** @format int64 */
            height?: string;
            /** @format date-time */
            time?: string;
            /** BlockID */
            last_block_id?: {
              /** @format byte */
              hash?: string;
              /** PartsetHeader */
              part_set_header?: {
                /** @format int64 */
                total?: number;
                /** @format byte */
                hash?: string;
              };
            };
            /**
             * hashes of block data
             * @format byte
             */
            last_commit_hash?: string;
            /** @format byte */
            data_hash?: string;
            /**
             * hashes from the app output from the prev block
             * @format byte
             */
            validators_hash?: string;
            /** @format byte */
            next_validators_hash?: string;
            /** @format byte */
            consensus_hash?: string;
            /** @format byte */
            app_hash?: string;
            /** @format byte */
            last_results_hash?: string;
            /**
             * consensus info
             * @format byte
             */
            evidence_hash?: string;
            /** @format byte */
            proposer_address?: string;
          };
          /** Data contains the set of transactions included in the block */
          data?: {
            /**
             * Txs that will be applied by state @ block.Height+1.
             * NOTE: not all txs here are valid.  We're just agreeing on the order first.
             * This means that block.AppHash does not include these txs.
             */
            txs?: string[];
          };
          evidence?: {
            evidence?: {
              /** DuplicateVoteEvidence contains evidence of a validator signed two conflicting votes. */
              duplicate_vote_evidence?: {
                /**
                 * Vote represents a prevote, precommit, or commit vote from validators for
                 * consensus.
                 */
                vote_a?: {
                  /**
                   * SignedMsgType is a type of signed message in the consensus.
                   *
                   *  - SIGNED_MSG_TYPE_PREVOTE: Votes
                   *  - SIGNED_MSG_TYPE_PROPOSAL: Proposals
                   * @default "SIGNED_MSG_TYPE_UNKNOWN"
                   */
                  type?:
                    | 'SIGNED_MSG_TYPE_UNKNOWN'
                    | 'SIGNED_MSG_TYPE_PREVOTE'
                    | 'SIGNED_MSG_TYPE_PRECOMMIT'
                    | 'SIGNED_MSG_TYPE_PROPOSAL';
                  /** @format int64 */
                  height?: string;
                  /** @format int32 */
                  round?: number;
                  /** BlockID */
                  block_id?: {
                    /** @format byte */
                    hash?: string;
                    /** PartsetHeader */
                    part_set_header?: {
                      /** @format int64 */
                      total?: number;
                      /** @format byte */
                      hash?: string;
                    };
                  };
                  /** @format date-time */
                  timestamp?: string;
                  /** @format byte */
                  validator_address?: string;
                  /** @format int32 */
                  validator_index?: number;
                  /** @format byte */
                  signature?: string;
                };
                /**
                 * Vote represents a prevote, precommit, or commit vote from validators for
                 * consensus.
                 */
                vote_b?: {
                  /**
                   * SignedMsgType is a type of signed message in the consensus.
                   *
                   *  - SIGNED_MSG_TYPE_PREVOTE: Votes
                   *  - SIGNED_MSG_TYPE_PROPOSAL: Proposals
                   * @default "SIGNED_MSG_TYPE_UNKNOWN"
                   */
                  type?:
                    | 'SIGNED_MSG_TYPE_UNKNOWN'
                    | 'SIGNED_MSG_TYPE_PREVOTE'
                    | 'SIGNED_MSG_TYPE_PRECOMMIT'
                    | 'SIGNED_MSG_TYPE_PROPOSAL';
                  /** @format int64 */
                  height?: string;
                  /** @format int32 */
                  round?: number;
                  /** BlockID */
                  block_id?: {
                    /** @format byte */
                    hash?: string;
                    /** PartsetHeader */
                    part_set_header?: {
                      /** @format int64 */
                      total?: number;
                      /** @format byte */
                      hash?: string;
                    };
                  };
                  /** @format date-time */
                  timestamp?: string;
                  /** @format byte */
                  validator_address?: string;
                  /** @format int32 */
                  validator_index?: number;
                  /** @format byte */
                  signature?: string;
                };
                /** @format int64 */
                total_voting_power?: string;
                /** @format int64 */
                validator_power?: string;
                /** @format date-time */
                timestamp?: string;
              };
              /** LightClientAttackEvidence contains evidence of a set of validators attempting to mislead a light client. */
              light_client_attack_evidence?: {
                conflicting_block?: {
                  signed_header?: {
                    /** Header defines the structure of a Tendermint block header. */
                    header?: {
                      /**
                       * basic block info
                       * Consensus captures the consensus rules for processing a block in the blockchain,
                       * including all blockchain data structures and the rules of the application's
                       * state transition machine.
                       */
                      version?: {
                        /** @format uint64 */
                        block?: string;
                        /** @format uint64 */
                        app?: string;
                      };
                      chain_id?: string;
                      /** @format int64 */
                      height?: string;
                      /** @format date-time */
                      time?: string;
                      /** BlockID */
                      last_block_id?: {
                        /** @format byte */
                        hash?: string;
                        /** PartsetHeader */
                        part_set_header?: {
                          /** @format int64 */
                          total?: number;
                          /** @format byte */
                          hash?: string;
                        };
                      };
                      /**
                       * hashes of block data
                       * @format byte
                       */
                      last_commit_hash?: string;
                      /** @format byte */
                      data_hash?: string;
                      /**
                       * hashes from the app output from the prev block
                       * @format byte
                       */
                      validators_hash?: string;
                      /** @format byte */
                      next_validators_hash?: string;
                      /** @format byte */
                      consensus_hash?: string;
                      /** @format byte */
                      app_hash?: string;
                      /** @format byte */
                      last_results_hash?: string;
                      /**
                       * consensus info
                       * @format byte
                       */
                      evidence_hash?: string;
                      /** @format byte */
                      proposer_address?: string;
                    };
                    /** Commit contains the evidence that a block was committed by a set of validators. */
                    commit?: {
                      /** @format int64 */
                      height?: string;
                      /** @format int32 */
                      round?: number;
                      /** BlockID */
                      block_id?: {
                        /** @format byte */
                        hash?: string;
                        /** PartsetHeader */
                        part_set_header?: {
                          /** @format int64 */
                          total?: number;
                          /** @format byte */
                          hash?: string;
                        };
                      };
                      signatures?: {
                        /**
                         * BlockIdFlag indicates which BlcokID the signature is for
                         * @default "BLOCK_ID_FLAG_UNKNOWN"
                         */
                        block_id_flag?:
                          | 'BLOCK_ID_FLAG_UNKNOWN'
                          | 'BLOCK_ID_FLAG_ABSENT'
                          | 'BLOCK_ID_FLAG_COMMIT'
                          | 'BLOCK_ID_FLAG_NIL';
                        /** @format byte */
                        validator_address?: string;
                        /** @format date-time */
                        timestamp?: string;
                        /** @format byte */
                        signature?: string;
                      }[];
                    };
                  };
                  validator_set?: {
                    validators?: {
                      /** @format byte */
                      address?: string;
                      /** PublicKey defines the keys available for use with Tendermint Validators */
                      pub_key?: {
                        /** @format byte */
                        ed25519?: string;
                        /** @format byte */
                        secp256k1?: string;
                      };
                      /** @format int64 */
                      voting_power?: string;
                      /** @format int64 */
                      proposer_priority?: string;
                    }[];
                    proposer?: {
                      /** @format byte */
                      address?: string;
                      /** PublicKey defines the keys available for use with Tendermint Validators */
                      pub_key?: {
                        /** @format byte */
                        ed25519?: string;
                        /** @format byte */
                        secp256k1?: string;
                      };
                      /** @format int64 */
                      voting_power?: string;
                      /** @format int64 */
                      proposer_priority?: string;
                    };
                    /** @format int64 */
                    total_voting_power?: string;
                  };
                };
                /** @format int64 */
                common_height?: string;
                byzantine_validators?: {
                  /** @format byte */
                  address?: string;
                  /** PublicKey defines the keys available for use with Tendermint Validators */
                  pub_key?: {
                    /** @format byte */
                    ed25519?: string;
                    /** @format byte */
                    secp256k1?: string;
                  };
                  /** @format int64 */
                  voting_power?: string;
                  /** @format int64 */
                  proposer_priority?: string;
                }[];
                /** @format int64 */
                total_voting_power?: string;
                /** @format date-time */
                timestamp?: string;
              };
            }[];
          };
          /** Commit contains the evidence that a block was committed by a set of validators. */
          last_commit?: {
            /** @format int64 */
            height?: string;
            /** @format int32 */
            round?: number;
            /** BlockID */
            block_id?: {
              /** @format byte */
              hash?: string;
              /** PartsetHeader */
              part_set_header?: {
                /** @format int64 */
                total?: number;
                /** @format byte */
                hash?: string;
              };
            };
            signatures?: {
              /**
               * BlockIdFlag indicates which BlcokID the signature is for
               * @default "BLOCK_ID_FLAG_UNKNOWN"
               */
              block_id_flag?:
                | 'BLOCK_ID_FLAG_UNKNOWN'
                | 'BLOCK_ID_FLAG_ABSENT'
                | 'BLOCK_ID_FLAG_COMMIT'
                | 'BLOCK_ID_FLAG_NIL';
              /** @format byte */
              validator_address?: string;
              /** @format date-time */
              timestamp?: string;
              /** @format byte */
              signature?: string;
            }[];
          };
        };
      },
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
      {
        /** BlockID */
        block_id?: {
          /** @format byte */
          hash?: string;
          /** PartsetHeader */
          part_set_header?: {
            /** @format int64 */
            total?: number;
            /** @format byte */
            hash?: string;
          };
        };
        block?: {
          /** Header defines the structure of a Tendermint block header. */
          header?: {
            /**
             * basic block info
             * Consensus captures the consensus rules for processing a block in the blockchain,
             * including all blockchain data structures and the rules of the application's
             * state transition machine.
             */
            version?: {
              /** @format uint64 */
              block?: string;
              /** @format uint64 */
              app?: string;
            };
            chain_id?: string;
            /** @format int64 */
            height?: string;
            /** @format date-time */
            time?: string;
            /** BlockID */
            last_block_id?: {
              /** @format byte */
              hash?: string;
              /** PartsetHeader */
              part_set_header?: {
                /** @format int64 */
                total?: number;
                /** @format byte */
                hash?: string;
              };
            };
            /**
             * hashes of block data
             * @format byte
             */
            last_commit_hash?: string;
            /** @format byte */
            data_hash?: string;
            /**
             * hashes from the app output from the prev block
             * @format byte
             */
            validators_hash?: string;
            /** @format byte */
            next_validators_hash?: string;
            /** @format byte */
            consensus_hash?: string;
            /** @format byte */
            app_hash?: string;
            /** @format byte */
            last_results_hash?: string;
            /**
             * consensus info
             * @format byte
             */
            evidence_hash?: string;
            /** @format byte */
            proposer_address?: string;
          };
          /** Data contains the set of transactions included in the block */
          data?: {
            /**
             * Txs that will be applied by state @ block.Height+1.
             * NOTE: not all txs here are valid.  We're just agreeing on the order first.
             * This means that block.AppHash does not include these txs.
             */
            txs?: string[];
          };
          evidence?: {
            evidence?: {
              /** DuplicateVoteEvidence contains evidence of a validator signed two conflicting votes. */
              duplicate_vote_evidence?: {
                /**
                 * Vote represents a prevote, precommit, or commit vote from validators for
                 * consensus.
                 */
                vote_a?: {
                  /**
                   * SignedMsgType is a type of signed message in the consensus.
                   *
                   *  - SIGNED_MSG_TYPE_PREVOTE: Votes
                   *  - SIGNED_MSG_TYPE_PROPOSAL: Proposals
                   * @default "SIGNED_MSG_TYPE_UNKNOWN"
                   */
                  type?:
                    | 'SIGNED_MSG_TYPE_UNKNOWN'
                    | 'SIGNED_MSG_TYPE_PREVOTE'
                    | 'SIGNED_MSG_TYPE_PRECOMMIT'
                    | 'SIGNED_MSG_TYPE_PROPOSAL';
                  /** @format int64 */
                  height?: string;
                  /** @format int32 */
                  round?: number;
                  /** BlockID */
                  block_id?: {
                    /** @format byte */
                    hash?: string;
                    /** PartsetHeader */
                    part_set_header?: {
                      /** @format int64 */
                      total?: number;
                      /** @format byte */
                      hash?: string;
                    };
                  };
                  /** @format date-time */
                  timestamp?: string;
                  /** @format byte */
                  validator_address?: string;
                  /** @format int32 */
                  validator_index?: number;
                  /** @format byte */
                  signature?: string;
                };
                /**
                 * Vote represents a prevote, precommit, or commit vote from validators for
                 * consensus.
                 */
                vote_b?: {
                  /**
                   * SignedMsgType is a type of signed message in the consensus.
                   *
                   *  - SIGNED_MSG_TYPE_PREVOTE: Votes
                   *  - SIGNED_MSG_TYPE_PROPOSAL: Proposals
                   * @default "SIGNED_MSG_TYPE_UNKNOWN"
                   */
                  type?:
                    | 'SIGNED_MSG_TYPE_UNKNOWN'
                    | 'SIGNED_MSG_TYPE_PREVOTE'
                    | 'SIGNED_MSG_TYPE_PRECOMMIT'
                    | 'SIGNED_MSG_TYPE_PROPOSAL';
                  /** @format int64 */
                  height?: string;
                  /** @format int32 */
                  round?: number;
                  /** BlockID */
                  block_id?: {
                    /** @format byte */
                    hash?: string;
                    /** PartsetHeader */
                    part_set_header?: {
                      /** @format int64 */
                      total?: number;
                      /** @format byte */
                      hash?: string;
                    };
                  };
                  /** @format date-time */
                  timestamp?: string;
                  /** @format byte */
                  validator_address?: string;
                  /** @format int32 */
                  validator_index?: number;
                  /** @format byte */
                  signature?: string;
                };
                /** @format int64 */
                total_voting_power?: string;
                /** @format int64 */
                validator_power?: string;
                /** @format date-time */
                timestamp?: string;
              };
              /** LightClientAttackEvidence contains evidence of a set of validators attempting to mislead a light client. */
              light_client_attack_evidence?: {
                conflicting_block?: {
                  signed_header?: {
                    /** Header defines the structure of a Tendermint block header. */
                    header?: {
                      /**
                       * basic block info
                       * Consensus captures the consensus rules for processing a block in the blockchain,
                       * including all blockchain data structures and the rules of the application's
                       * state transition machine.
                       */
                      version?: {
                        /** @format uint64 */
                        block?: string;
                        /** @format uint64 */
                        app?: string;
                      };
                      chain_id?: string;
                      /** @format int64 */
                      height?: string;
                      /** @format date-time */
                      time?: string;
                      /** BlockID */
                      last_block_id?: {
                        /** @format byte */
                        hash?: string;
                        /** PartsetHeader */
                        part_set_header?: {
                          /** @format int64 */
                          total?: number;
                          /** @format byte */
                          hash?: string;
                        };
                      };
                      /**
                       * hashes of block data
                       * @format byte
                       */
                      last_commit_hash?: string;
                      /** @format byte */
                      data_hash?: string;
                      /**
                       * hashes from the app output from the prev block
                       * @format byte
                       */
                      validators_hash?: string;
                      /** @format byte */
                      next_validators_hash?: string;
                      /** @format byte */
                      consensus_hash?: string;
                      /** @format byte */
                      app_hash?: string;
                      /** @format byte */
                      last_results_hash?: string;
                      /**
                       * consensus info
                       * @format byte
                       */
                      evidence_hash?: string;
                      /** @format byte */
                      proposer_address?: string;
                    };
                    /** Commit contains the evidence that a block was committed by a set of validators. */
                    commit?: {
                      /** @format int64 */
                      height?: string;
                      /** @format int32 */
                      round?: number;
                      /** BlockID */
                      block_id?: {
                        /** @format byte */
                        hash?: string;
                        /** PartsetHeader */
                        part_set_header?: {
                          /** @format int64 */
                          total?: number;
                          /** @format byte */
                          hash?: string;
                        };
                      };
                      signatures?: {
                        /**
                         * BlockIdFlag indicates which BlcokID the signature is for
                         * @default "BLOCK_ID_FLAG_UNKNOWN"
                         */
                        block_id_flag?:
                          | 'BLOCK_ID_FLAG_UNKNOWN'
                          | 'BLOCK_ID_FLAG_ABSENT'
                          | 'BLOCK_ID_FLAG_COMMIT'
                          | 'BLOCK_ID_FLAG_NIL';
                        /** @format byte */
                        validator_address?: string;
                        /** @format date-time */
                        timestamp?: string;
                        /** @format byte */
                        signature?: string;
                      }[];
                    };
                  };
                  validator_set?: {
                    validators?: {
                      /** @format byte */
                      address?: string;
                      /** PublicKey defines the keys available for use with Tendermint Validators */
                      pub_key?: {
                        /** @format byte */
                        ed25519?: string;
                        /** @format byte */
                        secp256k1?: string;
                      };
                      /** @format int64 */
                      voting_power?: string;
                      /** @format int64 */
                      proposer_priority?: string;
                    }[];
                    proposer?: {
                      /** @format byte */
                      address?: string;
                      /** PublicKey defines the keys available for use with Tendermint Validators */
                      pub_key?: {
                        /** @format byte */
                        ed25519?: string;
                        /** @format byte */
                        secp256k1?: string;
                      };
                      /** @format int64 */
                      voting_power?: string;
                      /** @format int64 */
                      proposer_priority?: string;
                    };
                    /** @format int64 */
                    total_voting_power?: string;
                  };
                };
                /** @format int64 */
                common_height?: string;
                byzantine_validators?: {
                  /** @format byte */
                  address?: string;
                  /** PublicKey defines the keys available for use with Tendermint Validators */
                  pub_key?: {
                    /** @format byte */
                    ed25519?: string;
                    /** @format byte */
                    secp256k1?: string;
                  };
                  /** @format int64 */
                  voting_power?: string;
                  /** @format int64 */
                  proposer_priority?: string;
                }[];
                /** @format int64 */
                total_voting_power?: string;
                /** @format date-time */
                timestamp?: string;
              };
            }[];
          };
          /** Commit contains the evidence that a block was committed by a set of validators. */
          last_commit?: {
            /** @format int64 */
            height?: string;
            /** @format int32 */
            round?: number;
            /** BlockID */
            block_id?: {
              /** @format byte */
              hash?: string;
              /** PartsetHeader */
              part_set_header?: {
                /** @format int64 */
                total?: number;
                /** @format byte */
                hash?: string;
              };
            };
            signatures?: {
              /**
               * BlockIdFlag indicates which BlcokID the signature is for
               * @default "BLOCK_ID_FLAG_UNKNOWN"
               */
              block_id_flag?:
                | 'BLOCK_ID_FLAG_UNKNOWN'
                | 'BLOCK_ID_FLAG_ABSENT'
                | 'BLOCK_ID_FLAG_COMMIT'
                | 'BLOCK_ID_FLAG_NIL';
              /** @format byte */
              validator_address?: string;
              /** @format date-time */
              timestamp?: string;
              /** @format byte */
              signature?: string;
            }[];
          };
        };
      },
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
      {
        default_node_info?: {
          protocol_version?: {
            /** @format uint64 */
            p2p?: string;
            /** @format uint64 */
            block?: string;
            /** @format uint64 */
            app?: string;
          };
          default_node_id?: string;
          listen_addr?: string;
          network?: string;
          version?: string;
          /** @format byte */
          channels?: string;
          moniker?: string;
          other?: {
            tx_index?: string;
            rpc_address?: string;
          };
        };
        /** VersionInfo is the type for the GetNodeInfoResponse message. */
        application_version?: {
          name?: string;
          app_name?: string;
          version?: string;
          git_commit?: string;
          build_tags?: string;
          go_version?: string;
          build_deps?: {
            /** module path */
            path?: string;
            /** module version */
            version?: string;
            /** checksum */
            sum?: string;
          }[];
        };
      },
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
      {
        syncing?: boolean;
      },
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
      {
        /** @format int64 */
        block_height?: string;
        validators?: {
          address?: string;
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
          pub_key?: {
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
          /** @format int64 */
          voting_power?: string;
          /** @format int64 */
          proposer_priority?: string;
        }[];
        /** pagination defines an pagination for the response. */
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
      },
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
      {
        /** @format int64 */
        block_height?: string;
        validators?: {
          address?: string;
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
          pub_key?: {
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
          /** @format int64 */
          voting_power?: string;
          /** @format int64 */
          proposer_priority?: string;
        }[];
        /** pagination defines an pagination for the response. */
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
      },
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
      {
        /** pool defines community pool's coins. */
        pool?: {
          denom?: string;
          amount?: string;
        }[];
      },
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
      {
        /** rewards defines all the rewards accrued by a delegator. */
        rewards?: {
          validator_address?: string;
          reward?: {
            denom?: string;
            amount?: string;
          }[];
        }[];
        /** total defines the sum of all the rewards. */
        total?: {
          denom?: string;
          amount?: string;
        }[];
      },
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
      {
        /** rewards defines the rewards accrued by a delegation. */
        rewards?: {
          denom?: string;
          amount?: string;
        }[];
      },
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
      {
        /** validators defines the validators a delegator is delegating for. */
        validators?: string[];
      },
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
      {
        /** withdraw_address defines the delegator address to query for. */
        withdraw_address?: string;
      },
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
      {
        /** params defines the parameters of the module. */
        params?: {
          community_tax?: string;
          base_proposer_reward?: string;
          bonus_proposer_reward?: string;
          withdraw_addr_enabled?: boolean;
        };
      },
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
      {
        /** commission defines the commision the validator received. */
        commission?: {
          commission?: {
            denom?: string;
            amount?: string;
          }[];
        };
      },
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
      {
        /**
         * ValidatorOutstandingRewards represents outstanding (un-withdrawn) rewards
         * for a validator inexpensive to track, allows simple sanity checks.
         */
        rewards?: {
          rewards?: {
            denom?: string;
            amount?: string;
          }[];
        };
      },
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
      {
        /** slashes defines the slashes the validator received. */
        slashes?: {
          /** @format uint64 */
          validator_period?: string;
          fraction?: string;
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
      },
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
      {
        /** evidence returns all evidences. */
        evidence?: {
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
      },
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
      {
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
        evidence?: {
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
      },
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
      {
        /** voting_params defines the parameters related to voting. */
        voting_params?: {
          /** Length of the voting period. */
          voting_period?: string;
        };
        /** deposit_params defines the parameters related to deposit. */
        deposit_params?: {
          /** Minimum deposit for a proposal to enter voting period. */
          min_deposit?: {
            denom?: string;
            amount?: string;
          }[];
          /**
           * Maximum period for Atom holders to deposit on a proposal. Initial value: 2
           *  months.
           */
          max_deposit_period?: string;
        };
        /** tally_params defines the parameters related to tally. */
        tally_params?: {
          /**
           * Minimum percentage of total stake needed to vote for a result to be
           *  considered valid.
           * @format byte
           */
          quorum?: string;
          /**
           * Minimum proportion of Yes votes for proposal to pass. Default value: 0.5.
           * @format byte
           */
          threshold?: string;
          /**
           * Minimum value of Veto votes to Total votes ratio for proposal to be
           *  vetoed. Default value: 1/3.
           * @format byte
           */
          veto_threshold?: string;
        };
      },
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
      {
        proposals?: {
          /** @format uint64 */
          proposal_id?: string;
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
          content?: {
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
           * ProposalStatus enumerates the valid statuses of a proposal.
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
          status?:
            | 'PROPOSAL_STATUS_UNSPECIFIED'
            | 'PROPOSAL_STATUS_DEPOSIT_PERIOD'
            | 'PROPOSAL_STATUS_VOTING_PERIOD'
            | 'PROPOSAL_STATUS_PASSED'
            | 'PROPOSAL_STATUS_REJECTED'
            | 'PROPOSAL_STATUS_FAILED';
          /** TallyResult defines a standard tally for a governance proposal. */
          final_tally_result?: {
            yes?: string;
            abstain?: string;
            no?: string;
            no_with_veto?: string;
          };
          /** @format date-time */
          submit_time?: string;
          /** @format date-time */
          deposit_end_time?: string;
          total_deposit?: {
            denom?: string;
            amount?: string;
          }[];
          /** @format date-time */
          voting_start_time?: string;
          /** @format date-time */
          voting_end_time?: string;
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
      },
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
      {
        /** Proposal defines the core field members of a governance proposal. */
        proposal?: {
          /** @format uint64 */
          proposal_id?: string;
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
          content?: {
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
           * ProposalStatus enumerates the valid statuses of a proposal.
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
          status?:
            | 'PROPOSAL_STATUS_UNSPECIFIED'
            | 'PROPOSAL_STATUS_DEPOSIT_PERIOD'
            | 'PROPOSAL_STATUS_VOTING_PERIOD'
            | 'PROPOSAL_STATUS_PASSED'
            | 'PROPOSAL_STATUS_REJECTED'
            | 'PROPOSAL_STATUS_FAILED';
          /** TallyResult defines a standard tally for a governance proposal. */
          final_tally_result?: {
            yes?: string;
            abstain?: string;
            no?: string;
            no_with_veto?: string;
          };
          /** @format date-time */
          submit_time?: string;
          /** @format date-time */
          deposit_end_time?: string;
          total_deposit?: {
            denom?: string;
            amount?: string;
          }[];
          /** @format date-time */
          voting_start_time?: string;
          /** @format date-time */
          voting_end_time?: string;
        };
      },
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
      {
        deposits?: {
          /** @format uint64 */
          proposal_id?: string;
          depositor?: string;
          amount?: {
            denom?: string;
            amount?: string;
          }[];
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
      },
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
      {
        /**
         * Deposit defines an amount deposited by an account address to an active
         * proposal.
         */
        deposit?: {
          /** @format uint64 */
          proposal_id?: string;
          depositor?: string;
          amount?: {
            denom?: string;
            amount?: string;
          }[];
        };
      },
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
      {
        /** TallyResult defines a standard tally for a governance proposal. */
        tally?: {
          yes?: string;
          abstain?: string;
          no?: string;
          no_with_veto?: string;
        };
      },
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
      {
        /** votes defined the queried votes. */
        votes?: {
          /** @format uint64 */
          proposal_id?: string;
          voter?: string;
          /**
           * VoteOption enumerates the valid vote options for a given governance proposal.
           *
           *  - VOTE_OPTION_UNSPECIFIED: VOTE_OPTION_UNSPECIFIED defines a no-op vote option.
           *  - VOTE_OPTION_YES: VOTE_OPTION_YES defines a yes vote option.
           *  - VOTE_OPTION_ABSTAIN: VOTE_OPTION_ABSTAIN defines an abstain vote option.
           *  - VOTE_OPTION_NO: VOTE_OPTION_NO defines a no vote option.
           *  - VOTE_OPTION_NO_WITH_VETO: VOTE_OPTION_NO_WITH_VETO defines a no with veto vote option.
           * @default "VOTE_OPTION_UNSPECIFIED"
           */
          option?:
            | 'VOTE_OPTION_UNSPECIFIED'
            | 'VOTE_OPTION_YES'
            | 'VOTE_OPTION_ABSTAIN'
            | 'VOTE_OPTION_NO'
            | 'VOTE_OPTION_NO_WITH_VETO';
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
      },
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
      {
        /**
         * Vote defines a vote on a governance proposal.
         * A Vote consists of a proposal ID, the voter, and the vote option.
         */
        vote?: {
          /** @format uint64 */
          proposal_id?: string;
          voter?: string;
          /**
           * VoteOption enumerates the valid vote options for a given governance proposal.
           *
           *  - VOTE_OPTION_UNSPECIFIED: VOTE_OPTION_UNSPECIFIED defines a no-op vote option.
           *  - VOTE_OPTION_YES: VOTE_OPTION_YES defines a yes vote option.
           *  - VOTE_OPTION_ABSTAIN: VOTE_OPTION_ABSTAIN defines an abstain vote option.
           *  - VOTE_OPTION_NO: VOTE_OPTION_NO defines a no vote option.
           *  - VOTE_OPTION_NO_WITH_VETO: VOTE_OPTION_NO_WITH_VETO defines a no with veto vote option.
           * @default "VOTE_OPTION_UNSPECIFIED"
           */
          option?:
            | 'VOTE_OPTION_UNSPECIFIED'
            | 'VOTE_OPTION_YES'
            | 'VOTE_OPTION_ABSTAIN'
            | 'VOTE_OPTION_NO'
            | 'VOTE_OPTION_NO_WITH_VETO';
        };
      },
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
      {
        /**
         * annual_provisions is the current minting annual provisions value.
         * @format byte
         */
        annual_provisions?: string;
      },
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
      {
        /**
         * inflation is the current minting inflation value.
         * @format byte
         */
        inflation?: string;
      },
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
      {
        /** params defines the parameters of the module. */
        params?: {
          /** type of coin to mint */
          mint_denom?: string;
          /** maximum annual change in inflation rate */
          inflation_rate_change?: string;
          /** maximum inflation rate */
          inflation_max?: string;
          /** minimum inflation rate */
          inflation_min?: string;
          /** goal of percent bonded atoms */
          goal_bonded?: string;
          /**
           * expected blocks per year
           * @format uint64
           */
          blocks_per_year?: string;
        };
      },
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
      {
        /** param defines the queried parameter. */
        param?: {
          subspace?: string;
          key?: string;
          value?: string;
        };
      },
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
      {
        /** Params represents the parameters used for by the slashing module. */
        params?: {
          /** @format int64 */
          signed_blocks_window?: string;
          /** @format byte */
          min_signed_per_window?: string;
          downtime_jail_duration?: string;
          /** @format byte */
          slash_fraction_double_sign?: string;
          /** @format byte */
          slash_fraction_downtime?: string;
        };
      },
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
      {
        /** info is the signing info of all validators */
        info?: {
          address?: string;
          /**
           * height at which validator was first a candidate OR was unjailed
           * @format int64
           */
          start_height?: string;
          /**
           * index offset into signed block bit array
           * @format int64
           */
          index_offset?: string;
          /**
           * timestamp validator cannot be unjailed until
           * @format date-time
           */
          jailed_until?: string;
          /**
           * whether or not a validator has been tombstoned (killed out of validator
           * set)
           */
          tombstoned?: boolean;
          /**
           * missed blocks counter (to avoid scanning the array every time)
           * @format int64
           */
          missed_blocks_counter?: string;
        }[];
        /**
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
      },
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
      {
        /**
         * val_signing_info is the signing info of requested val cons address
         * ValidatorSigningInfo defines a validator's signing info for monitoring their
         * liveness activity.
         */
        val_signing_info?: {
          address?: string;
          /**
           * height at which validator was first a candidate OR was unjailed
           * @format int64
           */
          start_height?: string;
          /**
           * index offset into signed block bit array
           * @format int64
           */
          index_offset?: string;
          /**
           * timestamp validator cannot be unjailed until
           * @format date-time
           */
          jailed_until?: string;
          /**
           * whether or not a validator has been tombstoned (killed out of validator
           * set)
           */
          tombstoned?: boolean;
          /**
           * missed blocks counter (to avoid scanning the array every time)
           * @format int64
           */
          missed_blocks_counter?: string;
        };
      },
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
      {
        /** delegation_responses defines all the delegations' info of a delegator. */
        delegation_responses?: {
          /**
           * Delegation represents the bond with tokens held by an account. It is
           * owned by one delegator, and is associated with the voting power of one
           * validator.
           */
          delegation?: {
            /** delegator_address is the bech32-encoded address of the delegator. */
            delegator_address?: string;
            /** validator_address is the bech32-encoded address of the validator. */
            validator_address?: string;
            /** shares define the delegation shares received. */
            shares?: string;
          };
          /**
           * Coin defines a token with a denomination and an amount.
           *
           * NOTE: The amount field is an Int which implements the custom method
           * signatures required by gogoproto.
           */
          balance?: {
            denom?: string;
            amount?: string;
          };
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
      },
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
      {
        redelegation_responses?: {
          /**
           * Redelegation contains the list of a particular delegator's redelegating bonds
           * from a particular source validator to a particular destination validator.
           */
          redelegation?: {
            /** delegator_address is the bech32-encoded address of the delegator. */
            delegator_address?: string;
            /** validator_src_address is the validator redelegation source operator address. */
            validator_src_address?: string;
            /** validator_dst_address is the validator redelegation destination operator address. */
            validator_dst_address?: string;
            /** entries are the redelegation entries. */
            entries?: {
              /**
               * creation_height  defines the height which the redelegation took place.
               * @format int64
               */
              creation_height?: string;
              /**
               * completion_time defines the unix time for redelegation completion.
               * @format date-time
               */
              completion_time?: string;
              /** initial_balance defines the initial balance when redelegation started. */
              initial_balance?: string;
              /** shares_dst is the amount of destination-validator shares created by redelegation. */
              shares_dst?: string;
            }[];
          };
          entries?: {
            /** RedelegationEntry defines a redelegation object with relevant metadata. */
            redelegation_entry?: {
              /**
               * creation_height  defines the height which the redelegation took place.
               * @format int64
               */
              creation_height?: string;
              /**
               * completion_time defines the unix time for redelegation completion.
               * @format date-time
               */
              completion_time?: string;
              /** initial_balance defines the initial balance when redelegation started. */
              initial_balance?: string;
              /** shares_dst is the amount of destination-validator shares created by redelegation. */
              shares_dst?: string;
            };
            balance?: string;
          }[];
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
      },
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
      {
        unbonding_responses?: {
          /** delegator_address is the bech32-encoded address of the delegator. */
          delegator_address?: string;
          /** validator_address is the bech32-encoded address of the validator. */
          validator_address?: string;
          /** entries are the unbonding delegation entries. */
          entries?: {
            /**
             * creation_height is the height which the unbonding took place.
             * @format int64
             */
            creation_height?: string;
            /**
             * completion_time is the unix time for unbonding completion.
             * @format date-time
             */
            completion_time?: string;
            /** initial_balance defines the tokens initially scheduled to receive at completion. */
            initial_balance?: string;
            /** balance defines the tokens to receive at completion. */
            balance?: string;
          }[];
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
      },
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
      {
        /** validators defines the the validators' info of a delegator. */
        validators?: {
          /** operator_address defines the address of the validator's operator; bech encoded in JSON. */
          operator_address?: string;
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
          consensus_pubkey?: {
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
          /** jailed defined whether the validator has been jailed from bonded status or not. */
          jailed?: boolean;
          /**
           * status is the validator status (bonded/unbonding/unbonded).
           * @default "BOND_STATUS_UNSPECIFIED"
           */
          status?: 'BOND_STATUS_UNSPECIFIED' | 'BOND_STATUS_UNBONDED' | 'BOND_STATUS_UNBONDING' | 'BOND_STATUS_BONDED';
          /** tokens define the delegated tokens (incl. self-delegation). */
          tokens?: string;
          /** delegator_shares defines total shares issued to a validator's delegators. */
          delegator_shares?: string;
          /** description defines the description terms for the validator. */
          description?: {
            /** moniker defines a human-readable name for the validator. */
            moniker?: string;
            /** identity defines an optional identity signature (ex. UPort or Keybase). */
            identity?: string;
            /** website defines an optional website link. */
            website?: string;
            /** security_contact defines an optional email for security contact. */
            security_contact?: string;
            /** details define other optional details. */
            details?: string;
          };
          /**
           * unbonding_height defines, if unbonding, the height at which this validator has begun unbonding.
           * @format int64
           */
          unbonding_height?: string;
          /**
           * unbonding_time defines, if unbonding, the min time for the validator to complete unbonding.
           * @format date-time
           */
          unbonding_time?: string;
          /** commission defines the commission parameters. */
          commission?: {
            /** commission_rates defines the initial commission rates to be used for creating a validator. */
            commission_rates?: {
              /** rate is the commission rate charged to delegators, as a fraction. */
              rate?: string;
              /** max_rate defines the maximum commission rate which validator can ever charge, as a fraction. */
              max_rate?: string;
              /** max_change_rate defines the maximum daily increase of the validator commission, as a fraction. */
              max_change_rate?: string;
            };
            /**
             * update_time is the last time the commission rate was changed.
             * @format date-time
             */
            update_time?: string;
          };
          /** min_self_delegation is the validator's self declared minimum self delegation. */
          min_self_delegation?: string;
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
      },
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
      {
        /**
         * Validator defines a validator, together with the total amount of the
         * Validator's bond shares and their exchange rate to coins. Slashing results in
         * a decrease in the exchange rate, allowing correct calculation of future
         * undelegations without iterating over delegators. When coins are delegated to
         * this validator, the validator is credited with a delegation whose number of
         * bond shares is based on the amount of coins delegated divided by the current
         * exchange rate. Voting power can be calculated as total bonded shares
         * multiplied by exchange rate.
         */
        validator?: {
          /** operator_address defines the address of the validator's operator; bech encoded in JSON. */
          operator_address?: string;
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
          consensus_pubkey?: {
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
          /** jailed defined whether the validator has been jailed from bonded status or not. */
          jailed?: boolean;
          /**
           * status is the validator status (bonded/unbonding/unbonded).
           * @default "BOND_STATUS_UNSPECIFIED"
           */
          status?: 'BOND_STATUS_UNSPECIFIED' | 'BOND_STATUS_UNBONDED' | 'BOND_STATUS_UNBONDING' | 'BOND_STATUS_BONDED';
          /** tokens define the delegated tokens (incl. self-delegation). */
          tokens?: string;
          /** delegator_shares defines total shares issued to a validator's delegators. */
          delegator_shares?: string;
          /** description defines the description terms for the validator. */
          description?: {
            /** moniker defines a human-readable name for the validator. */
            moniker?: string;
            /** identity defines an optional identity signature (ex. UPort or Keybase). */
            identity?: string;
            /** website defines an optional website link. */
            website?: string;
            /** security_contact defines an optional email for security contact. */
            security_contact?: string;
            /** details define other optional details. */
            details?: string;
          };
          /**
           * unbonding_height defines, if unbonding, the height at which this validator has begun unbonding.
           * @format int64
           */
          unbonding_height?: string;
          /**
           * unbonding_time defines, if unbonding, the min time for the validator to complete unbonding.
           * @format date-time
           */
          unbonding_time?: string;
          /** commission defines the commission parameters. */
          commission?: {
            /** commission_rates defines the initial commission rates to be used for creating a validator. */
            commission_rates?: {
              /** rate is the commission rate charged to delegators, as a fraction. */
              rate?: string;
              /** max_rate defines the maximum commission rate which validator can ever charge, as a fraction. */
              max_rate?: string;
              /** max_change_rate defines the maximum daily increase of the validator commission, as a fraction. */
              max_change_rate?: string;
            };
            /**
             * update_time is the last time the commission rate was changed.
             * @format date-time
             */
            update_time?: string;
          };
          /** min_self_delegation is the validator's self declared minimum self delegation. */
          min_self_delegation?: string;
        };
      },
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
      {
        /** hist defines the historical info at the given height. */
        hist?: {
          /** Header defines the structure of a Tendermint block header. */
          header?: {
            /**
             * basic block info
             * Consensus captures the consensus rules for processing a block in the blockchain,
             * including all blockchain data structures and the rules of the application's
             * state transition machine.
             */
            version?: {
              /** @format uint64 */
              block?: string;
              /** @format uint64 */
              app?: string;
            };
            chain_id?: string;
            /** @format int64 */
            height?: string;
            /** @format date-time */
            time?: string;
            /** prev block info */
            last_block_id?: {
              /** @format byte */
              hash?: string;
              /** PartsetHeader */
              part_set_header?: {
                /** @format int64 */
                total?: number;
                /** @format byte */
                hash?: string;
              };
            };
            /**
             * hashes of block data
             * @format byte
             */
            last_commit_hash?: string;
            /** @format byte */
            data_hash?: string;
            /**
             * hashes from the app output from the prev block
             * @format byte
             */
            validators_hash?: string;
            /** @format byte */
            next_validators_hash?: string;
            /** @format byte */
            consensus_hash?: string;
            /** @format byte */
            app_hash?: string;
            /** @format byte */
            last_results_hash?: string;
            /**
             * consensus info
             * @format byte
             */
            evidence_hash?: string;
            /** @format byte */
            proposer_address?: string;
          };
          valset?: {
            /** operator_address defines the address of the validator's operator; bech encoded in JSON. */
            operator_address?: string;
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
            consensus_pubkey?: {
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
            /** jailed defined whether the validator has been jailed from bonded status or not. */
            jailed?: boolean;
            /**
             * status is the validator status (bonded/unbonding/unbonded).
             * @default "BOND_STATUS_UNSPECIFIED"
             */
            status?:
              | 'BOND_STATUS_UNSPECIFIED'
              | 'BOND_STATUS_UNBONDED'
              | 'BOND_STATUS_UNBONDING'
              | 'BOND_STATUS_BONDED';
            /** tokens define the delegated tokens (incl. self-delegation). */
            tokens?: string;
            /** delegator_shares defines total shares issued to a validator's delegators. */
            delegator_shares?: string;
            /** description defines the description terms for the validator. */
            description?: {
              /** moniker defines a human-readable name for the validator. */
              moniker?: string;
              /** identity defines an optional identity signature (ex. UPort or Keybase). */
              identity?: string;
              /** website defines an optional website link. */
              website?: string;
              /** security_contact defines an optional email for security contact. */
              security_contact?: string;
              /** details define other optional details. */
              details?: string;
            };
            /**
             * unbonding_height defines, if unbonding, the height at which this validator has begun unbonding.
             * @format int64
             */
            unbonding_height?: string;
            /**
             * unbonding_time defines, if unbonding, the min time for the validator to complete unbonding.
             * @format date-time
             */
            unbonding_time?: string;
            /** commission defines the commission parameters. */
            commission?: {
              /** commission_rates defines the initial commission rates to be used for creating a validator. */
              commission_rates?: {
                /** rate is the commission rate charged to delegators, as a fraction. */
                rate?: string;
                /** max_rate defines the maximum commission rate which validator can ever charge, as a fraction. */
                max_rate?: string;
                /** max_change_rate defines the maximum daily increase of the validator commission, as a fraction. */
                max_change_rate?: string;
              };
              /**
               * update_time is the last time the commission rate was changed.
               * @format date-time
               */
              update_time?: string;
            };
            /** min_self_delegation is the validator's self declared minimum self delegation. */
            min_self_delegation?: string;
          }[];
        };
      },
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
      {
        /** params holds all the parameters of this module. */
        params?: {
          /** unbonding_time is the time duration of unbonding. */
          unbonding_time?: string;
          /**
           * max_validators is the maximum number of validators.
           * @format int64
           */
          max_validators?: number;
          /**
           * max_entries is the max entries for either unbonding delegation or redelegation (per pair/trio).
           * @format int64
           */
          max_entries?: number;
          /**
           * historical_entries is the number of historical entries to persist.
           * @format int64
           */
          historical_entries?: number;
          /** bond_denom defines the bondable coin denomination. */
          bond_denom?: string;
        };
      },
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
      {
        /** pool defines the pool info. */
        pool?: {
          not_bonded_tokens?: string;
          bonded_tokens?: string;
        };
      },
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
      {
        /** validators contains all the queried validators. */
        validators?: {
          /** operator_address defines the address of the validator's operator; bech encoded in JSON. */
          operator_address?: string;
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
          consensus_pubkey?: {
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
          /** jailed defined whether the validator has been jailed from bonded status or not. */
          jailed?: boolean;
          /**
           * status is the validator status (bonded/unbonding/unbonded).
           * @default "BOND_STATUS_UNSPECIFIED"
           */
          status?: 'BOND_STATUS_UNSPECIFIED' | 'BOND_STATUS_UNBONDED' | 'BOND_STATUS_UNBONDING' | 'BOND_STATUS_BONDED';
          /** tokens define the delegated tokens (incl. self-delegation). */
          tokens?: string;
          /** delegator_shares defines total shares issued to a validator's delegators. */
          delegator_shares?: string;
          /** description defines the description terms for the validator. */
          description?: {
            /** moniker defines a human-readable name for the validator. */
            moniker?: string;
            /** identity defines an optional identity signature (ex. UPort or Keybase). */
            identity?: string;
            /** website defines an optional website link. */
            website?: string;
            /** security_contact defines an optional email for security contact. */
            security_contact?: string;
            /** details define other optional details. */
            details?: string;
          };
          /**
           * unbonding_height defines, if unbonding, the height at which this validator has begun unbonding.
           * @format int64
           */
          unbonding_height?: string;
          /**
           * unbonding_time defines, if unbonding, the min time for the validator to complete unbonding.
           * @format date-time
           */
          unbonding_time?: string;
          /** commission defines the commission parameters. */
          commission?: {
            /** commission_rates defines the initial commission rates to be used for creating a validator. */
            commission_rates?: {
              /** rate is the commission rate charged to delegators, as a fraction. */
              rate?: string;
              /** max_rate defines the maximum commission rate which validator can ever charge, as a fraction. */
              max_rate?: string;
              /** max_change_rate defines the maximum daily increase of the validator commission, as a fraction. */
              max_change_rate?: string;
            };
            /**
             * update_time is the last time the commission rate was changed.
             * @format date-time
             */
            update_time?: string;
          };
          /** min_self_delegation is the validator's self declared minimum self delegation. */
          min_self_delegation?: string;
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
      },
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
      {
        /**
         * Validator defines a validator, together with the total amount of the
         * Validator's bond shares and their exchange rate to coins. Slashing results in
         * a decrease in the exchange rate, allowing correct calculation of future
         * undelegations without iterating over delegators. When coins are delegated to
         * this validator, the validator is credited with a delegation whose number of
         * bond shares is based on the amount of coins delegated divided by the current
         * exchange rate. Voting power can be calculated as total bonded shares
         * multiplied by exchange rate.
         */
        validator?: {
          /** operator_address defines the address of the validator's operator; bech encoded in JSON. */
          operator_address?: string;
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
          consensus_pubkey?: {
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
          /** jailed defined whether the validator has been jailed from bonded status or not. */
          jailed?: boolean;
          /**
           * status is the validator status (bonded/unbonding/unbonded).
           * @default "BOND_STATUS_UNSPECIFIED"
           */
          status?: 'BOND_STATUS_UNSPECIFIED' | 'BOND_STATUS_UNBONDED' | 'BOND_STATUS_UNBONDING' | 'BOND_STATUS_BONDED';
          /** tokens define the delegated tokens (incl. self-delegation). */
          tokens?: string;
          /** delegator_shares defines total shares issued to a validator's delegators. */
          delegator_shares?: string;
          /** description defines the description terms for the validator. */
          description?: {
            /** moniker defines a human-readable name for the validator. */
            moniker?: string;
            /** identity defines an optional identity signature (ex. UPort or Keybase). */
            identity?: string;
            /** website defines an optional website link. */
            website?: string;
            /** security_contact defines an optional email for security contact. */
            security_contact?: string;
            /** details define other optional details. */
            details?: string;
          };
          /**
           * unbonding_height defines, if unbonding, the height at which this validator has begun unbonding.
           * @format int64
           */
          unbonding_height?: string;
          /**
           * unbonding_time defines, if unbonding, the min time for the validator to complete unbonding.
           * @format date-time
           */
          unbonding_time?: string;
          /** commission defines the commission parameters. */
          commission?: {
            /** commission_rates defines the initial commission rates to be used for creating a validator. */
            commission_rates?: {
              /** rate is the commission rate charged to delegators, as a fraction. */
              rate?: string;
              /** max_rate defines the maximum commission rate which validator can ever charge, as a fraction. */
              max_rate?: string;
              /** max_change_rate defines the maximum daily increase of the validator commission, as a fraction. */
              max_change_rate?: string;
            };
            /**
             * update_time is the last time the commission rate was changed.
             * @format date-time
             */
            update_time?: string;
          };
          /** min_self_delegation is the validator's self declared minimum self delegation. */
          min_self_delegation?: string;
        };
      },
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
      {
        delegation_responses?: {
          /**
           * Delegation represents the bond with tokens held by an account. It is
           * owned by one delegator, and is associated with the voting power of one
           * validator.
           */
          delegation?: {
            /** delegator_address is the bech32-encoded address of the delegator. */
            delegator_address?: string;
            /** validator_address is the bech32-encoded address of the validator. */
            validator_address?: string;
            /** shares define the delegation shares received. */
            shares?: string;
          };
          /**
           * Coin defines a token with a denomination and an amount.
           *
           * NOTE: The amount field is an Int which implements the custom method
           * signatures required by gogoproto.
           */
          balance?: {
            denom?: string;
            amount?: string;
          };
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
      },
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
      {
        /**
         * DelegationResponse is equivalent to Delegation except that it contains a
         * balance in addition to shares which is more suitable for client responses.
         */
        delegation_response?: {
          /**
           * Delegation represents the bond with tokens held by an account. It is
           * owned by one delegator, and is associated with the voting power of one
           * validator.
           */
          delegation?: {
            /** delegator_address is the bech32-encoded address of the delegator. */
            delegator_address?: string;
            /** validator_address is the bech32-encoded address of the validator. */
            validator_address?: string;
            /** shares define the delegation shares received. */
            shares?: string;
          };
          /**
           * Coin defines a token with a denomination and an amount.
           *
           * NOTE: The amount field is an Int which implements the custom method
           * signatures required by gogoproto.
           */
          balance?: {
            denom?: string;
            amount?: string;
          };
        };
      },
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
      {
        /**
         * UnbondingDelegation stores all of a single delegator's unbonding bonds
         * for a single validator in an time-ordered list.
         */
        unbond?: {
          /** delegator_address is the bech32-encoded address of the delegator. */
          delegator_address?: string;
          /** validator_address is the bech32-encoded address of the validator. */
          validator_address?: string;
          /** entries are the unbonding delegation entries. */
          entries?: {
            /**
             * creation_height is the height which the unbonding took place.
             * @format int64
             */
            creation_height?: string;
            /**
             * completion_time is the unix time for unbonding completion.
             * @format date-time
             */
            completion_time?: string;
            /** initial_balance defines the tokens initially scheduled to receive at completion. */
            initial_balance?: string;
            /** balance defines the tokens to receive at completion. */
            balance?: string;
          }[];
        };
      },
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
      {
        unbonding_responses?: {
          /** delegator_address is the bech32-encoded address of the delegator. */
          delegator_address?: string;
          /** validator_address is the bech32-encoded address of the validator. */
          validator_address?: string;
          /** entries are the unbonding delegation entries. */
          entries?: {
            /**
             * creation_height is the height which the unbonding took place.
             * @format int64
             */
            creation_height?: string;
            /**
             * completion_time is the unix time for unbonding completion.
             * @format date-time
             */
            completion_time?: string;
            /** initial_balance defines the tokens initially scheduled to receive at completion. */
            initial_balance?: string;
            /** balance defines the tokens to receive at completion. */
            balance?: string;
          }[];
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
      },
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
      {
        /** gas_info is the information about gas used in the simulation. */
        gas_info?: {
          /**
           * GasWanted is the maximum units of work we allow this tx to perform.
           * @format uint64
           */
          gas_wanted?: string;
          /**
           * GasUsed is the amount of gas actually consumed.
           * @format uint64
           */
          gas_used?: string;
        };
        /** result is the result of the simulation. */
        result?: {
          /**
           * Data is any data returned from message or handler execution. It MUST be
           * length prefixed in order to separate data from multiple message executions.
           * @format byte
           */
          data?: string;
          /** Log contains the log information from message or handler execution. */
          log?: string;
          /**
           * Events contains a slice of Event objects that were emitted during message
           * or handler execution.
           */
          events?: {
            type?: string;
            attributes?: {
              /** @format byte */
              key?: string;
              /** @format byte */
              value?: string;
              index?: boolean;
            }[];
          }[];
        };
      },
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
      CosmosTxV1Beta1GetTxsEventResponse,
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
      {
        /**
         * TxResponse defines a structure containing relevant tx data and metadata. The
         * tags are stringified and the log is JSON decoded.
         */
        tx_response?: {
          /**
           * The block height
           * @format int64
           */
          height?: string;
          /** The transaction hash. */
          txhash?: string;
          /** Namespace for the Code */
          codespace?: string;
          /**
           * Response code.
           * @format int64
           */
          code?: number;
          /** Result bytes, if any. */
          data?: string;
          /**
           * The output of the application's logger (raw string). May be
           * non-deterministic.
           */
          raw_log?: string;
          /** The output of the application's logger (typed). May be non-deterministic. */
          logs?: {
            /** @format int64 */
            msg_index?: number;
            log?: string;
            /**
             * Events contains a slice of Event objects that were emitted during some
             * execution.
             */
            events?: {
              type?: string;
              attributes?: {
                key?: string;
                value?: string;
              }[];
            }[];
          }[];
          /** Additional information. May be non-deterministic. */
          info?: string;
          /**
           * Amount of gas requested for transaction.
           * @format int64
           */
          gas_wanted?: string;
          /**
           * Amount of gas consumed by transaction.
           * @format int64
           */
          gas_used?: string;
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
          tx?: {
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
           * Time of the previous block. For heights > 1, it's the weighted median of
           * the timestamps of the valid votes in the block.LastCommit. For height == 1,
           * it's genesis time.
           */
          timestamp?: string;
        };
      },
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
      CosmosTxV1Beta1GetTxResponse,
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
      {
        /**
         * height is the block height at which the plan was applied.
         * @format int64
         */
        height?: string;
      },
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
      {
        /** plan is the current upgrade plan. */
        plan?: {
          /**
           * Sets the name for the upgrade. This name will be used by the upgraded
           * version of the software to apply any special "on-upgrade" commands during
           * the first BeginBlock method after the upgrade is applied. It is also used
           * to detect whether a software version can handle a given upgrade. If no
           * upgrade handler with this name has been set in the software, it will be
           * assumed that the software is out-of-date when the upgrade Time or Height is
           * reached and the software will exit.
           */
          name?: string;
          /**
           * The time after which the upgrade must be performed.
           * Leave set to its zero value to use a pre-defined Height instead.
           * @format date-time
           */
          time?: string;
          /**
           * The height at which the upgrade must be performed.
           * Only used if Time is not set.
           * @format int64
           */
          height?: string;
          /**
           * Any application specific upgrade info to be included on-chain
           * such as a git commit that validators could automatically upgrade to
           */
          info?: string;
          /**
           * IBC-enabled chains can opt-in to including the upgraded client state in its upgrade plan
           * This will make the chain commit to the correct upgraded (self) client state before the upgrade occurs,
           * so that connecting chains can verify that the new upgraded client is valid by verifying a proof on the
           * previous version of the chain.
           * This will allow IBC connections to persist smoothly across planned chain upgrades
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
          upgraded_client_state?: {
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
      },
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
      {
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
        upgraded_consensus_state?: {
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
      },
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
