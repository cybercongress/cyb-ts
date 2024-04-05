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
  BacklinksData,
  BandwidthParamsData,
  DestinationRoutedEnergyData,
  DestinationRoutesData,
  DmnParamsData,
  GraphStatsData,
  GridParamsData,
  InvestmintData,
  IsAnyLinkExistData,
  IsLinkExistData,
  KarmaData,
  LoadData,
  NegentropyData,
  NeuronBandwidthData,
  ParticleNegentropyData,
  PriceData,
  RankData,
  RankParamsData,
  ResourcesParamsData,
  RouteData,
  RoutesData,
  SearchData,
  SourceRoutedEnergyData,
  SourceRoutesData,
  ThoughtData,
  ThoughtStatsData,
  ThoughtsData,
  ThoughtsStatsData,
  TopData,
  TotalBandwidthData,
} from './data-contracts';
import { HttpClient, RequestParams } from './http-client';

export class Cyber<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Query
   * @name GraphStats
   * @request GET:/cyber/graph/v1beta1/graph_stats
   */
  graphStats = (params: RequestParams = {}) =>
    this.request<
      GraphStatsData,
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
      path: `/cyber/graph/v1beta1/graph_stats`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name IsAnyLinkExist
   * @request GET:/cyber/rank/v1beta1/is_any_link_exist
   */
  isAnyLinkExist = (
    query?: {
      from?: string;
      to?: string;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      IsAnyLinkExistData,
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
      path: `/cyber/rank/v1beta1/is_any_link_exist`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name IsLinkExist
   * @request GET:/cyber/rank/v1beta1/is_link_exist
   */
  isLinkExist = (
    query?: {
      from?: string;
      to?: string;
      address?: string;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      IsLinkExistData,
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
      path: `/cyber/rank/v1beta1/is_link_exist`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Karma
   * @request GET:/cyber/rank/v1beta1/karma/{neuron}
   */
  karma = (neuron: string, params: RequestParams = {}) =>
    this.request<
      KarmaData,
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
      path: `/cyber/rank/v1beta1/karma/${neuron}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Negentropy
   * @request GET:/cyber/rank/v1beta1/negentropy
   */
  negentropy = (params: RequestParams = {}) =>
    this.request<
      NegentropyData,
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
      path: `/cyber/rank/v1beta1/negentropy`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ParticleNegentropy
   * @request GET:/cyber/rank/v1beta1/negentropy/{particle}
   */
  particleNegentropy = (particle: string, params: RequestParams = {}) =>
    this.request<
      ParticleNegentropyData,
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
      path: `/cyber/rank/v1beta1/negentropy/${particle}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Backlinks
   * @request GET:/cyber/rank/v1beta1/rank/backlinks/{particle}
   */
  backlinks = (
    particle: string,
    query?: {
      /** @format int64 */
      paginationPage?: number;
      /** @format int64 */
      paginationPerPage?: number;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      BacklinksData,
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
      path: `/cyber/rank/v1beta1/rank/backlinks/${particle}`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name RankParams
   * @request GET:/cyber/rank/v1beta1/rank/params
   */
  rankParams = (params: RequestParams = {}) =>
    this.request<
      RankParamsData,
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
      path: `/cyber/rank/v1beta1/rank/params`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Rank
   * @request GET:/cyber/rank/v1beta1/rank/rank/{particle}
   */
  rank = (particle: string, params: RequestParams = {}) =>
    this.request<
      RankData,
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
      path: `/cyber/rank/v1beta1/rank/rank/${particle}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Search
   * @request GET:/cyber/rank/v1beta1/rank/search/{particle}
   */
  search = (
    particle: string,
    query?: {
      /** @format int64 */
      paginationPage?: number;
      /** @format int64 */
      paginationPerPage?: number;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      SearchData,
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
      path: `/cyber/rank/v1beta1/rank/search/${particle}`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Top
   * @request GET:/cyber/rank/v1beta1/rank/top
   */
  top = (
    query?: {
      /** @format int64 */
      page?: number;
      /** @format int64 */
      per_page?: number;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      TopData,
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
      path: `/cyber/rank/v1beta1/rank/top`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Load
   * @request GET:/cyber/bandwidth/v1beta1/bandwidth/load
   */
  load = (params: RequestParams = {}) =>
    this.request<
      LoadData,
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
      path: `/cyber/bandwidth/v1beta1/bandwidth/load`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name NeuronBandwidth
   * @request GET:/cyber/bandwidth/v1beta1/bandwidth/neuron/{neuron}
   */
  neuronBandwidth = (neuron: string, params: RequestParams = {}) =>
    this.request<
      NeuronBandwidthData,
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
      path: `/cyber/bandwidth/v1beta1/bandwidth/neuron/${neuron}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name BandwidthParams
   * @request GET:/cyber/bandwidth/v1beta1/bandwidth/params
   */
  bandwidthParams = (params: RequestParams = {}) =>
    this.request<
      BandwidthParamsData,
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
      path: `/cyber/bandwidth/v1beta1/bandwidth/params`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Price
   * @request GET:/cyber/bandwidth/v1beta1/bandwidth/price
   */
  price = (params: RequestParams = {}) =>
    this.request<
      PriceData,
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
      path: `/cyber/bandwidth/v1beta1/bandwidth/price`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name TotalBandwidth
   * @request GET:/cyber/bandwidth/v1beta1/bandwidth/total
   */
  totalBandwidth = (params: RequestParams = {}) =>
    this.request<
      TotalBandwidthData,
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
      path: `/cyber/bandwidth/v1beta1/bandwidth/total`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name DestinationRoutedEnergy
   * @request GET:/cyber/grid/v1beta1/grid/destination_routed_energy
   */
  destinationRoutedEnergy = (
    query?: {
      destination?: string;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      DestinationRoutedEnergyData,
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
      path: `/cyber/grid/v1beta1/grid/destination_routed_energy`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name DestinationRoutes
   * @request GET:/cyber/grid/v1beta1/grid/destination_routes
   */
  destinationRoutes = (
    query?: {
      destination?: string;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      DestinationRoutesData,
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
      path: `/cyber/grid/v1beta1/grid/destination_routes`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name GridParams
   * @request GET:/cyber/grid/v1beta1/grid/params
   */
  gridParams = (params: RequestParams = {}) =>
    this.request<
      GridParamsData,
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
      path: `/cyber/grid/v1beta1/grid/params`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Route
   * @request GET:/cyber/grid/v1beta1/grid/route
   */
  route = (
    query?: {
      source?: string;
      destination?: string;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      RouteData,
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
      path: `/cyber/grid/v1beta1/grid/route`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Routes
   * @request GET:/cyber/grid/v1beta1/grid/routes
   */
  routes = (
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
    params: RequestParams = {}
  ) =>
    this.request<
      RoutesData,
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
      path: `/cyber/grid/v1beta1/grid/routes`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name SourceRoutedEnergy
   * @request GET:/cyber/grid/v1beta1/grid/source_routed_energy
   */
  sourceRoutedEnergy = (
    query?: {
      source?: string;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      SourceRoutedEnergyData,
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
      path: `/cyber/grid/v1beta1/grid/source_routed_energy`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name SourceRoutes
   * @request GET:/cyber/grid/v1beta1/grid/source_routes
   */
  sourceRoutes = (
    query?: {
      source?: string;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      SourceRoutesData,
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
      path: `/cyber/grid/v1beta1/grid/source_routes`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Investmint
   * @request GET:/cyber/resources/v1beta1/resources/investmint
   */
  investmint = (
    query?: {
      amountDenom?: string;
      amountAmount?: string;
      resource?: string;
      /** @format uint64 */
      length?: string;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      InvestmintData,
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
      path: `/cyber/resources/v1beta1/resources/investmint`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ResourcesParams
   * @request GET:/cyber/resources/v1beta1/resources/params
   */
  resourcesParams = (params: RequestParams = {}) =>
    this.request<
      ResourcesParamsData,
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
      path: `/cyber/resources/v1beta1/resources/params`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name DmnParams
   * @request GET:/cyber/dmn/v1beta1/dmn/params
   */
  dmnParams = (params: RequestParams = {}) =>
    this.request<
      DmnParamsData,
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
      path: `/cyber/dmn/v1beta1/dmn/params`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Thought
   * @request GET:/cyber/dmn/v1beta1/dmn/thought
   */
  thought = (
    query?: {
      program?: string;
      name?: string;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      ThoughtData,
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
      path: `/cyber/dmn/v1beta1/dmn/thought`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ThoughtStats
   * @request GET:/cyber/dmn/v1beta1/dmn/thought_stats
   */
  thoughtStats = (
    query?: {
      program?: string;
      name?: string;
    },
    params: RequestParams = {}
  ) =>
    this.request<
      ThoughtStatsData,
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
      path: `/cyber/dmn/v1beta1/dmn/thought_stats`,
      method: 'GET',
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name Thoughts
   * @request GET:/cyber/dmn/v1beta1/dmn/thoughts
   */
  thoughts = (params: RequestParams = {}) =>
    this.request<
      ThoughtsData,
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
      path: `/cyber/dmn/v1beta1/dmn/thoughts`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Query
   * @name ThoughtsStats
   * @request GET:/cyber/dmn/v1beta1/dmn/thoughts_stats
   */
  thoughtsStats = (params: RequestParams = {}) =>
    this.request<
      ThoughtsStatsData,
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
      path: `/cyber/dmn/v1beta1/dmn/thoughts_stats`,
      method: 'GET',
      ...params,
    });
}
