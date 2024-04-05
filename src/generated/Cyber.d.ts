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
export declare class Cyber<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name GraphStats
   * @request GET:/cyber/graph/v1beta1/graph_stats
   */
  graphStats: (params?: RequestParams) => Promise<
    AxiosResponse<{
      /** @format uint64 */
      cyberlinks?: string;
      /** @format uint64 */
      particles?: string;
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name IsAnyLinkExist
   * @request GET:/cyber/rank/v1beta1/is_any_link_exist
   */
  isAnyLinkExist: (
    query?: {
      from?: string;
      to?: string;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /** @format boolean */
      exist?: boolean;
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name IsLinkExist
   * @request GET:/cyber/rank/v1beta1/is_link_exist
   */
  isLinkExist: (
    query?: {
      from?: string;
      to?: string;
      address?: string;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /** @format boolean */
      exist?: boolean;
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Karma
   * @request GET:/cyber/rank/v1beta1/karma/{neuron}
   */
  karma: (
    neuron: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /** @format uint64 */
      karma?: string;
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Negentropy
   * @request GET:/cyber/rank/v1beta1/negentropy
   */
  negentropy: (params?: RequestParams) => Promise<
    AxiosResponse<{
      /** @format uint64 */
      negentropy?: string;
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name ParticleNegentropy
   * @request GET:/cyber/rank/v1beta1/negentropy/{particle}
   */
  particleNegentropy: (
    particle: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /** @format uint64 */
      entropy?: string;
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Backlinks
   * @request GET:/cyber/rank/v1beta1/rank/backlinks/{particle}
   */
  backlinks: (
    particle: string,
    query?: {
      /** @format int64 */
      paginationPage?: number;
      /** @format int64 */
      paginationPerPage?: number;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      result?: {
        particle?: string;
        /** @format uint64 */
        rank?: string;
      }[];
      pagination?: {
        /** @format int64 */
        total?: number;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name RankParams
   * @request GET:/cyber/rank/v1beta1/rank/params
   */
  rankParams: (params?: RequestParams) => Promise<
    AxiosResponse<{
      params?: {
        /** @format int64 */
        calculation_period?: string;
        damping_factor?: string;
        tolerance?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Rank
   * @request GET:/cyber/rank/v1beta1/rank/rank/{particle}
   */
  rank: (
    particle: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      /** @format uint64 */
      rank?: string;
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Search
   * @request GET:/cyber/rank/v1beta1/rank/search/{particle}
   */
  search: (
    particle: string,
    query?: {
      /** @format int64 */
      paginationPage?: number;
      /** @format int64 */
      paginationPerPage?: number;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      result?: {
        particle?: string;
        /** @format uint64 */
        rank?: string;
      }[];
      pagination?: {
        /** @format int64 */
        total?: number;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Top
   * @request GET:/cyber/rank/v1beta1/rank/top
   */
  top: (
    query?: {
      /** @format int64 */
      page?: number;
      /** @format int64 */
      per_page?: number;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      result?: {
        particle?: string;
        /** @format uint64 */
        rank?: string;
      }[];
      pagination?: {
        /** @format int64 */
        total?: number;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Load
   * @request GET:/cyber/bandwidth/v1beta1/bandwidth/load
   */
  load: (params?: RequestParams) => Promise<
    AxiosResponse<{
      /** DecProto defines a Protobuf wrapper around a Dec object. */
      load?: {
        dec?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name NeuronBandwidth
   * @request GET:/cyber/bandwidth/v1beta1/bandwidth/neuron/{neuron}
   */
  neuronBandwidth: (
    neuron: string,
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      neuron_bandwidth?: {
        neuron?: string;
        /** @format uint64 */
        remained_value?: string;
        /** @format uint64 */
        last_updated_block?: string;
        /** @format uint64 */
        max_value?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name BandwidthParams
   * @request GET:/cyber/bandwidth/v1beta1/bandwidth/params
   */
  bandwidthParams: (params?: RequestParams) => Promise<
    AxiosResponse<{
      params?: {
        /** @format uint64 */
        recovery_period?: string;
        /** @format uint64 */
        adjust_price_period?: string;
        base_price?: string;
        base_load?: string;
        /** @format uint64 */
        max_block_bandwidth?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Price
   * @request GET:/cyber/bandwidth/v1beta1/bandwidth/price
   */
  price: (params?: RequestParams) => Promise<
    AxiosResponse<{
      /** DecProto defines a Protobuf wrapper around a Dec object. */
      price?: {
        dec?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name TotalBandwidth
   * @request GET:/cyber/bandwidth/v1beta1/bandwidth/total
   */
  totalBandwidth: (params?: RequestParams) => Promise<
    AxiosResponse<{
      /** @format uint64 */
      total_bandwidth?: string;
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name DestinationRoutedEnergy
   * @request GET:/cyber/grid/v1beta1/grid/destination_routed_energy
   */
  destinationRoutedEnergy: (
    query?: {
      destination?: string;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      value?: {
        denom?: string;
        amount?: string;
      }[];
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name DestinationRoutes
   * @request GET:/cyber/grid/v1beta1/grid/destination_routes
   */
  destinationRoutes: (
    query?: {
      destination?: string;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      routes?: {
        source?: string;
        destination?: string;
        name?: string;
        value?: {
          denom?: string;
          amount?: string;
        }[];
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
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name GridParams
   * @request GET:/cyber/grid/v1beta1/grid/params
   */
  gridParams: (params?: RequestParams) => Promise<
    AxiosResponse<{
      params?: {
        /** @format int64 */
        max_routes?: number;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Route
   * @request GET:/cyber/grid/v1beta1/grid/route
   */
  route: (
    query?: {
      source?: string;
      destination?: string;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      route?: {
        source?: string;
        destination?: string;
        name?: string;
        value?: {
          denom?: string;
          amount?: string;
        }[];
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Routes
   * @request GET:/cyber/grid/v1beta1/grid/routes
   */
  routes: (
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
       * @format boolean
       */
      paginationCountTotal?: boolean;
      /**
       * reverse is set to true if results are to be returned in the descending order.
       * @format boolean
       */
      paginationReverse?: boolean;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      routes?: {
        source?: string;
        destination?: string;
        name?: string;
        value?: {
          denom?: string;
          amount?: string;
        }[];
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
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name SourceRoutedEnergy
   * @request GET:/cyber/grid/v1beta1/grid/source_routed_energy
   */
  sourceRoutedEnergy: (
    query?: {
      source?: string;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      value?: {
        denom?: string;
        amount?: string;
      }[];
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name SourceRoutes
   * @request GET:/cyber/grid/v1beta1/grid/source_routes
   */
  sourceRoutes: (
    query?: {
      source?: string;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      routes?: {
        source?: string;
        destination?: string;
        name?: string;
        value?: {
          denom?: string;
          amount?: string;
        }[];
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
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Investmint
   * @request GET:/cyber/resources/v1beta1/resources/investmint
   */
  investmint: (
    query?: {
      amountDenom?: string;
      amountAmount?: string;
      resource?: string;
      /** @format uint64 */
      length?: string;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
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
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name ResourcesParams
   * @request GET:/cyber/resources/v1beta1/resources/params
   */
  resourcesParams: (params?: RequestParams) => Promise<
    AxiosResponse<{
      params?: {
        /** @format int64 */
        max_slots?: number;
        /** @format int64 */
        halving_period_volt_blocks?: number;
        /** @format int64 */
        halving_period_ampere_blocks?: number;
        /** @format int64 */
        base_investmint_period_volt?: number;
        /** @format int64 */
        base_investmint_period_ampere?: number;
        /** @format int64 */
        min_investmint_period?: number;
        /**
         * Coin defines a token with a denomination and an amount.
         *
         * NOTE: The amount field is an Int which implements the custom method
         * signatures required by gogoproto.
         */
        base_investmint_amount_volt?: {
          denom?: string;
          amount?: string;
        };
        /**
         * Coin defines a token with a denomination and an amount.
         *
         * NOTE: The amount field is an Int which implements the custom method
         * signatures required by gogoproto.
         */
        base_investmint_amount_ampere?: {
          denom?: string;
          amount?: string;
        };
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name DmnParams
   * @request GET:/cyber/dmn/v1beta1/dmn/params
   */
  dmnParams: (params?: RequestParams) => Promise<
    AxiosResponse<{
      params?: {
        /** @format int64 */
        max_slots?: number;
        /** @format int64 */
        max_gas?: number;
        /** @format int64 */
        fee_ttl?: number;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Thought
   * @request GET:/cyber/dmn/v1beta1/dmn/thought
   */
  thought: (
    query?: {
      program?: string;
      name?: string;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      thought?: {
        program?: string;
        trigger?: {
          /** @format uint64 */
          period?: string;
          /** @format uint64 */
          block?: string;
        };
        load?: {
          input?: string;
          /**
           * Coin defines a token with a denomination and an amount.
           *
           * NOTE: The amount field is an Int which implements the custom method
           * signatures required by gogoproto.
           */
          gas_price?: {
            denom?: string;
            amount?: string;
          };
        };
        name?: string;
        particle?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name ThoughtStats
   * @request GET:/cyber/dmn/v1beta1/dmn/thought_stats
   */
  thoughtStats: (
    query?: {
      program?: string;
      name?: string;
    },
    params?: RequestParams
  ) => Promise<
    AxiosResponse<{
      thought_stats?: {
        program?: string;
        name?: string;
        /** @format uint64 */
        calls?: string;
        /** @format uint64 */
        fees?: string;
        /** @format uint64 */
        gas?: string;
        /** @format uint64 */
        last_block?: string;
      };
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name Thoughts
   * @request GET:/cyber/dmn/v1beta1/dmn/thoughts
   */
  thoughts: (params?: RequestParams) => Promise<
    AxiosResponse<{
      thoughts?: {
        program?: string;
        trigger?: {
          /** @format uint64 */
          period?: string;
          /** @format uint64 */
          block?: string;
        };
        load?: {
          input?: string;
          /**
           * Coin defines a token with a denomination and an amount.
           *
           * NOTE: The amount field is an Int which implements the custom method
           * signatures required by gogoproto.
           */
          gas_price?: {
            denom?: string;
            amount?: string;
          };
        };
        name?: string;
        particle?: string;
      }[];
    }>
  >;
  /**
   * No description
   *
   * @tags Query
   * @name ThoughtsStats
   * @request GET:/cyber/dmn/v1beta1/dmn/thoughts_stats
   */
  thoughtsStats: (params?: RequestParams) => Promise<
    AxiosResponse<{
      thoughts_stats?: {
        program?: string;
        name?: string;
        /** @format uint64 */
        calls?: string;
        /** @format uint64 */
        fees?: string;
        /** @format uint64 */
        gas?: string;
        /** @format uint64 */
        last_block?: string;
      }[];
    }>
  >;
}
