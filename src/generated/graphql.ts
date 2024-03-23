import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  _coin: { input: any; output: any; }
  _text: { input: any; output: any; }
  bigint: { input: any; output: any; }
  coin: { input: any; output: any; }
  date: { input: any; output: any; }
  float8: { input: any; output: any; }
  json: { input: any; output: any; }
  jsonb: { input: any; output: any; }
  numeric: { input: any; output: any; }
  timestamp: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type BooleanComparisonExp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type IntComparisonExp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type StringComparisonExp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to compare columns of type "_coin". All fields are combined with logical 'AND'. */
export type CoinComparisonExp = {
  _eq?: InputMaybe<Scalars['_coin']['input']>;
  _gt?: InputMaybe<Scalars['_coin']['input']>;
  _gte?: InputMaybe<Scalars['_coin']['input']>;
  _in?: InputMaybe<Array<Scalars['_coin']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['_coin']['input']>;
  _lte?: InputMaybe<Scalars['_coin']['input']>;
  _neq?: InputMaybe<Scalars['_coin']['input']>;
  _nin?: InputMaybe<Array<Scalars['_coin']['input']>>;
};

/** Boolean expression to compare columns of type "_text". All fields are combined with logical 'AND'. */
export type TextComparisonExp = {
  _eq?: InputMaybe<Scalars['_text']['input']>;
  _gt?: InputMaybe<Scalars['_text']['input']>;
  _gte?: InputMaybe<Scalars['_text']['input']>;
  _in?: InputMaybe<Array<Scalars['_text']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['_text']['input']>;
  _lte?: InputMaybe<Scalars['_text']['input']>;
  _neq?: InputMaybe<Scalars['_text']['input']>;
  _nin?: InputMaybe<Array<Scalars['_text']['input']>>;
};

/** columns and relationships of "_transaction" */
export type Transaction = {
  __typename?: '_transaction';
  fee?: Maybe<Scalars['jsonb']['output']>;
  gas_used?: Maybe<Scalars['bigint']['output']>;
  gas_wanted?: Maybe<Scalars['bigint']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  index?: Maybe<Scalars['bigint']['output']>;
  involved_accounts_addresses?: Maybe<Scalars['_text']['output']>;
  logs?: Maybe<Scalars['jsonb']['output']>;
  memo?: Maybe<Scalars['String']['output']>;
  messages?: Maybe<Scalars['jsonb']['output']>;
  raw_log?: Maybe<Scalars['String']['output']>;
  signatures?: Maybe<Scalars['_text']['output']>;
  signer_infos?: Maybe<Scalars['jsonb']['output']>;
  subject1?: Maybe<Scalars['String']['output']>;
  subject2?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['jsonb']['output']>;
};


/** columns and relationships of "_transaction" */
export type TransactionFeeArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "_transaction" */
export type TransactionLogsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "_transaction" */
export type TransactionMessagesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "_transaction" */
export type TransactionSignerInfosArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "_transaction" */
export type TransactionValueArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "_transaction" */
export type TransactionAggregate = {
  __typename?: '_transaction_aggregate';
  aggregate?: Maybe<TransactionAggregateFields>;
  nodes: Array<Transaction>;
};

/** aggregate fields of "_transaction" */
export type TransactionAggregateFields = {
  __typename?: '_transaction_aggregate_fields';
  avg?: Maybe<TransactionAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<TransactionMaxFields>;
  min?: Maybe<TransactionMinFields>;
  stddev?: Maybe<TransactionStddevFields>;
  stddev_pop?: Maybe<TransactionStddevPopFields>;
  stddev_samp?: Maybe<TransactionStddevSampFields>;
  sum?: Maybe<TransactionSumFields>;
  var_pop?: Maybe<TransactionVarPopFields>;
  var_samp?: Maybe<TransactionVarSampFields>;
  variance?: Maybe<TransactionVarianceFields>;
};


/** aggregate fields of "_transaction" */
export type TransactionAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<TransactionSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type TransactionAvgFields = {
  __typename?: '_transaction_avg_fields';
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "_transaction". All fields are combined with a logical 'AND'. */
export type TransactionBoolExp = {
  _and?: InputMaybe<Array<TransactionBoolExp>>;
  _not?: InputMaybe<TransactionBoolExp>;
  _or?: InputMaybe<Array<TransactionBoolExp>>;
  fee?: InputMaybe<JsonbComparisonExp>;
  gas_used?: InputMaybe<BigintComparisonExp>;
  gas_wanted?: InputMaybe<BigintComparisonExp>;
  hash?: InputMaybe<StringComparisonExp>;
  height?: InputMaybe<BigintComparisonExp>;
  index?: InputMaybe<BigintComparisonExp>;
  involved_accounts_addresses?: InputMaybe<TextComparisonExp>;
  logs?: InputMaybe<JsonbComparisonExp>;
  memo?: InputMaybe<StringComparisonExp>;
  messages?: InputMaybe<JsonbComparisonExp>;
  raw_log?: InputMaybe<StringComparisonExp>;
  signatures?: InputMaybe<TextComparisonExp>;
  signer_infos?: InputMaybe<JsonbComparisonExp>;
  subject1?: InputMaybe<StringComparisonExp>;
  subject2?: InputMaybe<StringComparisonExp>;
  success?: InputMaybe<BooleanComparisonExp>;
  transaction_hash?: InputMaybe<StringComparisonExp>;
  type?: InputMaybe<StringComparisonExp>;
  value?: InputMaybe<JsonbComparisonExp>;
};

/** aggregate max on columns */
export type TransactionMaxFields = {
  __typename?: '_transaction_max_fields';
  gas_used?: Maybe<Scalars['bigint']['output']>;
  gas_wanted?: Maybe<Scalars['bigint']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  index?: Maybe<Scalars['bigint']['output']>;
  memo?: Maybe<Scalars['String']['output']>;
  raw_log?: Maybe<Scalars['String']['output']>;
  subject1?: Maybe<Scalars['String']['output']>;
  subject2?: Maybe<Scalars['String']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type TransactionMinFields = {
  __typename?: '_transaction_min_fields';
  gas_used?: Maybe<Scalars['bigint']['output']>;
  gas_wanted?: Maybe<Scalars['bigint']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  index?: Maybe<Scalars['bigint']['output']>;
  memo?: Maybe<Scalars['String']['output']>;
  raw_log?: Maybe<Scalars['String']['output']>;
  subject1?: Maybe<Scalars['String']['output']>;
  subject2?: Maybe<Scalars['String']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "_transaction". */
export type TransactionOrderBy = {
  fee?: InputMaybe<OrderBy>;
  gas_used?: InputMaybe<OrderBy>;
  gas_wanted?: InputMaybe<OrderBy>;
  hash?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
  index?: InputMaybe<OrderBy>;
  involved_accounts_addresses?: InputMaybe<OrderBy>;
  logs?: InputMaybe<OrderBy>;
  memo?: InputMaybe<OrderBy>;
  messages?: InputMaybe<OrderBy>;
  raw_log?: InputMaybe<OrderBy>;
  signatures?: InputMaybe<OrderBy>;
  signer_infos?: InputMaybe<OrderBy>;
  subject1?: InputMaybe<OrderBy>;
  subject2?: InputMaybe<OrderBy>;
  success?: InputMaybe<OrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select columns of table "_transaction" */
export enum TransactionSelectColumn {
  /** column name */
  Fee = 'fee',
  /** column name */
  GasUsed = 'gas_used',
  /** column name */
  GasWanted = 'gas_wanted',
  /** column name */
  Hash = 'hash',
  /** column name */
  Height = 'height',
  /** column name */
  Index = 'index',
  /** column name */
  InvolvedAccountsAddresses = 'involved_accounts_addresses',
  /** column name */
  Logs = 'logs',
  /** column name */
  Memo = 'memo',
  /** column name */
  Messages = 'messages',
  /** column name */
  RawLog = 'raw_log',
  /** column name */
  Signatures = 'signatures',
  /** column name */
  SignerInfos = 'signer_infos',
  /** column name */
  Subject1 = 'subject1',
  /** column name */
  Subject2 = 'subject2',
  /** column name */
  Success = 'success',
  /** column name */
  TransactionHash = 'transaction_hash',
  /** column name */
  Type = 'type',
  /** column name */
  Value = 'value'
}

/** aggregate stddev on columns */
export type TransactionStddevFields = {
  __typename?: '_transaction_stddev_fields';
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type TransactionStddevPopFields = {
  __typename?: '_transaction_stddev_pop_fields';
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type TransactionStddevSampFields = {
  __typename?: '_transaction_stddev_samp_fields';
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type TransactionSumFields = {
  __typename?: '_transaction_sum_fields';
  gas_used?: Maybe<Scalars['bigint']['output']>;
  gas_wanted?: Maybe<Scalars['bigint']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  index?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type TransactionVarPopFields = {
  __typename?: '_transaction_var_pop_fields';
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type TransactionVarSampFields = {
  __typename?: '_transaction_var_samp_fields';
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type TransactionVarianceFields = {
  __typename?: '_transaction_variance_fields';
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "_uptime_temp" */
export type UptimeTemp = {
  __typename?: '_uptime_temp';
  pre_commits?: Maybe<Scalars['bigint']['output']>;
  validator_address?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "_uptime_temp" */
export type UptimeTempAggregate = {
  __typename?: '_uptime_temp_aggregate';
  aggregate?: Maybe<UptimeTempAggregateFields>;
  nodes: Array<UptimeTemp>;
};

/** aggregate fields of "_uptime_temp" */
export type UptimeTempAggregateFields = {
  __typename?: '_uptime_temp_aggregate_fields';
  avg?: Maybe<UptimeTempAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<UptimeTempMaxFields>;
  min?: Maybe<UptimeTempMinFields>;
  stddev?: Maybe<UptimeTempStddevFields>;
  stddev_pop?: Maybe<UptimeTempStddevPopFields>;
  stddev_samp?: Maybe<UptimeTempStddevSampFields>;
  sum?: Maybe<UptimeTempSumFields>;
  var_pop?: Maybe<UptimeTempVarPopFields>;
  var_samp?: Maybe<UptimeTempVarSampFields>;
  variance?: Maybe<UptimeTempVarianceFields>;
};


/** aggregate fields of "_uptime_temp" */
export type UptimeTempAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<UptimeTempSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type UptimeTempAvgFields = {
  __typename?: '_uptime_temp_avg_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "_uptime_temp". All fields are combined with a logical 'AND'. */
export type UptimeTempBoolExp = {
  _and?: InputMaybe<Array<UptimeTempBoolExp>>;
  _not?: InputMaybe<UptimeTempBoolExp>;
  _or?: InputMaybe<Array<UptimeTempBoolExp>>;
  pre_commits?: InputMaybe<BigintComparisonExp>;
  validator_address?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type UptimeTempMaxFields = {
  __typename?: '_uptime_temp_max_fields';
  pre_commits?: Maybe<Scalars['bigint']['output']>;
  validator_address?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type UptimeTempMinFields = {
  __typename?: '_uptime_temp_min_fields';
  pre_commits?: Maybe<Scalars['bigint']['output']>;
  validator_address?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "_uptime_temp". */
export type UptimeTempOrderBy = {
  pre_commits?: InputMaybe<OrderBy>;
  validator_address?: InputMaybe<OrderBy>;
};

/** select columns of table "_uptime_temp" */
export enum UptimeTempSelectColumn {
  /** column name */
  PreCommits = 'pre_commits',
  /** column name */
  ValidatorAddress = 'validator_address'
}

/** aggregate stddev on columns */
export type UptimeTempStddevFields = {
  __typename?: '_uptime_temp_stddev_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type UptimeTempStddevPopFields = {
  __typename?: '_uptime_temp_stddev_pop_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type UptimeTempStddevSampFields = {
  __typename?: '_uptime_temp_stddev_samp_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type UptimeTempSumFields = {
  __typename?: '_uptime_temp_sum_fields';
  pre_commits?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type UptimeTempVarPopFields = {
  __typename?: '_uptime_temp_var_pop_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type UptimeTempVarSampFields = {
  __typename?: '_uptime_temp_var_samp_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type UptimeTempVarianceFields = {
  __typename?: '_uptime_temp_variance_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "account" */
export type Account = {
  __typename?: 'account';
  /** An object relationship */
  account_balance?: Maybe<AccountBalance>;
  address: Scalars['String']['output'];
  /** fetch data from the table: "cyberlinks" */
  cyberlinks: Array<Cyberlinks>;
  /** An aggregate relationship */
  cyberlinks_aggregate: CyberlinksAggregate;
  /** An array relationship */
  investmints: Array<Investmints>;
  /** An aggregate relationship */
  investmints_aggregate: InvestmintsAggregate;
  /** An array relationship */
  particles: Array<Particles>;
  /** An aggregate relationship */
  particles_aggregate: ParticlesAggregate;
  /** An array relationship */
  routes: Array<Routes>;
  /** An array relationship */
  routesBySource: Array<Routes>;
  /** An aggregate relationship */
  routesBySource_aggregate: RoutesAggregate;
  /** An aggregate relationship */
  routes_aggregate: RoutesAggregate;
};


/** columns and relationships of "account" */
export type AccountCyberlinksArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksOrderBy>>;
  where?: InputMaybe<CyberlinksBoolExp>;
};


/** columns and relationships of "account" */
export type AccountCyberlinksAggregateArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksOrderBy>>;
  where?: InputMaybe<CyberlinksBoolExp>;
};


/** columns and relationships of "account" */
export type AccountInvestmintsArgs = {
  distinct_on?: InputMaybe<Array<InvestmintsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InvestmintsOrderBy>>;
  where?: InputMaybe<InvestmintsBoolExp>;
};


/** columns and relationships of "account" */
export type AccountInvestmintsAggregateArgs = {
  distinct_on?: InputMaybe<Array<InvestmintsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InvestmintsOrderBy>>;
  where?: InputMaybe<InvestmintsBoolExp>;
};


/** columns and relationships of "account" */
export type AccountParticlesArgs = {
  distinct_on?: InputMaybe<Array<ParticlesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ParticlesOrderBy>>;
  where?: InputMaybe<ParticlesBoolExp>;
};


/** columns and relationships of "account" */
export type AccountParticlesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ParticlesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ParticlesOrderBy>>;
  where?: InputMaybe<ParticlesBoolExp>;
};


/** columns and relationships of "account" */
export type AccountRoutesArgs = {
  distinct_on?: InputMaybe<Array<RoutesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RoutesOrderBy>>;
  where?: InputMaybe<RoutesBoolExp>;
};


/** columns and relationships of "account" */
export type AccountRoutesBySourceArgs = {
  distinct_on?: InputMaybe<Array<RoutesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RoutesOrderBy>>;
  where?: InputMaybe<RoutesBoolExp>;
};


/** columns and relationships of "account" */
export type AccountRoutesBySourceAggregateArgs = {
  distinct_on?: InputMaybe<Array<RoutesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RoutesOrderBy>>;
  where?: InputMaybe<RoutesBoolExp>;
};


/** columns and relationships of "account" */
export type AccountRoutesAggregateArgs = {
  distinct_on?: InputMaybe<Array<RoutesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RoutesOrderBy>>;
  where?: InputMaybe<RoutesBoolExp>;
};

/** aggregated selection of "account" */
export type AccountAggregate = {
  __typename?: 'account_aggregate';
  aggregate?: Maybe<AccountAggregateFields>;
  nodes: Array<Account>;
};

/** aggregate fields of "account" */
export type AccountAggregateFields = {
  __typename?: 'account_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<AccountMaxFields>;
  min?: Maybe<AccountMinFields>;
};


/** aggregate fields of "account" */
export type AccountAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AccountSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** columns and relationships of "account_balance" */
export type AccountBalance = {
  __typename?: 'account_balance';
  /** An object relationship */
  account: Account;
  address: Scalars['String']['output'];
  coins: Scalars['_coin']['output'];
  height: Scalars['bigint']['output'];
};

/** aggregated selection of "account_balance" */
export type AccountBalanceAggregate = {
  __typename?: 'account_balance_aggregate';
  aggregate?: Maybe<AccountBalanceAggregateFields>;
  nodes: Array<AccountBalance>;
};

/** aggregate fields of "account_balance" */
export type AccountBalanceAggregateFields = {
  __typename?: 'account_balance_aggregate_fields';
  avg?: Maybe<AccountBalanceAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<AccountBalanceMaxFields>;
  min?: Maybe<AccountBalanceMinFields>;
  stddev?: Maybe<AccountBalanceStddevFields>;
  stddev_pop?: Maybe<AccountBalanceStddevPopFields>;
  stddev_samp?: Maybe<AccountBalanceStddevSampFields>;
  sum?: Maybe<AccountBalanceSumFields>;
  var_pop?: Maybe<AccountBalanceVarPopFields>;
  var_samp?: Maybe<AccountBalanceVarSampFields>;
  variance?: Maybe<AccountBalanceVarianceFields>;
};


/** aggregate fields of "account_balance" */
export type AccountBalanceAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<AccountBalanceSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type AccountBalanceAvgFields = {
  __typename?: 'account_balance_avg_fields';
  height?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "account_balance". All fields are combined with a logical 'AND'. */
export type AccountBalanceBoolExp = {
  _and?: InputMaybe<Array<AccountBalanceBoolExp>>;
  _not?: InputMaybe<AccountBalanceBoolExp>;
  _or?: InputMaybe<Array<AccountBalanceBoolExp>>;
  account?: InputMaybe<AccountBoolExp>;
  address?: InputMaybe<StringComparisonExp>;
  coins?: InputMaybe<CoinComparisonExp>;
  height?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type AccountBalanceMaxFields = {
  __typename?: 'account_balance_max_fields';
  address?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type AccountBalanceMinFields = {
  __typename?: 'account_balance_min_fields';
  address?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "account_balance". */
export type AccountBalanceOrderBy = {
  account?: InputMaybe<AccountOrderBy>;
  address?: InputMaybe<OrderBy>;
  coins?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
};

/** select columns of table "account_balance" */
export enum AccountBalanceSelectColumn {
  /** column name */
  Address = 'address',
  /** column name */
  Coins = 'coins',
  /** column name */
  Height = 'height'
}

/** aggregate stddev on columns */
export type AccountBalanceStddevFields = {
  __typename?: 'account_balance_stddev_fields';
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type AccountBalanceStddevPopFields = {
  __typename?: 'account_balance_stddev_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type AccountBalanceStddevSampFields = {
  __typename?: 'account_balance_stddev_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type AccountBalanceSumFields = {
  __typename?: 'account_balance_sum_fields';
  height?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type AccountBalanceVarPopFields = {
  __typename?: 'account_balance_var_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type AccountBalanceVarSampFields = {
  __typename?: 'account_balance_var_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type AccountBalanceVarianceFields = {
  __typename?: 'account_balance_variance_fields';
  height?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "account". All fields are combined with a logical 'AND'. */
export type AccountBoolExp = {
  _and?: InputMaybe<Array<AccountBoolExp>>;
  _not?: InputMaybe<AccountBoolExp>;
  _or?: InputMaybe<Array<AccountBoolExp>>;
  account_balance?: InputMaybe<AccountBalanceBoolExp>;
  address?: InputMaybe<StringComparisonExp>;
  cyberlinks?: InputMaybe<CyberlinksBoolExp>;
  investmints?: InputMaybe<InvestmintsBoolExp>;
  particles?: InputMaybe<ParticlesBoolExp>;
  routes?: InputMaybe<RoutesBoolExp>;
  routesBySource?: InputMaybe<RoutesBoolExp>;
};

/** aggregate max on columns */
export type AccountMaxFields = {
  __typename?: 'account_max_fields';
  address?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type AccountMinFields = {
  __typename?: 'account_min_fields';
  address?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "account". */
export type AccountOrderBy = {
  account_balance?: InputMaybe<AccountBalanceOrderBy>;
  address?: InputMaybe<OrderBy>;
  cyberlinks_aggregate?: InputMaybe<CyberlinksAggregateOrderBy>;
  investmints_aggregate?: InputMaybe<InvestmintsAggregateOrderBy>;
  particles_aggregate?: InputMaybe<ParticlesAggregateOrderBy>;
  routesBySource_aggregate?: InputMaybe<RoutesAggregateOrderBy>;
  routes_aggregate?: InputMaybe<RoutesAggregateOrderBy>;
};

/** select columns of table "account" */
export enum AccountSelectColumn {
  /** column name */
  Address = 'address'
}

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type BigintComparisonExp = {
  _eq?: InputMaybe<Scalars['bigint']['input']>;
  _gt?: InputMaybe<Scalars['bigint']['input']>;
  _gte?: InputMaybe<Scalars['bigint']['input']>;
  _in?: InputMaybe<Array<Scalars['bigint']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['bigint']['input']>;
  _lte?: InputMaybe<Scalars['bigint']['input']>;
  _neq?: InputMaybe<Scalars['bigint']['input']>;
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>;
};

/** columns and relationships of "block" */
export type Block = {
  __typename?: 'block';
  /** fetch data from the table: "cyberlinks" */
  cyberlinks: Array<Cyberlinks>;
  /** An aggregate relationship */
  cyberlinks_aggregate: CyberlinksAggregate;
  hash: Scalars['String']['output'];
  height: Scalars['bigint']['output'];
  /** An array relationship */
  investmints: Array<Investmints>;
  /** An aggregate relationship */
  investmints_aggregate: InvestmintsAggregate;
  num_txs?: Maybe<Scalars['Int']['output']>;
  /** An array relationship */
  particles: Array<Particles>;
  /** An aggregate relationship */
  particles_aggregate: ParticlesAggregate;
  proposer_address?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  routes: Array<Routes>;
  /** An aggregate relationship */
  routes_aggregate: RoutesAggregate;
  timestamp: Scalars['timestamp']['output'];
  total_gas?: Maybe<Scalars['bigint']['output']>;
  /** An array relationship */
  transactions: Array<Transaction>;
  /** An aggregate relationship */
  transactions_aggregate: TransactionAggregate;
  /** An object relationship */
  validator?: Maybe<Validator>;
};


/** columns and relationships of "block" */
export type BlockCyberlinksArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksOrderBy>>;
  where?: InputMaybe<CyberlinksBoolExp>;
};


/** columns and relationships of "block" */
export type BlockCyberlinksAggregateArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksOrderBy>>;
  where?: InputMaybe<CyberlinksBoolExp>;
};


/** columns and relationships of "block" */
export type BlockInvestmintsArgs = {
  distinct_on?: InputMaybe<Array<InvestmintsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InvestmintsOrderBy>>;
  where?: InputMaybe<InvestmintsBoolExp>;
};


/** columns and relationships of "block" */
export type BlockInvestmintsAggregateArgs = {
  distinct_on?: InputMaybe<Array<InvestmintsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InvestmintsOrderBy>>;
  where?: InputMaybe<InvestmintsBoolExp>;
};


/** columns and relationships of "block" */
export type BlockParticlesArgs = {
  distinct_on?: InputMaybe<Array<ParticlesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ParticlesOrderBy>>;
  where?: InputMaybe<ParticlesBoolExp>;
};


/** columns and relationships of "block" */
export type BlockParticlesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ParticlesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ParticlesOrderBy>>;
  where?: InputMaybe<ParticlesBoolExp>;
};


/** columns and relationships of "block" */
export type BlockRoutesArgs = {
  distinct_on?: InputMaybe<Array<RoutesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RoutesOrderBy>>;
  where?: InputMaybe<RoutesBoolExp>;
};


/** columns and relationships of "block" */
export type BlockRoutesAggregateArgs = {
  distinct_on?: InputMaybe<Array<RoutesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RoutesOrderBy>>;
  where?: InputMaybe<RoutesBoolExp>;
};


/** columns and relationships of "block" */
export type BlockTransactionsArgs = {
  distinct_on?: InputMaybe<Array<TransactionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TransactionOrderBy>>;
  where?: InputMaybe<TransactionBoolExp>;
};


/** columns and relationships of "block" */
export type BlockTransactionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<TransactionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TransactionOrderBy>>;
  where?: InputMaybe<TransactionBoolExp>;
};

/** aggregated selection of "block" */
export type BlockAggregate = {
  __typename?: 'block_aggregate';
  aggregate?: Maybe<BlockAggregateFields>;
  nodes: Array<Block>;
};

/** aggregate fields of "block" */
export type BlockAggregateFields = {
  __typename?: 'block_aggregate_fields';
  avg?: Maybe<BlockAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<BlockMaxFields>;
  min?: Maybe<BlockMinFields>;
  stddev?: Maybe<BlockStddevFields>;
  stddev_pop?: Maybe<BlockStddevPopFields>;
  stddev_samp?: Maybe<BlockStddevSampFields>;
  sum?: Maybe<BlockSumFields>;
  var_pop?: Maybe<BlockVarPopFields>;
  var_samp?: Maybe<BlockVarSampFields>;
  variance?: Maybe<BlockVarianceFields>;
};


/** aggregate fields of "block" */
export type BlockAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BlockSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "block" */
export type BlockAggregateOrderBy = {
  avg?: InputMaybe<BlockAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BlockMaxOrderBy>;
  min?: InputMaybe<BlockMinOrderBy>;
  stddev?: InputMaybe<BlockStddevOrderBy>;
  stddev_pop?: InputMaybe<BlockStddevPopOrderBy>;
  stddev_samp?: InputMaybe<BlockStddevSampOrderBy>;
  sum?: InputMaybe<BlockSumOrderBy>;
  var_pop?: InputMaybe<BlockVarPopOrderBy>;
  var_samp?: InputMaybe<BlockVarSampOrderBy>;
  variance?: InputMaybe<BlockVarianceOrderBy>;
};

/** aggregate avg on columns */
export type BlockAvgFields = {
  __typename?: 'block_avg_fields';
  height?: Maybe<Scalars['Float']['output']>;
  num_txs?: Maybe<Scalars['Float']['output']>;
  total_gas?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "block" */
export type BlockAvgOrderBy = {
  height?: InputMaybe<OrderBy>;
  num_txs?: InputMaybe<OrderBy>;
  total_gas?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "block". All fields are combined with a logical 'AND'. */
export type BlockBoolExp = {
  _and?: InputMaybe<Array<BlockBoolExp>>;
  _not?: InputMaybe<BlockBoolExp>;
  _or?: InputMaybe<Array<BlockBoolExp>>;
  cyberlinks?: InputMaybe<CyberlinksBoolExp>;
  hash?: InputMaybe<StringComparisonExp>;
  height?: InputMaybe<BigintComparisonExp>;
  investmints?: InputMaybe<InvestmintsBoolExp>;
  num_txs?: InputMaybe<IntComparisonExp>;
  particles?: InputMaybe<ParticlesBoolExp>;
  proposer_address?: InputMaybe<StringComparisonExp>;
  routes?: InputMaybe<RoutesBoolExp>;
  timestamp?: InputMaybe<TimestampComparisonExp>;
  total_gas?: InputMaybe<BigintComparisonExp>;
  transactions?: InputMaybe<TransactionBoolExp>;
  validator?: InputMaybe<ValidatorBoolExp>;
};

/** aggregate max on columns */
export type BlockMaxFields = {
  __typename?: 'block_max_fields';
  hash?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  num_txs?: Maybe<Scalars['Int']['output']>;
  proposer_address?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  total_gas?: Maybe<Scalars['bigint']['output']>;
};

/** order by max() on columns of table "block" */
export type BlockMaxOrderBy = {
  hash?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
  num_txs?: InputMaybe<OrderBy>;
  proposer_address?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  total_gas?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BlockMinFields = {
  __typename?: 'block_min_fields';
  hash?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  num_txs?: Maybe<Scalars['Int']['output']>;
  proposer_address?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  total_gas?: Maybe<Scalars['bigint']['output']>;
};

/** order by min() on columns of table "block" */
export type BlockMinOrderBy = {
  hash?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
  num_txs?: InputMaybe<OrderBy>;
  proposer_address?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  total_gas?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "block". */
export type BlockOrderBy = {
  cyberlinks_aggregate?: InputMaybe<CyberlinksAggregateOrderBy>;
  hash?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
  investmints_aggregate?: InputMaybe<InvestmintsAggregateOrderBy>;
  num_txs?: InputMaybe<OrderBy>;
  particles_aggregate?: InputMaybe<ParticlesAggregateOrderBy>;
  proposer_address?: InputMaybe<OrderBy>;
  routes_aggregate?: InputMaybe<RoutesAggregateOrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  total_gas?: InputMaybe<OrderBy>;
  transactions_aggregate?: InputMaybe<TransactionAggregateOrderBy>;
  validator?: InputMaybe<ValidatorOrderBy>;
};

/** select columns of table "block" */
export enum BlockSelectColumn {
  /** column name */
  Hash = 'hash',
  /** column name */
  Height = 'height',
  /** column name */
  NumTxs = 'num_txs',
  /** column name */
  ProposerAddress = 'proposer_address',
  /** column name */
  Timestamp = 'timestamp',
  /** column name */
  TotalGas = 'total_gas'
}

/** aggregate stddev on columns */
export type BlockStddevFields = {
  __typename?: 'block_stddev_fields';
  height?: Maybe<Scalars['Float']['output']>;
  num_txs?: Maybe<Scalars['Float']['output']>;
  total_gas?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "block" */
export type BlockStddevOrderBy = {
  height?: InputMaybe<OrderBy>;
  num_txs?: InputMaybe<OrderBy>;
  total_gas?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type BlockStddevPopFields = {
  __typename?: 'block_stddev_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  num_txs?: Maybe<Scalars['Float']['output']>;
  total_gas?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "block" */
export type BlockStddevPopOrderBy = {
  height?: InputMaybe<OrderBy>;
  num_txs?: InputMaybe<OrderBy>;
  total_gas?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type BlockStddevSampFields = {
  __typename?: 'block_stddev_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  num_txs?: Maybe<Scalars['Float']['output']>;
  total_gas?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "block" */
export type BlockStddevSampOrderBy = {
  height?: InputMaybe<OrderBy>;
  num_txs?: InputMaybe<OrderBy>;
  total_gas?: InputMaybe<OrderBy>;
};

/** aggregate sum on columns */
export type BlockSumFields = {
  __typename?: 'block_sum_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  num_txs?: Maybe<Scalars['Int']['output']>;
  total_gas?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "block" */
export type BlockSumOrderBy = {
  height?: InputMaybe<OrderBy>;
  num_txs?: InputMaybe<OrderBy>;
  total_gas?: InputMaybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type BlockVarPopFields = {
  __typename?: 'block_var_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  num_txs?: Maybe<Scalars['Float']['output']>;
  total_gas?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "block" */
export type BlockVarPopOrderBy = {
  height?: InputMaybe<OrderBy>;
  num_txs?: InputMaybe<OrderBy>;
  total_gas?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type BlockVarSampFields = {
  __typename?: 'block_var_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  num_txs?: Maybe<Scalars['Float']['output']>;
  total_gas?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "block" */
export type BlockVarSampOrderBy = {
  height?: InputMaybe<OrderBy>;
  num_txs?: InputMaybe<OrderBy>;
  total_gas?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BlockVarianceFields = {
  __typename?: 'block_variance_fields';
  height?: Maybe<Scalars['Float']['output']>;
  num_txs?: Maybe<Scalars['Float']['output']>;
  total_gas?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "block" */
export type BlockVarianceOrderBy = {
  height?: InputMaybe<OrderBy>;
  num_txs?: InputMaybe<OrderBy>;
  total_gas?: InputMaybe<OrderBy>;
};

/** Boolean expression to compare columns of type "coin". All fields are combined with logical 'AND'. */
export type CoinComparisonExp = {
  _eq?: InputMaybe<Scalars['coin']['input']>;
  _gt?: InputMaybe<Scalars['coin']['input']>;
  _gte?: InputMaybe<Scalars['coin']['input']>;
  _in?: InputMaybe<Array<Scalars['coin']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['coin']['input']>;
  _lte?: InputMaybe<Scalars['coin']['input']>;
  _neq?: InputMaybe<Scalars['coin']['input']>;
  _nin?: InputMaybe<Array<Scalars['coin']['input']>>;
};

/** columns and relationships of "contracts" */
export type Contracts = {
  __typename?: 'contracts';
  address: Scalars['String']['output'];
  admin: Scalars['String']['output'];
  code_id: Scalars['bigint']['output'];
  creation_time: Scalars['String']['output'];
  creator: Scalars['String']['output'];
  fees: Scalars['bigint']['output'];
  gas: Scalars['bigint']['output'];
  height: Scalars['bigint']['output'];
  label: Scalars['String']['output'];
  tx: Scalars['bigint']['output'];
};

/** aggregated selection of "contracts" */
export type ContractsAggregate = {
  __typename?: 'contracts_aggregate';
  aggregate?: Maybe<ContractsAggregateFields>;
  nodes: Array<Contracts>;
};

/** aggregate fields of "contracts" */
export type ContractsAggregateFields = {
  __typename?: 'contracts_aggregate_fields';
  avg?: Maybe<ContractsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<ContractsMaxFields>;
  min?: Maybe<ContractsMinFields>;
  stddev?: Maybe<ContractsStddevFields>;
  stddev_pop?: Maybe<ContractsStddevPopFields>;
  stddev_samp?: Maybe<ContractsStddevSampFields>;
  sum?: Maybe<ContractsSumFields>;
  var_pop?: Maybe<ContractsVarPopFields>;
  var_samp?: Maybe<ContractsVarSampFields>;
  variance?: Maybe<ContractsVarianceFields>;
};


/** aggregate fields of "contracts" */
export type ContractsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ContractsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type ContractsAvgFields = {
  __typename?: 'contracts_avg_fields';
  code_id?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  gas?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  tx?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "contracts". All fields are combined with a logical 'AND'. */
export type ContractsBoolExp = {
  _and?: InputMaybe<Array<ContractsBoolExp>>;
  _not?: InputMaybe<ContractsBoolExp>;
  _or?: InputMaybe<Array<ContractsBoolExp>>;
  address?: InputMaybe<StringComparisonExp>;
  admin?: InputMaybe<StringComparisonExp>;
  code_id?: InputMaybe<BigintComparisonExp>;
  creation_time?: InputMaybe<StringComparisonExp>;
  creator?: InputMaybe<StringComparisonExp>;
  fees?: InputMaybe<BigintComparisonExp>;
  gas?: InputMaybe<BigintComparisonExp>;
  height?: InputMaybe<BigintComparisonExp>;
  label?: InputMaybe<StringComparisonExp>;
  tx?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type ContractsMaxFields = {
  __typename?: 'contracts_max_fields';
  address?: Maybe<Scalars['String']['output']>;
  admin?: Maybe<Scalars['String']['output']>;
  code_id?: Maybe<Scalars['bigint']['output']>;
  creation_time?: Maybe<Scalars['String']['output']>;
  creator?: Maybe<Scalars['String']['output']>;
  fees?: Maybe<Scalars['bigint']['output']>;
  gas?: Maybe<Scalars['bigint']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  tx?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type ContractsMinFields = {
  __typename?: 'contracts_min_fields';
  address?: Maybe<Scalars['String']['output']>;
  admin?: Maybe<Scalars['String']['output']>;
  code_id?: Maybe<Scalars['bigint']['output']>;
  creation_time?: Maybe<Scalars['String']['output']>;
  creator?: Maybe<Scalars['String']['output']>;
  fees?: Maybe<Scalars['bigint']['output']>;
  gas?: Maybe<Scalars['bigint']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  tx?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "contracts". */
export type ContractsOrderBy = {
  address?: InputMaybe<OrderBy>;
  admin?: InputMaybe<OrderBy>;
  code_id?: InputMaybe<OrderBy>;
  creation_time?: InputMaybe<OrderBy>;
  creator?: InputMaybe<OrderBy>;
  fees?: InputMaybe<OrderBy>;
  gas?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
  label?: InputMaybe<OrderBy>;
  tx?: InputMaybe<OrderBy>;
};

/** select columns of table "contracts" */
export enum ContractsSelectColumn {
  /** column name */
  Address = 'address',
  /** column name */
  Admin = 'admin',
  /** column name */
  CodeId = 'code_id',
  /** column name */
  CreationTime = 'creation_time',
  /** column name */
  Creator = 'creator',
  /** column name */
  Fees = 'fees',
  /** column name */
  Gas = 'gas',
  /** column name */
  Height = 'height',
  /** column name */
  Label = 'label',
  /** column name */
  Tx = 'tx'
}

/** aggregate stddev on columns */
export type ContractsStddevFields = {
  __typename?: 'contracts_stddev_fields';
  code_id?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  gas?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  tx?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type ContractsStddevPopFields = {
  __typename?: 'contracts_stddev_pop_fields';
  code_id?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  gas?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  tx?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type ContractsStddevSampFields = {
  __typename?: 'contracts_stddev_samp_fields';
  code_id?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  gas?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  tx?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type ContractsSumFields = {
  __typename?: 'contracts_sum_fields';
  code_id?: Maybe<Scalars['bigint']['output']>;
  fees?: Maybe<Scalars['bigint']['output']>;
  gas?: Maybe<Scalars['bigint']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  tx?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type ContractsVarPopFields = {
  __typename?: 'contracts_var_pop_fields';
  code_id?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  gas?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  tx?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type ContractsVarSampFields = {
  __typename?: 'contracts_var_samp_fields';
  code_id?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  gas?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  tx?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type ContractsVarianceFields = {
  __typename?: 'contracts_variance_fields';
  code_id?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  gas?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  tx?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "cyb_cohort" */
export type CybCohort = {
  __typename?: 'cyb_cohort';
  cyberlink_10_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_percent?: Maybe<Scalars['float8']['output']>;
  hero_hired_percent?: Maybe<Scalars['float8']['output']>;
  investmint_percent?: Maybe<Scalars['float8']['output']>;
  neurons_activated?: Maybe<Scalars['bigint']['output']>;
  redelegation_percent?: Maybe<Scalars['float8']['output']>;
  swap_percent?: Maybe<Scalars['float8']['output']>;
  undelegation_percent?: Maybe<Scalars['float8']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** aggregated selection of "cyb_cohort" */
export type CybCohortAggregate = {
  __typename?: 'cyb_cohort_aggregate';
  aggregate?: Maybe<CybCohortAggregateFields>;
  nodes: Array<CybCohort>;
};

/** aggregate fields of "cyb_cohort" */
export type CybCohortAggregateFields = {
  __typename?: 'cyb_cohort_aggregate_fields';
  avg?: Maybe<CybCohortAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<CybCohortMaxFields>;
  min?: Maybe<CybCohortMinFields>;
  stddev?: Maybe<CybCohortStddevFields>;
  stddev_pop?: Maybe<CybCohortStddevPopFields>;
  stddev_samp?: Maybe<CybCohortStddevSampFields>;
  sum?: Maybe<CybCohortSumFields>;
  var_pop?: Maybe<CybCohortVarPopFields>;
  var_samp?: Maybe<CybCohortVarSampFields>;
  variance?: Maybe<CybCohortVarianceFields>;
};


/** aggregate fields of "cyb_cohort" */
export type CybCohortAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CybCohortSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type CybCohortAvgFields = {
  __typename?: 'cyb_cohort_avg_fields';
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neurons_activated?: Maybe<Scalars['Float']['output']>;
  redelegation_percent?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
  undelegation_percent?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "cyb_cohort". All fields are combined with a logical 'AND'. */
export type CybCohortBoolExp = {
  _and?: InputMaybe<Array<CybCohortBoolExp>>;
  _not?: InputMaybe<CybCohortBoolExp>;
  _or?: InputMaybe<Array<CybCohortBoolExp>>;
  cyberlink_10_percent?: InputMaybe<Float8ComparisonExp>;
  cyberlink_100_percent?: InputMaybe<Float8ComparisonExp>;
  cyberlink_percent?: InputMaybe<Float8ComparisonExp>;
  hero_hired_percent?: InputMaybe<Float8ComparisonExp>;
  investmint_percent?: InputMaybe<Float8ComparisonExp>;
  neurons_activated?: InputMaybe<BigintComparisonExp>;
  redelegation_percent?: InputMaybe<Float8ComparisonExp>;
  swap_percent?: InputMaybe<Float8ComparisonExp>;
  undelegation_percent?: InputMaybe<Float8ComparisonExp>;
  week?: InputMaybe<DateComparisonExp>;
};

/** aggregate max on columns */
export type CybCohortMaxFields = {
  __typename?: 'cyb_cohort_max_fields';
  cyberlink_10_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_percent?: Maybe<Scalars['float8']['output']>;
  hero_hired_percent?: Maybe<Scalars['float8']['output']>;
  investmint_percent?: Maybe<Scalars['float8']['output']>;
  neurons_activated?: Maybe<Scalars['bigint']['output']>;
  redelegation_percent?: Maybe<Scalars['float8']['output']>;
  swap_percent?: Maybe<Scalars['float8']['output']>;
  undelegation_percent?: Maybe<Scalars['float8']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** aggregate min on columns */
export type CybCohortMinFields = {
  __typename?: 'cyb_cohort_min_fields';
  cyberlink_10_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_percent?: Maybe<Scalars['float8']['output']>;
  hero_hired_percent?: Maybe<Scalars['float8']['output']>;
  investmint_percent?: Maybe<Scalars['float8']['output']>;
  neurons_activated?: Maybe<Scalars['bigint']['output']>;
  redelegation_percent?: Maybe<Scalars['float8']['output']>;
  swap_percent?: Maybe<Scalars['float8']['output']>;
  undelegation_percent?: Maybe<Scalars['float8']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** Ordering options when selecting data from "cyb_cohort". */
export type CybCohortOrderBy = {
  cyberlink_10_percent?: InputMaybe<OrderBy>;
  cyberlink_100_percent?: InputMaybe<OrderBy>;
  cyberlink_percent?: InputMaybe<OrderBy>;
  hero_hired_percent?: InputMaybe<OrderBy>;
  investmint_percent?: InputMaybe<OrderBy>;
  neurons_activated?: InputMaybe<OrderBy>;
  redelegation_percent?: InputMaybe<OrderBy>;
  swap_percent?: InputMaybe<OrderBy>;
  undelegation_percent?: InputMaybe<OrderBy>;
  week?: InputMaybe<OrderBy>;
};

/** select columns of table "cyb_cohort" */
export enum CybCohortSelectColumn {
  /** column name */
  Cyberlink_10Percent = 'cyberlink_10_percent',
  /** column name */
  Cyberlink_100Percent = 'cyberlink_100_percent',
  /** column name */
  CyberlinkPercent = 'cyberlink_percent',
  /** column name */
  HeroHiredPercent = 'hero_hired_percent',
  /** column name */
  InvestmintPercent = 'investmint_percent',
  /** column name */
  NeuronsActivated = 'neurons_activated',
  /** column name */
  RedelegationPercent = 'redelegation_percent',
  /** column name */
  SwapPercent = 'swap_percent',
  /** column name */
  UndelegationPercent = 'undelegation_percent',
  /** column name */
  Week = 'week'
}

/** aggregate stddev on columns */
export type CybCohortStddevFields = {
  __typename?: 'cyb_cohort_stddev_fields';
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neurons_activated?: Maybe<Scalars['Float']['output']>;
  redelegation_percent?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
  undelegation_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type CybCohortStddevPopFields = {
  __typename?: 'cyb_cohort_stddev_pop_fields';
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neurons_activated?: Maybe<Scalars['Float']['output']>;
  redelegation_percent?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
  undelegation_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type CybCohortStddevSampFields = {
  __typename?: 'cyb_cohort_stddev_samp_fields';
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neurons_activated?: Maybe<Scalars['Float']['output']>;
  redelegation_percent?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
  undelegation_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type CybCohortSumFields = {
  __typename?: 'cyb_cohort_sum_fields';
  cyberlink_10_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_percent?: Maybe<Scalars['float8']['output']>;
  hero_hired_percent?: Maybe<Scalars['float8']['output']>;
  investmint_percent?: Maybe<Scalars['float8']['output']>;
  neurons_activated?: Maybe<Scalars['bigint']['output']>;
  redelegation_percent?: Maybe<Scalars['float8']['output']>;
  swap_percent?: Maybe<Scalars['float8']['output']>;
  undelegation_percent?: Maybe<Scalars['float8']['output']>;
};

/** aggregate var_pop on columns */
export type CybCohortVarPopFields = {
  __typename?: 'cyb_cohort_var_pop_fields';
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neurons_activated?: Maybe<Scalars['Float']['output']>;
  redelegation_percent?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
  undelegation_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type CybCohortVarSampFields = {
  __typename?: 'cyb_cohort_var_samp_fields';
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neurons_activated?: Maybe<Scalars['Float']['output']>;
  redelegation_percent?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
  undelegation_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type CybCohortVarianceFields = {
  __typename?: 'cyb_cohort_variance_fields';
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neurons_activated?: Maybe<Scalars['Float']['output']>;
  redelegation_percent?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
  undelegation_percent?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "cyb_new_cohort" */
export type CybNewCohort = {
  __typename?: 'cyb_new_cohort';
  cyberlink_10_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_percent?: Maybe<Scalars['float8']['output']>;
  hero_hired_percent?: Maybe<Scalars['float8']['output']>;
  investmint_percent?: Maybe<Scalars['float8']['output']>;
  neuron_activation?: Maybe<Scalars['numeric']['output']>;
  swap_percent?: Maybe<Scalars['float8']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** aggregated selection of "cyb_new_cohort" */
export type CybNewCohortAggregate = {
  __typename?: 'cyb_new_cohort_aggregate';
  aggregate?: Maybe<CybNewCohortAggregateFields>;
  nodes: Array<CybNewCohort>;
};

/** aggregate fields of "cyb_new_cohort" */
export type CybNewCohortAggregateFields = {
  __typename?: 'cyb_new_cohort_aggregate_fields';
  avg?: Maybe<CybNewCohortAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<CybNewCohortMaxFields>;
  min?: Maybe<CybNewCohortMinFields>;
  stddev?: Maybe<CybNewCohortStddevFields>;
  stddev_pop?: Maybe<CybNewCohortStddevPopFields>;
  stddev_samp?: Maybe<CybNewCohortStddevSampFields>;
  sum?: Maybe<CybNewCohortSumFields>;
  var_pop?: Maybe<CybNewCohortVarPopFields>;
  var_samp?: Maybe<CybNewCohortVarSampFields>;
  variance?: Maybe<CybNewCohortVarianceFields>;
};


/** aggregate fields of "cyb_new_cohort" */
export type CybNewCohortAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CybNewCohortSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type CybNewCohortAvgFields = {
  __typename?: 'cyb_new_cohort_avg_fields';
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activation?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "cyb_new_cohort". All fields are combined with a logical 'AND'. */
export type CybNewCohortBoolExp = {
  _and?: InputMaybe<Array<CybNewCohortBoolExp>>;
  _not?: InputMaybe<CybNewCohortBoolExp>;
  _or?: InputMaybe<Array<CybNewCohortBoolExp>>;
  cyberlink_10_percent?: InputMaybe<Float8ComparisonExp>;
  cyberlink_100_percent?: InputMaybe<Float8ComparisonExp>;
  cyberlink_percent?: InputMaybe<Float8ComparisonExp>;
  hero_hired_percent?: InputMaybe<Float8ComparisonExp>;
  investmint_percent?: InputMaybe<Float8ComparisonExp>;
  neuron_activation?: InputMaybe<NumericComparisonExp>;
  swap_percent?: InputMaybe<Float8ComparisonExp>;
  week?: InputMaybe<DateComparisonExp>;
};

/** aggregate max on columns */
export type CybNewCohortMaxFields = {
  __typename?: 'cyb_new_cohort_max_fields';
  cyberlink_10_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_percent?: Maybe<Scalars['float8']['output']>;
  hero_hired_percent?: Maybe<Scalars['float8']['output']>;
  investmint_percent?: Maybe<Scalars['float8']['output']>;
  neuron_activation?: Maybe<Scalars['numeric']['output']>;
  swap_percent?: Maybe<Scalars['float8']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** aggregate min on columns */
export type CybNewCohortMinFields = {
  __typename?: 'cyb_new_cohort_min_fields';
  cyberlink_10_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_percent?: Maybe<Scalars['float8']['output']>;
  hero_hired_percent?: Maybe<Scalars['float8']['output']>;
  investmint_percent?: Maybe<Scalars['float8']['output']>;
  neuron_activation?: Maybe<Scalars['numeric']['output']>;
  swap_percent?: Maybe<Scalars['float8']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** Ordering options when selecting data from "cyb_new_cohort". */
export type CybNewCohortOrderBy = {
  cyberlink_10_percent?: InputMaybe<OrderBy>;
  cyberlink_100_percent?: InputMaybe<OrderBy>;
  cyberlink_percent?: InputMaybe<OrderBy>;
  hero_hired_percent?: InputMaybe<OrderBy>;
  investmint_percent?: InputMaybe<OrderBy>;
  neuron_activation?: InputMaybe<OrderBy>;
  swap_percent?: InputMaybe<OrderBy>;
  week?: InputMaybe<OrderBy>;
};

/** select columns of table "cyb_new_cohort" */
export enum CybNewCohortSelectColumn {
  /** column name */
  Cyberlink_10Percent = 'cyberlink_10_percent',
  /** column name */
  Cyberlink_100Percent = 'cyberlink_100_percent',
  /** column name */
  CyberlinkPercent = 'cyberlink_percent',
  /** column name */
  HeroHiredPercent = 'hero_hired_percent',
  /** column name */
  InvestmintPercent = 'investmint_percent',
  /** column name */
  NeuronActivation = 'neuron_activation',
  /** column name */
  SwapPercent = 'swap_percent',
  /** column name */
  Week = 'week'
}

/** aggregate stddev on columns */
export type CybNewCohortStddevFields = {
  __typename?: 'cyb_new_cohort_stddev_fields';
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activation?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type CybNewCohortStddevPopFields = {
  __typename?: 'cyb_new_cohort_stddev_pop_fields';
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activation?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type CybNewCohortStddevSampFields = {
  __typename?: 'cyb_new_cohort_stddev_samp_fields';
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activation?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type CybNewCohortSumFields = {
  __typename?: 'cyb_new_cohort_sum_fields';
  cyberlink_10_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_percent?: Maybe<Scalars['float8']['output']>;
  hero_hired_percent?: Maybe<Scalars['float8']['output']>;
  investmint_percent?: Maybe<Scalars['float8']['output']>;
  neuron_activation?: Maybe<Scalars['numeric']['output']>;
  swap_percent?: Maybe<Scalars['float8']['output']>;
};

/** aggregate var_pop on columns */
export type CybNewCohortVarPopFields = {
  __typename?: 'cyb_new_cohort_var_pop_fields';
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activation?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type CybNewCohortVarSampFields = {
  __typename?: 'cyb_new_cohort_var_samp_fields';
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activation?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type CybNewCohortVarianceFields = {
  __typename?: 'cyb_new_cohort_variance_fields';
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activation?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "cyber_gift" */
export type CyberGift = {
  __typename?: 'cyber_gift';
  address: Scalars['String']['output'];
  audience: Scalars['String']['output'];
  gift: Scalars['numeric']['output'];
  grade: Scalars['Int']['output'];
  segment: Scalars['String']['output'];
};

/** aggregated selection of "cyber_gift" */
export type CyberGiftAggregate = {
  __typename?: 'cyber_gift_aggregate';
  aggregate?: Maybe<CyberGiftAggregateFields>;
  nodes: Array<CyberGift>;
};

/** aggregate fields of "cyber_gift" */
export type CyberGiftAggregateFields = {
  __typename?: 'cyber_gift_aggregate_fields';
  avg?: Maybe<CyberGiftAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<CyberGiftMaxFields>;
  min?: Maybe<CyberGiftMinFields>;
  stddev?: Maybe<CyberGiftStddevFields>;
  stddev_pop?: Maybe<CyberGiftStddevPopFields>;
  stddev_samp?: Maybe<CyberGiftStddevSampFields>;
  sum?: Maybe<CyberGiftSumFields>;
  var_pop?: Maybe<CyberGiftVarPopFields>;
  var_samp?: Maybe<CyberGiftVarSampFields>;
  variance?: Maybe<CyberGiftVarianceFields>;
};


/** aggregate fields of "cyber_gift" */
export type CyberGiftAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CyberGiftSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type CyberGiftAvgFields = {
  __typename?: 'cyber_gift_avg_fields';
  gift?: Maybe<Scalars['Float']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "cyber_gift". All fields are combined with a logical 'AND'. */
export type CyberGiftBoolExp = {
  _and?: InputMaybe<Array<CyberGiftBoolExp>>;
  _not?: InputMaybe<CyberGiftBoolExp>;
  _or?: InputMaybe<Array<CyberGiftBoolExp>>;
  address?: InputMaybe<StringComparisonExp>;
  audience?: InputMaybe<StringComparisonExp>;
  gift?: InputMaybe<NumericComparisonExp>;
  grade?: InputMaybe<IntComparisonExp>;
  segment?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type CyberGiftMaxFields = {
  __typename?: 'cyber_gift_max_fields';
  address?: Maybe<Scalars['String']['output']>;
  audience?: Maybe<Scalars['String']['output']>;
  gift?: Maybe<Scalars['numeric']['output']>;
  grade?: Maybe<Scalars['Int']['output']>;
  segment?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type CyberGiftMinFields = {
  __typename?: 'cyber_gift_min_fields';
  address?: Maybe<Scalars['String']['output']>;
  audience?: Maybe<Scalars['String']['output']>;
  gift?: Maybe<Scalars['numeric']['output']>;
  grade?: Maybe<Scalars['Int']['output']>;
  segment?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "cyber_gift". */
export type CyberGiftOrderBy = {
  address?: InputMaybe<OrderBy>;
  audience?: InputMaybe<OrderBy>;
  gift?: InputMaybe<OrderBy>;
  grade?: InputMaybe<OrderBy>;
  segment?: InputMaybe<OrderBy>;
};

/** columns and relationships of "cyber_gift_proofs" */
export type CyberGiftProofs = {
  __typename?: 'cyber_gift_proofs';
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  details?: Maybe<Scalars['json']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "cyber_gift_proofs" */
export type CyberGiftProofsDetailsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "cyber_gift_proofs" */
export type CyberGiftProofsAggregate = {
  __typename?: 'cyber_gift_proofs_aggregate';
  aggregate?: Maybe<CyberGiftProofsAggregateFields>;
  nodes: Array<CyberGiftProofs>;
};

/** aggregate fields of "cyber_gift_proofs" */
export type CyberGiftProofsAggregateFields = {
  __typename?: 'cyber_gift_proofs_aggregate_fields';
  avg?: Maybe<CyberGiftProofsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<CyberGiftProofsMaxFields>;
  min?: Maybe<CyberGiftProofsMinFields>;
  stddev?: Maybe<CyberGiftProofsStddevFields>;
  stddev_pop?: Maybe<CyberGiftProofsStddevPopFields>;
  stddev_samp?: Maybe<CyberGiftProofsStddevSampFields>;
  sum?: Maybe<CyberGiftProofsSumFields>;
  var_pop?: Maybe<CyberGiftProofsVarPopFields>;
  var_samp?: Maybe<CyberGiftProofsVarSampFields>;
  variance?: Maybe<CyberGiftProofsVarianceFields>;
};


/** aggregate fields of "cyber_gift_proofs" */
export type CyberGiftProofsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CyberGiftProofsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type CyberGiftProofsAvgFields = {
  __typename?: 'cyber_gift_proofs_avg_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "cyber_gift_proofs". All fields are combined with a logical 'AND'. */
export type CyberGiftProofsBoolExp = {
  _and?: InputMaybe<Array<CyberGiftProofsBoolExp>>;
  _not?: InputMaybe<CyberGiftProofsBoolExp>;
  _or?: InputMaybe<Array<CyberGiftProofsBoolExp>>;
  address?: InputMaybe<StringComparisonExp>;
  amount?: InputMaybe<BigintComparisonExp>;
  details?: InputMaybe<JsonComparisonExp>;
  proof?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type CyberGiftProofsMaxFields = {
  __typename?: 'cyber_gift_proofs_max_fields';
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type CyberGiftProofsMinFields = {
  __typename?: 'cyber_gift_proofs_min_fields';
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "cyber_gift_proofs". */
export type CyberGiftProofsOrderBy = {
  address?: InputMaybe<OrderBy>;
  amount?: InputMaybe<OrderBy>;
  details?: InputMaybe<OrderBy>;
  proof?: InputMaybe<OrderBy>;
};

/** select columns of table "cyber_gift_proofs" */
export enum CyberGiftProofsSelectColumn {
  /** column name */
  Address = 'address',
  /** column name */
  Amount = 'amount',
  /** column name */
  Details = 'details',
  /** column name */
  Proof = 'proof'
}

/** aggregate stddev on columns */
export type CyberGiftProofsStddevFields = {
  __typename?: 'cyber_gift_proofs_stddev_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type CyberGiftProofsStddevPopFields = {
  __typename?: 'cyber_gift_proofs_stddev_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type CyberGiftProofsStddevSampFields = {
  __typename?: 'cyber_gift_proofs_stddev_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type CyberGiftProofsSumFields = {
  __typename?: 'cyber_gift_proofs_sum_fields';
  amount?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type CyberGiftProofsVarPopFields = {
  __typename?: 'cyber_gift_proofs_var_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type CyberGiftProofsVarSampFields = {
  __typename?: 'cyber_gift_proofs_var_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type CyberGiftProofsVarianceFields = {
  __typename?: 'cyber_gift_proofs_variance_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** select columns of table "cyber_gift" */
export enum CyberGiftSelectColumn {
  /** column name */
  Address = 'address',
  /** column name */
  Audience = 'audience',
  /** column name */
  Gift = 'gift',
  /** column name */
  Grade = 'grade',
  /** column name */
  Segment = 'segment'
}

/** aggregate stddev on columns */
export type CyberGiftStddevFields = {
  __typename?: 'cyber_gift_stddev_fields';
  gift?: Maybe<Scalars['Float']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type CyberGiftStddevPopFields = {
  __typename?: 'cyber_gift_stddev_pop_fields';
  gift?: Maybe<Scalars['Float']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type CyberGiftStddevSampFields = {
  __typename?: 'cyber_gift_stddev_samp_fields';
  gift?: Maybe<Scalars['Float']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type CyberGiftSumFields = {
  __typename?: 'cyber_gift_sum_fields';
  gift?: Maybe<Scalars['numeric']['output']>;
  grade?: Maybe<Scalars['Int']['output']>;
};

/** aggregate var_pop on columns */
export type CyberGiftVarPopFields = {
  __typename?: 'cyber_gift_var_pop_fields';
  gift?: Maybe<Scalars['Float']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type CyberGiftVarSampFields = {
  __typename?: 'cyber_gift_var_samp_fields';
  gift?: Maybe<Scalars['Float']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type CyberGiftVarianceFields = {
  __typename?: 'cyber_gift_variance_fields';
  gift?: Maybe<Scalars['Float']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "cyberlinks" */
export type Cyberlinks = {
  __typename?: 'cyberlinks';
  /** An object relationship */
  account: Account;
  /** An object relationship */
  block: Block;
  /** An object relationship */
  from?: Maybe<Particles>;
  height: Scalars['bigint']['output'];
  id: Scalars['Int']['output'];
  neuron: Scalars['String']['output'];
  particle_from: Scalars['String']['output'];
  particle_to: Scalars['String']['output'];
  timestamp: Scalars['timestamp']['output'];
  /** An object relationship */
  to?: Maybe<Particles>;
  /** An object relationship */
  transaction: Transaction;
  transaction_hash: Scalars['String']['output'];
};

/** aggregated selection of "cyberlinks" */
export type CyberlinksAggregate = {
  __typename?: 'cyberlinks_aggregate';
  aggregate?: Maybe<CyberlinksAggregateFields>;
  nodes: Array<Cyberlinks>;
};

/** aggregate fields of "cyberlinks" */
export type CyberlinksAggregateFields = {
  __typename?: 'cyberlinks_aggregate_fields';
  avg?: Maybe<CyberlinksAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<CyberlinksMaxFields>;
  min?: Maybe<CyberlinksMinFields>;
  stddev?: Maybe<CyberlinksStddevFields>;
  stddev_pop?: Maybe<CyberlinksStddevPopFields>;
  stddev_samp?: Maybe<CyberlinksStddevSampFields>;
  sum?: Maybe<CyberlinksSumFields>;
  var_pop?: Maybe<CyberlinksVarPopFields>;
  var_samp?: Maybe<CyberlinksVarSampFields>;
  variance?: Maybe<CyberlinksVarianceFields>;
};


/** aggregate fields of "cyberlinks" */
export type CyberlinksAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CyberlinksSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "cyberlinks" */
export type CyberlinksAggregateOrderBy = {
  avg?: InputMaybe<CyberlinksAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<CyberlinksMaxOrderBy>;
  min?: InputMaybe<CyberlinksMinOrderBy>;
  stddev?: InputMaybe<CyberlinksStddevOrderBy>;
  stddev_pop?: InputMaybe<CyberlinksStddevPopOrderBy>;
  stddev_samp?: InputMaybe<CyberlinksStddevSampOrderBy>;
  sum?: InputMaybe<CyberlinksSumOrderBy>;
  var_pop?: InputMaybe<CyberlinksVarPopOrderBy>;
  var_samp?: InputMaybe<CyberlinksVarSampOrderBy>;
  variance?: InputMaybe<CyberlinksVarianceOrderBy>;
};

/** aggregate avg on columns */
export type CyberlinksAvgFields = {
  __typename?: 'cyberlinks_avg_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "cyberlinks" */
export type CyberlinksAvgOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "cyberlinks". All fields are combined with a logical 'AND'. */
export type CyberlinksBoolExp = {
  _and?: InputMaybe<Array<CyberlinksBoolExp>>;
  _not?: InputMaybe<CyberlinksBoolExp>;
  _or?: InputMaybe<Array<CyberlinksBoolExp>>;
  account?: InputMaybe<AccountBoolExp>;
  block?: InputMaybe<BlockBoolExp>;
  from?: InputMaybe<ParticlesBoolExp>;
  height?: InputMaybe<BigintComparisonExp>;
  id?: InputMaybe<IntComparisonExp>;
  neuron?: InputMaybe<StringComparisonExp>;
  particle_from?: InputMaybe<StringComparisonExp>;
  particle_to?: InputMaybe<StringComparisonExp>;
  timestamp?: InputMaybe<TimestampComparisonExp>;
  to?: InputMaybe<ParticlesBoolExp>;
  transaction?: InputMaybe<TransactionBoolExp>;
  transaction_hash?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type CyberlinksMaxFields = {
  __typename?: 'cyberlinks_max_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  particle_from?: Maybe<Scalars['String']['output']>;
  particle_to?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "cyberlinks" */
export type CyberlinksMaxOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  neuron?: InputMaybe<OrderBy>;
  particle_from?: InputMaybe<OrderBy>;
  particle_to?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type CyberlinksMinFields = {
  __typename?: 'cyberlinks_min_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  particle_from?: Maybe<Scalars['String']['output']>;
  particle_to?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "cyberlinks" */
export type CyberlinksMinOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  neuron?: InputMaybe<OrderBy>;
  particle_from?: InputMaybe<OrderBy>;
  particle_to?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "cyberlinks". */
export type CyberlinksOrderBy = {
  account?: InputMaybe<AccountOrderBy>;
  block?: InputMaybe<BlockOrderBy>;
  from?: InputMaybe<ParticlesOrderBy>;
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  neuron?: InputMaybe<OrderBy>;
  particle_from?: InputMaybe<OrderBy>;
  particle_to?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  to?: InputMaybe<ParticlesOrderBy>;
  transaction?: InputMaybe<TransactionOrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
};

/** select columns of table "cyberlinks" */
export enum CyberlinksSelectColumn {
  /** column name */
  Height = 'height',
  /** column name */
  Id = 'id',
  /** column name */
  Neuron = 'neuron',
  /** column name */
  ParticleFrom = 'particle_from',
  /** column name */
  ParticleTo = 'particle_to',
  /** column name */
  Timestamp = 'timestamp',
  /** column name */
  TransactionHash = 'transaction_hash'
}

/** columns and relationships of "cyberlinks_stats" */
export type CyberlinksStats = {
  __typename?: 'cyberlinks_stats';
  cyberlinks?: Maybe<Scalars['numeric']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
};

/** aggregated selection of "cyberlinks_stats" */
export type CyberlinksStatsAggregate = {
  __typename?: 'cyberlinks_stats_aggregate';
  aggregate?: Maybe<CyberlinksStatsAggregateFields>;
  nodes: Array<CyberlinksStats>;
};

/** aggregate fields of "cyberlinks_stats" */
export type CyberlinksStatsAggregateFields = {
  __typename?: 'cyberlinks_stats_aggregate_fields';
  avg?: Maybe<CyberlinksStatsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<CyberlinksStatsMaxFields>;
  min?: Maybe<CyberlinksStatsMinFields>;
  stddev?: Maybe<CyberlinksStatsStddevFields>;
  stddev_pop?: Maybe<CyberlinksStatsStddevPopFields>;
  stddev_samp?: Maybe<CyberlinksStatsStddevSampFields>;
  sum?: Maybe<CyberlinksStatsSumFields>;
  var_pop?: Maybe<CyberlinksStatsVarPopFields>;
  var_samp?: Maybe<CyberlinksStatsVarSampFields>;
  variance?: Maybe<CyberlinksStatsVarianceFields>;
};


/** aggregate fields of "cyberlinks_stats" */
export type CyberlinksStatsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<CyberlinksStatsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type CyberlinksStatsAvgFields = {
  __typename?: 'cyberlinks_stats_avg_fields';
  cyberlinks?: Maybe<Scalars['Float']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "cyberlinks_stats". All fields are combined with a logical 'AND'. */
export type CyberlinksStatsBoolExp = {
  _and?: InputMaybe<Array<CyberlinksStatsBoolExp>>;
  _not?: InputMaybe<CyberlinksStatsBoolExp>;
  _or?: InputMaybe<Array<CyberlinksStatsBoolExp>>;
  cyberlinks?: InputMaybe<NumericComparisonExp>;
  cyberlinks_per_day?: InputMaybe<BigintComparisonExp>;
  date?: InputMaybe<DateComparisonExp>;
};

/** aggregate max on columns */
export type CyberlinksStatsMaxFields = {
  __typename?: 'cyberlinks_stats_max_fields';
  cyberlinks?: Maybe<Scalars['numeric']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
};

/** aggregate min on columns */
export type CyberlinksStatsMinFields = {
  __typename?: 'cyberlinks_stats_min_fields';
  cyberlinks?: Maybe<Scalars['numeric']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
};

/** Ordering options when selecting data from "cyberlinks_stats". */
export type CyberlinksStatsOrderBy = {
  cyberlinks?: InputMaybe<OrderBy>;
  cyberlinks_per_day?: InputMaybe<OrderBy>;
  date?: InputMaybe<OrderBy>;
};

/** select columns of table "cyberlinks_stats" */
export enum CyberlinksStatsSelectColumn {
  /** column name */
  Cyberlinks = 'cyberlinks',
  /** column name */
  CyberlinksPerDay = 'cyberlinks_per_day',
  /** column name */
  Date = 'date'
}

/** aggregate stddev on columns */
export type CyberlinksStatsStddevFields = {
  __typename?: 'cyberlinks_stats_stddev_fields';
  cyberlinks?: Maybe<Scalars['Float']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type CyberlinksStatsStddevPopFields = {
  __typename?: 'cyberlinks_stats_stddev_pop_fields';
  cyberlinks?: Maybe<Scalars['Float']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type CyberlinksStatsStddevSampFields = {
  __typename?: 'cyberlinks_stats_stddev_samp_fields';
  cyberlinks?: Maybe<Scalars['Float']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type CyberlinksStatsSumFields = {
  __typename?: 'cyberlinks_stats_sum_fields';
  cyberlinks?: Maybe<Scalars['numeric']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type CyberlinksStatsVarPopFields = {
  __typename?: 'cyberlinks_stats_var_pop_fields';
  cyberlinks?: Maybe<Scalars['Float']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type CyberlinksStatsVarSampFields = {
  __typename?: 'cyberlinks_stats_var_samp_fields';
  cyberlinks?: Maybe<Scalars['Float']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type CyberlinksStatsVarianceFields = {
  __typename?: 'cyberlinks_stats_variance_fields';
  cyberlinks?: Maybe<Scalars['Float']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev on columns */
export type CyberlinksStddevFields = {
  __typename?: 'cyberlinks_stddev_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "cyberlinks" */
export type CyberlinksStddevOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type CyberlinksStddevPopFields = {
  __typename?: 'cyberlinks_stddev_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "cyberlinks" */
export type CyberlinksStddevPopOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type CyberlinksStddevSampFields = {
  __typename?: 'cyberlinks_stddev_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "cyberlinks" */
export type CyberlinksStddevSampOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate sum on columns */
export type CyberlinksSumFields = {
  __typename?: 'cyberlinks_sum_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "cyberlinks" */
export type CyberlinksSumOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type CyberlinksVarPopFields = {
  __typename?: 'cyberlinks_var_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "cyberlinks" */
export type CyberlinksVarPopOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type CyberlinksVarSampFields = {
  __typename?: 'cyberlinks_var_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "cyberlinks" */
export type CyberlinksVarSampOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type CyberlinksVarianceFields = {
  __typename?: 'cyberlinks_variance_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "cyberlinks" */
export type CyberlinksVarianceOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** columns and relationships of "daily_amount_of_active_neurons" */
export type DailyAmountOfActiveNeurons = {
  __typename?: 'daily_amount_of_active_neurons';
  count?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
};

/** aggregated selection of "daily_amount_of_active_neurons" */
export type DailyAmountOfActiveNeuronsAggregate = {
  __typename?: 'daily_amount_of_active_neurons_aggregate';
  aggregate?: Maybe<DailyAmountOfActiveNeuronsAggregateFields>;
  nodes: Array<DailyAmountOfActiveNeurons>;
};

/** aggregate fields of "daily_amount_of_active_neurons" */
export type DailyAmountOfActiveNeuronsAggregateFields = {
  __typename?: 'daily_amount_of_active_neurons_aggregate_fields';
  avg?: Maybe<DailyAmountOfActiveNeuronsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<DailyAmountOfActiveNeuronsMaxFields>;
  min?: Maybe<DailyAmountOfActiveNeuronsMinFields>;
  stddev?: Maybe<DailyAmountOfActiveNeuronsStddevFields>;
  stddev_pop?: Maybe<DailyAmountOfActiveNeuronsStddevPopFields>;
  stddev_samp?: Maybe<DailyAmountOfActiveNeuronsStddevSampFields>;
  sum?: Maybe<DailyAmountOfActiveNeuronsSumFields>;
  var_pop?: Maybe<DailyAmountOfActiveNeuronsVarPopFields>;
  var_samp?: Maybe<DailyAmountOfActiveNeuronsVarSampFields>;
  variance?: Maybe<DailyAmountOfActiveNeuronsVarianceFields>;
};


/** aggregate fields of "daily_amount_of_active_neurons" */
export type DailyAmountOfActiveNeuronsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<DailyAmountOfActiveNeuronsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type DailyAmountOfActiveNeuronsAvgFields = {
  __typename?: 'daily_amount_of_active_neurons_avg_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "daily_amount_of_active_neurons". All fields are combined with a logical 'AND'. */
export type DailyAmountOfActiveNeuronsBoolExp = {
  _and?: InputMaybe<Array<DailyAmountOfActiveNeuronsBoolExp>>;
  _not?: InputMaybe<DailyAmountOfActiveNeuronsBoolExp>;
  _or?: InputMaybe<Array<DailyAmountOfActiveNeuronsBoolExp>>;
  count?: InputMaybe<BigintComparisonExp>;
  date?: InputMaybe<DateComparisonExp>;
};

/** aggregate max on columns */
export type DailyAmountOfActiveNeuronsMaxFields = {
  __typename?: 'daily_amount_of_active_neurons_max_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
};

/** aggregate min on columns */
export type DailyAmountOfActiveNeuronsMinFields = {
  __typename?: 'daily_amount_of_active_neurons_min_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
};

/** Ordering options when selecting data from "daily_amount_of_active_neurons". */
export type DailyAmountOfActiveNeuronsOrderBy = {
  count?: InputMaybe<OrderBy>;
  date?: InputMaybe<OrderBy>;
};

/** select columns of table "daily_amount_of_active_neurons" */
export enum DailyAmountOfActiveNeuronsSelectColumn {
  /** column name */
  Count = 'count',
  /** column name */
  Date = 'date'
}

/** aggregate stddev on columns */
export type DailyAmountOfActiveNeuronsStddevFields = {
  __typename?: 'daily_amount_of_active_neurons_stddev_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type DailyAmountOfActiveNeuronsStddevPopFields = {
  __typename?: 'daily_amount_of_active_neurons_stddev_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type DailyAmountOfActiveNeuronsStddevSampFields = {
  __typename?: 'daily_amount_of_active_neurons_stddev_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type DailyAmountOfActiveNeuronsSumFields = {
  __typename?: 'daily_amount_of_active_neurons_sum_fields';
  count?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type DailyAmountOfActiveNeuronsVarPopFields = {
  __typename?: 'daily_amount_of_active_neurons_var_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type DailyAmountOfActiveNeuronsVarSampFields = {
  __typename?: 'daily_amount_of_active_neurons_var_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type DailyAmountOfActiveNeuronsVarianceFields = {
  __typename?: 'daily_amount_of_active_neurons_variance_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "daily_amount_of_used_gas" */
export type DailyAmountOfUsedGas = {
  __typename?: 'daily_amount_of_used_gas';
  daily_gas?: Maybe<Scalars['numeric']['output']>;
  date?: Maybe<Scalars['date']['output']>;
  gas_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "daily_amount_of_used_gas" */
export type DailyAmountOfUsedGasAggregate = {
  __typename?: 'daily_amount_of_used_gas_aggregate';
  aggregate?: Maybe<DailyAmountOfUsedGasAggregateFields>;
  nodes: Array<DailyAmountOfUsedGas>;
};

/** aggregate fields of "daily_amount_of_used_gas" */
export type DailyAmountOfUsedGasAggregateFields = {
  __typename?: 'daily_amount_of_used_gas_aggregate_fields';
  avg?: Maybe<DailyAmountOfUsedGasAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<DailyAmountOfUsedGasMaxFields>;
  min?: Maybe<DailyAmountOfUsedGasMinFields>;
  stddev?: Maybe<DailyAmountOfUsedGasStddevFields>;
  stddev_pop?: Maybe<DailyAmountOfUsedGasStddevPopFields>;
  stddev_samp?: Maybe<DailyAmountOfUsedGasStddevSampFields>;
  sum?: Maybe<DailyAmountOfUsedGasSumFields>;
  var_pop?: Maybe<DailyAmountOfUsedGasVarPopFields>;
  var_samp?: Maybe<DailyAmountOfUsedGasVarSampFields>;
  variance?: Maybe<DailyAmountOfUsedGasVarianceFields>;
};


/** aggregate fields of "daily_amount_of_used_gas" */
export type DailyAmountOfUsedGasAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<DailyAmountOfUsedGasSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type DailyAmountOfUsedGasAvgFields = {
  __typename?: 'daily_amount_of_used_gas_avg_fields';
  daily_gas?: Maybe<Scalars['Float']['output']>;
  gas_total?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "daily_amount_of_used_gas". All fields are combined with a logical 'AND'. */
export type DailyAmountOfUsedGasBoolExp = {
  _and?: InputMaybe<Array<DailyAmountOfUsedGasBoolExp>>;
  _not?: InputMaybe<DailyAmountOfUsedGasBoolExp>;
  _or?: InputMaybe<Array<DailyAmountOfUsedGasBoolExp>>;
  daily_gas?: InputMaybe<NumericComparisonExp>;
  date?: InputMaybe<DateComparisonExp>;
  gas_total?: InputMaybe<NumericComparisonExp>;
};

/** aggregate max on columns */
export type DailyAmountOfUsedGasMaxFields = {
  __typename?: 'daily_amount_of_used_gas_max_fields';
  daily_gas?: Maybe<Scalars['numeric']['output']>;
  date?: Maybe<Scalars['date']['output']>;
  gas_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type DailyAmountOfUsedGasMinFields = {
  __typename?: 'daily_amount_of_used_gas_min_fields';
  daily_gas?: Maybe<Scalars['numeric']['output']>;
  date?: Maybe<Scalars['date']['output']>;
  gas_total?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "daily_amount_of_used_gas". */
export type DailyAmountOfUsedGasOrderBy = {
  daily_gas?: InputMaybe<OrderBy>;
  date?: InputMaybe<OrderBy>;
  gas_total?: InputMaybe<OrderBy>;
};

/** select columns of table "daily_amount_of_used_gas" */
export enum DailyAmountOfUsedGasSelectColumn {
  /** column name */
  DailyGas = 'daily_gas',
  /** column name */
  Date = 'date',
  /** column name */
  GasTotal = 'gas_total'
}

/** aggregate stddev on columns */
export type DailyAmountOfUsedGasStddevFields = {
  __typename?: 'daily_amount_of_used_gas_stddev_fields';
  daily_gas?: Maybe<Scalars['Float']['output']>;
  gas_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type DailyAmountOfUsedGasStddevPopFields = {
  __typename?: 'daily_amount_of_used_gas_stddev_pop_fields';
  daily_gas?: Maybe<Scalars['Float']['output']>;
  gas_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type DailyAmountOfUsedGasStddevSampFields = {
  __typename?: 'daily_amount_of_used_gas_stddev_samp_fields';
  daily_gas?: Maybe<Scalars['Float']['output']>;
  gas_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type DailyAmountOfUsedGasSumFields = {
  __typename?: 'daily_amount_of_used_gas_sum_fields';
  daily_gas?: Maybe<Scalars['numeric']['output']>;
  gas_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type DailyAmountOfUsedGasVarPopFields = {
  __typename?: 'daily_amount_of_used_gas_var_pop_fields';
  daily_gas?: Maybe<Scalars['Float']['output']>;
  gas_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type DailyAmountOfUsedGasVarSampFields = {
  __typename?: 'daily_amount_of_used_gas_var_samp_fields';
  daily_gas?: Maybe<Scalars['Float']['output']>;
  gas_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type DailyAmountOfUsedGasVarianceFields = {
  __typename?: 'daily_amount_of_used_gas_variance_fields';
  daily_gas?: Maybe<Scalars['Float']['output']>;
  gas_total?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "daily_number_of_transactions" */
export type DailyNumberOfTransactions = {
  __typename?: 'daily_number_of_transactions';
  date?: Maybe<Scalars['date']['output']>;
  txs_per_day?: Maybe<Scalars['bigint']['output']>;
  txs_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "daily_number_of_transactions" */
export type DailyNumberOfTransactionsAggregate = {
  __typename?: 'daily_number_of_transactions_aggregate';
  aggregate?: Maybe<DailyNumberOfTransactionsAggregateFields>;
  nodes: Array<DailyNumberOfTransactions>;
};

/** aggregate fields of "daily_number_of_transactions" */
export type DailyNumberOfTransactionsAggregateFields = {
  __typename?: 'daily_number_of_transactions_aggregate_fields';
  avg?: Maybe<DailyNumberOfTransactionsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<DailyNumberOfTransactionsMaxFields>;
  min?: Maybe<DailyNumberOfTransactionsMinFields>;
  stddev?: Maybe<DailyNumberOfTransactionsStddevFields>;
  stddev_pop?: Maybe<DailyNumberOfTransactionsStddevPopFields>;
  stddev_samp?: Maybe<DailyNumberOfTransactionsStddevSampFields>;
  sum?: Maybe<DailyNumberOfTransactionsSumFields>;
  var_pop?: Maybe<DailyNumberOfTransactionsVarPopFields>;
  var_samp?: Maybe<DailyNumberOfTransactionsVarSampFields>;
  variance?: Maybe<DailyNumberOfTransactionsVarianceFields>;
};


/** aggregate fields of "daily_number_of_transactions" */
export type DailyNumberOfTransactionsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<DailyNumberOfTransactionsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type DailyNumberOfTransactionsAvgFields = {
  __typename?: 'daily_number_of_transactions_avg_fields';
  txs_per_day?: Maybe<Scalars['Float']['output']>;
  txs_total?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "daily_number_of_transactions". All fields are combined with a logical 'AND'. */
export type DailyNumberOfTransactionsBoolExp = {
  _and?: InputMaybe<Array<DailyNumberOfTransactionsBoolExp>>;
  _not?: InputMaybe<DailyNumberOfTransactionsBoolExp>;
  _or?: InputMaybe<Array<DailyNumberOfTransactionsBoolExp>>;
  date?: InputMaybe<DateComparisonExp>;
  txs_per_day?: InputMaybe<BigintComparisonExp>;
  txs_total?: InputMaybe<NumericComparisonExp>;
};

/** aggregate max on columns */
export type DailyNumberOfTransactionsMaxFields = {
  __typename?: 'daily_number_of_transactions_max_fields';
  date?: Maybe<Scalars['date']['output']>;
  txs_per_day?: Maybe<Scalars['bigint']['output']>;
  txs_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type DailyNumberOfTransactionsMinFields = {
  __typename?: 'daily_number_of_transactions_min_fields';
  date?: Maybe<Scalars['date']['output']>;
  txs_per_day?: Maybe<Scalars['bigint']['output']>;
  txs_total?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "daily_number_of_transactions". */
export type DailyNumberOfTransactionsOrderBy = {
  date?: InputMaybe<OrderBy>;
  txs_per_day?: InputMaybe<OrderBy>;
  txs_total?: InputMaybe<OrderBy>;
};

/** select columns of table "daily_number_of_transactions" */
export enum DailyNumberOfTransactionsSelectColumn {
  /** column name */
  Date = 'date',
  /** column name */
  TxsPerDay = 'txs_per_day',
  /** column name */
  TxsTotal = 'txs_total'
}

/** aggregate stddev on columns */
export type DailyNumberOfTransactionsStddevFields = {
  __typename?: 'daily_number_of_transactions_stddev_fields';
  txs_per_day?: Maybe<Scalars['Float']['output']>;
  txs_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type DailyNumberOfTransactionsStddevPopFields = {
  __typename?: 'daily_number_of_transactions_stddev_pop_fields';
  txs_per_day?: Maybe<Scalars['Float']['output']>;
  txs_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type DailyNumberOfTransactionsStddevSampFields = {
  __typename?: 'daily_number_of_transactions_stddev_samp_fields';
  txs_per_day?: Maybe<Scalars['Float']['output']>;
  txs_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type DailyNumberOfTransactionsSumFields = {
  __typename?: 'daily_number_of_transactions_sum_fields';
  txs_per_day?: Maybe<Scalars['bigint']['output']>;
  txs_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type DailyNumberOfTransactionsVarPopFields = {
  __typename?: 'daily_number_of_transactions_var_pop_fields';
  txs_per_day?: Maybe<Scalars['Float']['output']>;
  txs_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type DailyNumberOfTransactionsVarSampFields = {
  __typename?: 'daily_number_of_transactions_var_samp_fields';
  txs_per_day?: Maybe<Scalars['Float']['output']>;
  txs_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type DailyNumberOfTransactionsVarianceFields = {
  __typename?: 'daily_number_of_transactions_variance_fields';
  txs_per_day?: Maybe<Scalars['Float']['output']>;
  txs_total?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type DateComparisonExp = {
  _eq?: InputMaybe<Scalars['date']['input']>;
  _gt?: InputMaybe<Scalars['date']['input']>;
  _gte?: InputMaybe<Scalars['date']['input']>;
  _in?: InputMaybe<Array<Scalars['date']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['date']['input']>;
  _lte?: InputMaybe<Scalars['date']['input']>;
  _neq?: InputMaybe<Scalars['date']['input']>;
  _nin?: InputMaybe<Array<Scalars['date']['input']>>;
};

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8ComparisonExp = {
  _eq?: InputMaybe<Scalars['float8']['input']>;
  _gt?: InputMaybe<Scalars['float8']['input']>;
  _gte?: InputMaybe<Scalars['float8']['input']>;
  _in?: InputMaybe<Array<Scalars['float8']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['float8']['input']>;
  _lte?: InputMaybe<Scalars['float8']['input']>;
  _neq?: InputMaybe<Scalars['float8']['input']>;
  _nin?: InputMaybe<Array<Scalars['float8']['input']>>;
};

/** columns and relationships of "follow_stats" */
export type FollowStats = {
  __typename?: 'follow_stats';
  date?: Maybe<Scalars['date']['output']>;
  follow_total?: Maybe<Scalars['numeric']['output']>;
  follows_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** aggregated selection of "follow_stats" */
export type FollowStatsAggregate = {
  __typename?: 'follow_stats_aggregate';
  aggregate?: Maybe<FollowStatsAggregateFields>;
  nodes: Array<FollowStats>;
};

/** aggregate fields of "follow_stats" */
export type FollowStatsAggregateFields = {
  __typename?: 'follow_stats_aggregate_fields';
  avg?: Maybe<FollowStatsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<FollowStatsMaxFields>;
  min?: Maybe<FollowStatsMinFields>;
  stddev?: Maybe<FollowStatsStddevFields>;
  stddev_pop?: Maybe<FollowStatsStddevPopFields>;
  stddev_samp?: Maybe<FollowStatsStddevSampFields>;
  sum?: Maybe<FollowStatsSumFields>;
  var_pop?: Maybe<FollowStatsVarPopFields>;
  var_samp?: Maybe<FollowStatsVarSampFields>;
  variance?: Maybe<FollowStatsVarianceFields>;
};


/** aggregate fields of "follow_stats" */
export type FollowStatsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<FollowStatsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type FollowStatsAvgFields = {
  __typename?: 'follow_stats_avg_fields';
  follow_total?: Maybe<Scalars['Float']['output']>;
  follows_per_day?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "follow_stats". All fields are combined with a logical 'AND'. */
export type FollowStatsBoolExp = {
  _and?: InputMaybe<Array<FollowStatsBoolExp>>;
  _not?: InputMaybe<FollowStatsBoolExp>;
  _or?: InputMaybe<Array<FollowStatsBoolExp>>;
  date?: InputMaybe<DateComparisonExp>;
  follow_total?: InputMaybe<NumericComparisonExp>;
  follows_per_day?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type FollowStatsMaxFields = {
  __typename?: 'follow_stats_max_fields';
  date?: Maybe<Scalars['date']['output']>;
  follow_total?: Maybe<Scalars['numeric']['output']>;
  follows_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type FollowStatsMinFields = {
  __typename?: 'follow_stats_min_fields';
  date?: Maybe<Scalars['date']['output']>;
  follow_total?: Maybe<Scalars['numeric']['output']>;
  follows_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "follow_stats". */
export type FollowStatsOrderBy = {
  date?: InputMaybe<OrderBy>;
  follow_total?: InputMaybe<OrderBy>;
  follows_per_day?: InputMaybe<OrderBy>;
};

/** select columns of table "follow_stats" */
export enum FollowStatsSelectColumn {
  /** column name */
  Date = 'date',
  /** column name */
  FollowTotal = 'follow_total',
  /** column name */
  FollowsPerDay = 'follows_per_day'
}

/** aggregate stddev on columns */
export type FollowStatsStddevFields = {
  __typename?: 'follow_stats_stddev_fields';
  follow_total?: Maybe<Scalars['Float']['output']>;
  follows_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type FollowStatsStddevPopFields = {
  __typename?: 'follow_stats_stddev_pop_fields';
  follow_total?: Maybe<Scalars['Float']['output']>;
  follows_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type FollowStatsStddevSampFields = {
  __typename?: 'follow_stats_stddev_samp_fields';
  follow_total?: Maybe<Scalars['Float']['output']>;
  follows_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type FollowStatsSumFields = {
  __typename?: 'follow_stats_sum_fields';
  follow_total?: Maybe<Scalars['numeric']['output']>;
  follows_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type FollowStatsVarPopFields = {
  __typename?: 'follow_stats_var_pop_fields';
  follow_total?: Maybe<Scalars['Float']['output']>;
  follows_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type FollowStatsVarSampFields = {
  __typename?: 'follow_stats_var_samp_fields';
  follow_total?: Maybe<Scalars['Float']['output']>;
  follows_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type FollowStatsVarianceFields = {
  __typename?: 'follow_stats_variance_fields';
  follow_total?: Maybe<Scalars['Float']['output']>;
  follows_per_day?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "genesis_neurons_activation" */
export type GenesisNeuronsActivation = {
  __typename?: 'genesis_neurons_activation';
  count?: Maybe<Scalars['float8']['output']>;
  neurons?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "genesis_neurons_activation" */
export type GenesisNeuronsActivationAggregate = {
  __typename?: 'genesis_neurons_activation_aggregate';
  aggregate?: Maybe<GenesisNeuronsActivationAggregateFields>;
  nodes: Array<GenesisNeuronsActivation>;
};

/** aggregate fields of "genesis_neurons_activation" */
export type GenesisNeuronsActivationAggregateFields = {
  __typename?: 'genesis_neurons_activation_aggregate_fields';
  avg?: Maybe<GenesisNeuronsActivationAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<GenesisNeuronsActivationMaxFields>;
  min?: Maybe<GenesisNeuronsActivationMinFields>;
  stddev?: Maybe<GenesisNeuronsActivationStddevFields>;
  stddev_pop?: Maybe<GenesisNeuronsActivationStddevPopFields>;
  stddev_samp?: Maybe<GenesisNeuronsActivationStddevSampFields>;
  sum?: Maybe<GenesisNeuronsActivationSumFields>;
  var_pop?: Maybe<GenesisNeuronsActivationVarPopFields>;
  var_samp?: Maybe<GenesisNeuronsActivationVarSampFields>;
  variance?: Maybe<GenesisNeuronsActivationVarianceFields>;
};


/** aggregate fields of "genesis_neurons_activation" */
export type GenesisNeuronsActivationAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<GenesisNeuronsActivationSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type GenesisNeuronsActivationAvgFields = {
  __typename?: 'genesis_neurons_activation_avg_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "genesis_neurons_activation". All fields are combined with a logical 'AND'. */
export type GenesisNeuronsActivationBoolExp = {
  _and?: InputMaybe<Array<GenesisNeuronsActivationBoolExp>>;
  _not?: InputMaybe<GenesisNeuronsActivationBoolExp>;
  _or?: InputMaybe<Array<GenesisNeuronsActivationBoolExp>>;
  count?: InputMaybe<Float8ComparisonExp>;
  neurons?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type GenesisNeuronsActivationMaxFields = {
  __typename?: 'genesis_neurons_activation_max_fields';
  count?: Maybe<Scalars['float8']['output']>;
  neurons?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type GenesisNeuronsActivationMinFields = {
  __typename?: 'genesis_neurons_activation_min_fields';
  count?: Maybe<Scalars['float8']['output']>;
  neurons?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "genesis_neurons_activation". */
export type GenesisNeuronsActivationOrderBy = {
  count?: InputMaybe<OrderBy>;
  neurons?: InputMaybe<OrderBy>;
};

/** select columns of table "genesis_neurons_activation" */
export enum GenesisNeuronsActivationSelectColumn {
  /** column name */
  Count = 'count',
  /** column name */
  Neurons = 'neurons'
}

/** aggregate stddev on columns */
export type GenesisNeuronsActivationStddevFields = {
  __typename?: 'genesis_neurons_activation_stddev_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type GenesisNeuronsActivationStddevPopFields = {
  __typename?: 'genesis_neurons_activation_stddev_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type GenesisNeuronsActivationStddevSampFields = {
  __typename?: 'genesis_neurons_activation_stddev_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type GenesisNeuronsActivationSumFields = {
  __typename?: 'genesis_neurons_activation_sum_fields';
  count?: Maybe<Scalars['float8']['output']>;
};

/** aggregate var_pop on columns */
export type GenesisNeuronsActivationVarPopFields = {
  __typename?: 'genesis_neurons_activation_var_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type GenesisNeuronsActivationVarSampFields = {
  __typename?: 'genesis_neurons_activation_var_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type GenesisNeuronsActivationVarianceFields = {
  __typename?: 'genesis_neurons_activation_variance_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "investmints" */
export type Investmints = {
  __typename?: 'investmints';
  /** An object relationship */
  account: Account;
  amount: Scalars['coin']['output'];
  /** An object relationship */
  block: Block;
  height: Scalars['bigint']['output'];
  id: Scalars['Int']['output'];
  length: Scalars['bigint']['output'];
  neuron: Scalars['String']['output'];
  resource: Scalars['String']['output'];
  timestamp: Scalars['timestamp']['output'];
  /** An object relationship */
  transaction: Transaction;
  transaction_hash: Scalars['String']['output'];
};

/** aggregated selection of "investmints" */
export type InvestmintsAggregate = {
  __typename?: 'investmints_aggregate';
  aggregate?: Maybe<InvestmintsAggregateFields>;
  nodes: Array<Investmints>;
};

/** aggregate fields of "investmints" */
export type InvestmintsAggregateFields = {
  __typename?: 'investmints_aggregate_fields';
  avg?: Maybe<InvestmintsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<InvestmintsMaxFields>;
  min?: Maybe<InvestmintsMinFields>;
  stddev?: Maybe<InvestmintsStddevFields>;
  stddev_pop?: Maybe<InvestmintsStddevPopFields>;
  stddev_samp?: Maybe<InvestmintsStddevSampFields>;
  sum?: Maybe<InvestmintsSumFields>;
  var_pop?: Maybe<InvestmintsVarPopFields>;
  var_samp?: Maybe<InvestmintsVarSampFields>;
  variance?: Maybe<InvestmintsVarianceFields>;
};


/** aggregate fields of "investmints" */
export type InvestmintsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<InvestmintsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "investmints" */
export type InvestmintsAggregateOrderBy = {
  avg?: InputMaybe<InvestmintsAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<InvestmintsMaxOrderBy>;
  min?: InputMaybe<InvestmintsMinOrderBy>;
  stddev?: InputMaybe<InvestmintsStddevOrderBy>;
  stddev_pop?: InputMaybe<InvestmintsStddevPopOrderBy>;
  stddev_samp?: InputMaybe<InvestmintsStddevSampOrderBy>;
  sum?: InputMaybe<InvestmintsSumOrderBy>;
  var_pop?: InputMaybe<InvestmintsVarPopOrderBy>;
  var_samp?: InputMaybe<InvestmintsVarSampOrderBy>;
  variance?: InputMaybe<InvestmintsVarianceOrderBy>;
};

/** aggregate avg on columns */
export type InvestmintsAvgFields = {
  __typename?: 'investmints_avg_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "investmints" */
export type InvestmintsAvgOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  length?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "investmints". All fields are combined with a logical 'AND'. */
export type InvestmintsBoolExp = {
  _and?: InputMaybe<Array<InvestmintsBoolExp>>;
  _not?: InputMaybe<InvestmintsBoolExp>;
  _or?: InputMaybe<Array<InvestmintsBoolExp>>;
  account?: InputMaybe<AccountBoolExp>;
  amount?: InputMaybe<CoinComparisonExp>;
  block?: InputMaybe<BlockBoolExp>;
  height?: InputMaybe<BigintComparisonExp>;
  id?: InputMaybe<IntComparisonExp>;
  length?: InputMaybe<BigintComparisonExp>;
  neuron?: InputMaybe<StringComparisonExp>;
  resource?: InputMaybe<StringComparisonExp>;
  timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction?: InputMaybe<TransactionBoolExp>;
  transaction_hash?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type InvestmintsMaxFields = {
  __typename?: 'investmints_max_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  length?: Maybe<Scalars['bigint']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  resource?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "investmints" */
export type InvestmintsMaxOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  length?: InputMaybe<OrderBy>;
  neuron?: InputMaybe<OrderBy>;
  resource?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type InvestmintsMinFields = {
  __typename?: 'investmints_min_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  length?: Maybe<Scalars['bigint']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  resource?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "investmints" */
export type InvestmintsMinOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  length?: InputMaybe<OrderBy>;
  neuron?: InputMaybe<OrderBy>;
  resource?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "investmints". */
export type InvestmintsOrderBy = {
  account?: InputMaybe<AccountOrderBy>;
  amount?: InputMaybe<OrderBy>;
  block?: InputMaybe<BlockOrderBy>;
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  length?: InputMaybe<OrderBy>;
  neuron?: InputMaybe<OrderBy>;
  resource?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  transaction?: InputMaybe<TransactionOrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
};

/** select columns of table "investmints" */
export enum InvestmintsSelectColumn {
  /** column name */
  Amount = 'amount',
  /** column name */
  Height = 'height',
  /** column name */
  Id = 'id',
  /** column name */
  Length = 'length',
  /** column name */
  Neuron = 'neuron',
  /** column name */
  Resource = 'resource',
  /** column name */
  Timestamp = 'timestamp',
  /** column name */
  TransactionHash = 'transaction_hash'
}

/** aggregate stddev on columns */
export type InvestmintsStddevFields = {
  __typename?: 'investmints_stddev_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "investmints" */
export type InvestmintsStddevOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  length?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type InvestmintsStddevPopFields = {
  __typename?: 'investmints_stddev_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "investmints" */
export type InvestmintsStddevPopOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  length?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type InvestmintsStddevSampFields = {
  __typename?: 'investmints_stddev_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "investmints" */
export type InvestmintsStddevSampOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  length?: InputMaybe<OrderBy>;
};

/** aggregate sum on columns */
export type InvestmintsSumFields = {
  __typename?: 'investmints_sum_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  length?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "investmints" */
export type InvestmintsSumOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  length?: InputMaybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type InvestmintsVarPopFields = {
  __typename?: 'investmints_var_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "investmints" */
export type InvestmintsVarPopOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  length?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type InvestmintsVarSampFields = {
  __typename?: 'investmints_var_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "investmints" */
export type InvestmintsVarSampOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  length?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type InvestmintsVarianceFields = {
  __typename?: 'investmints_variance_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "investmints" */
export type InvestmintsVarianceOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  length?: InputMaybe<OrderBy>;
};

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type JsonComparisonExp = {
  _eq?: InputMaybe<Scalars['json']['input']>;
  _gt?: InputMaybe<Scalars['json']['input']>;
  _gte?: InputMaybe<Scalars['json']['input']>;
  _in?: InputMaybe<Array<Scalars['json']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['json']['input']>;
  _lte?: InputMaybe<Scalars['json']['input']>;
  _neq?: InputMaybe<Scalars['json']['input']>;
  _nin?: InputMaybe<Array<Scalars['json']['input']>>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type JsonbComparisonExp = {
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** columns and relationships of "message" */
export type Message = {
  __typename?: 'message';
  index: Scalars['bigint']['output'];
  involved_accounts_addresses?: Maybe<Scalars['_text']['output']>;
  /** An object relationship */
  transaction: Transaction;
  transaction_hash: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['jsonb']['output'];
};


/** columns and relationships of "message" */
export type MessageValueArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "message" */
export type MessageAggregate = {
  __typename?: 'message_aggregate';
  aggregate?: Maybe<MessageAggregateFields>;
  nodes: Array<Message>;
};

/** aggregate fields of "message" */
export type MessageAggregateFields = {
  __typename?: 'message_aggregate_fields';
  avg?: Maybe<MessageAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<MessageMaxFields>;
  min?: Maybe<MessageMinFields>;
  stddev?: Maybe<MessageStddevFields>;
  stddev_pop?: Maybe<MessageStddevPopFields>;
  stddev_samp?: Maybe<MessageStddevSampFields>;
  sum?: Maybe<MessageSumFields>;
  var_pop?: Maybe<MessageVarPopFields>;
  var_samp?: Maybe<MessageVarSampFields>;
  variance?: Maybe<MessageVarianceFields>;
};


/** aggregate fields of "message" */
export type MessageAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<MessageSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "message" */
export type MessageAggregateOrderBy = {
  avg?: InputMaybe<MessageAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<MessageMaxOrderBy>;
  min?: InputMaybe<MessageMinOrderBy>;
  stddev?: InputMaybe<MessageStddevOrderBy>;
  stddev_pop?: InputMaybe<MessageStddevPopOrderBy>;
  stddev_samp?: InputMaybe<MessageStddevSampOrderBy>;
  sum?: InputMaybe<MessageSumOrderBy>;
  var_pop?: InputMaybe<MessageVarPopOrderBy>;
  var_samp?: InputMaybe<MessageVarSampOrderBy>;
  variance?: InputMaybe<MessageVarianceOrderBy>;
};

/** aggregate avg on columns */
export type MessageAvgFields = {
  __typename?: 'message_avg_fields';
  index?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "message" */
export type MessageAvgOrderBy = {
  index?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "message". All fields are combined with a logical 'AND'. */
export type MessageBoolExp = {
  _and?: InputMaybe<Array<MessageBoolExp>>;
  _not?: InputMaybe<MessageBoolExp>;
  _or?: InputMaybe<Array<MessageBoolExp>>;
  index?: InputMaybe<BigintComparisonExp>;
  involved_accounts_addresses?: InputMaybe<TextComparisonExp>;
  transaction?: InputMaybe<TransactionBoolExp>;
  transaction_hash?: InputMaybe<StringComparisonExp>;
  type?: InputMaybe<StringComparisonExp>;
  value?: InputMaybe<JsonbComparisonExp>;
};

/** aggregate max on columns */
export type MessageMaxFields = {
  __typename?: 'message_max_fields';
  index?: Maybe<Scalars['bigint']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "message" */
export type MessageMaxOrderBy = {
  index?: InputMaybe<OrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type MessageMinFields = {
  __typename?: 'message_min_fields';
  index?: Maybe<Scalars['bigint']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "message" */
export type MessageMinOrderBy = {
  index?: InputMaybe<OrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "message". */
export type MessageOrderBy = {
  index?: InputMaybe<OrderBy>;
  involved_accounts_addresses?: InputMaybe<OrderBy>;
  transaction?: InputMaybe<TransactionOrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select columns of table "message" */
export enum MessageSelectColumn {
  /** column name */
  Index = 'index',
  /** column name */
  InvolvedAccountsAddresses = 'involved_accounts_addresses',
  /** column name */
  TransactionHash = 'transaction_hash',
  /** column name */
  Type = 'type',
  /** column name */
  Value = 'value'
}

/** aggregate stddev on columns */
export type MessageStddevFields = {
  __typename?: 'message_stddev_fields';
  index?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "message" */
export type MessageStddevOrderBy = {
  index?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type MessageStddevPopFields = {
  __typename?: 'message_stddev_pop_fields';
  index?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "message" */
export type MessageStddevPopOrderBy = {
  index?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type MessageStddevSampFields = {
  __typename?: 'message_stddev_samp_fields';
  index?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "message" */
export type MessageStddevSampOrderBy = {
  index?: InputMaybe<OrderBy>;
};

/** aggregate sum on columns */
export type MessageSumFields = {
  __typename?: 'message_sum_fields';
  index?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "message" */
export type MessageSumOrderBy = {
  index?: InputMaybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type MessageVarPopFields = {
  __typename?: 'message_var_pop_fields';
  index?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "message" */
export type MessageVarPopOrderBy = {
  index?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type MessageVarSampFields = {
  __typename?: 'message_var_samp_fields';
  index?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "message" */
export type MessageVarSampOrderBy = {
  index?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type MessageVarianceFields = {
  __typename?: 'message_variance_fields';
  index?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "message" */
export type MessageVarianceOrderBy = {
  index?: InputMaybe<OrderBy>;
};

export type MessagesByAddressArgs = {
  addresses?: InputMaybe<Scalars['_text']['input']>;
  limit?: InputMaybe<Scalars['bigint']['input']>;
  offset?: InputMaybe<Scalars['bigint']['input']>;
  types?: InputMaybe<Scalars['_text']['input']>;
};

/** columns and relationships of "modules" */
export type Modules = {
  __typename?: 'modules';
  module_name: Scalars['String']['output'];
};

/** aggregated selection of "modules" */
export type ModulesAggregate = {
  __typename?: 'modules_aggregate';
  aggregate?: Maybe<ModulesAggregateFields>;
  nodes: Array<Modules>;
};

/** aggregate fields of "modules" */
export type ModulesAggregateFields = {
  __typename?: 'modules_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<ModulesMaxFields>;
  min?: Maybe<ModulesMinFields>;
};


/** aggregate fields of "modules" */
export type ModulesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ModulesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "modules". All fields are combined with a logical 'AND'. */
export type ModulesBoolExp = {
  _and?: InputMaybe<Array<ModulesBoolExp>>;
  _not?: InputMaybe<ModulesBoolExp>;
  _or?: InputMaybe<Array<ModulesBoolExp>>;
  module_name?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type ModulesMaxFields = {
  __typename?: 'modules_max_fields';
  module_name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type ModulesMinFields = {
  __typename?: 'modules_min_fields';
  module_name?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "modules". */
export type ModulesOrderBy = {
  module_name?: InputMaybe<OrderBy>;
};

/** select columns of table "modules" */
export enum ModulesSelectColumn {
  /** column name */
  ModuleName = 'module_name'
}

/** columns and relationships of "neuron_activation_source" */
export type NeuronActivationSource = {
  __typename?: 'neuron_activation_source';
  genesis_percent?: Maybe<Scalars['float8']['output']>;
  ibc_receive_percent?: Maybe<Scalars['float8']['output']>;
  neuron_activated?: Maybe<Scalars['bigint']['output']>;
  recieve_percent?: Maybe<Scalars['float8']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** aggregated selection of "neuron_activation_source" */
export type NeuronActivationSourceAggregate = {
  __typename?: 'neuron_activation_source_aggregate';
  aggregate?: Maybe<NeuronActivationSourceAggregateFields>;
  nodes: Array<NeuronActivationSource>;
};

/** aggregate fields of "neuron_activation_source" */
export type NeuronActivationSourceAggregateFields = {
  __typename?: 'neuron_activation_source_aggregate_fields';
  avg?: Maybe<NeuronActivationSourceAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<NeuronActivationSourceMaxFields>;
  min?: Maybe<NeuronActivationSourceMinFields>;
  stddev?: Maybe<NeuronActivationSourceStddevFields>;
  stddev_pop?: Maybe<NeuronActivationSourceStddevPopFields>;
  stddev_samp?: Maybe<NeuronActivationSourceStddevSampFields>;
  sum?: Maybe<NeuronActivationSourceSumFields>;
  var_pop?: Maybe<NeuronActivationSourceVarPopFields>;
  var_samp?: Maybe<NeuronActivationSourceVarSampFields>;
  variance?: Maybe<NeuronActivationSourceVarianceFields>;
};


/** aggregate fields of "neuron_activation_source" */
export type NeuronActivationSourceAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<NeuronActivationSourceSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type NeuronActivationSourceAvgFields = {
  __typename?: 'neuron_activation_source_avg_fields';
  genesis_percent?: Maybe<Scalars['Float']['output']>;
  ibc_receive_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activated?: Maybe<Scalars['Float']['output']>;
  recieve_percent?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "neuron_activation_source". All fields are combined with a logical 'AND'. */
export type NeuronActivationSourceBoolExp = {
  _and?: InputMaybe<Array<NeuronActivationSourceBoolExp>>;
  _not?: InputMaybe<NeuronActivationSourceBoolExp>;
  _or?: InputMaybe<Array<NeuronActivationSourceBoolExp>>;
  genesis_percent?: InputMaybe<Float8ComparisonExp>;
  ibc_receive_percent?: InputMaybe<Float8ComparisonExp>;
  neuron_activated?: InputMaybe<BigintComparisonExp>;
  recieve_percent?: InputMaybe<Float8ComparisonExp>;
  week?: InputMaybe<DateComparisonExp>;
};

/** aggregate max on columns */
export type NeuronActivationSourceMaxFields = {
  __typename?: 'neuron_activation_source_max_fields';
  genesis_percent?: Maybe<Scalars['float8']['output']>;
  ibc_receive_percent?: Maybe<Scalars['float8']['output']>;
  neuron_activated?: Maybe<Scalars['bigint']['output']>;
  recieve_percent?: Maybe<Scalars['float8']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** aggregate min on columns */
export type NeuronActivationSourceMinFields = {
  __typename?: 'neuron_activation_source_min_fields';
  genesis_percent?: Maybe<Scalars['float8']['output']>;
  ibc_receive_percent?: Maybe<Scalars['float8']['output']>;
  neuron_activated?: Maybe<Scalars['bigint']['output']>;
  recieve_percent?: Maybe<Scalars['float8']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** Ordering options when selecting data from "neuron_activation_source". */
export type NeuronActivationSourceOrderBy = {
  genesis_percent?: InputMaybe<OrderBy>;
  ibc_receive_percent?: InputMaybe<OrderBy>;
  neuron_activated?: InputMaybe<OrderBy>;
  recieve_percent?: InputMaybe<OrderBy>;
  week?: InputMaybe<OrderBy>;
};

/** select columns of table "neuron_activation_source" */
export enum NeuronActivationSourceSelectColumn {
  /** column name */
  GenesisPercent = 'genesis_percent',
  /** column name */
  IbcReceivePercent = 'ibc_receive_percent',
  /** column name */
  NeuronActivated = 'neuron_activated',
  /** column name */
  RecievePercent = 'recieve_percent',
  /** column name */
  Week = 'week'
}

/** aggregate stddev on columns */
export type NeuronActivationSourceStddevFields = {
  __typename?: 'neuron_activation_source_stddev_fields';
  genesis_percent?: Maybe<Scalars['Float']['output']>;
  ibc_receive_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activated?: Maybe<Scalars['Float']['output']>;
  recieve_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type NeuronActivationSourceStddevPopFields = {
  __typename?: 'neuron_activation_source_stddev_pop_fields';
  genesis_percent?: Maybe<Scalars['Float']['output']>;
  ibc_receive_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activated?: Maybe<Scalars['Float']['output']>;
  recieve_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type NeuronActivationSourceStddevSampFields = {
  __typename?: 'neuron_activation_source_stddev_samp_fields';
  genesis_percent?: Maybe<Scalars['Float']['output']>;
  ibc_receive_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activated?: Maybe<Scalars['Float']['output']>;
  recieve_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type NeuronActivationSourceSumFields = {
  __typename?: 'neuron_activation_source_sum_fields';
  genesis_percent?: Maybe<Scalars['float8']['output']>;
  ibc_receive_percent?: Maybe<Scalars['float8']['output']>;
  neuron_activated?: Maybe<Scalars['bigint']['output']>;
  recieve_percent?: Maybe<Scalars['float8']['output']>;
};

/** aggregate var_pop on columns */
export type NeuronActivationSourceVarPopFields = {
  __typename?: 'neuron_activation_source_var_pop_fields';
  genesis_percent?: Maybe<Scalars['Float']['output']>;
  ibc_receive_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activated?: Maybe<Scalars['Float']['output']>;
  recieve_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type NeuronActivationSourceVarSampFields = {
  __typename?: 'neuron_activation_source_var_samp_fields';
  genesis_percent?: Maybe<Scalars['Float']['output']>;
  ibc_receive_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activated?: Maybe<Scalars['Float']['output']>;
  recieve_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type NeuronActivationSourceVarianceFields = {
  __typename?: 'neuron_activation_source_variance_fields';
  genesis_percent?: Maybe<Scalars['Float']['output']>;
  ibc_receive_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activated?: Maybe<Scalars['Float']['output']>;
  recieve_percent?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "number_of_new_neurons" */
export type NumberOfNewNeurons = {
  __typename?: 'number_of_new_neurons';
  date?: Maybe<Scalars['date']['output']>;
  new_neurons_daily?: Maybe<Scalars['bigint']['output']>;
  new_neurons_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "number_of_new_neurons" */
export type NumberOfNewNeuronsAggregate = {
  __typename?: 'number_of_new_neurons_aggregate';
  aggregate?: Maybe<NumberOfNewNeuronsAggregateFields>;
  nodes: Array<NumberOfNewNeurons>;
};

/** aggregate fields of "number_of_new_neurons" */
export type NumberOfNewNeuronsAggregateFields = {
  __typename?: 'number_of_new_neurons_aggregate_fields';
  avg?: Maybe<NumberOfNewNeuronsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<NumberOfNewNeuronsMaxFields>;
  min?: Maybe<NumberOfNewNeuronsMinFields>;
  stddev?: Maybe<NumberOfNewNeuronsStddevFields>;
  stddev_pop?: Maybe<NumberOfNewNeuronsStddevPopFields>;
  stddev_samp?: Maybe<NumberOfNewNeuronsStddevSampFields>;
  sum?: Maybe<NumberOfNewNeuronsSumFields>;
  var_pop?: Maybe<NumberOfNewNeuronsVarPopFields>;
  var_samp?: Maybe<NumberOfNewNeuronsVarSampFields>;
  variance?: Maybe<NumberOfNewNeuronsVarianceFields>;
};


/** aggregate fields of "number_of_new_neurons" */
export type NumberOfNewNeuronsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<NumberOfNewNeuronsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type NumberOfNewNeuronsAvgFields = {
  __typename?: 'number_of_new_neurons_avg_fields';
  new_neurons_daily?: Maybe<Scalars['Float']['output']>;
  new_neurons_total?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "number_of_new_neurons". All fields are combined with a logical 'AND'. */
export type NumberOfNewNeuronsBoolExp = {
  _and?: InputMaybe<Array<NumberOfNewNeuronsBoolExp>>;
  _not?: InputMaybe<NumberOfNewNeuronsBoolExp>;
  _or?: InputMaybe<Array<NumberOfNewNeuronsBoolExp>>;
  date?: InputMaybe<DateComparisonExp>;
  new_neurons_daily?: InputMaybe<BigintComparisonExp>;
  new_neurons_total?: InputMaybe<NumericComparisonExp>;
};

/** aggregate max on columns */
export type NumberOfNewNeuronsMaxFields = {
  __typename?: 'number_of_new_neurons_max_fields';
  date?: Maybe<Scalars['date']['output']>;
  new_neurons_daily?: Maybe<Scalars['bigint']['output']>;
  new_neurons_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type NumberOfNewNeuronsMinFields = {
  __typename?: 'number_of_new_neurons_min_fields';
  date?: Maybe<Scalars['date']['output']>;
  new_neurons_daily?: Maybe<Scalars['bigint']['output']>;
  new_neurons_total?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "number_of_new_neurons". */
export type NumberOfNewNeuronsOrderBy = {
  date?: InputMaybe<OrderBy>;
  new_neurons_daily?: InputMaybe<OrderBy>;
  new_neurons_total?: InputMaybe<OrderBy>;
};

/** select columns of table "number_of_new_neurons" */
export enum NumberOfNewNeuronsSelectColumn {
  /** column name */
  Date = 'date',
  /** column name */
  NewNeuronsDaily = 'new_neurons_daily',
  /** column name */
  NewNeuronsTotal = 'new_neurons_total'
}

/** aggregate stddev on columns */
export type NumberOfNewNeuronsStddevFields = {
  __typename?: 'number_of_new_neurons_stddev_fields';
  new_neurons_daily?: Maybe<Scalars['Float']['output']>;
  new_neurons_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type NumberOfNewNeuronsStddevPopFields = {
  __typename?: 'number_of_new_neurons_stddev_pop_fields';
  new_neurons_daily?: Maybe<Scalars['Float']['output']>;
  new_neurons_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type NumberOfNewNeuronsStddevSampFields = {
  __typename?: 'number_of_new_neurons_stddev_samp_fields';
  new_neurons_daily?: Maybe<Scalars['Float']['output']>;
  new_neurons_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type NumberOfNewNeuronsSumFields = {
  __typename?: 'number_of_new_neurons_sum_fields';
  new_neurons_daily?: Maybe<Scalars['bigint']['output']>;
  new_neurons_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type NumberOfNewNeuronsVarPopFields = {
  __typename?: 'number_of_new_neurons_var_pop_fields';
  new_neurons_daily?: Maybe<Scalars['Float']['output']>;
  new_neurons_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type NumberOfNewNeuronsVarSampFields = {
  __typename?: 'number_of_new_neurons_var_samp_fields';
  new_neurons_daily?: Maybe<Scalars['Float']['output']>;
  new_neurons_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type NumberOfNewNeuronsVarianceFields = {
  __typename?: 'number_of_new_neurons_variance_fields';
  new_neurons_daily?: Maybe<Scalars['Float']['output']>;
  new_neurons_total?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type NumericComparisonExp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** columns and relationships of "old_precommits" */
export type OldPrecommits = {
  __typename?: 'old_precommits';
  consensus_address: Scalars['String']['output'];
  consensus_pubkey: Scalars['String']['output'];
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "old_precommits" */
export type OldPrecommitsAggregate = {
  __typename?: 'old_precommits_aggregate';
  aggregate?: Maybe<OldPrecommitsAggregateFields>;
  nodes: Array<OldPrecommits>;
};

/** aggregate fields of "old_precommits" */
export type OldPrecommitsAggregateFields = {
  __typename?: 'old_precommits_aggregate_fields';
  avg?: Maybe<OldPrecommitsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<OldPrecommitsMaxFields>;
  min?: Maybe<OldPrecommitsMinFields>;
  stddev?: Maybe<OldPrecommitsStddevFields>;
  stddev_pop?: Maybe<OldPrecommitsStddevPopFields>;
  stddev_samp?: Maybe<OldPrecommitsStddevSampFields>;
  sum?: Maybe<OldPrecommitsSumFields>;
  var_pop?: Maybe<OldPrecommitsVarPopFields>;
  var_samp?: Maybe<OldPrecommitsVarSampFields>;
  variance?: Maybe<OldPrecommitsVarianceFields>;
};


/** aggregate fields of "old_precommits" */
export type OldPrecommitsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<OldPrecommitsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type OldPrecommitsAvgFields = {
  __typename?: 'old_precommits_avg_fields';
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "old_precommits". All fields are combined with a logical 'AND'. */
export type OldPrecommitsBoolExp = {
  _and?: InputMaybe<Array<OldPrecommitsBoolExp>>;
  _not?: InputMaybe<OldPrecommitsBoolExp>;
  _or?: InputMaybe<Array<OldPrecommitsBoolExp>>;
  consensus_address?: InputMaybe<StringComparisonExp>;
  consensus_pubkey?: InputMaybe<StringComparisonExp>;
  precommits?: InputMaybe<NumericComparisonExp>;
};

/** aggregate max on columns */
export type OldPrecommitsMaxFields = {
  __typename?: 'old_precommits_max_fields';
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type OldPrecommitsMinFields = {
  __typename?: 'old_precommits_min_fields';
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "old_precommits". */
export type OldPrecommitsOrderBy = {
  consensus_address?: InputMaybe<OrderBy>;
  consensus_pubkey?: InputMaybe<OrderBy>;
  precommits?: InputMaybe<OrderBy>;
};

/** select columns of table "old_precommits" */
export enum OldPrecommitsSelectColumn {
  /** column name */
  ConsensusAddress = 'consensus_address',
  /** column name */
  ConsensusPubkey = 'consensus_pubkey',
  /** column name */
  Precommits = 'precommits'
}

/** aggregate stddev on columns */
export type OldPrecommitsStddevFields = {
  __typename?: 'old_precommits_stddev_fields';
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type OldPrecommitsStddevPopFields = {
  __typename?: 'old_precommits_stddev_pop_fields';
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type OldPrecommitsStddevSampFields = {
  __typename?: 'old_precommits_stddev_samp_fields';
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type OldPrecommitsSumFields = {
  __typename?: 'old_precommits_sum_fields';
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type OldPrecommitsVarPopFields = {
  __typename?: 'old_precommits_var_pop_fields';
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type OldPrecommitsVarSampFields = {
  __typename?: 'old_precommits_var_samp_fields';
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type OldPrecommitsVarianceFields = {
  __typename?: 'old_precommits_variance_fields';
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** column ordering options */
export enum OrderBy {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** columns and relationships of "particles" */
export type Particles = {
  __typename?: 'particles';
  /** An object relationship */
  account: Account;
  /** An object relationship */
  block: Block;
  height: Scalars['bigint']['output'];
  id: Scalars['Int']['output'];
  /** An array relationship */
  in: Array<Cyberlinks>;
  /** An aggregate relationship */
  in_aggregate: CyberlinksAggregate;
  neuron: Scalars['String']['output'];
  /** An array relationship */
  out: Array<Cyberlinks>;
  /** An aggregate relationship */
  out_aggregate: CyberlinksAggregate;
  particle: Scalars['String']['output'];
  timestamp: Scalars['timestamp']['output'];
  /** An object relationship */
  transaction: Transaction;
  transaction_hash: Scalars['String']['output'];
};


/** columns and relationships of "particles" */
export type ParticlesInArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksOrderBy>>;
  where?: InputMaybe<CyberlinksBoolExp>;
};


/** columns and relationships of "particles" */
export type ParticlesInAggregateArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksOrderBy>>;
  where?: InputMaybe<CyberlinksBoolExp>;
};


/** columns and relationships of "particles" */
export type ParticlesOutArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksOrderBy>>;
  where?: InputMaybe<CyberlinksBoolExp>;
};


/** columns and relationships of "particles" */
export type ParticlesOutAggregateArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksOrderBy>>;
  where?: InputMaybe<CyberlinksBoolExp>;
};

/** aggregated selection of "particles" */
export type ParticlesAggregate = {
  __typename?: 'particles_aggregate';
  aggregate?: Maybe<ParticlesAggregateFields>;
  nodes: Array<Particles>;
};

/** aggregate fields of "particles" */
export type ParticlesAggregateFields = {
  __typename?: 'particles_aggregate_fields';
  avg?: Maybe<ParticlesAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<ParticlesMaxFields>;
  min?: Maybe<ParticlesMinFields>;
  stddev?: Maybe<ParticlesStddevFields>;
  stddev_pop?: Maybe<ParticlesStddevPopFields>;
  stddev_samp?: Maybe<ParticlesStddevSampFields>;
  sum?: Maybe<ParticlesSumFields>;
  var_pop?: Maybe<ParticlesVarPopFields>;
  var_samp?: Maybe<ParticlesVarSampFields>;
  variance?: Maybe<ParticlesVarianceFields>;
};


/** aggregate fields of "particles" */
export type ParticlesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ParticlesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "particles" */
export type ParticlesAggregateOrderBy = {
  avg?: InputMaybe<ParticlesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ParticlesMaxOrderBy>;
  min?: InputMaybe<ParticlesMinOrderBy>;
  stddev?: InputMaybe<ParticlesStddevOrderBy>;
  stddev_pop?: InputMaybe<ParticlesStddevPopOrderBy>;
  stddev_samp?: InputMaybe<ParticlesStddevSampOrderBy>;
  sum?: InputMaybe<ParticlesSumOrderBy>;
  var_pop?: InputMaybe<ParticlesVarPopOrderBy>;
  var_samp?: InputMaybe<ParticlesVarSampOrderBy>;
  variance?: InputMaybe<ParticlesVarianceOrderBy>;
};

/** aggregate avg on columns */
export type ParticlesAvgFields = {
  __typename?: 'particles_avg_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "particles" */
export type ParticlesAvgOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "particles". All fields are combined with a logical 'AND'. */
export type ParticlesBoolExp = {
  _and?: InputMaybe<Array<ParticlesBoolExp>>;
  _not?: InputMaybe<ParticlesBoolExp>;
  _or?: InputMaybe<Array<ParticlesBoolExp>>;
  account?: InputMaybe<AccountBoolExp>;
  block?: InputMaybe<BlockBoolExp>;
  height?: InputMaybe<BigintComparisonExp>;
  id?: InputMaybe<IntComparisonExp>;
  in?: InputMaybe<CyberlinksBoolExp>;
  neuron?: InputMaybe<StringComparisonExp>;
  out?: InputMaybe<CyberlinksBoolExp>;
  particle?: InputMaybe<StringComparisonExp>;
  timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction?: InputMaybe<TransactionBoolExp>;
  transaction_hash?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type ParticlesMaxFields = {
  __typename?: 'particles_max_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  particle?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "particles" */
export type ParticlesMaxOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  neuron?: InputMaybe<OrderBy>;
  particle?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type ParticlesMinFields = {
  __typename?: 'particles_min_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  particle?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "particles" */
export type ParticlesMinOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  neuron?: InputMaybe<OrderBy>;
  particle?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "particles". */
export type ParticlesOrderBy = {
  account?: InputMaybe<AccountOrderBy>;
  block?: InputMaybe<BlockOrderBy>;
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  in_aggregate?: InputMaybe<CyberlinksAggregateOrderBy>;
  neuron?: InputMaybe<OrderBy>;
  out_aggregate?: InputMaybe<CyberlinksAggregateOrderBy>;
  particle?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  transaction?: InputMaybe<TransactionOrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
};

/** select columns of table "particles" */
export enum ParticlesSelectColumn {
  /** column name */
  Height = 'height',
  /** column name */
  Id = 'id',
  /** column name */
  Neuron = 'neuron',
  /** column name */
  Particle = 'particle',
  /** column name */
  Timestamp = 'timestamp',
  /** column name */
  TransactionHash = 'transaction_hash'
}

/** aggregate stddev on columns */
export type ParticlesStddevFields = {
  __typename?: 'particles_stddev_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "particles" */
export type ParticlesStddevOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type ParticlesStddevPopFields = {
  __typename?: 'particles_stddev_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "particles" */
export type ParticlesStddevPopOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type ParticlesStddevSampFields = {
  __typename?: 'particles_stddev_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "particles" */
export type ParticlesStddevSampOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate sum on columns */
export type ParticlesSumFields = {
  __typename?: 'particles_sum_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "particles" */
export type ParticlesSumOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type ParticlesVarPopFields = {
  __typename?: 'particles_var_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "particles" */
export type ParticlesVarPopOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type ParticlesVarSampFields = {
  __typename?: 'particles_var_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "particles" */
export type ParticlesVarSampOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type ParticlesVarianceFields = {
  __typename?: 'particles_variance_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "particles" */
export type ParticlesVarianceOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** columns and relationships of "pre_commit" */
export type PreCommit = {
  __typename?: 'pre_commit';
  height: Scalars['bigint']['output'];
  proposer_priority: Scalars['bigint']['output'];
  timestamp: Scalars['timestamp']['output'];
  /** An object relationship */
  validator: Validator;
  validator_address: Scalars['String']['output'];
  voting_power: Scalars['bigint']['output'];
};

/** aggregated selection of "pre_commit" */
export type PreCommitAggregate = {
  __typename?: 'pre_commit_aggregate';
  aggregate?: Maybe<PreCommitAggregateFields>;
  nodes: Array<PreCommit>;
};

/** aggregate fields of "pre_commit" */
export type PreCommitAggregateFields = {
  __typename?: 'pre_commit_aggregate_fields';
  avg?: Maybe<PreCommitAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<PreCommitMaxFields>;
  min?: Maybe<PreCommitMinFields>;
  stddev?: Maybe<PreCommitStddevFields>;
  stddev_pop?: Maybe<PreCommitStddevPopFields>;
  stddev_samp?: Maybe<PreCommitStddevSampFields>;
  sum?: Maybe<PreCommitSumFields>;
  var_pop?: Maybe<PreCommitVarPopFields>;
  var_samp?: Maybe<PreCommitVarSampFields>;
  variance?: Maybe<PreCommitVarianceFields>;
};


/** aggregate fields of "pre_commit" */
export type PreCommitAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PreCommitSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "pre_commit" */
export type PreCommitAggregateOrderBy = {
  avg?: InputMaybe<PreCommitAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<PreCommitMaxOrderBy>;
  min?: InputMaybe<PreCommitMinOrderBy>;
  stddev?: InputMaybe<PreCommitStddevOrderBy>;
  stddev_pop?: InputMaybe<PreCommitStddevPopOrderBy>;
  stddev_samp?: InputMaybe<PreCommitStddevSampOrderBy>;
  sum?: InputMaybe<PreCommitSumOrderBy>;
  var_pop?: InputMaybe<PreCommitVarPopOrderBy>;
  var_samp?: InputMaybe<PreCommitVarSampOrderBy>;
  variance?: InputMaybe<PreCommitVarianceOrderBy>;
};

/** aggregate avg on columns */
export type PreCommitAvgFields = {
  __typename?: 'pre_commit_avg_fields';
  height?: Maybe<Scalars['Float']['output']>;
  proposer_priority?: Maybe<Scalars['Float']['output']>;
  voting_power?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "pre_commit" */
export type PreCommitAvgOrderBy = {
  height?: InputMaybe<OrderBy>;
  proposer_priority?: InputMaybe<OrderBy>;
  voting_power?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "pre_commit". All fields are combined with a logical 'AND'. */
export type PreCommitBoolExp = {
  _and?: InputMaybe<Array<PreCommitBoolExp>>;
  _not?: InputMaybe<PreCommitBoolExp>;
  _or?: InputMaybe<Array<PreCommitBoolExp>>;
  height?: InputMaybe<BigintComparisonExp>;
  proposer_priority?: InputMaybe<BigintComparisonExp>;
  timestamp?: InputMaybe<TimestampComparisonExp>;
  validator?: InputMaybe<ValidatorBoolExp>;
  validator_address?: InputMaybe<StringComparisonExp>;
  voting_power?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type PreCommitMaxFields = {
  __typename?: 'pre_commit_max_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  proposer_priority?: Maybe<Scalars['bigint']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  validator_address?: Maybe<Scalars['String']['output']>;
  voting_power?: Maybe<Scalars['bigint']['output']>;
};

/** order by max() on columns of table "pre_commit" */
export type PreCommitMaxOrderBy = {
  height?: InputMaybe<OrderBy>;
  proposer_priority?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  validator_address?: InputMaybe<OrderBy>;
  voting_power?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type PreCommitMinFields = {
  __typename?: 'pre_commit_min_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  proposer_priority?: Maybe<Scalars['bigint']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  validator_address?: Maybe<Scalars['String']['output']>;
  voting_power?: Maybe<Scalars['bigint']['output']>;
};

/** order by min() on columns of table "pre_commit" */
export type PreCommitMinOrderBy = {
  height?: InputMaybe<OrderBy>;
  proposer_priority?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  validator_address?: InputMaybe<OrderBy>;
  voting_power?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "pre_commit". */
export type PreCommitOrderBy = {
  height?: InputMaybe<OrderBy>;
  proposer_priority?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  validator?: InputMaybe<ValidatorOrderBy>;
  validator_address?: InputMaybe<OrderBy>;
  voting_power?: InputMaybe<OrderBy>;
};

/** select columns of table "pre_commit" */
export enum PreCommitSelectColumn {
  /** column name */
  Height = 'height',
  /** column name */
  ProposerPriority = 'proposer_priority',
  /** column name */
  Timestamp = 'timestamp',
  /** column name */
  ValidatorAddress = 'validator_address',
  /** column name */
  VotingPower = 'voting_power'
}

/** aggregate stddev on columns */
export type PreCommitStddevFields = {
  __typename?: 'pre_commit_stddev_fields';
  height?: Maybe<Scalars['Float']['output']>;
  proposer_priority?: Maybe<Scalars['Float']['output']>;
  voting_power?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "pre_commit" */
export type PreCommitStddevOrderBy = {
  height?: InputMaybe<OrderBy>;
  proposer_priority?: InputMaybe<OrderBy>;
  voting_power?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type PreCommitStddevPopFields = {
  __typename?: 'pre_commit_stddev_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  proposer_priority?: Maybe<Scalars['Float']['output']>;
  voting_power?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "pre_commit" */
export type PreCommitStddevPopOrderBy = {
  height?: InputMaybe<OrderBy>;
  proposer_priority?: InputMaybe<OrderBy>;
  voting_power?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type PreCommitStddevSampFields = {
  __typename?: 'pre_commit_stddev_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  proposer_priority?: Maybe<Scalars['Float']['output']>;
  voting_power?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "pre_commit" */
export type PreCommitStddevSampOrderBy = {
  height?: InputMaybe<OrderBy>;
  proposer_priority?: InputMaybe<OrderBy>;
  voting_power?: InputMaybe<OrderBy>;
};

/** aggregate sum on columns */
export type PreCommitSumFields = {
  __typename?: 'pre_commit_sum_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  proposer_priority?: Maybe<Scalars['bigint']['output']>;
  voting_power?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "pre_commit" */
export type PreCommitSumOrderBy = {
  height?: InputMaybe<OrderBy>;
  proposer_priority?: InputMaybe<OrderBy>;
  voting_power?: InputMaybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type PreCommitVarPopFields = {
  __typename?: 'pre_commit_var_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  proposer_priority?: Maybe<Scalars['Float']['output']>;
  voting_power?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "pre_commit" */
export type PreCommitVarPopOrderBy = {
  height?: InputMaybe<OrderBy>;
  proposer_priority?: InputMaybe<OrderBy>;
  voting_power?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type PreCommitVarSampFields = {
  __typename?: 'pre_commit_var_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  proposer_priority?: Maybe<Scalars['Float']['output']>;
  voting_power?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "pre_commit" */
export type PreCommitVarSampOrderBy = {
  height?: InputMaybe<OrderBy>;
  proposer_priority?: InputMaybe<OrderBy>;
  voting_power?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type PreCommitVarianceFields = {
  __typename?: 'pre_commit_variance_fields';
  height?: Maybe<Scalars['Float']['output']>;
  proposer_priority?: Maybe<Scalars['Float']['output']>;
  voting_power?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "pre_commit" */
export type PreCommitVarianceOrderBy = {
  height?: InputMaybe<OrderBy>;
  proposer_priority?: InputMaybe<OrderBy>;
  voting_power?: InputMaybe<OrderBy>;
};

/** columns and relationships of "pre_commits_rewards_view" */
export type PreCommitsRewardsView = {
  __typename?: 'pre_commits_rewards_view';
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  max_block?: Maybe<Scalars['bigint']['output']>;
  pre_commit_rewards?: Maybe<Scalars['numeric']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
  sum_precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "pre_commits_rewards_view" */
export type PreCommitsRewardsViewAggregate = {
  __typename?: 'pre_commits_rewards_view_aggregate';
  aggregate?: Maybe<PreCommitsRewardsViewAggregateFields>;
  nodes: Array<PreCommitsRewardsView>;
};

/** aggregate fields of "pre_commits_rewards_view" */
export type PreCommitsRewardsViewAggregateFields = {
  __typename?: 'pre_commits_rewards_view_aggregate_fields';
  avg?: Maybe<PreCommitsRewardsViewAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<PreCommitsRewardsViewMaxFields>;
  min?: Maybe<PreCommitsRewardsViewMinFields>;
  stddev?: Maybe<PreCommitsRewardsViewStddevFields>;
  stddev_pop?: Maybe<PreCommitsRewardsViewStddevPopFields>;
  stddev_samp?: Maybe<PreCommitsRewardsViewStddevSampFields>;
  sum?: Maybe<PreCommitsRewardsViewSumFields>;
  var_pop?: Maybe<PreCommitsRewardsViewVarPopFields>;
  var_samp?: Maybe<PreCommitsRewardsViewVarSampFields>;
  variance?: Maybe<PreCommitsRewardsViewVarianceFields>;
};


/** aggregate fields of "pre_commits_rewards_view" */
export type PreCommitsRewardsViewAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PreCommitsRewardsViewSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type PreCommitsRewardsViewAvgFields = {
  __typename?: 'pre_commits_rewards_view_avg_fields';
  max_block?: Maybe<Scalars['Float']['output']>;
  pre_commit_rewards?: Maybe<Scalars['Float']['output']>;
  precommits?: Maybe<Scalars['Float']['output']>;
  sum_precommits?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pre_commits_rewards_view". All fields are combined with a logical 'AND'. */
export type PreCommitsRewardsViewBoolExp = {
  _and?: InputMaybe<Array<PreCommitsRewardsViewBoolExp>>;
  _not?: InputMaybe<PreCommitsRewardsViewBoolExp>;
  _or?: InputMaybe<Array<PreCommitsRewardsViewBoolExp>>;
  consensus_pubkey?: InputMaybe<StringComparisonExp>;
  max_block?: InputMaybe<BigintComparisonExp>;
  pre_commit_rewards?: InputMaybe<NumericComparisonExp>;
  precommits?: InputMaybe<NumericComparisonExp>;
  sum_precommits?: InputMaybe<NumericComparisonExp>;
};

/** aggregate max on columns */
export type PreCommitsRewardsViewMaxFields = {
  __typename?: 'pre_commits_rewards_view_max_fields';
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  max_block?: Maybe<Scalars['bigint']['output']>;
  pre_commit_rewards?: Maybe<Scalars['numeric']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
  sum_precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type PreCommitsRewardsViewMinFields = {
  __typename?: 'pre_commits_rewards_view_min_fields';
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  max_block?: Maybe<Scalars['bigint']['output']>;
  pre_commit_rewards?: Maybe<Scalars['numeric']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
  sum_precommits?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "pre_commits_rewards_view". */
export type PreCommitsRewardsViewOrderBy = {
  consensus_pubkey?: InputMaybe<OrderBy>;
  max_block?: InputMaybe<OrderBy>;
  pre_commit_rewards?: InputMaybe<OrderBy>;
  precommits?: InputMaybe<OrderBy>;
  sum_precommits?: InputMaybe<OrderBy>;
};

/** select columns of table "pre_commits_rewards_view" */
export enum PreCommitsRewardsViewSelectColumn {
  /** column name */
  ConsensusPubkey = 'consensus_pubkey',
  /** column name */
  MaxBlock = 'max_block',
  /** column name */
  PreCommitRewards = 'pre_commit_rewards',
  /** column name */
  Precommits = 'precommits',
  /** column name */
  SumPrecommits = 'sum_precommits'
}

/** aggregate stddev on columns */
export type PreCommitsRewardsViewStddevFields = {
  __typename?: 'pre_commits_rewards_view_stddev_fields';
  max_block?: Maybe<Scalars['Float']['output']>;
  pre_commit_rewards?: Maybe<Scalars['Float']['output']>;
  precommits?: Maybe<Scalars['Float']['output']>;
  sum_precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type PreCommitsRewardsViewStddevPopFields = {
  __typename?: 'pre_commits_rewards_view_stddev_pop_fields';
  max_block?: Maybe<Scalars['Float']['output']>;
  pre_commit_rewards?: Maybe<Scalars['Float']['output']>;
  precommits?: Maybe<Scalars['Float']['output']>;
  sum_precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type PreCommitsRewardsViewStddevSampFields = {
  __typename?: 'pre_commits_rewards_view_stddev_samp_fields';
  max_block?: Maybe<Scalars['Float']['output']>;
  pre_commit_rewards?: Maybe<Scalars['Float']['output']>;
  precommits?: Maybe<Scalars['Float']['output']>;
  sum_precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type PreCommitsRewardsViewSumFields = {
  __typename?: 'pre_commits_rewards_view_sum_fields';
  max_block?: Maybe<Scalars['bigint']['output']>;
  pre_commit_rewards?: Maybe<Scalars['numeric']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
  sum_precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type PreCommitsRewardsViewVarPopFields = {
  __typename?: 'pre_commits_rewards_view_var_pop_fields';
  max_block?: Maybe<Scalars['Float']['output']>;
  pre_commit_rewards?: Maybe<Scalars['Float']['output']>;
  precommits?: Maybe<Scalars['Float']['output']>;
  sum_precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type PreCommitsRewardsViewVarSampFields = {
  __typename?: 'pre_commits_rewards_view_var_samp_fields';
  max_block?: Maybe<Scalars['Float']['output']>;
  pre_commit_rewards?: Maybe<Scalars['Float']['output']>;
  precommits?: Maybe<Scalars['Float']['output']>;
  sum_precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type PreCommitsRewardsViewVarianceFields = {
  __typename?: 'pre_commits_rewards_view_variance_fields';
  max_block?: Maybe<Scalars['Float']['output']>;
  pre_commit_rewards?: Maybe<Scalars['Float']['output']>;
  precommits?: Maybe<Scalars['Float']['output']>;
  sum_precommits?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "pre_commits_total" */
export type PreCommitsTotal = {
  __typename?: 'pre_commits_total';
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  pre_commits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "pre_commits_total" */
export type PreCommitsTotalAggregate = {
  __typename?: 'pre_commits_total_aggregate';
  aggregate?: Maybe<PreCommitsTotalAggregateFields>;
  nodes: Array<PreCommitsTotal>;
};

/** aggregate fields of "pre_commits_total" */
export type PreCommitsTotalAggregateFields = {
  __typename?: 'pre_commits_total_aggregate_fields';
  avg?: Maybe<PreCommitsTotalAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<PreCommitsTotalMaxFields>;
  min?: Maybe<PreCommitsTotalMinFields>;
  stddev?: Maybe<PreCommitsTotalStddevFields>;
  stddev_pop?: Maybe<PreCommitsTotalStddevPopFields>;
  stddev_samp?: Maybe<PreCommitsTotalStddevSampFields>;
  sum?: Maybe<PreCommitsTotalSumFields>;
  var_pop?: Maybe<PreCommitsTotalVarPopFields>;
  var_samp?: Maybe<PreCommitsTotalVarSampFields>;
  variance?: Maybe<PreCommitsTotalVarianceFields>;
};


/** aggregate fields of "pre_commits_total" */
export type PreCommitsTotalAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PreCommitsTotalSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type PreCommitsTotalAvgFields = {
  __typename?: 'pre_commits_total_avg_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pre_commits_total". All fields are combined with a logical 'AND'. */
export type PreCommitsTotalBoolExp = {
  _and?: InputMaybe<Array<PreCommitsTotalBoolExp>>;
  _not?: InputMaybe<PreCommitsTotalBoolExp>;
  _or?: InputMaybe<Array<PreCommitsTotalBoolExp>>;
  consensus_pubkey?: InputMaybe<StringComparisonExp>;
  pre_commits?: InputMaybe<NumericComparisonExp>;
};

/** aggregate max on columns */
export type PreCommitsTotalMaxFields = {
  __typename?: 'pre_commits_total_max_fields';
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  pre_commits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type PreCommitsTotalMinFields = {
  __typename?: 'pre_commits_total_min_fields';
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  pre_commits?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "pre_commits_total". */
export type PreCommitsTotalOrderBy = {
  consensus_pubkey?: InputMaybe<OrderBy>;
  pre_commits?: InputMaybe<OrderBy>;
};

/** select columns of table "pre_commits_total" */
export enum PreCommitsTotalSelectColumn {
  /** column name */
  ConsensusPubkey = 'consensus_pubkey',
  /** column name */
  PreCommits = 'pre_commits'
}

/** aggregate stddev on columns */
export type PreCommitsTotalStddevFields = {
  __typename?: 'pre_commits_total_stddev_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type PreCommitsTotalStddevPopFields = {
  __typename?: 'pre_commits_total_stddev_pop_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type PreCommitsTotalStddevSampFields = {
  __typename?: 'pre_commits_total_stddev_samp_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type PreCommitsTotalSumFields = {
  __typename?: 'pre_commits_total_sum_fields';
  pre_commits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type PreCommitsTotalVarPopFields = {
  __typename?: 'pre_commits_total_var_pop_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type PreCommitsTotalVarSampFields = {
  __typename?: 'pre_commits_total_var_samp_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type PreCommitsTotalVarianceFields = {
  __typename?: 'pre_commits_total_variance_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "pre_commits_view" */
export type PreCommitsView = {
  __typename?: 'pre_commits_view';
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "pre_commits_view" */
export type PreCommitsViewAggregate = {
  __typename?: 'pre_commits_view_aggregate';
  aggregate?: Maybe<PreCommitsViewAggregateFields>;
  nodes: Array<PreCommitsView>;
};

/** aggregate fields of "pre_commits_view" */
export type PreCommitsViewAggregateFields = {
  __typename?: 'pre_commits_view_aggregate_fields';
  avg?: Maybe<PreCommitsViewAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<PreCommitsViewMaxFields>;
  min?: Maybe<PreCommitsViewMinFields>;
  stddev?: Maybe<PreCommitsViewStddevFields>;
  stddev_pop?: Maybe<PreCommitsViewStddevPopFields>;
  stddev_samp?: Maybe<PreCommitsViewStddevSampFields>;
  sum?: Maybe<PreCommitsViewSumFields>;
  var_pop?: Maybe<PreCommitsViewVarPopFields>;
  var_samp?: Maybe<PreCommitsViewVarSampFields>;
  variance?: Maybe<PreCommitsViewVarianceFields>;
};


/** aggregate fields of "pre_commits_view" */
export type PreCommitsViewAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PreCommitsViewSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type PreCommitsViewAvgFields = {
  __typename?: 'pre_commits_view_avg_fields';
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pre_commits_view". All fields are combined with a logical 'AND'. */
export type PreCommitsViewBoolExp = {
  _and?: InputMaybe<Array<PreCommitsViewBoolExp>>;
  _not?: InputMaybe<PreCommitsViewBoolExp>;
  _or?: InputMaybe<Array<PreCommitsViewBoolExp>>;
  consensus_address?: InputMaybe<StringComparisonExp>;
  consensus_pubkey?: InputMaybe<StringComparisonExp>;
  precommits?: InputMaybe<NumericComparisonExp>;
};

/** aggregate max on columns */
export type PreCommitsViewMaxFields = {
  __typename?: 'pre_commits_view_max_fields';
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type PreCommitsViewMinFields = {
  __typename?: 'pre_commits_view_min_fields';
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "pre_commits_view". */
export type PreCommitsViewOrderBy = {
  consensus_address?: InputMaybe<OrderBy>;
  consensus_pubkey?: InputMaybe<OrderBy>;
  precommits?: InputMaybe<OrderBy>;
};

/** select columns of table "pre_commits_view" */
export enum PreCommitsViewSelectColumn {
  /** column name */
  ConsensusAddress = 'consensus_address',
  /** column name */
  ConsensusPubkey = 'consensus_pubkey',
  /** column name */
  Precommits = 'precommits'
}

/** aggregate stddev on columns */
export type PreCommitsViewStddevFields = {
  __typename?: 'pre_commits_view_stddev_fields';
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type PreCommitsViewStddevPopFields = {
  __typename?: 'pre_commits_view_stddev_pop_fields';
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type PreCommitsViewStddevSampFields = {
  __typename?: 'pre_commits_view_stddev_samp_fields';
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type PreCommitsViewSumFields = {
  __typename?: 'pre_commits_view_sum_fields';
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type PreCommitsViewVarPopFields = {
  __typename?: 'pre_commits_view_var_pop_fields';
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type PreCommitsViewVarSampFields = {
  __typename?: 'pre_commits_view_var_samp_fields';
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type PreCommitsViewVarianceFields = {
  __typename?: 'pre_commits_view_variance_fields';
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "pruning" */
export type Pruning = {
  __typename?: 'pruning';
  last_pruned_height: Scalars['bigint']['output'];
};

/** aggregated selection of "pruning" */
export type PruningAggregate = {
  __typename?: 'pruning_aggregate';
  aggregate?: Maybe<PruningAggregateFields>;
  nodes: Array<Pruning>;
};

/** aggregate fields of "pruning" */
export type PruningAggregateFields = {
  __typename?: 'pruning_aggregate_fields';
  avg?: Maybe<PruningAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<PruningMaxFields>;
  min?: Maybe<PruningMinFields>;
  stddev?: Maybe<PruningStddevFields>;
  stddev_pop?: Maybe<PruningStddevPopFields>;
  stddev_samp?: Maybe<PruningStddevSampFields>;
  sum?: Maybe<PruningSumFields>;
  var_pop?: Maybe<PruningVarPopFields>;
  var_samp?: Maybe<PruningVarSampFields>;
  variance?: Maybe<PruningVarianceFields>;
};


/** aggregate fields of "pruning" */
export type PruningAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PruningSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type PruningAvgFields = {
  __typename?: 'pruning_avg_fields';
  last_pruned_height?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pruning". All fields are combined with a logical 'AND'. */
export type PruningBoolExp = {
  _and?: InputMaybe<Array<PruningBoolExp>>;
  _not?: InputMaybe<PruningBoolExp>;
  _or?: InputMaybe<Array<PruningBoolExp>>;
  last_pruned_height?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type PruningMaxFields = {
  __typename?: 'pruning_max_fields';
  last_pruned_height?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type PruningMinFields = {
  __typename?: 'pruning_min_fields';
  last_pruned_height?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "pruning". */
export type PruningOrderBy = {
  last_pruned_height?: InputMaybe<OrderBy>;
};

/** select columns of table "pruning" */
export enum PruningSelectColumn {
  /** column name */
  LastPrunedHeight = 'last_pruned_height'
}

/** aggregate stddev on columns */
export type PruningStddevFields = {
  __typename?: 'pruning_stddev_fields';
  last_pruned_height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type PruningStddevPopFields = {
  __typename?: 'pruning_stddev_pop_fields';
  last_pruned_height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type PruningStddevSampFields = {
  __typename?: 'pruning_stddev_samp_fields';
  last_pruned_height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type PruningSumFields = {
  __typename?: 'pruning_sum_fields';
  last_pruned_height?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type PruningVarPopFields = {
  __typename?: 'pruning_var_pop_fields';
  last_pruned_height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type PruningVarSampFields = {
  __typename?: 'pruning_var_samp_fields';
  last_pruned_height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type PruningVarianceFields = {
  __typename?: 'pruning_variance_fields';
  last_pruned_height?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "pussy_gift_proofs" */
export type PussyGiftProofs = {
  __typename?: 'pussy_gift_proofs';
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  details?: Maybe<Scalars['String']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "pussy_gift_proofs" */
export type PussyGiftProofsAggregate = {
  __typename?: 'pussy_gift_proofs_aggregate';
  aggregate?: Maybe<PussyGiftProofsAggregateFields>;
  nodes: Array<PussyGiftProofs>;
};

/** aggregate fields of "pussy_gift_proofs" */
export type PussyGiftProofsAggregateFields = {
  __typename?: 'pussy_gift_proofs_aggregate_fields';
  avg?: Maybe<PussyGiftProofsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<PussyGiftProofsMaxFields>;
  min?: Maybe<PussyGiftProofsMinFields>;
  stddev?: Maybe<PussyGiftProofsStddevFields>;
  stddev_pop?: Maybe<PussyGiftProofsStddevPopFields>;
  stddev_samp?: Maybe<PussyGiftProofsStddevSampFields>;
  sum?: Maybe<PussyGiftProofsSumFields>;
  var_pop?: Maybe<PussyGiftProofsVarPopFields>;
  var_samp?: Maybe<PussyGiftProofsVarSampFields>;
  variance?: Maybe<PussyGiftProofsVarianceFields>;
};


/** aggregate fields of "pussy_gift_proofs" */
export type PussyGiftProofsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<PussyGiftProofsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type PussyGiftProofsAvgFields = {
  __typename?: 'pussy_gift_proofs_avg_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pussy_gift_proofs". All fields are combined with a logical 'AND'. */
export type PussyGiftProofsBoolExp = {
  _and?: InputMaybe<Array<PussyGiftProofsBoolExp>>;
  _not?: InputMaybe<PussyGiftProofsBoolExp>;
  _or?: InputMaybe<Array<PussyGiftProofsBoolExp>>;
  address?: InputMaybe<StringComparisonExp>;
  amount?: InputMaybe<BigintComparisonExp>;
  details?: InputMaybe<StringComparisonExp>;
  proof?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type PussyGiftProofsMaxFields = {
  __typename?: 'pussy_gift_proofs_max_fields';
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  details?: Maybe<Scalars['String']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type PussyGiftProofsMinFields = {
  __typename?: 'pussy_gift_proofs_min_fields';
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  details?: Maybe<Scalars['String']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "pussy_gift_proofs". */
export type PussyGiftProofsOrderBy = {
  address?: InputMaybe<OrderBy>;
  amount?: InputMaybe<OrderBy>;
  details?: InputMaybe<OrderBy>;
  proof?: InputMaybe<OrderBy>;
};

/** select columns of table "pussy_gift_proofs" */
export enum PussyGiftProofsSelectColumn {
  /** column name */
  Address = 'address',
  /** column name */
  Amount = 'amount',
  /** column name */
  Details = 'details',
  /** column name */
  Proof = 'proof'
}

/** aggregate stddev on columns */
export type PussyGiftProofsStddevFields = {
  __typename?: 'pussy_gift_proofs_stddev_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type PussyGiftProofsStddevPopFields = {
  __typename?: 'pussy_gift_proofs_stddev_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type PussyGiftProofsStddevSampFields = {
  __typename?: 'pussy_gift_proofs_stddev_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type PussyGiftProofsSumFields = {
  __typename?: 'pussy_gift_proofs_sum_fields';
  amount?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type PussyGiftProofsVarPopFields = {
  __typename?: 'pussy_gift_proofs_var_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type PussyGiftProofsVarSampFields = {
  __typename?: 'pussy_gift_proofs_var_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type PussyGiftProofsVarianceFields = {
  __typename?: 'pussy_gift_proofs_variance_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

export type QueryRoot = {
  __typename?: 'query_root';
  /** fetch data from the table: "_transaction" */
  _transaction: Array<Transaction>;
  /** fetch aggregated fields from the table: "_transaction" */
  _transaction_aggregate: TransactionAggregate;
  /** fetch data from the table: "_uptime_temp" */
  _uptime_temp: Array<UptimeTemp>;
  /** fetch aggregated fields from the table: "_uptime_temp" */
  _uptime_temp_aggregate: UptimeTempAggregate;
  /** fetch data from the table: "account" */
  account: Array<Account>;
  /** fetch aggregated fields from the table: "account" */
  account_aggregate: AccountAggregate;
  /** fetch data from the table: "account_balance" */
  account_balance: Array<AccountBalance>;
  /** fetch aggregated fields from the table: "account_balance" */
  account_balance_aggregate: AccountBalanceAggregate;
  /** fetch data from the table: "account_balance" using primary key columns */
  account_balance_by_pk?: Maybe<AccountBalance>;
  /** fetch data from the table: "account" using primary key columns */
  account_by_pk?: Maybe<Account>;
  /** fetch data from the table: "block" */
  block: Array<Block>;
  /** fetch aggregated fields from the table: "block" */
  block_aggregate: BlockAggregate;
  /** fetch data from the table: "block" using primary key columns */
  block_by_pk?: Maybe<Block>;
  /** fetch data from the table: "contracts" */
  contracts: Array<Contracts>;
  /** fetch aggregated fields from the table: "contracts" */
  contracts_aggregate: ContractsAggregate;
  /** fetch data from the table: "contracts" using primary key columns */
  contracts_by_pk?: Maybe<Contracts>;
  /** fetch data from the table: "cyb_cohort" */
  cyb_cohort: Array<CybCohort>;
  /** fetch aggregated fields from the table: "cyb_cohort" */
  cyb_cohort_aggregate: CybCohortAggregate;
  /** fetch data from the table: "cyb_new_cohort" */
  cyb_new_cohort: Array<CybNewCohort>;
  /** fetch aggregated fields from the table: "cyb_new_cohort" */
  cyb_new_cohort_aggregate: CybNewCohortAggregate;
  /** fetch data from the table: "cyber_gift" */
  cyber_gift: Array<CyberGift>;
  /** fetch aggregated fields from the table: "cyber_gift" */
  cyber_gift_aggregate: CyberGiftAggregate;
  /** fetch data from the table: "cyber_gift_proofs" */
  cyber_gift_proofs: Array<CyberGiftProofs>;
  /** fetch aggregated fields from the table: "cyber_gift_proofs" */
  cyber_gift_proofs_aggregate: CyberGiftProofsAggregate;
  /** fetch data from the table: "cyberlinks" */
  cyberlinks: Array<Cyberlinks>;
  /** An aggregate relationship */
  cyberlinks_aggregate: CyberlinksAggregate;
  /** fetch data from the table: "cyberlinks" using primary key columns */
  cyberlinks_by_pk?: Maybe<Cyberlinks>;
  /** fetch data from the table: "cyberlinks_stats" */
  cyberlinks_stats: Array<CyberlinksStats>;
  /** fetch aggregated fields from the table: "cyberlinks_stats" */
  cyberlinks_stats_aggregate: CyberlinksStatsAggregate;
  /** fetch data from the table: "daily_amount_of_active_neurons" */
  daily_amount_of_active_neurons: Array<DailyAmountOfActiveNeurons>;
  /** fetch aggregated fields from the table: "daily_amount_of_active_neurons" */
  daily_amount_of_active_neurons_aggregate: DailyAmountOfActiveNeuronsAggregate;
  /** fetch data from the table: "daily_amount_of_used_gas" */
  daily_amount_of_used_gas: Array<DailyAmountOfUsedGas>;
  /** fetch aggregated fields from the table: "daily_amount_of_used_gas" */
  daily_amount_of_used_gas_aggregate: DailyAmountOfUsedGasAggregate;
  /** fetch data from the table: "daily_number_of_transactions" */
  daily_number_of_transactions: Array<DailyNumberOfTransactions>;
  /** fetch aggregated fields from the table: "daily_number_of_transactions" */
  daily_number_of_transactions_aggregate: DailyNumberOfTransactionsAggregate;
  /** fetch data from the table: "follow_stats" */
  follow_stats: Array<FollowStats>;
  /** fetch aggregated fields from the table: "follow_stats" */
  follow_stats_aggregate: FollowStatsAggregate;
  /** fetch data from the table: "genesis_neurons_activation" */
  genesis_neurons_activation: Array<GenesisNeuronsActivation>;
  /** fetch aggregated fields from the table: "genesis_neurons_activation" */
  genesis_neurons_activation_aggregate: GenesisNeuronsActivationAggregate;
  /** An array relationship */
  investmints: Array<Investmints>;
  /** An aggregate relationship */
  investmints_aggregate: InvestmintsAggregate;
  /** fetch data from the table: "investmints" using primary key columns */
  investmints_by_pk?: Maybe<Investmints>;
  /** fetch data from the table: "message" */
  message: Array<Message>;
  /** fetch aggregated fields from the table: "message" */
  message_aggregate: MessageAggregate;
  /** execute function "messages_by_address" which returns "message" */
  messages_by_address: Array<Message>;
  /** execute function "messages_by_address" and query aggregates on result of table type "message" */
  messages_by_address_aggregate: MessageAggregate;
  /** fetch data from the table: "modules" */
  modules: Array<Modules>;
  /** fetch aggregated fields from the table: "modules" */
  modules_aggregate: ModulesAggregate;
  /** fetch data from the table: "modules" using primary key columns */
  modules_by_pk?: Maybe<Modules>;
  /** fetch data from the table: "neuron_activation_source" */
  neuron_activation_source: Array<NeuronActivationSource>;
  /** fetch aggregated fields from the table: "neuron_activation_source" */
  neuron_activation_source_aggregate: NeuronActivationSourceAggregate;
  /** fetch data from the table: "number_of_new_neurons" */
  number_of_new_neurons: Array<NumberOfNewNeurons>;
  /** fetch aggregated fields from the table: "number_of_new_neurons" */
  number_of_new_neurons_aggregate: NumberOfNewNeuronsAggregate;
  /** fetch data from the table: "old_precommits" */
  old_precommits: Array<OldPrecommits>;
  /** fetch aggregated fields from the table: "old_precommits" */
  old_precommits_aggregate: OldPrecommitsAggregate;
  /** fetch data from the table: "old_precommits" using primary key columns */
  old_precommits_by_pk?: Maybe<OldPrecommits>;
  /** An array relationship */
  particles: Array<Particles>;
  /** An aggregate relationship */
  particles_aggregate: ParticlesAggregate;
  /** fetch data from the table: "particles" using primary key columns */
  particles_by_pk?: Maybe<Particles>;
  /** fetch data from the table: "pre_commit" */
  pre_commit: Array<PreCommit>;
  /** fetch aggregated fields from the table: "pre_commit" */
  pre_commit_aggregate: PreCommitAggregate;
  /** fetch data from the table: "pre_commits_rewards_view" */
  pre_commits_rewards_view: Array<PreCommitsRewardsView>;
  /** fetch aggregated fields from the table: "pre_commits_rewards_view" */
  pre_commits_rewards_view_aggregate: PreCommitsRewardsViewAggregate;
  /** fetch data from the table: "pre_commits_total" */
  pre_commits_total: Array<PreCommitsTotal>;
  /** fetch aggregated fields from the table: "pre_commits_total" */
  pre_commits_total_aggregate: PreCommitsTotalAggregate;
  /** fetch data from the table: "pre_commits_view" */
  pre_commits_view: Array<PreCommitsView>;
  /** fetch aggregated fields from the table: "pre_commits_view" */
  pre_commits_view_aggregate: PreCommitsViewAggregate;
  /** fetch data from the table: "pruning" */
  pruning: Array<Pruning>;
  /** fetch aggregated fields from the table: "pruning" */
  pruning_aggregate: PruningAggregate;
  /** fetch data from the table: "pussy_gift_proofs" */
  pussy_gift_proofs: Array<PussyGiftProofs>;
  /** fetch aggregated fields from the table: "pussy_gift_proofs" */
  pussy_gift_proofs_aggregate: PussyGiftProofsAggregate;
  /** An array relationship */
  routes: Array<Routes>;
  /** An aggregate relationship */
  routes_aggregate: RoutesAggregate;
  /** fetch data from the table: "routes" using primary key columns */
  routes_by_pk?: Maybe<Routes>;
  /** fetch data from the table: "supply" */
  supply: Array<Supply>;
  /** fetch aggregated fields from the table: "supply" */
  supply_aggregate: SupplyAggregate;
  /** fetch data from the table: "supply" using primary key columns */
  supply_by_pk?: Maybe<Supply>;
  /** fetch data from the table: "test_gift" */
  test_gift: Array<TestGift>;
  /** fetch aggregated fields from the table: "test_gift" */
  test_gift_aggregate: TestGiftAggregate;
  /** fetch data from the table: "today_top_txs" */
  today_top_txs: Array<TodayTopTxs>;
  /** fetch aggregated fields from the table: "today_top_txs" */
  today_top_txs_aggregate: TodayTopTxsAggregate;
  /** fetch data from the table: "top_10_of_active_neurons_week" */
  top_10_of_active_neurons_week: Array<Top_10OfActiveNeuronsWeek>;
  /** fetch aggregated fields from the table: "top_10_of_active_neurons_week" */
  top_10_of_active_neurons_week_aggregate: Top_10OfActiveNeuronsWeekAggregate;
  /** fetch data from the table: "top_first_txs" */
  top_first_txs: Array<TopFirstTxs>;
  /** fetch aggregated fields from the table: "top_first_txs" */
  top_first_txs_aggregate: TopFirstTxsAggregate;
  /** fetch data from the table: "top_leaders" */
  top_leaders: Array<TopLeaders>;
  /** fetch data from the table: "top_txs" */
  top_txs: Array<TopTxs>;
  /** fetch aggregated fields from the table: "top_txs" */
  top_txs_aggregate: TopTxsAggregate;
  /** fetch data from the table: "transaction" */
  transaction: Array<Transaction>;
  /** fetch aggregated fields from the table: "transaction" */
  transaction_aggregate: TransactionAggregate;
  /** fetch data from the table: "transaction" using primary key columns */
  transaction_by_pk?: Maybe<Transaction>;
  /** fetch data from the table: "tweets_stats" */
  tweets_stats: Array<TweetsStats>;
  /** fetch aggregated fields from the table: "tweets_stats" */
  tweets_stats_aggregate: TweetsStatsAggregate;
  /** fetch data from the table: "txs_ranked" */
  txs_ranked: Array<TxsRanked>;
  /** fetch aggregated fields from the table: "txs_ranked" */
  txs_ranked_aggregate: TxsRankedAggregate;
  /** fetch data from the table: "txs_stats" */
  txs_stats: Array<TxsStats>;
  /** fetch aggregated fields from the table: "txs_stats" */
  txs_stats_aggregate: TxsStatsAggregate;
  /** fetch data from the table: "uptime" */
  uptime: Array<Uptime>;
  /** fetch aggregated fields from the table: "uptime" */
  uptime_aggregate: UptimeAggregate;
  /** fetch data from the table: "validator" */
  validator: Array<Validator>;
  /** fetch aggregated fields from the table: "validator" */
  validator_aggregate: ValidatorAggregate;
  /** fetch data from the table: "validator" using primary key columns */
  validator_by_pk?: Maybe<Validator>;
  /** fetch data from the table: "volts_demand" */
  volts_demand: Array<VoltsDemand>;
  /** fetch aggregated fields from the table: "volts_demand" */
  volts_demand_aggregate: VoltsDemandAggregate;
  /** fetch data from the table: "volts_stats" */
  volts_stats: Array<VoltsStats>;
  /** fetch aggregated fields from the table: "volts_stats" */
  volts_stats_aggregate: VoltsStatsAggregate;
};


export type QueryRootTransactionArgs = {
  distinct_on?: InputMaybe<Array<TransactionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TransactionOrderBy>>;
  where?: InputMaybe<TransactionBoolExp>;
};


export type QueryRootTransactionAggregateArgs = {
  distinct_on?: InputMaybe<Array<TransactionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TransactionOrderBy>>;
  where?: InputMaybe<TransactionBoolExp>;
};


export type QueryRootUptimeTempArgs = {
  distinct_on?: InputMaybe<Array<UptimeTempSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UptimeTempOrderBy>>;
  where?: InputMaybe<UptimeTempBoolExp>;
};


export type QueryRootUptimeTempAggregateArgs = {
  distinct_on?: InputMaybe<Array<UptimeTempSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UptimeTempOrderBy>>;
  where?: InputMaybe<UptimeTempBoolExp>;
};


export type QueryRootAccountArgs = {
  distinct_on?: InputMaybe<Array<AccountSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AccountOrderBy>>;
  where?: InputMaybe<AccountBoolExp>;
};


export type QueryRootAccountAggregateArgs = {
  distinct_on?: InputMaybe<Array<AccountSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AccountOrderBy>>;
  where?: InputMaybe<AccountBoolExp>;
};


export type QueryRootAccountBalanceArgs = {
  distinct_on?: InputMaybe<Array<AccountBalanceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AccountBalanceOrderBy>>;
  where?: InputMaybe<AccountBalanceBoolExp>;
};


export type QueryRootAccountBalanceAggregateArgs = {
  distinct_on?: InputMaybe<Array<AccountBalanceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AccountBalanceOrderBy>>;
  where?: InputMaybe<AccountBalanceBoolExp>;
};


export type QueryRootAccountBalanceByPkArgs = {
  address: Scalars['String']['input'];
};


export type QueryRootAccountByPkArgs = {
  address: Scalars['String']['input'];
};


export type QueryRootBlockArgs = {
  distinct_on?: InputMaybe<Array<BlockSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockOrderBy>>;
  where?: InputMaybe<BlockBoolExp>;
};


export type QueryRootBlockAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockOrderBy>>;
  where?: InputMaybe<BlockBoolExp>;
};


export type QueryRootBlockByPkArgs = {
  height: Scalars['bigint']['input'];
};


export type QueryRootContractsArgs = {
  distinct_on?: InputMaybe<Array<ContractsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ContractsOrderBy>>;
  where?: InputMaybe<ContractsBoolExp>;
};


export type QueryRootContractsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ContractsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ContractsOrderBy>>;
  where?: InputMaybe<ContractsBoolExp>;
};


export type QueryRootContractsByPkArgs = {
  address: Scalars['String']['input'];
};


export type QueryRootCybCohortArgs = {
  distinct_on?: InputMaybe<Array<CybCohortSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CybCohortOrderBy>>;
  where?: InputMaybe<CybCohortBoolExp>;
};


export type QueryRootCybCohortAggregateArgs = {
  distinct_on?: InputMaybe<Array<CybCohortSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CybCohortOrderBy>>;
  where?: InputMaybe<CybCohortBoolExp>;
};


export type QueryRootCybNewCohortArgs = {
  distinct_on?: InputMaybe<Array<CybNewCohortSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CybNewCohortOrderBy>>;
  where?: InputMaybe<CybNewCohortBoolExp>;
};


export type QueryRootCybNewCohortAggregateArgs = {
  distinct_on?: InputMaybe<Array<CybNewCohortSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CybNewCohortOrderBy>>;
  where?: InputMaybe<CybNewCohortBoolExp>;
};


export type QueryRootCyberGiftArgs = {
  distinct_on?: InputMaybe<Array<CyberGiftSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberGiftOrderBy>>;
  where?: InputMaybe<CyberGiftBoolExp>;
};


export type QueryRootCyberGiftAggregateArgs = {
  distinct_on?: InputMaybe<Array<CyberGiftSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberGiftOrderBy>>;
  where?: InputMaybe<CyberGiftBoolExp>;
};


export type QueryRootCyberGiftProofsArgs = {
  distinct_on?: InputMaybe<Array<CyberGiftProofsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberGiftProofsOrderBy>>;
  where?: InputMaybe<CyberGiftProofsBoolExp>;
};


export type QueryRootCyberGiftProofsAggregateArgs = {
  distinct_on?: InputMaybe<Array<CyberGiftProofsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberGiftProofsOrderBy>>;
  where?: InputMaybe<CyberGiftProofsBoolExp>;
};


export type QueryRootCyberlinksArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksOrderBy>>;
  where?: InputMaybe<CyberlinksBoolExp>;
};


export type QueryRootCyberlinksAggregateArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksOrderBy>>;
  where?: InputMaybe<CyberlinksBoolExp>;
};


export type QueryRootCyberlinksByPkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryRootCyberlinksStatsArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksStatsOrderBy>>;
  where?: InputMaybe<CyberlinksStatsBoolExp>;
};


export type QueryRootCyberlinksStatsAggregateArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksStatsOrderBy>>;
  where?: InputMaybe<CyberlinksStatsBoolExp>;
};


export type QueryRootDailyAmountOfActiveNeuronsArgs = {
  distinct_on?: InputMaybe<Array<DailyAmountOfActiveNeuronsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DailyAmountOfActiveNeuronsOrderBy>>;
  where?: InputMaybe<DailyAmountOfActiveNeuronsBoolExp>;
};


export type QueryRootDailyAmountOfActiveNeuronsAggregateArgs = {
  distinct_on?: InputMaybe<Array<DailyAmountOfActiveNeuronsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DailyAmountOfActiveNeuronsOrderBy>>;
  where?: InputMaybe<DailyAmountOfActiveNeuronsBoolExp>;
};


export type QueryRootDailyAmountOfUsedGasArgs = {
  distinct_on?: InputMaybe<Array<DailyAmountOfUsedGasSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DailyAmountOfUsedGasOrderBy>>;
  where?: InputMaybe<DailyAmountOfUsedGasBoolExp>;
};


export type QueryRootDailyAmountOfUsedGasAggregateArgs = {
  distinct_on?: InputMaybe<Array<DailyAmountOfUsedGasSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DailyAmountOfUsedGasOrderBy>>;
  where?: InputMaybe<DailyAmountOfUsedGasBoolExp>;
};


export type QueryRootDailyNumberOfTransactionsArgs = {
  distinct_on?: InputMaybe<Array<DailyNumberOfTransactionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DailyNumberOfTransactionsOrderBy>>;
  where?: InputMaybe<DailyNumberOfTransactionsBoolExp>;
};


export type QueryRootDailyNumberOfTransactionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<DailyNumberOfTransactionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DailyNumberOfTransactionsOrderBy>>;
  where?: InputMaybe<DailyNumberOfTransactionsBoolExp>;
};


export type QueryRootFollowStatsArgs = {
  distinct_on?: InputMaybe<Array<FollowStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FollowStatsOrderBy>>;
  where?: InputMaybe<FollowStatsBoolExp>;
};


export type QueryRootFollowStatsAggregateArgs = {
  distinct_on?: InputMaybe<Array<FollowStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FollowStatsOrderBy>>;
  where?: InputMaybe<FollowStatsBoolExp>;
};


export type QueryRootGenesisNeuronsActivationArgs = {
  distinct_on?: InputMaybe<Array<GenesisNeuronsActivationSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GenesisNeuronsActivationOrderBy>>;
  where?: InputMaybe<GenesisNeuronsActivationBoolExp>;
};


export type QueryRootGenesisNeuronsActivationAggregateArgs = {
  distinct_on?: InputMaybe<Array<GenesisNeuronsActivationSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GenesisNeuronsActivationOrderBy>>;
  where?: InputMaybe<GenesisNeuronsActivationBoolExp>;
};


export type QueryRootInvestmintsArgs = {
  distinct_on?: InputMaybe<Array<InvestmintsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InvestmintsOrderBy>>;
  where?: InputMaybe<InvestmintsBoolExp>;
};


export type QueryRootInvestmintsAggregateArgs = {
  distinct_on?: InputMaybe<Array<InvestmintsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InvestmintsOrderBy>>;
  where?: InputMaybe<InvestmintsBoolExp>;
};


export type QueryRootInvestmintsByPkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryRootMessageArgs = {
  distinct_on?: InputMaybe<Array<MessageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MessageOrderBy>>;
  where?: InputMaybe<MessageBoolExp>;
};


export type QueryRootMessageAggregateArgs = {
  distinct_on?: InputMaybe<Array<MessageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MessageOrderBy>>;
  where?: InputMaybe<MessageBoolExp>;
};


export type QueryRootMessagesByAddressArgs = {
  args: MessagesByAddressArgs;
  distinct_on?: InputMaybe<Array<MessageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MessageOrderBy>>;
  where?: InputMaybe<MessageBoolExp>;
};


export type QueryRootMessagesByAddressAggregateArgs = {
  args: MessagesByAddressArgs;
  distinct_on?: InputMaybe<Array<MessageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MessageOrderBy>>;
  where?: InputMaybe<MessageBoolExp>;
};


export type QueryRootModulesArgs = {
  distinct_on?: InputMaybe<Array<ModulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ModulesOrderBy>>;
  where?: InputMaybe<ModulesBoolExp>;
};


export type QueryRootModulesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ModulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ModulesOrderBy>>;
  where?: InputMaybe<ModulesBoolExp>;
};


export type QueryRootModulesByPkArgs = {
  module_name: Scalars['String']['input'];
};


export type QueryRootNeuronActivationSourceArgs = {
  distinct_on?: InputMaybe<Array<NeuronActivationSourceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NeuronActivationSourceOrderBy>>;
  where?: InputMaybe<NeuronActivationSourceBoolExp>;
};


export type QueryRootNeuronActivationSourceAggregateArgs = {
  distinct_on?: InputMaybe<Array<NeuronActivationSourceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NeuronActivationSourceOrderBy>>;
  where?: InputMaybe<NeuronActivationSourceBoolExp>;
};


export type QueryRootNumberOfNewNeuronsArgs = {
  distinct_on?: InputMaybe<Array<NumberOfNewNeuronsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NumberOfNewNeuronsOrderBy>>;
  where?: InputMaybe<NumberOfNewNeuronsBoolExp>;
};


export type QueryRootNumberOfNewNeuronsAggregateArgs = {
  distinct_on?: InputMaybe<Array<NumberOfNewNeuronsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NumberOfNewNeuronsOrderBy>>;
  where?: InputMaybe<NumberOfNewNeuronsBoolExp>;
};


export type QueryRootOldPrecommitsArgs = {
  distinct_on?: InputMaybe<Array<OldPrecommitsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<OldPrecommitsOrderBy>>;
  where?: InputMaybe<OldPrecommitsBoolExp>;
};


export type QueryRootOldPrecommitsAggregateArgs = {
  distinct_on?: InputMaybe<Array<OldPrecommitsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<OldPrecommitsOrderBy>>;
  where?: InputMaybe<OldPrecommitsBoolExp>;
};


export type QueryRootOldPrecommitsByPkArgs = {
  consensus_address: Scalars['String']['input'];
};


export type QueryRootParticlesArgs = {
  distinct_on?: InputMaybe<Array<ParticlesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ParticlesOrderBy>>;
  where?: InputMaybe<ParticlesBoolExp>;
};


export type QueryRootParticlesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ParticlesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ParticlesOrderBy>>;
  where?: InputMaybe<ParticlesBoolExp>;
};


export type QueryRootParticlesByPkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryRootPreCommitArgs = {
  distinct_on?: InputMaybe<Array<PreCommitSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitOrderBy>>;
  where?: InputMaybe<PreCommitBoolExp>;
};


export type QueryRootPreCommitAggregateArgs = {
  distinct_on?: InputMaybe<Array<PreCommitSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitOrderBy>>;
  where?: InputMaybe<PreCommitBoolExp>;
};


export type QueryRootPreCommitsRewardsViewArgs = {
  distinct_on?: InputMaybe<Array<PreCommitsRewardsViewSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitsRewardsViewOrderBy>>;
  where?: InputMaybe<PreCommitsRewardsViewBoolExp>;
};


export type QueryRootPreCommitsRewardsViewAggregateArgs = {
  distinct_on?: InputMaybe<Array<PreCommitsRewardsViewSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitsRewardsViewOrderBy>>;
  where?: InputMaybe<PreCommitsRewardsViewBoolExp>;
};


export type QueryRootPreCommitsTotalArgs = {
  distinct_on?: InputMaybe<Array<PreCommitsTotalSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitsTotalOrderBy>>;
  where?: InputMaybe<PreCommitsTotalBoolExp>;
};


export type QueryRootPreCommitsTotalAggregateArgs = {
  distinct_on?: InputMaybe<Array<PreCommitsTotalSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitsTotalOrderBy>>;
  where?: InputMaybe<PreCommitsTotalBoolExp>;
};


export type QueryRootPreCommitsViewArgs = {
  distinct_on?: InputMaybe<Array<PreCommitsViewSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitsViewOrderBy>>;
  where?: InputMaybe<PreCommitsViewBoolExp>;
};


export type QueryRootPreCommitsViewAggregateArgs = {
  distinct_on?: InputMaybe<Array<PreCommitsViewSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitsViewOrderBy>>;
  where?: InputMaybe<PreCommitsViewBoolExp>;
};


export type QueryRootPruningArgs = {
  distinct_on?: InputMaybe<Array<PruningSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PruningOrderBy>>;
  where?: InputMaybe<PruningBoolExp>;
};


export type QueryRootPruningAggregateArgs = {
  distinct_on?: InputMaybe<Array<PruningSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PruningOrderBy>>;
  where?: InputMaybe<PruningBoolExp>;
};


export type QueryRootPussyGiftProofsArgs = {
  distinct_on?: InputMaybe<Array<PussyGiftProofsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PussyGiftProofsOrderBy>>;
  where?: InputMaybe<PussyGiftProofsBoolExp>;
};


export type QueryRootPussyGiftProofsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PussyGiftProofsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PussyGiftProofsOrderBy>>;
  where?: InputMaybe<PussyGiftProofsBoolExp>;
};


export type QueryRootRoutesArgs = {
  distinct_on?: InputMaybe<Array<RoutesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RoutesOrderBy>>;
  where?: InputMaybe<RoutesBoolExp>;
};


export type QueryRootRoutesAggregateArgs = {
  distinct_on?: InputMaybe<Array<RoutesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RoutesOrderBy>>;
  where?: InputMaybe<RoutesBoolExp>;
};


export type QueryRootRoutesByPkArgs = {
  id: Scalars['Int']['input'];
};


export type QueryRootSupplyArgs = {
  distinct_on?: InputMaybe<Array<SupplySelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<SupplyOrderBy>>;
  where?: InputMaybe<SupplyBoolExp>;
};


export type QueryRootSupplyAggregateArgs = {
  distinct_on?: InputMaybe<Array<SupplySelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<SupplyOrderBy>>;
  where?: InputMaybe<SupplyBoolExp>;
};


export type QueryRootSupplyByPkArgs = {
  one_row_id: Scalars['Boolean']['input'];
};


export type QueryRootTestGiftArgs = {
  distinct_on?: InputMaybe<Array<TestGiftSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TestGiftOrderBy>>;
  where?: InputMaybe<TestGiftBoolExp>;
};


export type QueryRootTestGiftAggregateArgs = {
  distinct_on?: InputMaybe<Array<TestGiftSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TestGiftOrderBy>>;
  where?: InputMaybe<TestGiftBoolExp>;
};


export type QueryRootTodayTopTxsArgs = {
  distinct_on?: InputMaybe<Array<TodayTopTxsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TodayTopTxsOrderBy>>;
  where?: InputMaybe<TodayTopTxsBoolExp>;
};


export type QueryRootTodayTopTxsAggregateArgs = {
  distinct_on?: InputMaybe<Array<TodayTopTxsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TodayTopTxsOrderBy>>;
  where?: InputMaybe<TodayTopTxsBoolExp>;
};


export type QueryRootTop_10OfActiveNeuronsWeekArgs = {
  distinct_on?: InputMaybe<Array<Top_10OfActiveNeuronsWeekSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_10OfActiveNeuronsWeekOrderBy>>;
  where?: InputMaybe<Top_10OfActiveNeuronsWeekBoolExp>;
};


export type QueryRootTop_10OfActiveNeuronsWeekAggregateArgs = {
  distinct_on?: InputMaybe<Array<Top_10OfActiveNeuronsWeekSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_10OfActiveNeuronsWeekOrderBy>>;
  where?: InputMaybe<Top_10OfActiveNeuronsWeekBoolExp>;
};


export type QueryRootTopFirstTxsArgs = {
  distinct_on?: InputMaybe<Array<TopFirstTxsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TopFirstTxsOrderBy>>;
  where?: InputMaybe<TopFirstTxsBoolExp>;
};


export type QueryRootTopFirstTxsAggregateArgs = {
  distinct_on?: InputMaybe<Array<TopFirstTxsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TopFirstTxsOrderBy>>;
  where?: InputMaybe<TopFirstTxsBoolExp>;
};


export type QueryRootTopLeadersArgs = {
  distinct_on?: InputMaybe<Array<TopLeadersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TopLeadersOrderBy>>;
  where?: InputMaybe<TopLeadersBoolExp>;
};


export type QueryRootTopTxsArgs = {
  distinct_on?: InputMaybe<Array<TopTxsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TopTxsOrderBy>>;
  where?: InputMaybe<TopTxsBoolExp>;
};


export type QueryRootTopTxsAggregateArgs = {
  distinct_on?: InputMaybe<Array<TopTxsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TopTxsOrderBy>>;
  where?: InputMaybe<TopTxsBoolExp>;
};


export type QueryRootTransactionArgs = {
  distinct_on?: InputMaybe<Array<TransactionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TransactionOrderBy>>;
  where?: InputMaybe<TransactionBoolExp>;
};


export type QueryRootTransactionAggregateArgs = {
  distinct_on?: InputMaybe<Array<TransactionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TransactionOrderBy>>;
  where?: InputMaybe<TransactionBoolExp>;
};


export type QueryRootTransactionByPkArgs = {
  hash: Scalars['String']['input'];
};


export type QueryRootTweetsStatsArgs = {
  distinct_on?: InputMaybe<Array<TweetsStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TweetsStatsOrderBy>>;
  where?: InputMaybe<TweetsStatsBoolExp>;
};


export type QueryRootTweetsStatsAggregateArgs = {
  distinct_on?: InputMaybe<Array<TweetsStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TweetsStatsOrderBy>>;
  where?: InputMaybe<TweetsStatsBoolExp>;
};


export type QueryRootTxsRankedArgs = {
  distinct_on?: InputMaybe<Array<TxsRankedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TxsRankedOrderBy>>;
  where?: InputMaybe<TxsRankedBoolExp>;
};


export type QueryRootTxsRankedAggregateArgs = {
  distinct_on?: InputMaybe<Array<TxsRankedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TxsRankedOrderBy>>;
  where?: InputMaybe<TxsRankedBoolExp>;
};


export type QueryRootTxsStatsArgs = {
  distinct_on?: InputMaybe<Array<TxsStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TxsStatsOrderBy>>;
  where?: InputMaybe<TxsStatsBoolExp>;
};


export type QueryRootTxsStatsAggregateArgs = {
  distinct_on?: InputMaybe<Array<TxsStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TxsStatsOrderBy>>;
  where?: InputMaybe<TxsStatsBoolExp>;
};


export type QueryRootUptimeArgs = {
  distinct_on?: InputMaybe<Array<UptimeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UptimeOrderBy>>;
  where?: InputMaybe<UptimeBoolExp>;
};


export type QueryRootUptimeAggregateArgs = {
  distinct_on?: InputMaybe<Array<UptimeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UptimeOrderBy>>;
  where?: InputMaybe<UptimeBoolExp>;
};


export type QueryRootValidatorArgs = {
  distinct_on?: InputMaybe<Array<ValidatorSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ValidatorOrderBy>>;
  where?: InputMaybe<ValidatorBoolExp>;
};


export type QueryRootValidatorAggregateArgs = {
  distinct_on?: InputMaybe<Array<ValidatorSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ValidatorOrderBy>>;
  where?: InputMaybe<ValidatorBoolExp>;
};


export type QueryRootValidatorByPkArgs = {
  consensus_address: Scalars['String']['input'];
};


export type QueryRootVoltsDemandArgs = {
  distinct_on?: InputMaybe<Array<VoltsDemandSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<VoltsDemandOrderBy>>;
  where?: InputMaybe<VoltsDemandBoolExp>;
};


export type QueryRootVoltsDemandAggregateArgs = {
  distinct_on?: InputMaybe<Array<VoltsDemandSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<VoltsDemandOrderBy>>;
  where?: InputMaybe<VoltsDemandBoolExp>;
};


export type QueryRootVoltsStatsArgs = {
  distinct_on?: InputMaybe<Array<VoltsStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<VoltsStatsOrderBy>>;
  where?: InputMaybe<VoltsStatsBoolExp>;
};


export type QueryRootVoltsStatsAggregateArgs = {
  distinct_on?: InputMaybe<Array<VoltsStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<VoltsStatsOrderBy>>;
  where?: InputMaybe<VoltsStatsBoolExp>;
};

/** columns and relationships of "routes" */
export type Routes = {
  __typename?: 'routes';
  /** An object relationship */
  account: Account;
  /** An object relationship */
  accountBySource: Account;
  alias: Scalars['String']['output'];
  /** An object relationship */
  block: Block;
  destination: Scalars['String']['output'];
  height: Scalars['bigint']['output'];
  id: Scalars['Int']['output'];
  source: Scalars['String']['output'];
  timestamp: Scalars['timestamp']['output'];
  /** An object relationship */
  transaction: Transaction;
  transaction_hash: Scalars['String']['output'];
  value: Scalars['_coin']['output'];
};

/** aggregated selection of "routes" */
export type RoutesAggregate = {
  __typename?: 'routes_aggregate';
  aggregate?: Maybe<RoutesAggregateFields>;
  nodes: Array<Routes>;
};

/** aggregate fields of "routes" */
export type RoutesAggregateFields = {
  __typename?: 'routes_aggregate_fields';
  avg?: Maybe<RoutesAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<RoutesMaxFields>;
  min?: Maybe<RoutesMinFields>;
  stddev?: Maybe<RoutesStddevFields>;
  stddev_pop?: Maybe<RoutesStddevPopFields>;
  stddev_samp?: Maybe<RoutesStddevSampFields>;
  sum?: Maybe<RoutesSumFields>;
  var_pop?: Maybe<RoutesVarPopFields>;
  var_samp?: Maybe<RoutesVarSampFields>;
  variance?: Maybe<RoutesVarianceFields>;
};


/** aggregate fields of "routes" */
export type RoutesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<RoutesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "routes" */
export type RoutesAggregateOrderBy = {
  avg?: InputMaybe<RoutesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<RoutesMaxOrderBy>;
  min?: InputMaybe<RoutesMinOrderBy>;
  stddev?: InputMaybe<RoutesStddevOrderBy>;
  stddev_pop?: InputMaybe<RoutesStddevPopOrderBy>;
  stddev_samp?: InputMaybe<RoutesStddevSampOrderBy>;
  sum?: InputMaybe<RoutesSumOrderBy>;
  var_pop?: InputMaybe<RoutesVarPopOrderBy>;
  var_samp?: InputMaybe<RoutesVarSampOrderBy>;
  variance?: InputMaybe<RoutesVarianceOrderBy>;
};

/** aggregate avg on columns */
export type RoutesAvgFields = {
  __typename?: 'routes_avg_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "routes" */
export type RoutesAvgOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "routes". All fields are combined with a logical 'AND'. */
export type RoutesBoolExp = {
  _and?: InputMaybe<Array<RoutesBoolExp>>;
  _not?: InputMaybe<RoutesBoolExp>;
  _or?: InputMaybe<Array<RoutesBoolExp>>;
  account?: InputMaybe<AccountBoolExp>;
  accountBySource?: InputMaybe<AccountBoolExp>;
  alias?: InputMaybe<StringComparisonExp>;
  block?: InputMaybe<BlockBoolExp>;
  destination?: InputMaybe<StringComparisonExp>;
  height?: InputMaybe<BigintComparisonExp>;
  id?: InputMaybe<IntComparisonExp>;
  source?: InputMaybe<StringComparisonExp>;
  timestamp?: InputMaybe<TimestampComparisonExp>;
  transaction?: InputMaybe<TransactionBoolExp>;
  transaction_hash?: InputMaybe<StringComparisonExp>;
  value?: InputMaybe<CoinComparisonExp>;
};

/** aggregate max on columns */
export type RoutesMaxFields = {
  __typename?: 'routes_max_fields';
  alias?: Maybe<Scalars['String']['output']>;
  destination?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "routes" */
export type RoutesMaxOrderBy = {
  alias?: InputMaybe<OrderBy>;
  destination?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  source?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type RoutesMinFields = {
  __typename?: 'routes_min_fields';
  alias?: Maybe<Scalars['String']['output']>;
  destination?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "routes" */
export type RoutesMinOrderBy = {
  alias?: InputMaybe<OrderBy>;
  destination?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  source?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "routes". */
export type RoutesOrderBy = {
  account?: InputMaybe<AccountOrderBy>;
  accountBySource?: InputMaybe<AccountOrderBy>;
  alias?: InputMaybe<OrderBy>;
  block?: InputMaybe<BlockOrderBy>;
  destination?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  source?: InputMaybe<OrderBy>;
  timestamp?: InputMaybe<OrderBy>;
  transaction?: InputMaybe<TransactionOrderBy>;
  transaction_hash?: InputMaybe<OrderBy>;
  value?: InputMaybe<OrderBy>;
};

/** select columns of table "routes" */
export enum RoutesSelectColumn {
  /** column name */
  Alias = 'alias',
  /** column name */
  Destination = 'destination',
  /** column name */
  Height = 'height',
  /** column name */
  Id = 'id',
  /** column name */
  Source = 'source',
  /** column name */
  Timestamp = 'timestamp',
  /** column name */
  TransactionHash = 'transaction_hash',
  /** column name */
  Value = 'value'
}

/** aggregate stddev on columns */
export type RoutesStddevFields = {
  __typename?: 'routes_stddev_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "routes" */
export type RoutesStddevOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type RoutesStddevPopFields = {
  __typename?: 'routes_stddev_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "routes" */
export type RoutesStddevPopOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type RoutesStddevSampFields = {
  __typename?: 'routes_stddev_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "routes" */
export type RoutesStddevSampOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate sum on columns */
export type RoutesSumFields = {
  __typename?: 'routes_sum_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "routes" */
export type RoutesSumOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type RoutesVarPopFields = {
  __typename?: 'routes_var_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "routes" */
export type RoutesVarPopOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type RoutesVarSampFields = {
  __typename?: 'routes_var_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "routes" */
export type RoutesVarSampOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type RoutesVarianceFields = {
  __typename?: 'routes_variance_fields';
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "routes" */
export type RoutesVarianceOrderBy = {
  height?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
};

export type SubscriptionRoot = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "_transaction" */
  _transaction: Array<Transaction>;
  /** fetch aggregated fields from the table: "_transaction" */
  _transaction_aggregate: TransactionAggregate;
  /** fetch data from the table: "_uptime_temp" */
  _uptime_temp: Array<UptimeTemp>;
  /** fetch aggregated fields from the table: "_uptime_temp" */
  _uptime_temp_aggregate: UptimeTempAggregate;
  /** fetch data from the table: "account" */
  account: Array<Account>;
  /** fetch aggregated fields from the table: "account" */
  account_aggregate: AccountAggregate;
  /** fetch data from the table: "account_balance" */
  account_balance: Array<AccountBalance>;
  /** fetch aggregated fields from the table: "account_balance" */
  account_balance_aggregate: AccountBalanceAggregate;
  /** fetch data from the table: "account_balance" using primary key columns */
  account_balance_by_pk?: Maybe<AccountBalance>;
  /** fetch data from the table: "account" using primary key columns */
  account_by_pk?: Maybe<Account>;
  /** fetch data from the table: "block" */
  block: Array<Block>;
  /** fetch aggregated fields from the table: "block" */
  block_aggregate: BlockAggregate;
  /** fetch data from the table: "block" using primary key columns */
  block_by_pk?: Maybe<Block>;
  /** fetch data from the table: "contracts" */
  contracts: Array<Contracts>;
  /** fetch aggregated fields from the table: "contracts" */
  contracts_aggregate: ContractsAggregate;
  /** fetch data from the table: "contracts" using primary key columns */
  contracts_by_pk?: Maybe<Contracts>;
  /** fetch data from the table: "cyb_cohort" */
  cyb_cohort: Array<CybCohort>;
  /** fetch aggregated fields from the table: "cyb_cohort" */
  cyb_cohort_aggregate: CybCohortAggregate;
  /** fetch data from the table: "cyb_new_cohort" */
  cyb_new_cohort: Array<CybNewCohort>;
  /** fetch aggregated fields from the table: "cyb_new_cohort" */
  cyb_new_cohort_aggregate: CybNewCohortAggregate;
  /** fetch data from the table: "cyber_gift" */
  cyber_gift: Array<CyberGift>;
  /** fetch aggregated fields from the table: "cyber_gift" */
  cyber_gift_aggregate: CyberGiftAggregate;
  /** fetch data from the table: "cyber_gift_proofs" */
  cyber_gift_proofs: Array<CyberGiftProofs>;
  /** fetch aggregated fields from the table: "cyber_gift_proofs" */
  cyber_gift_proofs_aggregate: CyberGiftProofsAggregate;
  /** fetch data from the table: "cyberlinks" */
  cyberlinks: Array<Cyberlinks>;
  /** An aggregate relationship */
  cyberlinks_aggregate: CyberlinksAggregate;
  /** fetch data from the table: "cyberlinks" using primary key columns */
  cyberlinks_by_pk?: Maybe<Cyberlinks>;
  /** fetch data from the table: "cyberlinks_stats" */
  cyberlinks_stats: Array<CyberlinksStats>;
  /** fetch aggregated fields from the table: "cyberlinks_stats" */
  cyberlinks_stats_aggregate: CyberlinksStatsAggregate;
  /** fetch data from the table: "daily_amount_of_active_neurons" */
  daily_amount_of_active_neurons: Array<DailyAmountOfActiveNeurons>;
  /** fetch aggregated fields from the table: "daily_amount_of_active_neurons" */
  daily_amount_of_active_neurons_aggregate: DailyAmountOfActiveNeuronsAggregate;
  /** fetch data from the table: "daily_amount_of_used_gas" */
  daily_amount_of_used_gas: Array<DailyAmountOfUsedGas>;
  /** fetch aggregated fields from the table: "daily_amount_of_used_gas" */
  daily_amount_of_used_gas_aggregate: DailyAmountOfUsedGasAggregate;
  /** fetch data from the table: "daily_number_of_transactions" */
  daily_number_of_transactions: Array<DailyNumberOfTransactions>;
  /** fetch aggregated fields from the table: "daily_number_of_transactions" */
  daily_number_of_transactions_aggregate: DailyNumberOfTransactionsAggregate;
  /** fetch data from the table: "follow_stats" */
  follow_stats: Array<FollowStats>;
  /** fetch aggregated fields from the table: "follow_stats" */
  follow_stats_aggregate: FollowStatsAggregate;
  /** fetch data from the table: "genesis_neurons_activation" */
  genesis_neurons_activation: Array<GenesisNeuronsActivation>;
  /** fetch aggregated fields from the table: "genesis_neurons_activation" */
  genesis_neurons_activation_aggregate: GenesisNeuronsActivationAggregate;
  /** An array relationship */
  investmints: Array<Investmints>;
  /** An aggregate relationship */
  investmints_aggregate: InvestmintsAggregate;
  /** fetch data from the table: "investmints" using primary key columns */
  investmints_by_pk?: Maybe<Investmints>;
  /** fetch data from the table: "message" */
  message: Array<Message>;
  /** fetch aggregated fields from the table: "message" */
  message_aggregate: MessageAggregate;
  /** execute function "messages_by_address" which returns "message" */
  messages_by_address: Array<Message>;
  /** execute function "messages_by_address" and query aggregates on result of table type "message" */
  messages_by_address_aggregate: MessageAggregate;
  /** fetch data from the table: "modules" */
  modules: Array<Modules>;
  /** fetch aggregated fields from the table: "modules" */
  modules_aggregate: ModulesAggregate;
  /** fetch data from the table: "modules" using primary key columns */
  modules_by_pk?: Maybe<Modules>;
  /** fetch data from the table: "neuron_activation_source" */
  neuron_activation_source: Array<NeuronActivationSource>;
  /** fetch aggregated fields from the table: "neuron_activation_source" */
  neuron_activation_source_aggregate: NeuronActivationSourceAggregate;
  /** fetch data from the table: "number_of_new_neurons" */
  number_of_new_neurons: Array<NumberOfNewNeurons>;
  /** fetch aggregated fields from the table: "number_of_new_neurons" */
  number_of_new_neurons_aggregate: NumberOfNewNeuronsAggregate;
  /** fetch data from the table: "old_precommits" */
  old_precommits: Array<OldPrecommits>;
  /** fetch aggregated fields from the table: "old_precommits" */
  old_precommits_aggregate: OldPrecommitsAggregate;
  /** fetch data from the table: "old_precommits" using primary key columns */
  old_precommits_by_pk?: Maybe<OldPrecommits>;
  /** An array relationship */
  particles: Array<Particles>;
  /** An aggregate relationship */
  particles_aggregate: ParticlesAggregate;
  /** fetch data from the table: "particles" using primary key columns */
  particles_by_pk?: Maybe<Particles>;
  /** fetch data from the table: "pre_commit" */
  pre_commit: Array<PreCommit>;
  /** fetch aggregated fields from the table: "pre_commit" */
  pre_commit_aggregate: PreCommitAggregate;
  /** fetch data from the table: "pre_commits_rewards_view" */
  pre_commits_rewards_view: Array<PreCommitsRewardsView>;
  /** fetch aggregated fields from the table: "pre_commits_rewards_view" */
  pre_commits_rewards_view_aggregate: PreCommitsRewardsViewAggregate;
  /** fetch data from the table: "pre_commits_total" */
  pre_commits_total: Array<PreCommitsTotal>;
  /** fetch aggregated fields from the table: "pre_commits_total" */
  pre_commits_total_aggregate: PreCommitsTotalAggregate;
  /** fetch data from the table: "pre_commits_view" */
  pre_commits_view: Array<PreCommitsView>;
  /** fetch aggregated fields from the table: "pre_commits_view" */
  pre_commits_view_aggregate: PreCommitsViewAggregate;
  /** fetch data from the table: "pruning" */
  pruning: Array<Pruning>;
  /** fetch aggregated fields from the table: "pruning" */
  pruning_aggregate: PruningAggregate;
  /** fetch data from the table: "pussy_gift_proofs" */
  pussy_gift_proofs: Array<PussyGiftProofs>;
  /** fetch aggregated fields from the table: "pussy_gift_proofs" */
  pussy_gift_proofs_aggregate: PussyGiftProofsAggregate;
  /** An array relationship */
  routes: Array<Routes>;
  /** An aggregate relationship */
  routes_aggregate: RoutesAggregate;
  /** fetch data from the table: "routes" using primary key columns */
  routes_by_pk?: Maybe<Routes>;
  /** fetch data from the table: "supply" */
  supply: Array<Supply>;
  /** fetch aggregated fields from the table: "supply" */
  supply_aggregate: SupplyAggregate;
  /** fetch data from the table: "supply" using primary key columns */
  supply_by_pk?: Maybe<Supply>;
  /** fetch data from the table: "test_gift" */
  test_gift: Array<TestGift>;
  /** fetch aggregated fields from the table: "test_gift" */
  test_gift_aggregate: TestGiftAggregate;
  /** fetch data from the table: "today_top_txs" */
  today_top_txs: Array<TodayTopTxs>;
  /** fetch aggregated fields from the table: "today_top_txs" */
  today_top_txs_aggregate: TodayTopTxsAggregate;
  /** fetch data from the table: "top_10_of_active_neurons_week" */
  top_10_of_active_neurons_week: Array<Top_10OfActiveNeuronsWeek>;
  /** fetch aggregated fields from the table: "top_10_of_active_neurons_week" */
  top_10_of_active_neurons_week_aggregate: Top_10OfActiveNeuronsWeekAggregate;
  /** fetch data from the table: "top_first_txs" */
  top_first_txs: Array<TopFirstTxs>;
  /** fetch aggregated fields from the table: "top_first_txs" */
  top_first_txs_aggregate: TopFirstTxsAggregate;
  /** fetch data from the table: "top_leaders" */
  top_leaders: Array<TopLeaders>;
  /** fetch data from the table: "top_txs" */
  top_txs: Array<TopTxs>;
  /** fetch aggregated fields from the table: "top_txs" */
  top_txs_aggregate: TopTxsAggregate;
  /** fetch data from the table: "transaction" */
  transaction: Array<Transaction>;
  /** fetch aggregated fields from the table: "transaction" */
  transaction_aggregate: TransactionAggregate;
  /** fetch data from the table: "transaction" using primary key columns */
  transaction_by_pk?: Maybe<Transaction>;
  /** fetch data from the table: "tweets_stats" */
  tweets_stats: Array<TweetsStats>;
  /** fetch aggregated fields from the table: "tweets_stats" */
  tweets_stats_aggregate: TweetsStatsAggregate;
  /** fetch data from the table: "txs_ranked" */
  txs_ranked: Array<TxsRanked>;
  /** fetch aggregated fields from the table: "txs_ranked" */
  txs_ranked_aggregate: TxsRankedAggregate;
  /** fetch data from the table: "txs_stats" */
  txs_stats: Array<TxsStats>;
  /** fetch aggregated fields from the table: "txs_stats" */
  txs_stats_aggregate: TxsStatsAggregate;
  /** fetch data from the table: "uptime" */
  uptime: Array<Uptime>;
  /** fetch aggregated fields from the table: "uptime" */
  uptime_aggregate: UptimeAggregate;
  /** fetch data from the table: "validator" */
  validator: Array<Validator>;
  /** fetch aggregated fields from the table: "validator" */
  validator_aggregate: ValidatorAggregate;
  /** fetch data from the table: "validator" using primary key columns */
  validator_by_pk?: Maybe<Validator>;
  /** fetch data from the table: "volts_demand" */
  volts_demand: Array<VoltsDemand>;
  /** fetch aggregated fields from the table: "volts_demand" */
  volts_demand_aggregate: VoltsDemandAggregate;
  /** fetch data from the table: "volts_stats" */
  volts_stats: Array<VoltsStats>;
  /** fetch aggregated fields from the table: "volts_stats" */
  volts_stats_aggregate: VoltsStatsAggregate;
};


export type SubscriptionRootTransactionArgs = {
  distinct_on?: InputMaybe<Array<TransactionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TransactionOrderBy>>;
  where?: InputMaybe<TransactionBoolExp>;
};


export type SubscriptionRootTransactionAggregateArgs = {
  distinct_on?: InputMaybe<Array<TransactionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TransactionOrderBy>>;
  where?: InputMaybe<TransactionBoolExp>;
};


export type SubscriptionRootUptimeTempArgs = {
  distinct_on?: InputMaybe<Array<UptimeTempSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UptimeTempOrderBy>>;
  where?: InputMaybe<UptimeTempBoolExp>;
};


export type SubscriptionRootUptimeTempAggregateArgs = {
  distinct_on?: InputMaybe<Array<UptimeTempSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UptimeTempOrderBy>>;
  where?: InputMaybe<UptimeTempBoolExp>;
};


export type SubscriptionRootAccountArgs = {
  distinct_on?: InputMaybe<Array<AccountSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AccountOrderBy>>;
  where?: InputMaybe<AccountBoolExp>;
};


export type SubscriptionRootAccountAggregateArgs = {
  distinct_on?: InputMaybe<Array<AccountSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AccountOrderBy>>;
  where?: InputMaybe<AccountBoolExp>;
};


export type SubscriptionRootAccountBalanceArgs = {
  distinct_on?: InputMaybe<Array<AccountBalanceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AccountBalanceOrderBy>>;
  where?: InputMaybe<AccountBalanceBoolExp>;
};


export type SubscriptionRootAccountBalanceAggregateArgs = {
  distinct_on?: InputMaybe<Array<AccountBalanceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<AccountBalanceOrderBy>>;
  where?: InputMaybe<AccountBalanceBoolExp>;
};


export type SubscriptionRootAccountBalanceByPkArgs = {
  address: Scalars['String']['input'];
};


export type SubscriptionRootAccountByPkArgs = {
  address: Scalars['String']['input'];
};


export type SubscriptionRootBlockArgs = {
  distinct_on?: InputMaybe<Array<BlockSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockOrderBy>>;
  where?: InputMaybe<BlockBoolExp>;
};


export type SubscriptionRootBlockAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockOrderBy>>;
  where?: InputMaybe<BlockBoolExp>;
};


export type SubscriptionRootBlockByPkArgs = {
  height: Scalars['bigint']['input'];
};


export type SubscriptionRootContractsArgs = {
  distinct_on?: InputMaybe<Array<ContractsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ContractsOrderBy>>;
  where?: InputMaybe<ContractsBoolExp>;
};


export type SubscriptionRootContractsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ContractsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ContractsOrderBy>>;
  where?: InputMaybe<ContractsBoolExp>;
};


export type SubscriptionRootContractsByPkArgs = {
  address: Scalars['String']['input'];
};


export type SubscriptionRootCybCohortArgs = {
  distinct_on?: InputMaybe<Array<CybCohortSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CybCohortOrderBy>>;
  where?: InputMaybe<CybCohortBoolExp>;
};


export type SubscriptionRootCybCohortAggregateArgs = {
  distinct_on?: InputMaybe<Array<CybCohortSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CybCohortOrderBy>>;
  where?: InputMaybe<CybCohortBoolExp>;
};


export type SubscriptionRootCybNewCohortArgs = {
  distinct_on?: InputMaybe<Array<CybNewCohortSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CybNewCohortOrderBy>>;
  where?: InputMaybe<CybNewCohortBoolExp>;
};


export type SubscriptionRootCybNewCohortAggregateArgs = {
  distinct_on?: InputMaybe<Array<CybNewCohortSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CybNewCohortOrderBy>>;
  where?: InputMaybe<CybNewCohortBoolExp>;
};


export type SubscriptionRootCyberGiftArgs = {
  distinct_on?: InputMaybe<Array<CyberGiftSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberGiftOrderBy>>;
  where?: InputMaybe<CyberGiftBoolExp>;
};


export type SubscriptionRootCyberGiftAggregateArgs = {
  distinct_on?: InputMaybe<Array<CyberGiftSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberGiftOrderBy>>;
  where?: InputMaybe<CyberGiftBoolExp>;
};


export type SubscriptionRootCyberGiftProofsArgs = {
  distinct_on?: InputMaybe<Array<CyberGiftProofsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberGiftProofsOrderBy>>;
  where?: InputMaybe<CyberGiftProofsBoolExp>;
};


export type SubscriptionRootCyberGiftProofsAggregateArgs = {
  distinct_on?: InputMaybe<Array<CyberGiftProofsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberGiftProofsOrderBy>>;
  where?: InputMaybe<CyberGiftProofsBoolExp>;
};


export type SubscriptionRootCyberlinksArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksOrderBy>>;
  where?: InputMaybe<CyberlinksBoolExp>;
};


export type SubscriptionRootCyberlinksAggregateArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksOrderBy>>;
  where?: InputMaybe<CyberlinksBoolExp>;
};


export type SubscriptionRootCyberlinksByPkArgs = {
  id: Scalars['Int']['input'];
};


export type SubscriptionRootCyberlinksStatsArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksStatsOrderBy>>;
  where?: InputMaybe<CyberlinksStatsBoolExp>;
};


export type SubscriptionRootCyberlinksStatsAggregateArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksStatsOrderBy>>;
  where?: InputMaybe<CyberlinksStatsBoolExp>;
};


export type SubscriptionRootDailyAmountOfActiveNeuronsArgs = {
  distinct_on?: InputMaybe<Array<DailyAmountOfActiveNeuronsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DailyAmountOfActiveNeuronsOrderBy>>;
  where?: InputMaybe<DailyAmountOfActiveNeuronsBoolExp>;
};


export type SubscriptionRootDailyAmountOfActiveNeuronsAggregateArgs = {
  distinct_on?: InputMaybe<Array<DailyAmountOfActiveNeuronsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DailyAmountOfActiveNeuronsOrderBy>>;
  where?: InputMaybe<DailyAmountOfActiveNeuronsBoolExp>;
};


export type SubscriptionRootDailyAmountOfUsedGasArgs = {
  distinct_on?: InputMaybe<Array<DailyAmountOfUsedGasSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DailyAmountOfUsedGasOrderBy>>;
  where?: InputMaybe<DailyAmountOfUsedGasBoolExp>;
};


export type SubscriptionRootDailyAmountOfUsedGasAggregateArgs = {
  distinct_on?: InputMaybe<Array<DailyAmountOfUsedGasSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DailyAmountOfUsedGasOrderBy>>;
  where?: InputMaybe<DailyAmountOfUsedGasBoolExp>;
};


export type SubscriptionRootDailyNumberOfTransactionsArgs = {
  distinct_on?: InputMaybe<Array<DailyNumberOfTransactionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DailyNumberOfTransactionsOrderBy>>;
  where?: InputMaybe<DailyNumberOfTransactionsBoolExp>;
};


export type SubscriptionRootDailyNumberOfTransactionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<DailyNumberOfTransactionsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<DailyNumberOfTransactionsOrderBy>>;
  where?: InputMaybe<DailyNumberOfTransactionsBoolExp>;
};


export type SubscriptionRootFollowStatsArgs = {
  distinct_on?: InputMaybe<Array<FollowStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FollowStatsOrderBy>>;
  where?: InputMaybe<FollowStatsBoolExp>;
};


export type SubscriptionRootFollowStatsAggregateArgs = {
  distinct_on?: InputMaybe<Array<FollowStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<FollowStatsOrderBy>>;
  where?: InputMaybe<FollowStatsBoolExp>;
};


export type SubscriptionRootGenesisNeuronsActivationArgs = {
  distinct_on?: InputMaybe<Array<GenesisNeuronsActivationSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GenesisNeuronsActivationOrderBy>>;
  where?: InputMaybe<GenesisNeuronsActivationBoolExp>;
};


export type SubscriptionRootGenesisNeuronsActivationAggregateArgs = {
  distinct_on?: InputMaybe<Array<GenesisNeuronsActivationSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<GenesisNeuronsActivationOrderBy>>;
  where?: InputMaybe<GenesisNeuronsActivationBoolExp>;
};


export type SubscriptionRootInvestmintsArgs = {
  distinct_on?: InputMaybe<Array<InvestmintsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InvestmintsOrderBy>>;
  where?: InputMaybe<InvestmintsBoolExp>;
};


export type SubscriptionRootInvestmintsAggregateArgs = {
  distinct_on?: InputMaybe<Array<InvestmintsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InvestmintsOrderBy>>;
  where?: InputMaybe<InvestmintsBoolExp>;
};


export type SubscriptionRootInvestmintsByPkArgs = {
  id: Scalars['Int']['input'];
};


export type SubscriptionRootMessageArgs = {
  distinct_on?: InputMaybe<Array<MessageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MessageOrderBy>>;
  where?: InputMaybe<MessageBoolExp>;
};


export type SubscriptionRootMessageAggregateArgs = {
  distinct_on?: InputMaybe<Array<MessageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MessageOrderBy>>;
  where?: InputMaybe<MessageBoolExp>;
};


export type SubscriptionRootMessagesByAddressArgs = {
  args: MessagesByAddressArgs;
  distinct_on?: InputMaybe<Array<MessageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MessageOrderBy>>;
  where?: InputMaybe<MessageBoolExp>;
};


export type SubscriptionRootMessagesByAddressAggregateArgs = {
  args: MessagesByAddressArgs;
  distinct_on?: InputMaybe<Array<MessageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MessageOrderBy>>;
  where?: InputMaybe<MessageBoolExp>;
};


export type SubscriptionRootModulesArgs = {
  distinct_on?: InputMaybe<Array<ModulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ModulesOrderBy>>;
  where?: InputMaybe<ModulesBoolExp>;
};


export type SubscriptionRootModulesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ModulesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ModulesOrderBy>>;
  where?: InputMaybe<ModulesBoolExp>;
};


export type SubscriptionRootModulesByPkArgs = {
  module_name: Scalars['String']['input'];
};


export type SubscriptionRootNeuronActivationSourceArgs = {
  distinct_on?: InputMaybe<Array<NeuronActivationSourceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NeuronActivationSourceOrderBy>>;
  where?: InputMaybe<NeuronActivationSourceBoolExp>;
};


export type SubscriptionRootNeuronActivationSourceAggregateArgs = {
  distinct_on?: InputMaybe<Array<NeuronActivationSourceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NeuronActivationSourceOrderBy>>;
  where?: InputMaybe<NeuronActivationSourceBoolExp>;
};


export type SubscriptionRootNumberOfNewNeuronsArgs = {
  distinct_on?: InputMaybe<Array<NumberOfNewNeuronsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NumberOfNewNeuronsOrderBy>>;
  where?: InputMaybe<NumberOfNewNeuronsBoolExp>;
};


export type SubscriptionRootNumberOfNewNeuronsAggregateArgs = {
  distinct_on?: InputMaybe<Array<NumberOfNewNeuronsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<NumberOfNewNeuronsOrderBy>>;
  where?: InputMaybe<NumberOfNewNeuronsBoolExp>;
};


export type SubscriptionRootOldPrecommitsArgs = {
  distinct_on?: InputMaybe<Array<OldPrecommitsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<OldPrecommitsOrderBy>>;
  where?: InputMaybe<OldPrecommitsBoolExp>;
};


export type SubscriptionRootOldPrecommitsAggregateArgs = {
  distinct_on?: InputMaybe<Array<OldPrecommitsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<OldPrecommitsOrderBy>>;
  where?: InputMaybe<OldPrecommitsBoolExp>;
};


export type SubscriptionRootOldPrecommitsByPkArgs = {
  consensus_address: Scalars['String']['input'];
};


export type SubscriptionRootParticlesArgs = {
  distinct_on?: InputMaybe<Array<ParticlesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ParticlesOrderBy>>;
  where?: InputMaybe<ParticlesBoolExp>;
};


export type SubscriptionRootParticlesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ParticlesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ParticlesOrderBy>>;
  where?: InputMaybe<ParticlesBoolExp>;
};


export type SubscriptionRootParticlesByPkArgs = {
  id: Scalars['Int']['input'];
};


export type SubscriptionRootPreCommitArgs = {
  distinct_on?: InputMaybe<Array<PreCommitSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitOrderBy>>;
  where?: InputMaybe<PreCommitBoolExp>;
};


export type SubscriptionRootPreCommitAggregateArgs = {
  distinct_on?: InputMaybe<Array<PreCommitSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitOrderBy>>;
  where?: InputMaybe<PreCommitBoolExp>;
};


export type SubscriptionRootPreCommitsRewardsViewArgs = {
  distinct_on?: InputMaybe<Array<PreCommitsRewardsViewSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitsRewardsViewOrderBy>>;
  where?: InputMaybe<PreCommitsRewardsViewBoolExp>;
};


export type SubscriptionRootPreCommitsRewardsViewAggregateArgs = {
  distinct_on?: InputMaybe<Array<PreCommitsRewardsViewSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitsRewardsViewOrderBy>>;
  where?: InputMaybe<PreCommitsRewardsViewBoolExp>;
};


export type SubscriptionRootPreCommitsTotalArgs = {
  distinct_on?: InputMaybe<Array<PreCommitsTotalSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitsTotalOrderBy>>;
  where?: InputMaybe<PreCommitsTotalBoolExp>;
};


export type SubscriptionRootPreCommitsTotalAggregateArgs = {
  distinct_on?: InputMaybe<Array<PreCommitsTotalSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitsTotalOrderBy>>;
  where?: InputMaybe<PreCommitsTotalBoolExp>;
};


export type SubscriptionRootPreCommitsViewArgs = {
  distinct_on?: InputMaybe<Array<PreCommitsViewSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitsViewOrderBy>>;
  where?: InputMaybe<PreCommitsViewBoolExp>;
};


export type SubscriptionRootPreCommitsViewAggregateArgs = {
  distinct_on?: InputMaybe<Array<PreCommitsViewSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitsViewOrderBy>>;
  where?: InputMaybe<PreCommitsViewBoolExp>;
};


export type SubscriptionRootPruningArgs = {
  distinct_on?: InputMaybe<Array<PruningSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PruningOrderBy>>;
  where?: InputMaybe<PruningBoolExp>;
};


export type SubscriptionRootPruningAggregateArgs = {
  distinct_on?: InputMaybe<Array<PruningSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PruningOrderBy>>;
  where?: InputMaybe<PruningBoolExp>;
};


export type SubscriptionRootPussyGiftProofsArgs = {
  distinct_on?: InputMaybe<Array<PussyGiftProofsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PussyGiftProofsOrderBy>>;
  where?: InputMaybe<PussyGiftProofsBoolExp>;
};


export type SubscriptionRootPussyGiftProofsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PussyGiftProofsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PussyGiftProofsOrderBy>>;
  where?: InputMaybe<PussyGiftProofsBoolExp>;
};


export type SubscriptionRootRoutesArgs = {
  distinct_on?: InputMaybe<Array<RoutesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RoutesOrderBy>>;
  where?: InputMaybe<RoutesBoolExp>;
};


export type SubscriptionRootRoutesAggregateArgs = {
  distinct_on?: InputMaybe<Array<RoutesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RoutesOrderBy>>;
  where?: InputMaybe<RoutesBoolExp>;
};


export type SubscriptionRootRoutesByPkArgs = {
  id: Scalars['Int']['input'];
};


export type SubscriptionRootSupplyArgs = {
  distinct_on?: InputMaybe<Array<SupplySelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<SupplyOrderBy>>;
  where?: InputMaybe<SupplyBoolExp>;
};


export type SubscriptionRootSupplyAggregateArgs = {
  distinct_on?: InputMaybe<Array<SupplySelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<SupplyOrderBy>>;
  where?: InputMaybe<SupplyBoolExp>;
};


export type SubscriptionRootSupplyByPkArgs = {
  one_row_id: Scalars['Boolean']['input'];
};


export type SubscriptionRootTestGiftArgs = {
  distinct_on?: InputMaybe<Array<TestGiftSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TestGiftOrderBy>>;
  where?: InputMaybe<TestGiftBoolExp>;
};


export type SubscriptionRootTestGiftAggregateArgs = {
  distinct_on?: InputMaybe<Array<TestGiftSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TestGiftOrderBy>>;
  where?: InputMaybe<TestGiftBoolExp>;
};


export type SubscriptionRootTodayTopTxsArgs = {
  distinct_on?: InputMaybe<Array<TodayTopTxsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TodayTopTxsOrderBy>>;
  where?: InputMaybe<TodayTopTxsBoolExp>;
};


export type SubscriptionRootTodayTopTxsAggregateArgs = {
  distinct_on?: InputMaybe<Array<TodayTopTxsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TodayTopTxsOrderBy>>;
  where?: InputMaybe<TodayTopTxsBoolExp>;
};


export type SubscriptionRootTop_10OfActiveNeuronsWeekArgs = {
  distinct_on?: InputMaybe<Array<Top_10OfActiveNeuronsWeekSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_10OfActiveNeuronsWeekOrderBy>>;
  where?: InputMaybe<Top_10OfActiveNeuronsWeekBoolExp>;
};


export type SubscriptionRootTop_10OfActiveNeuronsWeekAggregateArgs = {
  distinct_on?: InputMaybe<Array<Top_10OfActiveNeuronsWeekSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_10OfActiveNeuronsWeekOrderBy>>;
  where?: InputMaybe<Top_10OfActiveNeuronsWeekBoolExp>;
};


export type SubscriptionRootTopFirstTxsArgs = {
  distinct_on?: InputMaybe<Array<TopFirstTxsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TopFirstTxsOrderBy>>;
  where?: InputMaybe<TopFirstTxsBoolExp>;
};


export type SubscriptionRootTopFirstTxsAggregateArgs = {
  distinct_on?: InputMaybe<Array<TopFirstTxsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TopFirstTxsOrderBy>>;
  where?: InputMaybe<TopFirstTxsBoolExp>;
};


export type SubscriptionRootTopLeadersArgs = {
  distinct_on?: InputMaybe<Array<TopLeadersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TopLeadersOrderBy>>;
  where?: InputMaybe<TopLeadersBoolExp>;
};


export type SubscriptionRootTopTxsArgs = {
  distinct_on?: InputMaybe<Array<TopTxsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TopTxsOrderBy>>;
  where?: InputMaybe<TopTxsBoolExp>;
};


export type SubscriptionRootTopTxsAggregateArgs = {
  distinct_on?: InputMaybe<Array<TopTxsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TopTxsOrderBy>>;
  where?: InputMaybe<TopTxsBoolExp>;
};


export type SubscriptionRootTransactionArgs = {
  distinct_on?: InputMaybe<Array<TransactionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TransactionOrderBy>>;
  where?: InputMaybe<TransactionBoolExp>;
};


export type SubscriptionRootTransactionAggregateArgs = {
  distinct_on?: InputMaybe<Array<TransactionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TransactionOrderBy>>;
  where?: InputMaybe<TransactionBoolExp>;
};


export type SubscriptionRootTransactionByPkArgs = {
  hash: Scalars['String']['input'];
};


export type SubscriptionRootTweetsStatsArgs = {
  distinct_on?: InputMaybe<Array<TweetsStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TweetsStatsOrderBy>>;
  where?: InputMaybe<TweetsStatsBoolExp>;
};


export type SubscriptionRootTweetsStatsAggregateArgs = {
  distinct_on?: InputMaybe<Array<TweetsStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TweetsStatsOrderBy>>;
  where?: InputMaybe<TweetsStatsBoolExp>;
};


export type SubscriptionRootTxsRankedArgs = {
  distinct_on?: InputMaybe<Array<TxsRankedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TxsRankedOrderBy>>;
  where?: InputMaybe<TxsRankedBoolExp>;
};


export type SubscriptionRootTxsRankedAggregateArgs = {
  distinct_on?: InputMaybe<Array<TxsRankedSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TxsRankedOrderBy>>;
  where?: InputMaybe<TxsRankedBoolExp>;
};


export type SubscriptionRootTxsStatsArgs = {
  distinct_on?: InputMaybe<Array<TxsStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TxsStatsOrderBy>>;
  where?: InputMaybe<TxsStatsBoolExp>;
};


export type SubscriptionRootTxsStatsAggregateArgs = {
  distinct_on?: InputMaybe<Array<TxsStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<TxsStatsOrderBy>>;
  where?: InputMaybe<TxsStatsBoolExp>;
};


export type SubscriptionRootUptimeArgs = {
  distinct_on?: InputMaybe<Array<UptimeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UptimeOrderBy>>;
  where?: InputMaybe<UptimeBoolExp>;
};


export type SubscriptionRootUptimeAggregateArgs = {
  distinct_on?: InputMaybe<Array<UptimeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<UptimeOrderBy>>;
  where?: InputMaybe<UptimeBoolExp>;
};


export type SubscriptionRootValidatorArgs = {
  distinct_on?: InputMaybe<Array<ValidatorSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ValidatorOrderBy>>;
  where?: InputMaybe<ValidatorBoolExp>;
};


export type SubscriptionRootValidatorAggregateArgs = {
  distinct_on?: InputMaybe<Array<ValidatorSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ValidatorOrderBy>>;
  where?: InputMaybe<ValidatorBoolExp>;
};


export type SubscriptionRootValidatorByPkArgs = {
  consensus_address: Scalars['String']['input'];
};


export type SubscriptionRootVoltsDemandArgs = {
  distinct_on?: InputMaybe<Array<VoltsDemandSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<VoltsDemandOrderBy>>;
  where?: InputMaybe<VoltsDemandBoolExp>;
};


export type SubscriptionRootVoltsDemandAggregateArgs = {
  distinct_on?: InputMaybe<Array<VoltsDemandSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<VoltsDemandOrderBy>>;
  where?: InputMaybe<VoltsDemandBoolExp>;
};


export type SubscriptionRootVoltsStatsArgs = {
  distinct_on?: InputMaybe<Array<VoltsStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<VoltsStatsOrderBy>>;
  where?: InputMaybe<VoltsStatsBoolExp>;
};


export type SubscriptionRootVoltsStatsAggregateArgs = {
  distinct_on?: InputMaybe<Array<VoltsStatsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<VoltsStatsOrderBy>>;
  where?: InputMaybe<VoltsStatsBoolExp>;
};

/** columns and relationships of "supply" */
export type Supply = {
  __typename?: 'supply';
  coins: Scalars['_coin']['output'];
  height: Scalars['bigint']['output'];
  one_row_id: Scalars['Boolean']['output'];
};

/** aggregated selection of "supply" */
export type SupplyAggregate = {
  __typename?: 'supply_aggregate';
  aggregate?: Maybe<SupplyAggregateFields>;
  nodes: Array<Supply>;
};

/** aggregate fields of "supply" */
export type SupplyAggregateFields = {
  __typename?: 'supply_aggregate_fields';
  avg?: Maybe<SupplyAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<SupplyMaxFields>;
  min?: Maybe<SupplyMinFields>;
  stddev?: Maybe<SupplyStddevFields>;
  stddev_pop?: Maybe<SupplyStddevPopFields>;
  stddev_samp?: Maybe<SupplyStddevSampFields>;
  sum?: Maybe<SupplySumFields>;
  var_pop?: Maybe<SupplyVarPopFields>;
  var_samp?: Maybe<SupplyVarSampFields>;
  variance?: Maybe<SupplyVarianceFields>;
};


/** aggregate fields of "supply" */
export type SupplyAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<SupplySelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type SupplyAvgFields = {
  __typename?: 'supply_avg_fields';
  height?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "supply". All fields are combined with a logical 'AND'. */
export type SupplyBoolExp = {
  _and?: InputMaybe<Array<SupplyBoolExp>>;
  _not?: InputMaybe<SupplyBoolExp>;
  _or?: InputMaybe<Array<SupplyBoolExp>>;
  coins?: InputMaybe<CoinComparisonExp>;
  height?: InputMaybe<BigintComparisonExp>;
  one_row_id?: InputMaybe<BooleanComparisonExp>;
};

/** aggregate max on columns */
export type SupplyMaxFields = {
  __typename?: 'supply_max_fields';
  height?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type SupplyMinFields = {
  __typename?: 'supply_min_fields';
  height?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "supply". */
export type SupplyOrderBy = {
  coins?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
  one_row_id?: InputMaybe<OrderBy>;
};

/** select columns of table "supply" */
export enum SupplySelectColumn {
  /** column name */
  Coins = 'coins',
  /** column name */
  Height = 'height',
  /** column name */
  OneRowId = 'one_row_id'
}

/** aggregate stddev on columns */
export type SupplyStddevFields = {
  __typename?: 'supply_stddev_fields';
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type SupplyStddevPopFields = {
  __typename?: 'supply_stddev_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type SupplyStddevSampFields = {
  __typename?: 'supply_stddev_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type SupplySumFields = {
  __typename?: 'supply_sum_fields';
  height?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type SupplyVarPopFields = {
  __typename?: 'supply_var_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type SupplyVarSampFields = {
  __typename?: 'supply_var_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type SupplyVarianceFields = {
  __typename?: 'supply_variance_fields';
  height?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "test_gift" */
export type TestGift = {
  __typename?: 'test_gift';
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  details?: Maybe<Scalars['json']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "test_gift" */
export type TestGiftDetailsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "test_gift" */
export type TestGiftAggregate = {
  __typename?: 'test_gift_aggregate';
  aggregate?: Maybe<TestGiftAggregateFields>;
  nodes: Array<TestGift>;
};

/** aggregate fields of "test_gift" */
export type TestGiftAggregateFields = {
  __typename?: 'test_gift_aggregate_fields';
  avg?: Maybe<TestGiftAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<TestGiftMaxFields>;
  min?: Maybe<TestGiftMinFields>;
  stddev?: Maybe<TestGiftStddevFields>;
  stddev_pop?: Maybe<TestGiftStddevPopFields>;
  stddev_samp?: Maybe<TestGiftStddevSampFields>;
  sum?: Maybe<TestGiftSumFields>;
  var_pop?: Maybe<TestGiftVarPopFields>;
  var_samp?: Maybe<TestGiftVarSampFields>;
  variance?: Maybe<TestGiftVarianceFields>;
};


/** aggregate fields of "test_gift" */
export type TestGiftAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<TestGiftSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type TestGiftAvgFields = {
  __typename?: 'test_gift_avg_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "test_gift". All fields are combined with a logical 'AND'. */
export type TestGiftBoolExp = {
  _and?: InputMaybe<Array<TestGiftBoolExp>>;
  _not?: InputMaybe<TestGiftBoolExp>;
  _or?: InputMaybe<Array<TestGiftBoolExp>>;
  address?: InputMaybe<StringComparisonExp>;
  amount?: InputMaybe<BigintComparisonExp>;
  details?: InputMaybe<JsonComparisonExp>;
  proof?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type TestGiftMaxFields = {
  __typename?: 'test_gift_max_fields';
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type TestGiftMinFields = {
  __typename?: 'test_gift_min_fields';
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "test_gift". */
export type TestGiftOrderBy = {
  address?: InputMaybe<OrderBy>;
  amount?: InputMaybe<OrderBy>;
  details?: InputMaybe<OrderBy>;
  proof?: InputMaybe<OrderBy>;
};

/** select columns of table "test_gift" */
export enum TestGiftSelectColumn {
  /** column name */
  Address = 'address',
  /** column name */
  Amount = 'amount',
  /** column name */
  Details = 'details',
  /** column name */
  Proof = 'proof'
}

/** aggregate stddev on columns */
export type TestGiftStddevFields = {
  __typename?: 'test_gift_stddev_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type TestGiftStddevPopFields = {
  __typename?: 'test_gift_stddev_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type TestGiftStddevSampFields = {
  __typename?: 'test_gift_stddev_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type TestGiftSumFields = {
  __typename?: 'test_gift_sum_fields';
  amount?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type TestGiftVarPopFields = {
  __typename?: 'test_gift_var_pop_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type TestGiftVarSampFields = {
  __typename?: 'test_gift_var_samp_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type TestGiftVarianceFields = {
  __typename?: 'test_gift_variance_fields';
  amount?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type TimestampComparisonExp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamp']['input']>;
  _lte?: InputMaybe<Scalars['timestamp']['input']>;
  _neq?: InputMaybe<Scalars['timestamp']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
};

/** columns and relationships of "today_top_txs" */
export type TodayTopTxs = {
  __typename?: 'today_top_txs';
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "today_top_txs" */
export type TodayTopTxsAggregate = {
  __typename?: 'today_top_txs_aggregate';
  aggregate?: Maybe<TodayTopTxsAggregateFields>;
  nodes: Array<TodayTopTxs>;
};

/** aggregate fields of "today_top_txs" */
export type TodayTopTxsAggregateFields = {
  __typename?: 'today_top_txs_aggregate_fields';
  avg?: Maybe<TodayTopTxsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<TodayTopTxsMaxFields>;
  min?: Maybe<TodayTopTxsMinFields>;
  stddev?: Maybe<TodayTopTxsStddevFields>;
  stddev_pop?: Maybe<TodayTopTxsStddevPopFields>;
  stddev_samp?: Maybe<TodayTopTxsStddevSampFields>;
  sum?: Maybe<TodayTopTxsSumFields>;
  var_pop?: Maybe<TodayTopTxsVarPopFields>;
  var_samp?: Maybe<TodayTopTxsVarSampFields>;
  variance?: Maybe<TodayTopTxsVarianceFields>;
};


/** aggregate fields of "today_top_txs" */
export type TodayTopTxsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<TodayTopTxsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type TodayTopTxsAvgFields = {
  __typename?: 'today_top_txs_avg_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "today_top_txs". All fields are combined with a logical 'AND'. */
export type TodayTopTxsBoolExp = {
  _and?: InputMaybe<Array<TodayTopTxsBoolExp>>;
  _not?: InputMaybe<TodayTopTxsBoolExp>;
  _or?: InputMaybe<Array<TodayTopTxsBoolExp>>;
  count?: InputMaybe<BigintComparisonExp>;
  type?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type TodayTopTxsMaxFields = {
  __typename?: 'today_top_txs_max_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type TodayTopTxsMinFields = {
  __typename?: 'today_top_txs_min_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "today_top_txs". */
export type TodayTopTxsOrderBy = {
  count?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
};

/** select columns of table "today_top_txs" */
export enum TodayTopTxsSelectColumn {
  /** column name */
  Count = 'count',
  /** column name */
  Type = 'type'
}

/** aggregate stddev on columns */
export type TodayTopTxsStddevFields = {
  __typename?: 'today_top_txs_stddev_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type TodayTopTxsStddevPopFields = {
  __typename?: 'today_top_txs_stddev_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type TodayTopTxsStddevSampFields = {
  __typename?: 'today_top_txs_stddev_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type TodayTopTxsSumFields = {
  __typename?: 'today_top_txs_sum_fields';
  count?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type TodayTopTxsVarPopFields = {
  __typename?: 'today_top_txs_var_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type TodayTopTxsVarSampFields = {
  __typename?: 'today_top_txs_var_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type TodayTopTxsVarianceFields = {
  __typename?: 'today_top_txs_variance_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "top_10_of_active_neurons_week" */
export type Top_10OfActiveNeuronsWeek = {
  __typename?: 'top_10_of_active_neurons_week';
  count?: Maybe<Scalars['bigint']['output']>;
  pubkey?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "top_10_of_active_neurons_week" */
export type Top_10OfActiveNeuronsWeekAggregate = {
  __typename?: 'top_10_of_active_neurons_week_aggregate';
  aggregate?: Maybe<Top_10OfActiveNeuronsWeekAggregateFields>;
  nodes: Array<Top_10OfActiveNeuronsWeek>;
};

/** aggregate fields of "top_10_of_active_neurons_week" */
export type Top_10OfActiveNeuronsWeekAggregateFields = {
  __typename?: 'top_10_of_active_neurons_week_aggregate_fields';
  avg?: Maybe<Top_10OfActiveNeuronsWeekAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Top_10OfActiveNeuronsWeekMaxFields>;
  min?: Maybe<Top_10OfActiveNeuronsWeekMinFields>;
  stddev?: Maybe<Top_10OfActiveNeuronsWeekStddevFields>;
  stddev_pop?: Maybe<Top_10OfActiveNeuronsWeekStddevPopFields>;
  stddev_samp?: Maybe<Top_10OfActiveNeuronsWeekStddevSampFields>;
  sum?: Maybe<Top_10OfActiveNeuronsWeekSumFields>;
  var_pop?: Maybe<Top_10OfActiveNeuronsWeekVarPopFields>;
  var_samp?: Maybe<Top_10OfActiveNeuronsWeekVarSampFields>;
  variance?: Maybe<Top_10OfActiveNeuronsWeekVarianceFields>;
};


/** aggregate fields of "top_10_of_active_neurons_week" */
export type Top_10OfActiveNeuronsWeekAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<Top_10OfActiveNeuronsWeekSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Top_10OfActiveNeuronsWeekAvgFields = {
  __typename?: 'top_10_of_active_neurons_week_avg_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "top_10_of_active_neurons_week". All fields are combined with a logical 'AND'. */
export type Top_10OfActiveNeuronsWeekBoolExp = {
  _and?: InputMaybe<Array<Top_10OfActiveNeuronsWeekBoolExp>>;
  _not?: InputMaybe<Top_10OfActiveNeuronsWeekBoolExp>;
  _or?: InputMaybe<Array<Top_10OfActiveNeuronsWeekBoolExp>>;
  count?: InputMaybe<BigintComparisonExp>;
  pubkey?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type Top_10OfActiveNeuronsWeekMaxFields = {
  __typename?: 'top_10_of_active_neurons_week_max_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  pubkey?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Top_10OfActiveNeuronsWeekMinFields = {
  __typename?: 'top_10_of_active_neurons_week_min_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  pubkey?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "top_10_of_active_neurons_week". */
export type Top_10OfActiveNeuronsWeekOrderBy = {
  count?: InputMaybe<OrderBy>;
  pubkey?: InputMaybe<OrderBy>;
};

/** select columns of table "top_10_of_active_neurons_week" */
export enum Top_10OfActiveNeuronsWeekSelectColumn {
  /** column name */
  Count = 'count',
  /** column name */
  Pubkey = 'pubkey'
}

/** aggregate stddev on columns */
export type Top_10OfActiveNeuronsWeekStddevFields = {
  __typename?: 'top_10_of_active_neurons_week_stddev_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Top_10OfActiveNeuronsWeekStddevPopFields = {
  __typename?: 'top_10_of_active_neurons_week_stddev_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Top_10OfActiveNeuronsWeekStddevSampFields = {
  __typename?: 'top_10_of_active_neurons_week_stddev_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Top_10OfActiveNeuronsWeekSumFields = {
  __typename?: 'top_10_of_active_neurons_week_sum_fields';
  count?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Top_10OfActiveNeuronsWeekVarPopFields = {
  __typename?: 'top_10_of_active_neurons_week_var_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Top_10OfActiveNeuronsWeekVarSampFields = {
  __typename?: 'top_10_of_active_neurons_week_var_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Top_10OfActiveNeuronsWeekVarianceFields = {
  __typename?: 'top_10_of_active_neurons_week_variance_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "top_first_txs" */
export type TopFirstTxs = {
  __typename?: 'top_first_txs';
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "top_first_txs" */
export type TopFirstTxsAggregate = {
  __typename?: 'top_first_txs_aggregate';
  aggregate?: Maybe<TopFirstTxsAggregateFields>;
  nodes: Array<TopFirstTxs>;
};

/** aggregate fields of "top_first_txs" */
export type TopFirstTxsAggregateFields = {
  __typename?: 'top_first_txs_aggregate_fields';
  avg?: Maybe<TopFirstTxsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<TopFirstTxsMaxFields>;
  min?: Maybe<TopFirstTxsMinFields>;
  stddev?: Maybe<TopFirstTxsStddevFields>;
  stddev_pop?: Maybe<TopFirstTxsStddevPopFields>;
  stddev_samp?: Maybe<TopFirstTxsStddevSampFields>;
  sum?: Maybe<TopFirstTxsSumFields>;
  var_pop?: Maybe<TopFirstTxsVarPopFields>;
  var_samp?: Maybe<TopFirstTxsVarSampFields>;
  variance?: Maybe<TopFirstTxsVarianceFields>;
};


/** aggregate fields of "top_first_txs" */
export type TopFirstTxsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<TopFirstTxsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type TopFirstTxsAvgFields = {
  __typename?: 'top_first_txs_avg_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "top_first_txs". All fields are combined with a logical 'AND'. */
export type TopFirstTxsBoolExp = {
  _and?: InputMaybe<Array<TopFirstTxsBoolExp>>;
  _not?: InputMaybe<TopFirstTxsBoolExp>;
  _or?: InputMaybe<Array<TopFirstTxsBoolExp>>;
  count?: InputMaybe<BigintComparisonExp>;
  type?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type TopFirstTxsMaxFields = {
  __typename?: 'top_first_txs_max_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type TopFirstTxsMinFields = {
  __typename?: 'top_first_txs_min_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "top_first_txs". */
export type TopFirstTxsOrderBy = {
  count?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
};

/** select columns of table "top_first_txs" */
export enum TopFirstTxsSelectColumn {
  /** column name */
  Count = 'count',
  /** column name */
  Type = 'type'
}

/** aggregate stddev on columns */
export type TopFirstTxsStddevFields = {
  __typename?: 'top_first_txs_stddev_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type TopFirstTxsStddevPopFields = {
  __typename?: 'top_first_txs_stddev_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type TopFirstTxsStddevSampFields = {
  __typename?: 'top_first_txs_stddev_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type TopFirstTxsSumFields = {
  __typename?: 'top_first_txs_sum_fields';
  count?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type TopFirstTxsVarPopFields = {
  __typename?: 'top_first_txs_var_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type TopFirstTxsVarSampFields = {
  __typename?: 'top_first_txs_var_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type TopFirstTxsVarianceFields = {
  __typename?: 'top_first_txs_variance_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "top_leaders" */
export type TopLeaders = {
  __typename?: 'top_leaders';
  count?: Maybe<Scalars['bigint']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
};

/** Boolean expression to filter rows from the table "top_leaders". All fields are combined with a logical 'AND'. */
export type TopLeadersBoolExp = {
  _and?: InputMaybe<Array<TopLeadersBoolExp>>;
  _not?: InputMaybe<TopLeadersBoolExp>;
  _or?: InputMaybe<Array<TopLeadersBoolExp>>;
  count?: InputMaybe<BigintComparisonExp>;
  neuron?: InputMaybe<StringComparisonExp>;
};

/** Ordering options when selecting data from "top_leaders". */
export type TopLeadersOrderBy = {
  count?: InputMaybe<OrderBy>;
  neuron?: InputMaybe<OrderBy>;
};

/** select columns of table "top_leaders" */
export enum TopLeadersSelectColumn {
  /** column name */
  Count = 'count',
  /** column name */
  Neuron = 'neuron'
}

/** columns and relationships of "top_txs" */
export type TopTxs = {
  __typename?: 'top_txs';
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "top_txs" */
export type TopTxsAggregate = {
  __typename?: 'top_txs_aggregate';
  aggregate?: Maybe<TopTxsAggregateFields>;
  nodes: Array<TopTxs>;
};

/** aggregate fields of "top_txs" */
export type TopTxsAggregateFields = {
  __typename?: 'top_txs_aggregate_fields';
  avg?: Maybe<TopTxsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<TopTxsMaxFields>;
  min?: Maybe<TopTxsMinFields>;
  stddev?: Maybe<TopTxsStddevFields>;
  stddev_pop?: Maybe<TopTxsStddevPopFields>;
  stddev_samp?: Maybe<TopTxsStddevSampFields>;
  sum?: Maybe<TopTxsSumFields>;
  var_pop?: Maybe<TopTxsVarPopFields>;
  var_samp?: Maybe<TopTxsVarSampFields>;
  variance?: Maybe<TopTxsVarianceFields>;
};


/** aggregate fields of "top_txs" */
export type TopTxsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<TopTxsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type TopTxsAvgFields = {
  __typename?: 'top_txs_avg_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "top_txs". All fields are combined with a logical 'AND'. */
export type TopTxsBoolExp = {
  _and?: InputMaybe<Array<TopTxsBoolExp>>;
  _not?: InputMaybe<TopTxsBoolExp>;
  _or?: InputMaybe<Array<TopTxsBoolExp>>;
  count?: InputMaybe<BigintComparisonExp>;
  type?: InputMaybe<StringComparisonExp>;
};

/** aggregate max on columns */
export type TopTxsMaxFields = {
  __typename?: 'top_txs_max_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type TopTxsMinFields = {
  __typename?: 'top_txs_min_fields';
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "top_txs". */
export type TopTxsOrderBy = {
  count?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
};

/** select columns of table "top_txs" */
export enum TopTxsSelectColumn {
  /** column name */
  Count = 'count',
  /** column name */
  Type = 'type'
}

/** aggregate stddev on columns */
export type TopTxsStddevFields = {
  __typename?: 'top_txs_stddev_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type TopTxsStddevPopFields = {
  __typename?: 'top_txs_stddev_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type TopTxsStddevSampFields = {
  __typename?: 'top_txs_stddev_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type TopTxsSumFields = {
  __typename?: 'top_txs_sum_fields';
  count?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type TopTxsVarPopFields = {
  __typename?: 'top_txs_var_pop_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type TopTxsVarSampFields = {
  __typename?: 'top_txs_var_samp_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type TopTxsVarianceFields = {
  __typename?: 'top_txs_variance_fields';
  count?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "transaction" */
export type Transaction = {
  __typename?: 'transaction';
  /** An object relationship */
  block: Block;
  /** fetch data from the table: "cyberlinks" */
  cyberlinks: Array<Cyberlinks>;
  /** An aggregate relationship */
  cyberlinks_aggregate: CyberlinksAggregate;
  fee: Scalars['jsonb']['output'];
  gas_used?: Maybe<Scalars['bigint']['output']>;
  gas_wanted?: Maybe<Scalars['bigint']['output']>;
  hash: Scalars['String']['output'];
  height: Scalars['bigint']['output'];
  /** An array relationship */
  investmints: Array<Investmints>;
  /** An aggregate relationship */
  investmints_aggregate: InvestmintsAggregate;
  logs?: Maybe<Scalars['jsonb']['output']>;
  memo?: Maybe<Scalars['String']['output']>;
  messages: Scalars['jsonb']['output'];
  /** An array relationship */
  messagesByTransactionHash: Array<Message>;
  /** An aggregate relationship */
  messagesByTransactionHash_aggregate: MessageAggregate;
  /** An array relationship */
  particles: Array<Particles>;
  /** An aggregate relationship */
  particles_aggregate: ParticlesAggregate;
  raw_log?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  routes: Array<Routes>;
  /** An aggregate relationship */
  routes_aggregate: RoutesAggregate;
  signatures: Scalars['_text']['output'];
  signer_infos: Scalars['jsonb']['output'];
  success: Scalars['Boolean']['output'];
};


/** columns and relationships of "transaction" */
export type TransactionCyberlinksArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksOrderBy>>;
  where?: InputMaybe<CyberlinksBoolExp>;
};


/** columns and relationships of "transaction" */
export type TransactionCyberlinksAggregateArgs = {
  distinct_on?: InputMaybe<Array<CyberlinksSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<CyberlinksOrderBy>>;
  where?: InputMaybe<CyberlinksBoolExp>;
};


/** columns and relationships of "transaction" */
export type TransactionFeeArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "transaction" */
export type TransactionInvestmintsArgs = {
  distinct_on?: InputMaybe<Array<InvestmintsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InvestmintsOrderBy>>;
  where?: InputMaybe<InvestmintsBoolExp>;
};


/** columns and relationships of "transaction" */
export type TransactionInvestmintsAggregateArgs = {
  distinct_on?: InputMaybe<Array<InvestmintsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<InvestmintsOrderBy>>;
  where?: InputMaybe<InvestmintsBoolExp>;
};


/** columns and relationships of "transaction" */
export type TransactionLogsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "transaction" */
export type TransactionMessagesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "transaction" */
export type TransactionMessagesByTransactionHashArgs = {
  distinct_on?: InputMaybe<Array<MessageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MessageOrderBy>>;
  where?: InputMaybe<MessageBoolExp>;
};


/** columns and relationships of "transaction" */
export type TransactionMessagesByTransactionHashAggregateArgs = {
  distinct_on?: InputMaybe<Array<MessageSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<MessageOrderBy>>;
  where?: InputMaybe<MessageBoolExp>;
};


/** columns and relationships of "transaction" */
export type TransactionParticlesArgs = {
  distinct_on?: InputMaybe<Array<ParticlesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ParticlesOrderBy>>;
  where?: InputMaybe<ParticlesBoolExp>;
};


/** columns and relationships of "transaction" */
export type TransactionParticlesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ParticlesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<ParticlesOrderBy>>;
  where?: InputMaybe<ParticlesBoolExp>;
};


/** columns and relationships of "transaction" */
export type TransactionRoutesArgs = {
  distinct_on?: InputMaybe<Array<RoutesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RoutesOrderBy>>;
  where?: InputMaybe<RoutesBoolExp>;
};


/** columns and relationships of "transaction" */
export type TransactionRoutesAggregateArgs = {
  distinct_on?: InputMaybe<Array<RoutesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<RoutesOrderBy>>;
  where?: InputMaybe<RoutesBoolExp>;
};


/** columns and relationships of "transaction" */
export type TransactionSignerInfosArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "transaction" */
export type TransactionAggregate = {
  __typename?: 'transaction_aggregate';
  aggregate?: Maybe<TransactionAggregateFields>;
  nodes: Array<Transaction>;
};

/** aggregate fields of "transaction" */
export type TransactionAggregateFields = {
  __typename?: 'transaction_aggregate_fields';
  avg?: Maybe<TransactionAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<TransactionMaxFields>;
  min?: Maybe<TransactionMinFields>;
  stddev?: Maybe<TransactionStddevFields>;
  stddev_pop?: Maybe<TransactionStddevPopFields>;
  stddev_samp?: Maybe<TransactionStddevSampFields>;
  sum?: Maybe<TransactionSumFields>;
  var_pop?: Maybe<TransactionVarPopFields>;
  var_samp?: Maybe<TransactionVarSampFields>;
  variance?: Maybe<TransactionVarianceFields>;
};


/** aggregate fields of "transaction" */
export type TransactionAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<TransactionSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "transaction" */
export type TransactionAggregateOrderBy = {
  avg?: InputMaybe<TransactionAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<TransactionMaxOrderBy>;
  min?: InputMaybe<TransactionMinOrderBy>;
  stddev?: InputMaybe<TransactionStddevOrderBy>;
  stddev_pop?: InputMaybe<TransactionStddevPopOrderBy>;
  stddev_samp?: InputMaybe<TransactionStddevSampOrderBy>;
  sum?: InputMaybe<TransactionSumOrderBy>;
  var_pop?: InputMaybe<TransactionVarPopOrderBy>;
  var_samp?: InputMaybe<TransactionVarSampOrderBy>;
  variance?: InputMaybe<TransactionVarianceOrderBy>;
};

/** aggregate avg on columns */
export type TransactionAvgFields = {
  __typename?: 'transaction_avg_fields';
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "transaction" */
export type TransactionAvgOrderBy = {
  gas_used?: InputMaybe<OrderBy>;
  gas_wanted?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "transaction". All fields are combined with a logical 'AND'. */
export type TransactionBoolExp = {
  _and?: InputMaybe<Array<TransactionBoolExp>>;
  _not?: InputMaybe<TransactionBoolExp>;
  _or?: InputMaybe<Array<TransactionBoolExp>>;
  block?: InputMaybe<BlockBoolExp>;
  cyberlinks?: InputMaybe<CyberlinksBoolExp>;
  fee?: InputMaybe<JsonbComparisonExp>;
  gas_used?: InputMaybe<BigintComparisonExp>;
  gas_wanted?: InputMaybe<BigintComparisonExp>;
  hash?: InputMaybe<StringComparisonExp>;
  height?: InputMaybe<BigintComparisonExp>;
  investmints?: InputMaybe<InvestmintsBoolExp>;
  logs?: InputMaybe<JsonbComparisonExp>;
  memo?: InputMaybe<StringComparisonExp>;
  messages?: InputMaybe<JsonbComparisonExp>;
  messagesByTransactionHash?: InputMaybe<MessageBoolExp>;
  particles?: InputMaybe<ParticlesBoolExp>;
  raw_log?: InputMaybe<StringComparisonExp>;
  routes?: InputMaybe<RoutesBoolExp>;
  signatures?: InputMaybe<TextComparisonExp>;
  signer_infos?: InputMaybe<JsonbComparisonExp>;
  success?: InputMaybe<BooleanComparisonExp>;
};

/** aggregate max on columns */
export type TransactionMaxFields = {
  __typename?: 'transaction_max_fields';
  gas_used?: Maybe<Scalars['bigint']['output']>;
  gas_wanted?: Maybe<Scalars['bigint']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  memo?: Maybe<Scalars['String']['output']>;
  raw_log?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "transaction" */
export type TransactionMaxOrderBy = {
  gas_used?: InputMaybe<OrderBy>;
  gas_wanted?: InputMaybe<OrderBy>;
  hash?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
  memo?: InputMaybe<OrderBy>;
  raw_log?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type TransactionMinFields = {
  __typename?: 'transaction_min_fields';
  gas_used?: Maybe<Scalars['bigint']['output']>;
  gas_wanted?: Maybe<Scalars['bigint']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  memo?: Maybe<Scalars['String']['output']>;
  raw_log?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "transaction" */
export type TransactionMinOrderBy = {
  gas_used?: InputMaybe<OrderBy>;
  gas_wanted?: InputMaybe<OrderBy>;
  hash?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
  memo?: InputMaybe<OrderBy>;
  raw_log?: InputMaybe<OrderBy>;
};

/** Ordering options when selecting data from "transaction". */
export type TransactionOrderBy = {
  block?: InputMaybe<BlockOrderBy>;
  cyberlinks_aggregate?: InputMaybe<CyberlinksAggregateOrderBy>;
  fee?: InputMaybe<OrderBy>;
  gas_used?: InputMaybe<OrderBy>;
  gas_wanted?: InputMaybe<OrderBy>;
  hash?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
  investmints_aggregate?: InputMaybe<InvestmintsAggregateOrderBy>;
  logs?: InputMaybe<OrderBy>;
  memo?: InputMaybe<OrderBy>;
  messages?: InputMaybe<OrderBy>;
  messagesByTransactionHash_aggregate?: InputMaybe<MessageAggregateOrderBy>;
  particles_aggregate?: InputMaybe<ParticlesAggregateOrderBy>;
  raw_log?: InputMaybe<OrderBy>;
  routes_aggregate?: InputMaybe<RoutesAggregateOrderBy>;
  signatures?: InputMaybe<OrderBy>;
  signer_infos?: InputMaybe<OrderBy>;
  success?: InputMaybe<OrderBy>;
};

/** select columns of table "transaction" */
export enum TransactionSelectColumn {
  /** column name */
  Fee = 'fee',
  /** column name */
  GasUsed = 'gas_used',
  /** column name */
  GasWanted = 'gas_wanted',
  /** column name */
  Hash = 'hash',
  /** column name */
  Height = 'height',
  /** column name */
  Logs = 'logs',
  /** column name */
  Memo = 'memo',
  /** column name */
  Messages = 'messages',
  /** column name */
  RawLog = 'raw_log',
  /** column name */
  Signatures = 'signatures',
  /** column name */
  SignerInfos = 'signer_infos',
  /** column name */
  Success = 'success'
}

/** aggregate stddev on columns */
export type TransactionStddevFields = {
  __typename?: 'transaction_stddev_fields';
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "transaction" */
export type TransactionStddevOrderBy = {
  gas_used?: InputMaybe<OrderBy>;
  gas_wanted?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type TransactionStddevPopFields = {
  __typename?: 'transaction_stddev_pop_fields';
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "transaction" */
export type TransactionStddevPopOrderBy = {
  gas_used?: InputMaybe<OrderBy>;
  gas_wanted?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type TransactionStddevSampFields = {
  __typename?: 'transaction_stddev_samp_fields';
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "transaction" */
export type TransactionStddevSampOrderBy = {
  gas_used?: InputMaybe<OrderBy>;
  gas_wanted?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
};

/** aggregate sum on columns */
export type TransactionSumFields = {
  __typename?: 'transaction_sum_fields';
  gas_used?: Maybe<Scalars['bigint']['output']>;
  gas_wanted?: Maybe<Scalars['bigint']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "transaction" */
export type TransactionSumOrderBy = {
  gas_used?: InputMaybe<OrderBy>;
  gas_wanted?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type TransactionVarPopFields = {
  __typename?: 'transaction_var_pop_fields';
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "transaction" */
export type TransactionVarPopOrderBy = {
  gas_used?: InputMaybe<OrderBy>;
  gas_wanted?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type TransactionVarSampFields = {
  __typename?: 'transaction_var_samp_fields';
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "transaction" */
export type TransactionVarSampOrderBy = {
  gas_used?: InputMaybe<OrderBy>;
  gas_wanted?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type TransactionVarianceFields = {
  __typename?: 'transaction_variance_fields';
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "transaction" */
export type TransactionVarianceOrderBy = {
  gas_used?: InputMaybe<OrderBy>;
  gas_wanted?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
};

/** columns and relationships of "tweets_stats" */
export type TweetsStats = {
  __typename?: 'tweets_stats';
  date?: Maybe<Scalars['date']['output']>;
  tweets?: Maybe<Scalars['numeric']['output']>;
  tweets_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** aggregated selection of "tweets_stats" */
export type TweetsStatsAggregate = {
  __typename?: 'tweets_stats_aggregate';
  aggregate?: Maybe<TweetsStatsAggregateFields>;
  nodes: Array<TweetsStats>;
};

/** aggregate fields of "tweets_stats" */
export type TweetsStatsAggregateFields = {
  __typename?: 'tweets_stats_aggregate_fields';
  avg?: Maybe<TweetsStatsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<TweetsStatsMaxFields>;
  min?: Maybe<TweetsStatsMinFields>;
  stddev?: Maybe<TweetsStatsStddevFields>;
  stddev_pop?: Maybe<TweetsStatsStddevPopFields>;
  stddev_samp?: Maybe<TweetsStatsStddevSampFields>;
  sum?: Maybe<TweetsStatsSumFields>;
  var_pop?: Maybe<TweetsStatsVarPopFields>;
  var_samp?: Maybe<TweetsStatsVarSampFields>;
  variance?: Maybe<TweetsStatsVarianceFields>;
};


/** aggregate fields of "tweets_stats" */
export type TweetsStatsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<TweetsStatsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type TweetsStatsAvgFields = {
  __typename?: 'tweets_stats_avg_fields';
  tweets?: Maybe<Scalars['Float']['output']>;
  tweets_per_day?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "tweets_stats". All fields are combined with a logical 'AND'. */
export type TweetsStatsBoolExp = {
  _and?: InputMaybe<Array<TweetsStatsBoolExp>>;
  _not?: InputMaybe<TweetsStatsBoolExp>;
  _or?: InputMaybe<Array<TweetsStatsBoolExp>>;
  date?: InputMaybe<DateComparisonExp>;
  tweets?: InputMaybe<NumericComparisonExp>;
  tweets_per_day?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type TweetsStatsMaxFields = {
  __typename?: 'tweets_stats_max_fields';
  date?: Maybe<Scalars['date']['output']>;
  tweets?: Maybe<Scalars['numeric']['output']>;
  tweets_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type TweetsStatsMinFields = {
  __typename?: 'tweets_stats_min_fields';
  date?: Maybe<Scalars['date']['output']>;
  tweets?: Maybe<Scalars['numeric']['output']>;
  tweets_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "tweets_stats". */
export type TweetsStatsOrderBy = {
  date?: InputMaybe<OrderBy>;
  tweets?: InputMaybe<OrderBy>;
  tweets_per_day?: InputMaybe<OrderBy>;
};

/** select columns of table "tweets_stats" */
export enum TweetsStatsSelectColumn {
  /** column name */
  Date = 'date',
  /** column name */
  Tweets = 'tweets',
  /** column name */
  TweetsPerDay = 'tweets_per_day'
}

/** aggregate stddev on columns */
export type TweetsStatsStddevFields = {
  __typename?: 'tweets_stats_stddev_fields';
  tweets?: Maybe<Scalars['Float']['output']>;
  tweets_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type TweetsStatsStddevPopFields = {
  __typename?: 'tweets_stats_stddev_pop_fields';
  tweets?: Maybe<Scalars['Float']['output']>;
  tweets_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type TweetsStatsStddevSampFields = {
  __typename?: 'tweets_stats_stddev_samp_fields';
  tweets?: Maybe<Scalars['Float']['output']>;
  tweets_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type TweetsStatsSumFields = {
  __typename?: 'tweets_stats_sum_fields';
  tweets?: Maybe<Scalars['numeric']['output']>;
  tweets_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type TweetsStatsVarPopFields = {
  __typename?: 'tweets_stats_var_pop_fields';
  tweets?: Maybe<Scalars['Float']['output']>;
  tweets_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type TweetsStatsVarSampFields = {
  __typename?: 'tweets_stats_var_samp_fields';
  tweets?: Maybe<Scalars['Float']['output']>;
  tweets_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type TweetsStatsVarianceFields = {
  __typename?: 'tweets_stats_variance_fields';
  tweets?: Maybe<Scalars['Float']['output']>;
  tweets_per_day?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "txs_ranked" */
export type TxsRanked = {
  __typename?: 'txs_ranked';
  height?: Maybe<Scalars['bigint']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** aggregated selection of "txs_ranked" */
export type TxsRankedAggregate = {
  __typename?: 'txs_ranked_aggregate';
  aggregate?: Maybe<TxsRankedAggregateFields>;
  nodes: Array<TxsRanked>;
};

/** aggregate fields of "txs_ranked" */
export type TxsRankedAggregateFields = {
  __typename?: 'txs_ranked_aggregate_fields';
  avg?: Maybe<TxsRankedAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<TxsRankedMaxFields>;
  min?: Maybe<TxsRankedMinFields>;
  stddev?: Maybe<TxsRankedStddevFields>;
  stddev_pop?: Maybe<TxsRankedStddevPopFields>;
  stddev_samp?: Maybe<TxsRankedStddevSampFields>;
  sum?: Maybe<TxsRankedSumFields>;
  var_pop?: Maybe<TxsRankedVarPopFields>;
  var_samp?: Maybe<TxsRankedVarSampFields>;
  variance?: Maybe<TxsRankedVarianceFields>;
};


/** aggregate fields of "txs_ranked" */
export type TxsRankedAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<TxsRankedSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type TxsRankedAvgFields = {
  __typename?: 'txs_ranked_avg_fields';
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "txs_ranked". All fields are combined with a logical 'AND'. */
export type TxsRankedBoolExp = {
  _and?: InputMaybe<Array<TxsRankedBoolExp>>;
  _not?: InputMaybe<TxsRankedBoolExp>;
  _or?: InputMaybe<Array<TxsRankedBoolExp>>;
  height?: InputMaybe<BigintComparisonExp>;
  neuron?: InputMaybe<StringComparisonExp>;
  rank?: InputMaybe<BigintComparisonExp>;
  type?: InputMaybe<StringComparisonExp>;
  week?: InputMaybe<DateComparisonExp>;
};

/** aggregate max on columns */
export type TxsRankedMaxFields = {
  __typename?: 'txs_ranked_max_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** aggregate min on columns */
export type TxsRankedMinFields = {
  __typename?: 'txs_ranked_min_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** Ordering options when selecting data from "txs_ranked". */
export type TxsRankedOrderBy = {
  height?: InputMaybe<OrderBy>;
  neuron?: InputMaybe<OrderBy>;
  rank?: InputMaybe<OrderBy>;
  type?: InputMaybe<OrderBy>;
  week?: InputMaybe<OrderBy>;
};

/** select columns of table "txs_ranked" */
export enum TxsRankedSelectColumn {
  /** column name */
  Height = 'height',
  /** column name */
  Neuron = 'neuron',
  /** column name */
  Rank = 'rank',
  /** column name */
  Type = 'type',
  /** column name */
  Week = 'week'
}

/** aggregate stddev on columns */
export type TxsRankedStddevFields = {
  __typename?: 'txs_ranked_stddev_fields';
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type TxsRankedStddevPopFields = {
  __typename?: 'txs_ranked_stddev_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type TxsRankedStddevSampFields = {
  __typename?: 'txs_ranked_stddev_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type TxsRankedSumFields = {
  __typename?: 'txs_ranked_sum_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type TxsRankedVarPopFields = {
  __typename?: 'txs_ranked_var_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type TxsRankedVarSampFields = {
  __typename?: 'txs_ranked_var_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type TxsRankedVarianceFields = {
  __typename?: 'txs_ranked_variance_fields';
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "txs_stats" */
export type TxsStats = {
  __typename?: 'txs_stats';
  date?: Maybe<Scalars['date']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  msg_type?: Maybe<Scalars['String']['output']>;
  pubkey?: Maybe<Scalars['jsonb']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
};


/** columns and relationships of "txs_stats" */
export type TxsStatsPubkeyArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "txs_stats" */
export type TxsStatsAggregate = {
  __typename?: 'txs_stats_aggregate';
  aggregate?: Maybe<TxsStatsAggregateFields>;
  nodes: Array<TxsStats>;
};

/** aggregate fields of "txs_stats" */
export type TxsStatsAggregateFields = {
  __typename?: 'txs_stats_aggregate_fields';
  avg?: Maybe<TxsStatsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<TxsStatsMaxFields>;
  min?: Maybe<TxsStatsMinFields>;
  stddev?: Maybe<TxsStatsStddevFields>;
  stddev_pop?: Maybe<TxsStatsStddevPopFields>;
  stddev_samp?: Maybe<TxsStatsStddevSampFields>;
  sum?: Maybe<TxsStatsSumFields>;
  var_pop?: Maybe<TxsStatsVarPopFields>;
  var_samp?: Maybe<TxsStatsVarSampFields>;
  variance?: Maybe<TxsStatsVarianceFields>;
};


/** aggregate fields of "txs_stats" */
export type TxsStatsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<TxsStatsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type TxsStatsAvgFields = {
  __typename?: 'txs_stats_avg_fields';
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "txs_stats". All fields are combined with a logical 'AND'. */
export type TxsStatsBoolExp = {
  _and?: InputMaybe<Array<TxsStatsBoolExp>>;
  _not?: InputMaybe<TxsStatsBoolExp>;
  _or?: InputMaybe<Array<TxsStatsBoolExp>>;
  date?: InputMaybe<DateComparisonExp>;
  height?: InputMaybe<BigintComparisonExp>;
  msg_type?: InputMaybe<StringComparisonExp>;
  pubkey?: InputMaybe<JsonbComparisonExp>;
  rank?: InputMaybe<BigintComparisonExp>;
};

/** aggregate max on columns */
export type TxsStatsMaxFields = {
  __typename?: 'txs_stats_max_fields';
  date?: Maybe<Scalars['date']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  msg_type?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type TxsStatsMinFields = {
  __typename?: 'txs_stats_min_fields';
  date?: Maybe<Scalars['date']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  msg_type?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "txs_stats". */
export type TxsStatsOrderBy = {
  date?: InputMaybe<OrderBy>;
  height?: InputMaybe<OrderBy>;
  msg_type?: InputMaybe<OrderBy>;
  pubkey?: InputMaybe<OrderBy>;
  rank?: InputMaybe<OrderBy>;
};

/** select columns of table "txs_stats" */
export enum TxsStatsSelectColumn {
  /** column name */
  Date = 'date',
  /** column name */
  Height = 'height',
  /** column name */
  MsgType = 'msg_type',
  /** column name */
  Pubkey = 'pubkey',
  /** column name */
  Rank = 'rank'
}

/** aggregate stddev on columns */
export type TxsStatsStddevFields = {
  __typename?: 'txs_stats_stddev_fields';
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type TxsStatsStddevPopFields = {
  __typename?: 'txs_stats_stddev_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type TxsStatsStddevSampFields = {
  __typename?: 'txs_stats_stddev_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type TxsStatsSumFields = {
  __typename?: 'txs_stats_sum_fields';
  height?: Maybe<Scalars['bigint']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type TxsStatsVarPopFields = {
  __typename?: 'txs_stats_var_pop_fields';
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type TxsStatsVarSampFields = {
  __typename?: 'txs_stats_var_samp_fields';
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type TxsStatsVarianceFields = {
  __typename?: 'txs_stats_variance_fields';
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "uptime" */
export type Uptime = {
  __typename?: 'uptime';
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  pre_commits?: Maybe<Scalars['bigint']['output']>;
  uptime?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "uptime" */
export type UptimeAggregate = {
  __typename?: 'uptime_aggregate';
  aggregate?: Maybe<UptimeAggregateFields>;
  nodes: Array<Uptime>;
};

/** aggregate fields of "uptime" */
export type UptimeAggregateFields = {
  __typename?: 'uptime_aggregate_fields';
  avg?: Maybe<UptimeAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<UptimeMaxFields>;
  min?: Maybe<UptimeMinFields>;
  stddev?: Maybe<UptimeStddevFields>;
  stddev_pop?: Maybe<UptimeStddevPopFields>;
  stddev_samp?: Maybe<UptimeStddevSampFields>;
  sum?: Maybe<UptimeSumFields>;
  var_pop?: Maybe<UptimeVarPopFields>;
  var_samp?: Maybe<UptimeVarSampFields>;
  variance?: Maybe<UptimeVarianceFields>;
};


/** aggregate fields of "uptime" */
export type UptimeAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<UptimeSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type UptimeAvgFields = {
  __typename?: 'uptime_avg_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
  uptime?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "uptime". All fields are combined with a logical 'AND'. */
export type UptimeBoolExp = {
  _and?: InputMaybe<Array<UptimeBoolExp>>;
  _not?: InputMaybe<UptimeBoolExp>;
  _or?: InputMaybe<Array<UptimeBoolExp>>;
  consensus_address?: InputMaybe<StringComparisonExp>;
  consensus_pubkey?: InputMaybe<StringComparisonExp>;
  pre_commits?: InputMaybe<BigintComparisonExp>;
  uptime?: InputMaybe<NumericComparisonExp>;
};

/** aggregate max on columns */
export type UptimeMaxFields = {
  __typename?: 'uptime_max_fields';
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  pre_commits?: Maybe<Scalars['bigint']['output']>;
  uptime?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type UptimeMinFields = {
  __typename?: 'uptime_min_fields';
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  pre_commits?: Maybe<Scalars['bigint']['output']>;
  uptime?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "uptime". */
export type UptimeOrderBy = {
  consensus_address?: InputMaybe<OrderBy>;
  consensus_pubkey?: InputMaybe<OrderBy>;
  pre_commits?: InputMaybe<OrderBy>;
  uptime?: InputMaybe<OrderBy>;
};

/** select columns of table "uptime" */
export enum UptimeSelectColumn {
  /** column name */
  ConsensusAddress = 'consensus_address',
  /** column name */
  ConsensusPubkey = 'consensus_pubkey',
  /** column name */
  PreCommits = 'pre_commits',
  /** column name */
  Uptime = 'uptime'
}

/** aggregate stddev on columns */
export type UptimeStddevFields = {
  __typename?: 'uptime_stddev_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
  uptime?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type UptimeStddevPopFields = {
  __typename?: 'uptime_stddev_pop_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
  uptime?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type UptimeStddevSampFields = {
  __typename?: 'uptime_stddev_samp_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
  uptime?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type UptimeSumFields = {
  __typename?: 'uptime_sum_fields';
  pre_commits?: Maybe<Scalars['bigint']['output']>;
  uptime?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type UptimeVarPopFields = {
  __typename?: 'uptime_var_pop_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
  uptime?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type UptimeVarSampFields = {
  __typename?: 'uptime_var_samp_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
  uptime?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type UptimeVarianceFields = {
  __typename?: 'uptime_variance_fields';
  pre_commits?: Maybe<Scalars['Float']['output']>;
  uptime?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "validator" */
export type Validator = {
  __typename?: 'validator';
  /** An array relationship */
  blocks: Array<Block>;
  /** An aggregate relationship */
  blocks_aggregate: BlockAggregate;
  consensus_address: Scalars['String']['output'];
  consensus_pubkey: Scalars['String']['output'];
  /** An array relationship */
  pre_commits: Array<PreCommit>;
  /** An aggregate relationship */
  pre_commits_aggregate: PreCommitAggregate;
};


/** columns and relationships of "validator" */
export type ValidatorBlocksArgs = {
  distinct_on?: InputMaybe<Array<BlockSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockOrderBy>>;
  where?: InputMaybe<BlockBoolExp>;
};


/** columns and relationships of "validator" */
export type ValidatorBlocksAggregateArgs = {
  distinct_on?: InputMaybe<Array<BlockSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<BlockOrderBy>>;
  where?: InputMaybe<BlockBoolExp>;
};


/** columns and relationships of "validator" */
export type ValidatorPreCommitsArgs = {
  distinct_on?: InputMaybe<Array<PreCommitSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitOrderBy>>;
  where?: InputMaybe<PreCommitBoolExp>;
};


/** columns and relationships of "validator" */
export type ValidatorPreCommitsAggregateArgs = {
  distinct_on?: InputMaybe<Array<PreCommitSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<PreCommitOrderBy>>;
  where?: InputMaybe<PreCommitBoolExp>;
};

/** aggregated selection of "validator" */
export type ValidatorAggregate = {
  __typename?: 'validator_aggregate';
  aggregate?: Maybe<ValidatorAggregateFields>;
  nodes: Array<Validator>;
};

/** aggregate fields of "validator" */
export type ValidatorAggregateFields = {
  __typename?: 'validator_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<ValidatorMaxFields>;
  min?: Maybe<ValidatorMinFields>;
};


/** aggregate fields of "validator" */
export type ValidatorAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ValidatorSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "validator". All fields are combined with a logical 'AND'. */
export type ValidatorBoolExp = {
  _and?: InputMaybe<Array<ValidatorBoolExp>>;
  _not?: InputMaybe<ValidatorBoolExp>;
  _or?: InputMaybe<Array<ValidatorBoolExp>>;
  blocks?: InputMaybe<BlockBoolExp>;
  consensus_address?: InputMaybe<StringComparisonExp>;
  consensus_pubkey?: InputMaybe<StringComparisonExp>;
  pre_commits?: InputMaybe<PreCommitBoolExp>;
};

/** aggregate max on columns */
export type ValidatorMaxFields = {
  __typename?: 'validator_max_fields';
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type ValidatorMinFields = {
  __typename?: 'validator_min_fields';
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "validator". */
export type ValidatorOrderBy = {
  blocks_aggregate?: InputMaybe<BlockAggregateOrderBy>;
  consensus_address?: InputMaybe<OrderBy>;
  consensus_pubkey?: InputMaybe<OrderBy>;
  pre_commits_aggregate?: InputMaybe<PreCommitAggregateOrderBy>;
};

/** select columns of table "validator" */
export enum ValidatorSelectColumn {
  /** column name */
  ConsensusAddress = 'consensus_address',
  /** column name */
  ConsensusPubkey = 'consensus_pubkey'
}

/** columns and relationships of "volts_demand" */
export type VoltsDemand = {
  __typename?: 'volts_demand';
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
  volts?: Maybe<Scalars['float8']['output']>;
};

/** aggregated selection of "volts_demand" */
export type VoltsDemandAggregate = {
  __typename?: 'volts_demand_aggregate';
  aggregate?: Maybe<VoltsDemandAggregateFields>;
  nodes: Array<VoltsDemand>;
};

/** aggregate fields of "volts_demand" */
export type VoltsDemandAggregateFields = {
  __typename?: 'volts_demand_aggregate_fields';
  avg?: Maybe<VoltsDemandAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<VoltsDemandMaxFields>;
  min?: Maybe<VoltsDemandMinFields>;
  stddev?: Maybe<VoltsDemandStddevFields>;
  stddev_pop?: Maybe<VoltsDemandStddevPopFields>;
  stddev_samp?: Maybe<VoltsDemandStddevSampFields>;
  sum?: Maybe<VoltsDemandSumFields>;
  var_pop?: Maybe<VoltsDemandVarPopFields>;
  var_samp?: Maybe<VoltsDemandVarSampFields>;
  variance?: Maybe<VoltsDemandVarianceFields>;
};


/** aggregate fields of "volts_demand" */
export type VoltsDemandAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<VoltsDemandSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type VoltsDemandAvgFields = {
  __typename?: 'volts_demand_avg_fields';
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
  volts?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "volts_demand". All fields are combined with a logical 'AND'. */
export type VoltsDemandBoolExp = {
  _and?: InputMaybe<Array<VoltsDemandBoolExp>>;
  _not?: InputMaybe<VoltsDemandBoolExp>;
  _or?: InputMaybe<Array<VoltsDemandBoolExp>>;
  cyberlinks_per_day?: InputMaybe<BigintComparisonExp>;
  date?: InputMaybe<DateComparisonExp>;
  volts?: InputMaybe<Float8ComparisonExp>;
};

/** aggregate max on columns */
export type VoltsDemandMaxFields = {
  __typename?: 'volts_demand_max_fields';
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
  volts?: Maybe<Scalars['float8']['output']>;
};

/** aggregate min on columns */
export type VoltsDemandMinFields = {
  __typename?: 'volts_demand_min_fields';
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
  volts?: Maybe<Scalars['float8']['output']>;
};

/** Ordering options when selecting data from "volts_demand". */
export type VoltsDemandOrderBy = {
  cyberlinks_per_day?: InputMaybe<OrderBy>;
  date?: InputMaybe<OrderBy>;
  volts?: InputMaybe<OrderBy>;
};

/** select columns of table "volts_demand" */
export enum VoltsDemandSelectColumn {
  /** column name */
  CyberlinksPerDay = 'cyberlinks_per_day',
  /** column name */
  Date = 'date',
  /** column name */
  Volts = 'volts'
}

/** aggregate stddev on columns */
export type VoltsDemandStddevFields = {
  __typename?: 'volts_demand_stddev_fields';
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
  volts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type VoltsDemandStddevPopFields = {
  __typename?: 'volts_demand_stddev_pop_fields';
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
  volts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type VoltsDemandStddevSampFields = {
  __typename?: 'volts_demand_stddev_samp_fields';
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
  volts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type VoltsDemandSumFields = {
  __typename?: 'volts_demand_sum_fields';
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
  volts?: Maybe<Scalars['float8']['output']>;
};

/** aggregate var_pop on columns */
export type VoltsDemandVarPopFields = {
  __typename?: 'volts_demand_var_pop_fields';
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
  volts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type VoltsDemandVarSampFields = {
  __typename?: 'volts_demand_var_samp_fields';
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
  volts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type VoltsDemandVarianceFields = {
  __typename?: 'volts_demand_variance_fields';
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
  volts?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "volts_stats" */
export type VoltsStats = {
  __typename?: 'volts_stats';
  date?: Maybe<Scalars['date']['output']>;
  volts?: Maybe<Scalars['float8']['output']>;
  volts_per_day?: Maybe<Scalars['float8']['output']>;
};

/** aggregated selection of "volts_stats" */
export type VoltsStatsAggregate = {
  __typename?: 'volts_stats_aggregate';
  aggregate?: Maybe<VoltsStatsAggregateFields>;
  nodes: Array<VoltsStats>;
};

/** aggregate fields of "volts_stats" */
export type VoltsStatsAggregateFields = {
  __typename?: 'volts_stats_aggregate_fields';
  avg?: Maybe<VoltsStatsAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<VoltsStatsMaxFields>;
  min?: Maybe<VoltsStatsMinFields>;
  stddev?: Maybe<VoltsStatsStddevFields>;
  stddev_pop?: Maybe<VoltsStatsStddevPopFields>;
  stddev_samp?: Maybe<VoltsStatsStddevSampFields>;
  sum?: Maybe<VoltsStatsSumFields>;
  var_pop?: Maybe<VoltsStatsVarPopFields>;
  var_samp?: Maybe<VoltsStatsVarSampFields>;
  variance?: Maybe<VoltsStatsVarianceFields>;
};


/** aggregate fields of "volts_stats" */
export type VoltsStatsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<VoltsStatsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type VoltsStatsAvgFields = {
  __typename?: 'volts_stats_avg_fields';
  volts?: Maybe<Scalars['Float']['output']>;
  volts_per_day?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "volts_stats". All fields are combined with a logical 'AND'. */
export type VoltsStatsBoolExp = {
  _and?: InputMaybe<Array<VoltsStatsBoolExp>>;
  _not?: InputMaybe<VoltsStatsBoolExp>;
  _or?: InputMaybe<Array<VoltsStatsBoolExp>>;
  date?: InputMaybe<DateComparisonExp>;
  volts?: InputMaybe<Float8ComparisonExp>;
  volts_per_day?: InputMaybe<Float8ComparisonExp>;
};

/** aggregate max on columns */
export type VoltsStatsMaxFields = {
  __typename?: 'volts_stats_max_fields';
  date?: Maybe<Scalars['date']['output']>;
  volts?: Maybe<Scalars['float8']['output']>;
  volts_per_day?: Maybe<Scalars['float8']['output']>;
};

/** aggregate min on columns */
export type VoltsStatsMinFields = {
  __typename?: 'volts_stats_min_fields';
  date?: Maybe<Scalars['date']['output']>;
  volts?: Maybe<Scalars['float8']['output']>;
  volts_per_day?: Maybe<Scalars['float8']['output']>;
};

/** Ordering options when selecting data from "volts_stats". */
export type VoltsStatsOrderBy = {
  date?: InputMaybe<OrderBy>;
  volts?: InputMaybe<OrderBy>;
  volts_per_day?: InputMaybe<OrderBy>;
};

/** select columns of table "volts_stats" */
export enum VoltsStatsSelectColumn {
  /** column name */
  Date = 'date',
  /** column name */
  Volts = 'volts',
  /** column name */
  VoltsPerDay = 'volts_per_day'
}

/** aggregate stddev on columns */
export type VoltsStatsStddevFields = {
  __typename?: 'volts_stats_stddev_fields';
  volts?: Maybe<Scalars['Float']['output']>;
  volts_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type VoltsStatsStddevPopFields = {
  __typename?: 'volts_stats_stddev_pop_fields';
  volts?: Maybe<Scalars['Float']['output']>;
  volts_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type VoltsStatsStddevSampFields = {
  __typename?: 'volts_stats_stddev_samp_fields';
  volts?: Maybe<Scalars['Float']['output']>;
  volts_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type VoltsStatsSumFields = {
  __typename?: 'volts_stats_sum_fields';
  volts?: Maybe<Scalars['float8']['output']>;
  volts_per_day?: Maybe<Scalars['float8']['output']>;
};

/** aggregate var_pop on columns */
export type VoltsStatsVarPopFields = {
  __typename?: 'volts_stats_var_pop_fields';
  volts?: Maybe<Scalars['Float']['output']>;
  volts_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type VoltsStatsVarSampFields = {
  __typename?: 'volts_stats_var_samp_fields';
  volts?: Maybe<Scalars['Float']['output']>;
  volts_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type VoltsStatsVarianceFields = {
  __typename?: 'volts_stats_variance_fields';
  volts?: Maybe<Scalars['Float']['output']>;
  volts_per_day?: Maybe<Scalars['Float']['output']>;
};

export type TransactionsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TransactionsSubscription = { __typename?: 'subscription_root', transaction: Array<{ __typename?: 'transaction', success: boolean, messages: any, height: any, hash: string }> };

export type MessagesByAddressQueryVariables = Exact<{
  address?: InputMaybe<Scalars['_text']['input']>;
  limit?: InputMaybe<Scalars['bigint']['input']>;
  offset?: InputMaybe<Scalars['bigint']['input']>;
}>;


export type MessagesByAddressQuery = { __typename?: 'query_root', messages_by_address: Array<{ __typename?: 'message', transaction_hash: string, value: any, type: string, transaction: { __typename?: 'transaction', success: boolean, block: { __typename?: 'block', timestamp: any } } }> };


export const TransactionsDocument = gql`
    subscription Transactions {
  transaction(offset: 0, limit: 200, order_by: {height: desc}) {
    success
    messages
    height
    hash
  }
}
    `;

/**
 * __useTransactionsSubscription__
 *
 * To run a query within a React component, call `useTransactionsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTransactionsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useTransactionsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<TransactionsSubscription, TransactionsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TransactionsSubscription, TransactionsSubscriptionVariables>(TransactionsDocument, options);
      }
export type TransactionsSubscriptionHookResult = ReturnType<typeof useTransactionsSubscription>;
export type TransactionsSubscriptionResult = Apollo.SubscriptionResult<TransactionsSubscription>;
export const MessagesByAddressDocument = gql`
    query MessagesByAddress($address: _text, $limit: bigint, $offset: bigint) {
  messages_by_address(
    args: {addresses: $address, limit: $limit, offset: $offset, types: "{}"}
    order_by: {transaction: {block: {height: desc}}}
  ) {
    transaction_hash
    value
    transaction {
      success
      block {
        timestamp
      }
    }
    type
  }
}
    `;

/**
 * __useMessagesByAddressQuery__
 *
 * To run a query within a React component, call `useMessagesByAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesByAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesByAddressQuery({
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useMessagesByAddressQuery(baseOptions?: Apollo.QueryHookOptions<MessagesByAddressQuery, MessagesByAddressQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MessagesByAddressQuery, MessagesByAddressQueryVariables>(MessagesByAddressDocument, options);
      }
export function useMessagesByAddressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessagesByAddressQuery, MessagesByAddressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MessagesByAddressQuery, MessagesByAddressQueryVariables>(MessagesByAddressDocument, options);
        }
export function useMessagesByAddressSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MessagesByAddressQuery, MessagesByAddressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MessagesByAddressQuery, MessagesByAddressQueryVariables>(MessagesByAddressDocument, options);
        }
export type MessagesByAddressQueryHookResult = ReturnType<typeof useMessagesByAddressQuery>;
export type MessagesByAddressLazyQueryHookResult = ReturnType<typeof useMessagesByAddressLazyQuery>;
export type MessagesByAddressSuspenseQueryHookResult = ReturnType<typeof useMessagesByAddressSuspenseQuery>;
export type MessagesByAddressQueryResult = Apollo.QueryResult<MessagesByAddressQuery, MessagesByAddressQueryVariables>;