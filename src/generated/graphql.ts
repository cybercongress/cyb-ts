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
export type Boolean_Comparison_Exp = {
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
export type Int_Comparison_Exp = {
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
export type String_Comparison_Exp = {
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
export type _Coin_Comparison_Exp = {
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
export type _Text_Comparison_Exp = {
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
export type _Transaction = {
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
export type _TransactionFeeArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "_transaction" */
export type _TransactionLogsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "_transaction" */
export type _TransactionMessagesArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "_transaction" */
export type _TransactionSigner_InfosArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "_transaction" */
export type _TransactionValueArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "_transaction" */
export type _Transaction_Aggregate = {
  aggregate?: Maybe<_Transaction_Aggregate_Fields>;
  nodes: Array<_Transaction>;
};

/** aggregate fields of "_transaction" */
export type _Transaction_Aggregate_Fields = {
  avg?: Maybe<_Transaction_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<_Transaction_Max_Fields>;
  min?: Maybe<_Transaction_Min_Fields>;
  stddev?: Maybe<_Transaction_Stddev_Fields>;
  stddev_pop?: Maybe<_Transaction_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<_Transaction_Stddev_Samp_Fields>;
  sum?: Maybe<_Transaction_Sum_Fields>;
  var_pop?: Maybe<_Transaction_Var_Pop_Fields>;
  var_samp?: Maybe<_Transaction_Var_Samp_Fields>;
  variance?: Maybe<_Transaction_Variance_Fields>;
};


/** aggregate fields of "_transaction" */
export type _Transaction_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<_Transaction_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type _Transaction_Avg_Fields = {
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "_transaction". All fields are combined with a logical 'AND'. */
export type _Transaction_Bool_Exp = {
  _and?: InputMaybe<Array<_Transaction_Bool_Exp>>;
  _not?: InputMaybe<_Transaction_Bool_Exp>;
  _or?: InputMaybe<Array<_Transaction_Bool_Exp>>;
  fee?: InputMaybe<Jsonb_Comparison_Exp>;
  gas_used?: InputMaybe<Bigint_Comparison_Exp>;
  gas_wanted?: InputMaybe<Bigint_Comparison_Exp>;
  hash?: InputMaybe<String_Comparison_Exp>;
  height?: InputMaybe<Bigint_Comparison_Exp>;
  index?: InputMaybe<Bigint_Comparison_Exp>;
  involved_accounts_addresses?: InputMaybe<_Text_Comparison_Exp>;
  logs?: InputMaybe<Jsonb_Comparison_Exp>;
  memo?: InputMaybe<String_Comparison_Exp>;
  messages?: InputMaybe<Jsonb_Comparison_Exp>;
  raw_log?: InputMaybe<String_Comparison_Exp>;
  signatures?: InputMaybe<_Text_Comparison_Exp>;
  signer_infos?: InputMaybe<Jsonb_Comparison_Exp>;
  subject1?: InputMaybe<String_Comparison_Exp>;
  subject2?: InputMaybe<String_Comparison_Exp>;
  success?: InputMaybe<Boolean_Comparison_Exp>;
  transaction_hash?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** aggregate max on columns */
export type _Transaction_Max_Fields = {
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
export type _Transaction_Min_Fields = {
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
export type _Transaction_Order_By = {
  fee?: InputMaybe<Order_By>;
  gas_used?: InputMaybe<Order_By>;
  gas_wanted?: InputMaybe<Order_By>;
  hash?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  index?: InputMaybe<Order_By>;
  involved_accounts_addresses?: InputMaybe<Order_By>;
  logs?: InputMaybe<Order_By>;
  memo?: InputMaybe<Order_By>;
  messages?: InputMaybe<Order_By>;
  raw_log?: InputMaybe<Order_By>;
  signatures?: InputMaybe<Order_By>;
  signer_infos?: InputMaybe<Order_By>;
  subject1?: InputMaybe<Order_By>;
  subject2?: InputMaybe<Order_By>;
  success?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** select columns of table "_transaction" */
export enum _Transaction_Select_Column {
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
export type _Transaction_Stddev_Fields = {
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type _Transaction_Stddev_Pop_Fields = {
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type _Transaction_Stddev_Samp_Fields = {
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type _Transaction_Sum_Fields = {
  gas_used?: Maybe<Scalars['bigint']['output']>;
  gas_wanted?: Maybe<Scalars['bigint']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  index?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type _Transaction_Var_Pop_Fields = {
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type _Transaction_Var_Samp_Fields = {
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type _Transaction_Variance_Fields = {
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  index?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "_uptime_temp" */
export type _Uptime_Temp = {
  pre_commits?: Maybe<Scalars['bigint']['output']>;
  validator_address?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "_uptime_temp" */
export type _Uptime_Temp_Aggregate = {
  aggregate?: Maybe<_Uptime_Temp_Aggregate_Fields>;
  nodes: Array<_Uptime_Temp>;
};

/** aggregate fields of "_uptime_temp" */
export type _Uptime_Temp_Aggregate_Fields = {
  avg?: Maybe<_Uptime_Temp_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<_Uptime_Temp_Max_Fields>;
  min?: Maybe<_Uptime_Temp_Min_Fields>;
  stddev?: Maybe<_Uptime_Temp_Stddev_Fields>;
  stddev_pop?: Maybe<_Uptime_Temp_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<_Uptime_Temp_Stddev_Samp_Fields>;
  sum?: Maybe<_Uptime_Temp_Sum_Fields>;
  var_pop?: Maybe<_Uptime_Temp_Var_Pop_Fields>;
  var_samp?: Maybe<_Uptime_Temp_Var_Samp_Fields>;
  variance?: Maybe<_Uptime_Temp_Variance_Fields>;
};


/** aggregate fields of "_uptime_temp" */
export type _Uptime_Temp_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<_Uptime_Temp_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type _Uptime_Temp_Avg_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "_uptime_temp". All fields are combined with a logical 'AND'. */
export type _Uptime_Temp_Bool_Exp = {
  _and?: InputMaybe<Array<_Uptime_Temp_Bool_Exp>>;
  _not?: InputMaybe<_Uptime_Temp_Bool_Exp>;
  _or?: InputMaybe<Array<_Uptime_Temp_Bool_Exp>>;
  pre_commits?: InputMaybe<Bigint_Comparison_Exp>;
  validator_address?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type _Uptime_Temp_Max_Fields = {
  pre_commits?: Maybe<Scalars['bigint']['output']>;
  validator_address?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type _Uptime_Temp_Min_Fields = {
  pre_commits?: Maybe<Scalars['bigint']['output']>;
  validator_address?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "_uptime_temp". */
export type _Uptime_Temp_Order_By = {
  pre_commits?: InputMaybe<Order_By>;
  validator_address?: InputMaybe<Order_By>;
};

/** select columns of table "_uptime_temp" */
export enum _Uptime_Temp_Select_Column {
  /** column name */
  PreCommits = 'pre_commits',
  /** column name */
  ValidatorAddress = 'validator_address'
}

/** aggregate stddev on columns */
export type _Uptime_Temp_Stddev_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type _Uptime_Temp_Stddev_Pop_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type _Uptime_Temp_Stddev_Samp_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type _Uptime_Temp_Sum_Fields = {
  pre_commits?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type _Uptime_Temp_Var_Pop_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type _Uptime_Temp_Var_Samp_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type _Uptime_Temp_Variance_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "account" */
export type Account = {
  /** An object relationship */
  account_balance?: Maybe<Account_Balance>;
  address: Scalars['String']['output'];
  /** fetch data from the table: "cyberlinks" */
  cyberlinks: Array<Cyberlinks>;
  /** An aggregate relationship */
  cyberlinks_aggregate: Cyberlinks_Aggregate;
  /** An array relationship */
  investmints: Array<Investmints>;
  /** An aggregate relationship */
  investmints_aggregate: Investmints_Aggregate;
  /** An array relationship */
  particles: Array<Particles>;
  /** An aggregate relationship */
  particles_aggregate: Particles_Aggregate;
  /** An array relationship */
  routes: Array<Routes>;
  /** An array relationship */
  routesBySource: Array<Routes>;
  /** An aggregate relationship */
  routesBySource_aggregate: Routes_Aggregate;
  /** An aggregate relationship */
  routes_aggregate: Routes_Aggregate;
};


/** columns and relationships of "account" */
export type AccountCyberlinksArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Order_By>>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
};


/** columns and relationships of "account" */
export type AccountCyberlinks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Order_By>>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
};


/** columns and relationships of "account" */
export type AccountInvestmintsArgs = {
  distinct_on?: InputMaybe<Array<Investmints_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Investmints_Order_By>>;
  where?: InputMaybe<Investmints_Bool_Exp>;
};


/** columns and relationships of "account" */
export type AccountInvestmints_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Investmints_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Investmints_Order_By>>;
  where?: InputMaybe<Investmints_Bool_Exp>;
};


/** columns and relationships of "account" */
export type AccountParticlesArgs = {
  distinct_on?: InputMaybe<Array<Particles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Particles_Order_By>>;
  where?: InputMaybe<Particles_Bool_Exp>;
};


/** columns and relationships of "account" */
export type AccountParticles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Particles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Particles_Order_By>>;
  where?: InputMaybe<Particles_Bool_Exp>;
};


/** columns and relationships of "account" */
export type AccountRoutesArgs = {
  distinct_on?: InputMaybe<Array<Routes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Routes_Order_By>>;
  where?: InputMaybe<Routes_Bool_Exp>;
};


/** columns and relationships of "account" */
export type AccountRoutesBySourceArgs = {
  distinct_on?: InputMaybe<Array<Routes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Routes_Order_By>>;
  where?: InputMaybe<Routes_Bool_Exp>;
};


/** columns and relationships of "account" */
export type AccountRoutesBySource_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Routes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Routes_Order_By>>;
  where?: InputMaybe<Routes_Bool_Exp>;
};


/** columns and relationships of "account" */
export type AccountRoutes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Routes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Routes_Order_By>>;
  where?: InputMaybe<Routes_Bool_Exp>;
};

/** aggregated selection of "account" */
export type Account_Aggregate = {
  aggregate?: Maybe<Account_Aggregate_Fields>;
  nodes: Array<Account>;
};

/** aggregate fields of "account" */
export type Account_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Account_Max_Fields>;
  min?: Maybe<Account_Min_Fields>;
};


/** aggregate fields of "account" */
export type Account_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Account_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** columns and relationships of "account_balance" */
export type Account_Balance = {
  /** An object relationship */
  account: Account;
  address: Scalars['String']['output'];
  coins: Scalars['_coin']['output'];
  height: Scalars['bigint']['output'];
};

/** aggregated selection of "account_balance" */
export type Account_Balance_Aggregate = {
  aggregate?: Maybe<Account_Balance_Aggregate_Fields>;
  nodes: Array<Account_Balance>;
};

/** aggregate fields of "account_balance" */
export type Account_Balance_Aggregate_Fields = {
  avg?: Maybe<Account_Balance_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Account_Balance_Max_Fields>;
  min?: Maybe<Account_Balance_Min_Fields>;
  stddev?: Maybe<Account_Balance_Stddev_Fields>;
  stddev_pop?: Maybe<Account_Balance_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Account_Balance_Stddev_Samp_Fields>;
  sum?: Maybe<Account_Balance_Sum_Fields>;
  var_pop?: Maybe<Account_Balance_Var_Pop_Fields>;
  var_samp?: Maybe<Account_Balance_Var_Samp_Fields>;
  variance?: Maybe<Account_Balance_Variance_Fields>;
};


/** aggregate fields of "account_balance" */
export type Account_Balance_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Account_Balance_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Account_Balance_Avg_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "account_balance". All fields are combined with a logical 'AND'. */
export type Account_Balance_Bool_Exp = {
  _and?: InputMaybe<Array<Account_Balance_Bool_Exp>>;
  _not?: InputMaybe<Account_Balance_Bool_Exp>;
  _or?: InputMaybe<Array<Account_Balance_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  address?: InputMaybe<String_Comparison_Exp>;
  coins?: InputMaybe<_Coin_Comparison_Exp>;
  height?: InputMaybe<Bigint_Comparison_Exp>;
};

/** aggregate max on columns */
export type Account_Balance_Max_Fields = {
  address?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type Account_Balance_Min_Fields = {
  address?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "account_balance". */
export type Account_Balance_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  address?: InputMaybe<Order_By>;
  coins?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
};

/** select columns of table "account_balance" */
export enum Account_Balance_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  Coins = 'coins',
  /** column name */
  Height = 'height'
}

/** aggregate stddev on columns */
export type Account_Balance_Stddev_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Account_Balance_Stddev_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Account_Balance_Stddev_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Account_Balance_Sum_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Account_Balance_Var_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Account_Balance_Var_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Account_Balance_Variance_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "account". All fields are combined with a logical 'AND'. */
export type Account_Bool_Exp = {
  _and?: InputMaybe<Array<Account_Bool_Exp>>;
  _not?: InputMaybe<Account_Bool_Exp>;
  _or?: InputMaybe<Array<Account_Bool_Exp>>;
  account_balance?: InputMaybe<Account_Balance_Bool_Exp>;
  address?: InputMaybe<String_Comparison_Exp>;
  cyberlinks?: InputMaybe<Cyberlinks_Bool_Exp>;
  investmints?: InputMaybe<Investmints_Bool_Exp>;
  particles?: InputMaybe<Particles_Bool_Exp>;
  routes?: InputMaybe<Routes_Bool_Exp>;
  routesBySource?: InputMaybe<Routes_Bool_Exp>;
};

/** aggregate max on columns */
export type Account_Max_Fields = {
  address?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Account_Min_Fields = {
  address?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "account". */
export type Account_Order_By = {
  account_balance?: InputMaybe<Account_Balance_Order_By>;
  address?: InputMaybe<Order_By>;
  cyberlinks_aggregate?: InputMaybe<Cyberlinks_Aggregate_Order_By>;
  investmints_aggregate?: InputMaybe<Investmints_Aggregate_Order_By>;
  particles_aggregate?: InputMaybe<Particles_Aggregate_Order_By>;
  routesBySource_aggregate?: InputMaybe<Routes_Aggregate_Order_By>;
  routes_aggregate?: InputMaybe<Routes_Aggregate_Order_By>;
};

/** select columns of table "account" */
export enum Account_Select_Column {
  /** column name */
  Address = 'address'
}

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
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
  /** fetch data from the table: "cyberlinks" */
  cyberlinks: Array<Cyberlinks>;
  /** An aggregate relationship */
  cyberlinks_aggregate: Cyberlinks_Aggregate;
  hash: Scalars['String']['output'];
  height: Scalars['bigint']['output'];
  /** An array relationship */
  investmints: Array<Investmints>;
  /** An aggregate relationship */
  investmints_aggregate: Investmints_Aggregate;
  num_txs?: Maybe<Scalars['Int']['output']>;
  /** An array relationship */
  particles: Array<Particles>;
  /** An aggregate relationship */
  particles_aggregate: Particles_Aggregate;
  proposer_address?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  routes: Array<Routes>;
  /** An aggregate relationship */
  routes_aggregate: Routes_Aggregate;
  timestamp: Scalars['timestamp']['output'];
  total_gas?: Maybe<Scalars['bigint']['output']>;
  /** An array relationship */
  transactions: Array<Transaction>;
  /** An aggregate relationship */
  transactions_aggregate: Transaction_Aggregate;
  /** An object relationship */
  validator?: Maybe<Validator>;
};


/** columns and relationships of "block" */
export type BlockCyberlinksArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Order_By>>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
};


/** columns and relationships of "block" */
export type BlockCyberlinks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Order_By>>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
};


/** columns and relationships of "block" */
export type BlockInvestmintsArgs = {
  distinct_on?: InputMaybe<Array<Investmints_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Investmints_Order_By>>;
  where?: InputMaybe<Investmints_Bool_Exp>;
};


/** columns and relationships of "block" */
export type BlockInvestmints_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Investmints_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Investmints_Order_By>>;
  where?: InputMaybe<Investmints_Bool_Exp>;
};


/** columns and relationships of "block" */
export type BlockParticlesArgs = {
  distinct_on?: InputMaybe<Array<Particles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Particles_Order_By>>;
  where?: InputMaybe<Particles_Bool_Exp>;
};


/** columns and relationships of "block" */
export type BlockParticles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Particles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Particles_Order_By>>;
  where?: InputMaybe<Particles_Bool_Exp>;
};


/** columns and relationships of "block" */
export type BlockRoutesArgs = {
  distinct_on?: InputMaybe<Array<Routes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Routes_Order_By>>;
  where?: InputMaybe<Routes_Bool_Exp>;
};


/** columns and relationships of "block" */
export type BlockRoutes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Routes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Routes_Order_By>>;
  where?: InputMaybe<Routes_Bool_Exp>;
};


/** columns and relationships of "block" */
export type BlockTransactionsArgs = {
  distinct_on?: InputMaybe<Array<Transaction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_Order_By>>;
  where?: InputMaybe<Transaction_Bool_Exp>;
};


/** columns and relationships of "block" */
export type BlockTransactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transaction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_Order_By>>;
  where?: InputMaybe<Transaction_Bool_Exp>;
};

/** aggregated selection of "block" */
export type Block_Aggregate = {
  aggregate?: Maybe<Block_Aggregate_Fields>;
  nodes: Array<Block>;
};

/** aggregate fields of "block" */
export type Block_Aggregate_Fields = {
  avg?: Maybe<Block_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Block_Max_Fields>;
  min?: Maybe<Block_Min_Fields>;
  stddev?: Maybe<Block_Stddev_Fields>;
  stddev_pop?: Maybe<Block_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Block_Stddev_Samp_Fields>;
  sum?: Maybe<Block_Sum_Fields>;
  var_pop?: Maybe<Block_Var_Pop_Fields>;
  var_samp?: Maybe<Block_Var_Samp_Fields>;
  variance?: Maybe<Block_Variance_Fields>;
};


/** aggregate fields of "block" */
export type Block_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Block_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "block" */
export type Block_Aggregate_Order_By = {
  avg?: InputMaybe<Block_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Block_Max_Order_By>;
  min?: InputMaybe<Block_Min_Order_By>;
  stddev?: InputMaybe<Block_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Block_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Block_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Block_Sum_Order_By>;
  var_pop?: InputMaybe<Block_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Block_Var_Samp_Order_By>;
  variance?: InputMaybe<Block_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Block_Avg_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  num_txs?: Maybe<Scalars['Float']['output']>;
  total_gas?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "block" */
export type Block_Avg_Order_By = {
  height?: InputMaybe<Order_By>;
  num_txs?: InputMaybe<Order_By>;
  total_gas?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "block". All fields are combined with a logical 'AND'. */
export type Block_Bool_Exp = {
  _and?: InputMaybe<Array<Block_Bool_Exp>>;
  _not?: InputMaybe<Block_Bool_Exp>;
  _or?: InputMaybe<Array<Block_Bool_Exp>>;
  cyberlinks?: InputMaybe<Cyberlinks_Bool_Exp>;
  hash?: InputMaybe<String_Comparison_Exp>;
  height?: InputMaybe<Bigint_Comparison_Exp>;
  investmints?: InputMaybe<Investmints_Bool_Exp>;
  num_txs?: InputMaybe<Int_Comparison_Exp>;
  particles?: InputMaybe<Particles_Bool_Exp>;
  proposer_address?: InputMaybe<String_Comparison_Exp>;
  routes?: InputMaybe<Routes_Bool_Exp>;
  timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  total_gas?: InputMaybe<Bigint_Comparison_Exp>;
  transactions?: InputMaybe<Transaction_Bool_Exp>;
  validator?: InputMaybe<Validator_Bool_Exp>;
};

/** aggregate max on columns */
export type Block_Max_Fields = {
  hash?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  num_txs?: Maybe<Scalars['Int']['output']>;
  proposer_address?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  total_gas?: Maybe<Scalars['bigint']['output']>;
};

/** order by max() on columns of table "block" */
export type Block_Max_Order_By = {
  hash?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  num_txs?: InputMaybe<Order_By>;
  proposer_address?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  total_gas?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Block_Min_Fields = {
  hash?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  num_txs?: Maybe<Scalars['Int']['output']>;
  proposer_address?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  total_gas?: Maybe<Scalars['bigint']['output']>;
};

/** order by min() on columns of table "block" */
export type Block_Min_Order_By = {
  hash?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  num_txs?: InputMaybe<Order_By>;
  proposer_address?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  total_gas?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "block". */
export type Block_Order_By = {
  cyberlinks_aggregate?: InputMaybe<Cyberlinks_Aggregate_Order_By>;
  hash?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  investmints_aggregate?: InputMaybe<Investmints_Aggregate_Order_By>;
  num_txs?: InputMaybe<Order_By>;
  particles_aggregate?: InputMaybe<Particles_Aggregate_Order_By>;
  proposer_address?: InputMaybe<Order_By>;
  routes_aggregate?: InputMaybe<Routes_Aggregate_Order_By>;
  timestamp?: InputMaybe<Order_By>;
  total_gas?: InputMaybe<Order_By>;
  transactions_aggregate?: InputMaybe<Transaction_Aggregate_Order_By>;
  validator?: InputMaybe<Validator_Order_By>;
};

/** select columns of table "block" */
export enum Block_Select_Column {
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
export type Block_Stddev_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  num_txs?: Maybe<Scalars['Float']['output']>;
  total_gas?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "block" */
export type Block_Stddev_Order_By = {
  height?: InputMaybe<Order_By>;
  num_txs?: InputMaybe<Order_By>;
  total_gas?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Block_Stddev_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  num_txs?: Maybe<Scalars['Float']['output']>;
  total_gas?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "block" */
export type Block_Stddev_Pop_Order_By = {
  height?: InputMaybe<Order_By>;
  num_txs?: InputMaybe<Order_By>;
  total_gas?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Block_Stddev_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  num_txs?: Maybe<Scalars['Float']['output']>;
  total_gas?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "block" */
export type Block_Stddev_Samp_Order_By = {
  height?: InputMaybe<Order_By>;
  num_txs?: InputMaybe<Order_By>;
  total_gas?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Block_Sum_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  num_txs?: Maybe<Scalars['Int']['output']>;
  total_gas?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "block" */
export type Block_Sum_Order_By = {
  height?: InputMaybe<Order_By>;
  num_txs?: InputMaybe<Order_By>;
  total_gas?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Block_Var_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  num_txs?: Maybe<Scalars['Float']['output']>;
  total_gas?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "block" */
export type Block_Var_Pop_Order_By = {
  height?: InputMaybe<Order_By>;
  num_txs?: InputMaybe<Order_By>;
  total_gas?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Block_Var_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  num_txs?: Maybe<Scalars['Float']['output']>;
  total_gas?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "block" */
export type Block_Var_Samp_Order_By = {
  height?: InputMaybe<Order_By>;
  num_txs?: InputMaybe<Order_By>;
  total_gas?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Block_Variance_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  num_txs?: Maybe<Scalars['Float']['output']>;
  total_gas?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "block" */
export type Block_Variance_Order_By = {
  height?: InputMaybe<Order_By>;
  num_txs?: InputMaybe<Order_By>;
  total_gas?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "coin". All fields are combined with logical 'AND'. */
export type Coin_Comparison_Exp = {
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
export type Contracts_Aggregate = {
  aggregate?: Maybe<Contracts_Aggregate_Fields>;
  nodes: Array<Contracts>;
};

/** aggregate fields of "contracts" */
export type Contracts_Aggregate_Fields = {
  avg?: Maybe<Contracts_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Contracts_Max_Fields>;
  min?: Maybe<Contracts_Min_Fields>;
  stddev?: Maybe<Contracts_Stddev_Fields>;
  stddev_pop?: Maybe<Contracts_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Contracts_Stddev_Samp_Fields>;
  sum?: Maybe<Contracts_Sum_Fields>;
  var_pop?: Maybe<Contracts_Var_Pop_Fields>;
  var_samp?: Maybe<Contracts_Var_Samp_Fields>;
  variance?: Maybe<Contracts_Variance_Fields>;
};


/** aggregate fields of "contracts" */
export type Contracts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Contracts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Contracts_Avg_Fields = {
  code_id?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  gas?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  tx?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "contracts". All fields are combined with a logical 'AND'. */
export type Contracts_Bool_Exp = {
  _and?: InputMaybe<Array<Contracts_Bool_Exp>>;
  _not?: InputMaybe<Contracts_Bool_Exp>;
  _or?: InputMaybe<Array<Contracts_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  admin?: InputMaybe<String_Comparison_Exp>;
  code_id?: InputMaybe<Bigint_Comparison_Exp>;
  creation_time?: InputMaybe<String_Comparison_Exp>;
  creator?: InputMaybe<String_Comparison_Exp>;
  fees?: InputMaybe<Bigint_Comparison_Exp>;
  gas?: InputMaybe<Bigint_Comparison_Exp>;
  height?: InputMaybe<Bigint_Comparison_Exp>;
  label?: InputMaybe<String_Comparison_Exp>;
  tx?: InputMaybe<Bigint_Comparison_Exp>;
};

/** aggregate max on columns */
export type Contracts_Max_Fields = {
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
export type Contracts_Min_Fields = {
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
export type Contracts_Order_By = {
  address?: InputMaybe<Order_By>;
  admin?: InputMaybe<Order_By>;
  code_id?: InputMaybe<Order_By>;
  creation_time?: InputMaybe<Order_By>;
  creator?: InputMaybe<Order_By>;
  fees?: InputMaybe<Order_By>;
  gas?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  tx?: InputMaybe<Order_By>;
};

/** select columns of table "contracts" */
export enum Contracts_Select_Column {
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
export type Contracts_Stddev_Fields = {
  code_id?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  gas?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  tx?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Contracts_Stddev_Pop_Fields = {
  code_id?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  gas?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  tx?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Contracts_Stddev_Samp_Fields = {
  code_id?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  gas?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  tx?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Contracts_Sum_Fields = {
  code_id?: Maybe<Scalars['bigint']['output']>;
  fees?: Maybe<Scalars['bigint']['output']>;
  gas?: Maybe<Scalars['bigint']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  tx?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Contracts_Var_Pop_Fields = {
  code_id?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  gas?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  tx?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Contracts_Var_Samp_Fields = {
  code_id?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  gas?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  tx?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Contracts_Variance_Fields = {
  code_id?: Maybe<Scalars['Float']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  gas?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  tx?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "cyb_cohort" */
export type Cyb_Cohort = {
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
export type Cyb_Cohort_Aggregate = {
  aggregate?: Maybe<Cyb_Cohort_Aggregate_Fields>;
  nodes: Array<Cyb_Cohort>;
};

/** aggregate fields of "cyb_cohort" */
export type Cyb_Cohort_Aggregate_Fields = {
  avg?: Maybe<Cyb_Cohort_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Cyb_Cohort_Max_Fields>;
  min?: Maybe<Cyb_Cohort_Min_Fields>;
  stddev?: Maybe<Cyb_Cohort_Stddev_Fields>;
  stddev_pop?: Maybe<Cyb_Cohort_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cyb_Cohort_Stddev_Samp_Fields>;
  sum?: Maybe<Cyb_Cohort_Sum_Fields>;
  var_pop?: Maybe<Cyb_Cohort_Var_Pop_Fields>;
  var_samp?: Maybe<Cyb_Cohort_Var_Samp_Fields>;
  variance?: Maybe<Cyb_Cohort_Variance_Fields>;
};


/** aggregate fields of "cyb_cohort" */
export type Cyb_Cohort_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cyb_Cohort_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Cyb_Cohort_Avg_Fields = {
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
export type Cyb_Cohort_Bool_Exp = {
  _and?: InputMaybe<Array<Cyb_Cohort_Bool_Exp>>;
  _not?: InputMaybe<Cyb_Cohort_Bool_Exp>;
  _or?: InputMaybe<Array<Cyb_Cohort_Bool_Exp>>;
  cyberlink_10_percent?: InputMaybe<Float8_Comparison_Exp>;
  cyberlink_100_percent?: InputMaybe<Float8_Comparison_Exp>;
  cyberlink_percent?: InputMaybe<Float8_Comparison_Exp>;
  hero_hired_percent?: InputMaybe<Float8_Comparison_Exp>;
  investmint_percent?: InputMaybe<Float8_Comparison_Exp>;
  neurons_activated?: InputMaybe<Bigint_Comparison_Exp>;
  redelegation_percent?: InputMaybe<Float8_Comparison_Exp>;
  swap_percent?: InputMaybe<Float8_Comparison_Exp>;
  undelegation_percent?: InputMaybe<Float8_Comparison_Exp>;
  week?: InputMaybe<Date_Comparison_Exp>;
};

/** aggregate max on columns */
export type Cyb_Cohort_Max_Fields = {
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
export type Cyb_Cohort_Min_Fields = {
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
export type Cyb_Cohort_Order_By = {
  cyberlink_10_percent?: InputMaybe<Order_By>;
  cyberlink_100_percent?: InputMaybe<Order_By>;
  cyberlink_percent?: InputMaybe<Order_By>;
  hero_hired_percent?: InputMaybe<Order_By>;
  investmint_percent?: InputMaybe<Order_By>;
  neurons_activated?: InputMaybe<Order_By>;
  redelegation_percent?: InputMaybe<Order_By>;
  swap_percent?: InputMaybe<Order_By>;
  undelegation_percent?: InputMaybe<Order_By>;
  week?: InputMaybe<Order_By>;
};

/** select columns of table "cyb_cohort" */
export enum Cyb_Cohort_Select_Column {
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
export type Cyb_Cohort_Stddev_Fields = {
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
export type Cyb_Cohort_Stddev_Pop_Fields = {
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
export type Cyb_Cohort_Stddev_Samp_Fields = {
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
export type Cyb_Cohort_Sum_Fields = {
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
export type Cyb_Cohort_Var_Pop_Fields = {
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
export type Cyb_Cohort_Var_Samp_Fields = {
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
export type Cyb_Cohort_Variance_Fields = {
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
export type Cyb_New_Cohort = {
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
export type Cyb_New_Cohort_Aggregate = {
  aggregate?: Maybe<Cyb_New_Cohort_Aggregate_Fields>;
  nodes: Array<Cyb_New_Cohort>;
};

/** aggregate fields of "cyb_new_cohort" */
export type Cyb_New_Cohort_Aggregate_Fields = {
  avg?: Maybe<Cyb_New_Cohort_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Cyb_New_Cohort_Max_Fields>;
  min?: Maybe<Cyb_New_Cohort_Min_Fields>;
  stddev?: Maybe<Cyb_New_Cohort_Stddev_Fields>;
  stddev_pop?: Maybe<Cyb_New_Cohort_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cyb_New_Cohort_Stddev_Samp_Fields>;
  sum?: Maybe<Cyb_New_Cohort_Sum_Fields>;
  var_pop?: Maybe<Cyb_New_Cohort_Var_Pop_Fields>;
  var_samp?: Maybe<Cyb_New_Cohort_Var_Samp_Fields>;
  variance?: Maybe<Cyb_New_Cohort_Variance_Fields>;
};


/** aggregate fields of "cyb_new_cohort" */
export type Cyb_New_Cohort_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cyb_New_Cohort_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Cyb_New_Cohort_Avg_Fields = {
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activation?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "cyb_new_cohort". All fields are combined with a logical 'AND'. */
export type Cyb_New_Cohort_Bool_Exp = {
  _and?: InputMaybe<Array<Cyb_New_Cohort_Bool_Exp>>;
  _not?: InputMaybe<Cyb_New_Cohort_Bool_Exp>;
  _or?: InputMaybe<Array<Cyb_New_Cohort_Bool_Exp>>;
  cyberlink_10_percent?: InputMaybe<Float8_Comparison_Exp>;
  cyberlink_100_percent?: InputMaybe<Float8_Comparison_Exp>;
  cyberlink_percent?: InputMaybe<Float8_Comparison_Exp>;
  hero_hired_percent?: InputMaybe<Float8_Comparison_Exp>;
  investmint_percent?: InputMaybe<Float8_Comparison_Exp>;
  neuron_activation?: InputMaybe<Numeric_Comparison_Exp>;
  swap_percent?: InputMaybe<Float8_Comparison_Exp>;
  week?: InputMaybe<Date_Comparison_Exp>;
};

/** aggregate max on columns */
export type Cyb_New_Cohort_Max_Fields = {
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
export type Cyb_New_Cohort_Min_Fields = {
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
export type Cyb_New_Cohort_Order_By = {
  cyberlink_10_percent?: InputMaybe<Order_By>;
  cyberlink_100_percent?: InputMaybe<Order_By>;
  cyberlink_percent?: InputMaybe<Order_By>;
  hero_hired_percent?: InputMaybe<Order_By>;
  investmint_percent?: InputMaybe<Order_By>;
  neuron_activation?: InputMaybe<Order_By>;
  swap_percent?: InputMaybe<Order_By>;
  week?: InputMaybe<Order_By>;
};

/** select columns of table "cyb_new_cohort" */
export enum Cyb_New_Cohort_Select_Column {
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
export type Cyb_New_Cohort_Stddev_Fields = {
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activation?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Cyb_New_Cohort_Stddev_Pop_Fields = {
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activation?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Cyb_New_Cohort_Stddev_Samp_Fields = {
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activation?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Cyb_New_Cohort_Sum_Fields = {
  cyberlink_10_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['float8']['output']>;
  cyberlink_percent?: Maybe<Scalars['float8']['output']>;
  hero_hired_percent?: Maybe<Scalars['float8']['output']>;
  investmint_percent?: Maybe<Scalars['float8']['output']>;
  neuron_activation?: Maybe<Scalars['numeric']['output']>;
  swap_percent?: Maybe<Scalars['float8']['output']>;
};

/** aggregate var_pop on columns */
export type Cyb_New_Cohort_Var_Pop_Fields = {
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activation?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Cyb_New_Cohort_Var_Samp_Fields = {
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activation?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Cyb_New_Cohort_Variance_Fields = {
  cyberlink_10_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_100_percent?: Maybe<Scalars['Float']['output']>;
  cyberlink_percent?: Maybe<Scalars['Float']['output']>;
  hero_hired_percent?: Maybe<Scalars['Float']['output']>;
  investmint_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activation?: Maybe<Scalars['Float']['output']>;
  swap_percent?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "cyber_gift" */
export type Cyber_Gift = {
  address: Scalars['String']['output'];
  audience: Scalars['String']['output'];
  gift: Scalars['numeric']['output'];
  grade: Scalars['Int']['output'];
  segment: Scalars['String']['output'];
};

/** aggregated selection of "cyber_gift" */
export type Cyber_Gift_Aggregate = {
  aggregate?: Maybe<Cyber_Gift_Aggregate_Fields>;
  nodes: Array<Cyber_Gift>;
};

/** aggregate fields of "cyber_gift" */
export type Cyber_Gift_Aggregate_Fields = {
  avg?: Maybe<Cyber_Gift_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Cyber_Gift_Max_Fields>;
  min?: Maybe<Cyber_Gift_Min_Fields>;
  stddev?: Maybe<Cyber_Gift_Stddev_Fields>;
  stddev_pop?: Maybe<Cyber_Gift_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cyber_Gift_Stddev_Samp_Fields>;
  sum?: Maybe<Cyber_Gift_Sum_Fields>;
  var_pop?: Maybe<Cyber_Gift_Var_Pop_Fields>;
  var_samp?: Maybe<Cyber_Gift_Var_Samp_Fields>;
  variance?: Maybe<Cyber_Gift_Variance_Fields>;
};


/** aggregate fields of "cyber_gift" */
export type Cyber_Gift_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cyber_Gift_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Cyber_Gift_Avg_Fields = {
  gift?: Maybe<Scalars['Float']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "cyber_gift". All fields are combined with a logical 'AND'. */
export type Cyber_Gift_Bool_Exp = {
  _and?: InputMaybe<Array<Cyber_Gift_Bool_Exp>>;
  _not?: InputMaybe<Cyber_Gift_Bool_Exp>;
  _or?: InputMaybe<Array<Cyber_Gift_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  audience?: InputMaybe<String_Comparison_Exp>;
  gift?: InputMaybe<Numeric_Comparison_Exp>;
  grade?: InputMaybe<Int_Comparison_Exp>;
  segment?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Cyber_Gift_Max_Fields = {
  address?: Maybe<Scalars['String']['output']>;
  audience?: Maybe<Scalars['String']['output']>;
  gift?: Maybe<Scalars['numeric']['output']>;
  grade?: Maybe<Scalars['Int']['output']>;
  segment?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Cyber_Gift_Min_Fields = {
  address?: Maybe<Scalars['String']['output']>;
  audience?: Maybe<Scalars['String']['output']>;
  gift?: Maybe<Scalars['numeric']['output']>;
  grade?: Maybe<Scalars['Int']['output']>;
  segment?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "cyber_gift". */
export type Cyber_Gift_Order_By = {
  address?: InputMaybe<Order_By>;
  audience?: InputMaybe<Order_By>;
  gift?: InputMaybe<Order_By>;
  grade?: InputMaybe<Order_By>;
  segment?: InputMaybe<Order_By>;
};

/** columns and relationships of "cyber_gift_proofs" */
export type Cyber_Gift_Proofs = {
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  details?: Maybe<Scalars['json']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "cyber_gift_proofs" */
export type Cyber_Gift_ProofsDetailsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "cyber_gift_proofs" */
export type Cyber_Gift_Proofs_Aggregate = {
  aggregate?: Maybe<Cyber_Gift_Proofs_Aggregate_Fields>;
  nodes: Array<Cyber_Gift_Proofs>;
};

/** aggregate fields of "cyber_gift_proofs" */
export type Cyber_Gift_Proofs_Aggregate_Fields = {
  avg?: Maybe<Cyber_Gift_Proofs_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Cyber_Gift_Proofs_Max_Fields>;
  min?: Maybe<Cyber_Gift_Proofs_Min_Fields>;
  stddev?: Maybe<Cyber_Gift_Proofs_Stddev_Fields>;
  stddev_pop?: Maybe<Cyber_Gift_Proofs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cyber_Gift_Proofs_Stddev_Samp_Fields>;
  sum?: Maybe<Cyber_Gift_Proofs_Sum_Fields>;
  var_pop?: Maybe<Cyber_Gift_Proofs_Var_Pop_Fields>;
  var_samp?: Maybe<Cyber_Gift_Proofs_Var_Samp_Fields>;
  variance?: Maybe<Cyber_Gift_Proofs_Variance_Fields>;
};


/** aggregate fields of "cyber_gift_proofs" */
export type Cyber_Gift_Proofs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cyber_Gift_Proofs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Cyber_Gift_Proofs_Avg_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "cyber_gift_proofs". All fields are combined with a logical 'AND'. */
export type Cyber_Gift_Proofs_Bool_Exp = {
  _and?: InputMaybe<Array<Cyber_Gift_Proofs_Bool_Exp>>;
  _not?: InputMaybe<Cyber_Gift_Proofs_Bool_Exp>;
  _or?: InputMaybe<Array<Cyber_Gift_Proofs_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  amount?: InputMaybe<Bigint_Comparison_Exp>;
  details?: InputMaybe<Json_Comparison_Exp>;
  proof?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Cyber_Gift_Proofs_Max_Fields = {
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Cyber_Gift_Proofs_Min_Fields = {
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "cyber_gift_proofs". */
export type Cyber_Gift_Proofs_Order_By = {
  address?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  details?: InputMaybe<Order_By>;
  proof?: InputMaybe<Order_By>;
};

/** select columns of table "cyber_gift_proofs" */
export enum Cyber_Gift_Proofs_Select_Column {
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
export type Cyber_Gift_Proofs_Stddev_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Cyber_Gift_Proofs_Stddev_Pop_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Cyber_Gift_Proofs_Stddev_Samp_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Cyber_Gift_Proofs_Sum_Fields = {
  amount?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Cyber_Gift_Proofs_Var_Pop_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Cyber_Gift_Proofs_Var_Samp_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Cyber_Gift_Proofs_Variance_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** select columns of table "cyber_gift" */
export enum Cyber_Gift_Select_Column {
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
export type Cyber_Gift_Stddev_Fields = {
  gift?: Maybe<Scalars['Float']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Cyber_Gift_Stddev_Pop_Fields = {
  gift?: Maybe<Scalars['Float']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Cyber_Gift_Stddev_Samp_Fields = {
  gift?: Maybe<Scalars['Float']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Cyber_Gift_Sum_Fields = {
  gift?: Maybe<Scalars['numeric']['output']>;
  grade?: Maybe<Scalars['Int']['output']>;
};

/** aggregate var_pop on columns */
export type Cyber_Gift_Var_Pop_Fields = {
  gift?: Maybe<Scalars['Float']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Cyber_Gift_Var_Samp_Fields = {
  gift?: Maybe<Scalars['Float']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Cyber_Gift_Variance_Fields = {
  gift?: Maybe<Scalars['Float']['output']>;
  grade?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "cyberlinks" */
export type Cyberlinks = {
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
export type Cyberlinks_Aggregate = {
  aggregate?: Maybe<Cyberlinks_Aggregate_Fields>;
  nodes: Array<Cyberlinks>;
};

/** aggregate fields of "cyberlinks" */
export type Cyberlinks_Aggregate_Fields = {
  avg?: Maybe<Cyberlinks_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Cyberlinks_Max_Fields>;
  min?: Maybe<Cyberlinks_Min_Fields>;
  stddev?: Maybe<Cyberlinks_Stddev_Fields>;
  stddev_pop?: Maybe<Cyberlinks_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cyberlinks_Stddev_Samp_Fields>;
  sum?: Maybe<Cyberlinks_Sum_Fields>;
  var_pop?: Maybe<Cyberlinks_Var_Pop_Fields>;
  var_samp?: Maybe<Cyberlinks_Var_Samp_Fields>;
  variance?: Maybe<Cyberlinks_Variance_Fields>;
};


/** aggregate fields of "cyberlinks" */
export type Cyberlinks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "cyberlinks" */
export type Cyberlinks_Aggregate_Order_By = {
  avg?: InputMaybe<Cyberlinks_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Cyberlinks_Max_Order_By>;
  min?: InputMaybe<Cyberlinks_Min_Order_By>;
  stddev?: InputMaybe<Cyberlinks_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Cyberlinks_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Cyberlinks_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Cyberlinks_Sum_Order_By>;
  var_pop?: InputMaybe<Cyberlinks_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Cyberlinks_Var_Samp_Order_By>;
  variance?: InputMaybe<Cyberlinks_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Cyberlinks_Avg_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "cyberlinks" */
export type Cyberlinks_Avg_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "cyberlinks". All fields are combined with a logical 'AND'. */
export type Cyberlinks_Bool_Exp = {
  _and?: InputMaybe<Array<Cyberlinks_Bool_Exp>>;
  _not?: InputMaybe<Cyberlinks_Bool_Exp>;
  _or?: InputMaybe<Array<Cyberlinks_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  block?: InputMaybe<Block_Bool_Exp>;
  from?: InputMaybe<Particles_Bool_Exp>;
  height?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  neuron?: InputMaybe<String_Comparison_Exp>;
  particle_from?: InputMaybe<String_Comparison_Exp>;
  particle_to?: InputMaybe<String_Comparison_Exp>;
  timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  to?: InputMaybe<Particles_Bool_Exp>;
  transaction?: InputMaybe<Transaction_Bool_Exp>;
  transaction_hash?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Cyberlinks_Max_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  particle_from?: Maybe<Scalars['String']['output']>;
  particle_to?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "cyberlinks" */
export type Cyberlinks_Max_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  neuron?: InputMaybe<Order_By>;
  particle_from?: InputMaybe<Order_By>;
  particle_to?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Cyberlinks_Min_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  particle_from?: Maybe<Scalars['String']['output']>;
  particle_to?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "cyberlinks" */
export type Cyberlinks_Min_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  neuron?: InputMaybe<Order_By>;
  particle_from?: InputMaybe<Order_By>;
  particle_to?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "cyberlinks". */
export type Cyberlinks_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  block?: InputMaybe<Block_Order_By>;
  from?: InputMaybe<Particles_Order_By>;
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  neuron?: InputMaybe<Order_By>;
  particle_from?: InputMaybe<Order_By>;
  particle_to?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  to?: InputMaybe<Particles_Order_By>;
  transaction?: InputMaybe<Transaction_Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
};

/** select columns of table "cyberlinks" */
export enum Cyberlinks_Select_Column {
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
export type Cyberlinks_Stats = {
  cyberlinks?: Maybe<Scalars['numeric']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
};

/** aggregated selection of "cyberlinks_stats" */
export type Cyberlinks_Stats_Aggregate = {
  aggregate?: Maybe<Cyberlinks_Stats_Aggregate_Fields>;
  nodes: Array<Cyberlinks_Stats>;
};

/** aggregate fields of "cyberlinks_stats" */
export type Cyberlinks_Stats_Aggregate_Fields = {
  avg?: Maybe<Cyberlinks_Stats_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Cyberlinks_Stats_Max_Fields>;
  min?: Maybe<Cyberlinks_Stats_Min_Fields>;
  stddev?: Maybe<Cyberlinks_Stats_Stddev_Fields>;
  stddev_pop?: Maybe<Cyberlinks_Stats_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cyberlinks_Stats_Stddev_Samp_Fields>;
  sum?: Maybe<Cyberlinks_Stats_Sum_Fields>;
  var_pop?: Maybe<Cyberlinks_Stats_Var_Pop_Fields>;
  var_samp?: Maybe<Cyberlinks_Stats_Var_Samp_Fields>;
  variance?: Maybe<Cyberlinks_Stats_Variance_Fields>;
};


/** aggregate fields of "cyberlinks_stats" */
export type Cyberlinks_Stats_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cyberlinks_Stats_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Cyberlinks_Stats_Avg_Fields = {
  cyberlinks?: Maybe<Scalars['Float']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "cyberlinks_stats". All fields are combined with a logical 'AND'. */
export type Cyberlinks_Stats_Bool_Exp = {
  _and?: InputMaybe<Array<Cyberlinks_Stats_Bool_Exp>>;
  _not?: InputMaybe<Cyberlinks_Stats_Bool_Exp>;
  _or?: InputMaybe<Array<Cyberlinks_Stats_Bool_Exp>>;
  cyberlinks?: InputMaybe<Numeric_Comparison_Exp>;
  cyberlinks_per_day?: InputMaybe<Bigint_Comparison_Exp>;
  date?: InputMaybe<Date_Comparison_Exp>;
};

/** aggregate max on columns */
export type Cyberlinks_Stats_Max_Fields = {
  cyberlinks?: Maybe<Scalars['numeric']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
};

/** aggregate min on columns */
export type Cyberlinks_Stats_Min_Fields = {
  cyberlinks?: Maybe<Scalars['numeric']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
};

/** Ordering options when selecting data from "cyberlinks_stats". */
export type Cyberlinks_Stats_Order_By = {
  cyberlinks?: InputMaybe<Order_By>;
  cyberlinks_per_day?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
};

/** select columns of table "cyberlinks_stats" */
export enum Cyberlinks_Stats_Select_Column {
  /** column name */
  Cyberlinks = 'cyberlinks',
  /** column name */
  CyberlinksPerDay = 'cyberlinks_per_day',
  /** column name */
  Date = 'date'
}

/** aggregate stddev on columns */
export type Cyberlinks_Stats_Stddev_Fields = {
  cyberlinks?: Maybe<Scalars['Float']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Cyberlinks_Stats_Stddev_Pop_Fields = {
  cyberlinks?: Maybe<Scalars['Float']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Cyberlinks_Stats_Stddev_Samp_Fields = {
  cyberlinks?: Maybe<Scalars['Float']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Cyberlinks_Stats_Sum_Fields = {
  cyberlinks?: Maybe<Scalars['numeric']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Cyberlinks_Stats_Var_Pop_Fields = {
  cyberlinks?: Maybe<Scalars['Float']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Cyberlinks_Stats_Var_Samp_Fields = {
  cyberlinks?: Maybe<Scalars['Float']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Cyberlinks_Stats_Variance_Fields = {
  cyberlinks?: Maybe<Scalars['Float']['output']>;
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev on columns */
export type Cyberlinks_Stddev_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "cyberlinks" */
export type Cyberlinks_Stddev_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Cyberlinks_Stddev_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "cyberlinks" */
export type Cyberlinks_Stddev_Pop_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Cyberlinks_Stddev_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "cyberlinks" */
export type Cyberlinks_Stddev_Samp_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Cyberlinks_Sum_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "cyberlinks" */
export type Cyberlinks_Sum_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Cyberlinks_Var_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "cyberlinks" */
export type Cyberlinks_Var_Pop_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Cyberlinks_Var_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "cyberlinks" */
export type Cyberlinks_Var_Samp_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Cyberlinks_Variance_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "cyberlinks" */
export type Cyberlinks_Variance_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** columns and relationships of "daily_amount_of_active_neurons" */
export type Daily_Amount_Of_Active_Neurons = {
  count?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
};

/** aggregated selection of "daily_amount_of_active_neurons" */
export type Daily_Amount_Of_Active_Neurons_Aggregate = {
  aggregate?: Maybe<Daily_Amount_Of_Active_Neurons_Aggregate_Fields>;
  nodes: Array<Daily_Amount_Of_Active_Neurons>;
};

/** aggregate fields of "daily_amount_of_active_neurons" */
export type Daily_Amount_Of_Active_Neurons_Aggregate_Fields = {
  avg?: Maybe<Daily_Amount_Of_Active_Neurons_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Daily_Amount_Of_Active_Neurons_Max_Fields>;
  min?: Maybe<Daily_Amount_Of_Active_Neurons_Min_Fields>;
  stddev?: Maybe<Daily_Amount_Of_Active_Neurons_Stddev_Fields>;
  stddev_pop?: Maybe<Daily_Amount_Of_Active_Neurons_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Daily_Amount_Of_Active_Neurons_Stddev_Samp_Fields>;
  sum?: Maybe<Daily_Amount_Of_Active_Neurons_Sum_Fields>;
  var_pop?: Maybe<Daily_Amount_Of_Active_Neurons_Var_Pop_Fields>;
  var_samp?: Maybe<Daily_Amount_Of_Active_Neurons_Var_Samp_Fields>;
  variance?: Maybe<Daily_Amount_Of_Active_Neurons_Variance_Fields>;
};


/** aggregate fields of "daily_amount_of_active_neurons" */
export type Daily_Amount_Of_Active_Neurons_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Daily_Amount_Of_Active_Neurons_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Daily_Amount_Of_Active_Neurons_Avg_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "daily_amount_of_active_neurons". All fields are combined with a logical 'AND'. */
export type Daily_Amount_Of_Active_Neurons_Bool_Exp = {
  _and?: InputMaybe<Array<Daily_Amount_Of_Active_Neurons_Bool_Exp>>;
  _not?: InputMaybe<Daily_Amount_Of_Active_Neurons_Bool_Exp>;
  _or?: InputMaybe<Array<Daily_Amount_Of_Active_Neurons_Bool_Exp>>;
  count?: InputMaybe<Bigint_Comparison_Exp>;
  date?: InputMaybe<Date_Comparison_Exp>;
};

/** aggregate max on columns */
export type Daily_Amount_Of_Active_Neurons_Max_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
};

/** aggregate min on columns */
export type Daily_Amount_Of_Active_Neurons_Min_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
};

/** Ordering options when selecting data from "daily_amount_of_active_neurons". */
export type Daily_Amount_Of_Active_Neurons_Order_By = {
  count?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
};

/** select columns of table "daily_amount_of_active_neurons" */
export enum Daily_Amount_Of_Active_Neurons_Select_Column {
  /** column name */
  Count = 'count',
  /** column name */
  Date = 'date'
}

/** aggregate stddev on columns */
export type Daily_Amount_Of_Active_Neurons_Stddev_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Daily_Amount_Of_Active_Neurons_Stddev_Pop_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Daily_Amount_Of_Active_Neurons_Stddev_Samp_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Daily_Amount_Of_Active_Neurons_Sum_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Daily_Amount_Of_Active_Neurons_Var_Pop_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Daily_Amount_Of_Active_Neurons_Var_Samp_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Daily_Amount_Of_Active_Neurons_Variance_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "daily_amount_of_used_gas" */
export type Daily_Amount_Of_Used_Gas = {
  daily_gas?: Maybe<Scalars['numeric']['output']>;
  date?: Maybe<Scalars['date']['output']>;
  gas_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "daily_amount_of_used_gas" */
export type Daily_Amount_Of_Used_Gas_Aggregate = {
  aggregate?: Maybe<Daily_Amount_Of_Used_Gas_Aggregate_Fields>;
  nodes: Array<Daily_Amount_Of_Used_Gas>;
};

/** aggregate fields of "daily_amount_of_used_gas" */
export type Daily_Amount_Of_Used_Gas_Aggregate_Fields = {
  avg?: Maybe<Daily_Amount_Of_Used_Gas_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Daily_Amount_Of_Used_Gas_Max_Fields>;
  min?: Maybe<Daily_Amount_Of_Used_Gas_Min_Fields>;
  stddev?: Maybe<Daily_Amount_Of_Used_Gas_Stddev_Fields>;
  stddev_pop?: Maybe<Daily_Amount_Of_Used_Gas_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Daily_Amount_Of_Used_Gas_Stddev_Samp_Fields>;
  sum?: Maybe<Daily_Amount_Of_Used_Gas_Sum_Fields>;
  var_pop?: Maybe<Daily_Amount_Of_Used_Gas_Var_Pop_Fields>;
  var_samp?: Maybe<Daily_Amount_Of_Used_Gas_Var_Samp_Fields>;
  variance?: Maybe<Daily_Amount_Of_Used_Gas_Variance_Fields>;
};


/** aggregate fields of "daily_amount_of_used_gas" */
export type Daily_Amount_Of_Used_Gas_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Daily_Amount_Of_Used_Gas_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Daily_Amount_Of_Used_Gas_Avg_Fields = {
  daily_gas?: Maybe<Scalars['Float']['output']>;
  gas_total?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "daily_amount_of_used_gas". All fields are combined with a logical 'AND'. */
export type Daily_Amount_Of_Used_Gas_Bool_Exp = {
  _and?: InputMaybe<Array<Daily_Amount_Of_Used_Gas_Bool_Exp>>;
  _not?: InputMaybe<Daily_Amount_Of_Used_Gas_Bool_Exp>;
  _or?: InputMaybe<Array<Daily_Amount_Of_Used_Gas_Bool_Exp>>;
  daily_gas?: InputMaybe<Numeric_Comparison_Exp>;
  date?: InputMaybe<Date_Comparison_Exp>;
  gas_total?: InputMaybe<Numeric_Comparison_Exp>;
};

/** aggregate max on columns */
export type Daily_Amount_Of_Used_Gas_Max_Fields = {
  daily_gas?: Maybe<Scalars['numeric']['output']>;
  date?: Maybe<Scalars['date']['output']>;
  gas_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type Daily_Amount_Of_Used_Gas_Min_Fields = {
  daily_gas?: Maybe<Scalars['numeric']['output']>;
  date?: Maybe<Scalars['date']['output']>;
  gas_total?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "daily_amount_of_used_gas". */
export type Daily_Amount_Of_Used_Gas_Order_By = {
  daily_gas?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  gas_total?: InputMaybe<Order_By>;
};

/** select columns of table "daily_amount_of_used_gas" */
export enum Daily_Amount_Of_Used_Gas_Select_Column {
  /** column name */
  DailyGas = 'daily_gas',
  /** column name */
  Date = 'date',
  /** column name */
  GasTotal = 'gas_total'
}

/** aggregate stddev on columns */
export type Daily_Amount_Of_Used_Gas_Stddev_Fields = {
  daily_gas?: Maybe<Scalars['Float']['output']>;
  gas_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Daily_Amount_Of_Used_Gas_Stddev_Pop_Fields = {
  daily_gas?: Maybe<Scalars['Float']['output']>;
  gas_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Daily_Amount_Of_Used_Gas_Stddev_Samp_Fields = {
  daily_gas?: Maybe<Scalars['Float']['output']>;
  gas_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Daily_Amount_Of_Used_Gas_Sum_Fields = {
  daily_gas?: Maybe<Scalars['numeric']['output']>;
  gas_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type Daily_Amount_Of_Used_Gas_Var_Pop_Fields = {
  daily_gas?: Maybe<Scalars['Float']['output']>;
  gas_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Daily_Amount_Of_Used_Gas_Var_Samp_Fields = {
  daily_gas?: Maybe<Scalars['Float']['output']>;
  gas_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Daily_Amount_Of_Used_Gas_Variance_Fields = {
  daily_gas?: Maybe<Scalars['Float']['output']>;
  gas_total?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "daily_number_of_transactions" */
export type Daily_Number_Of_Transactions = {
  date?: Maybe<Scalars['date']['output']>;
  txs_per_day?: Maybe<Scalars['bigint']['output']>;
  txs_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "daily_number_of_transactions" */
export type Daily_Number_Of_Transactions_Aggregate = {
  aggregate?: Maybe<Daily_Number_Of_Transactions_Aggregate_Fields>;
  nodes: Array<Daily_Number_Of_Transactions>;
};

/** aggregate fields of "daily_number_of_transactions" */
export type Daily_Number_Of_Transactions_Aggregate_Fields = {
  avg?: Maybe<Daily_Number_Of_Transactions_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Daily_Number_Of_Transactions_Max_Fields>;
  min?: Maybe<Daily_Number_Of_Transactions_Min_Fields>;
  stddev?: Maybe<Daily_Number_Of_Transactions_Stddev_Fields>;
  stddev_pop?: Maybe<Daily_Number_Of_Transactions_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Daily_Number_Of_Transactions_Stddev_Samp_Fields>;
  sum?: Maybe<Daily_Number_Of_Transactions_Sum_Fields>;
  var_pop?: Maybe<Daily_Number_Of_Transactions_Var_Pop_Fields>;
  var_samp?: Maybe<Daily_Number_Of_Transactions_Var_Samp_Fields>;
  variance?: Maybe<Daily_Number_Of_Transactions_Variance_Fields>;
};


/** aggregate fields of "daily_number_of_transactions" */
export type Daily_Number_Of_Transactions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Daily_Number_Of_Transactions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Daily_Number_Of_Transactions_Avg_Fields = {
  txs_per_day?: Maybe<Scalars['Float']['output']>;
  txs_total?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "daily_number_of_transactions". All fields are combined with a logical 'AND'. */
export type Daily_Number_Of_Transactions_Bool_Exp = {
  _and?: InputMaybe<Array<Daily_Number_Of_Transactions_Bool_Exp>>;
  _not?: InputMaybe<Daily_Number_Of_Transactions_Bool_Exp>;
  _or?: InputMaybe<Array<Daily_Number_Of_Transactions_Bool_Exp>>;
  date?: InputMaybe<Date_Comparison_Exp>;
  txs_per_day?: InputMaybe<Bigint_Comparison_Exp>;
  txs_total?: InputMaybe<Numeric_Comparison_Exp>;
};

/** aggregate max on columns */
export type Daily_Number_Of_Transactions_Max_Fields = {
  date?: Maybe<Scalars['date']['output']>;
  txs_per_day?: Maybe<Scalars['bigint']['output']>;
  txs_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type Daily_Number_Of_Transactions_Min_Fields = {
  date?: Maybe<Scalars['date']['output']>;
  txs_per_day?: Maybe<Scalars['bigint']['output']>;
  txs_total?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "daily_number_of_transactions". */
export type Daily_Number_Of_Transactions_Order_By = {
  date?: InputMaybe<Order_By>;
  txs_per_day?: InputMaybe<Order_By>;
  txs_total?: InputMaybe<Order_By>;
};

/** select columns of table "daily_number_of_transactions" */
export enum Daily_Number_Of_Transactions_Select_Column {
  /** column name */
  Date = 'date',
  /** column name */
  TxsPerDay = 'txs_per_day',
  /** column name */
  TxsTotal = 'txs_total'
}

/** aggregate stddev on columns */
export type Daily_Number_Of_Transactions_Stddev_Fields = {
  txs_per_day?: Maybe<Scalars['Float']['output']>;
  txs_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Daily_Number_Of_Transactions_Stddev_Pop_Fields = {
  txs_per_day?: Maybe<Scalars['Float']['output']>;
  txs_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Daily_Number_Of_Transactions_Stddev_Samp_Fields = {
  txs_per_day?: Maybe<Scalars['Float']['output']>;
  txs_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Daily_Number_Of_Transactions_Sum_Fields = {
  txs_per_day?: Maybe<Scalars['bigint']['output']>;
  txs_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type Daily_Number_Of_Transactions_Var_Pop_Fields = {
  txs_per_day?: Maybe<Scalars['Float']['output']>;
  txs_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Daily_Number_Of_Transactions_Var_Samp_Fields = {
  txs_per_day?: Maybe<Scalars['Float']['output']>;
  txs_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Daily_Number_Of_Transactions_Variance_Fields = {
  txs_per_day?: Maybe<Scalars['Float']['output']>;
  txs_total?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
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
export type Float8_Comparison_Exp = {
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
export type Follow_Stats = {
  date?: Maybe<Scalars['date']['output']>;
  follow_total?: Maybe<Scalars['numeric']['output']>;
  follows_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** aggregated selection of "follow_stats" */
export type Follow_Stats_Aggregate = {
  aggregate?: Maybe<Follow_Stats_Aggregate_Fields>;
  nodes: Array<Follow_Stats>;
};

/** aggregate fields of "follow_stats" */
export type Follow_Stats_Aggregate_Fields = {
  avg?: Maybe<Follow_Stats_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Follow_Stats_Max_Fields>;
  min?: Maybe<Follow_Stats_Min_Fields>;
  stddev?: Maybe<Follow_Stats_Stddev_Fields>;
  stddev_pop?: Maybe<Follow_Stats_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Follow_Stats_Stddev_Samp_Fields>;
  sum?: Maybe<Follow_Stats_Sum_Fields>;
  var_pop?: Maybe<Follow_Stats_Var_Pop_Fields>;
  var_samp?: Maybe<Follow_Stats_Var_Samp_Fields>;
  variance?: Maybe<Follow_Stats_Variance_Fields>;
};


/** aggregate fields of "follow_stats" */
export type Follow_Stats_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Follow_Stats_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Follow_Stats_Avg_Fields = {
  follow_total?: Maybe<Scalars['Float']['output']>;
  follows_per_day?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "follow_stats". All fields are combined with a logical 'AND'. */
export type Follow_Stats_Bool_Exp = {
  _and?: InputMaybe<Array<Follow_Stats_Bool_Exp>>;
  _not?: InputMaybe<Follow_Stats_Bool_Exp>;
  _or?: InputMaybe<Array<Follow_Stats_Bool_Exp>>;
  date?: InputMaybe<Date_Comparison_Exp>;
  follow_total?: InputMaybe<Numeric_Comparison_Exp>;
  follows_per_day?: InputMaybe<Bigint_Comparison_Exp>;
};

/** aggregate max on columns */
export type Follow_Stats_Max_Fields = {
  date?: Maybe<Scalars['date']['output']>;
  follow_total?: Maybe<Scalars['numeric']['output']>;
  follows_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type Follow_Stats_Min_Fields = {
  date?: Maybe<Scalars['date']['output']>;
  follow_total?: Maybe<Scalars['numeric']['output']>;
  follows_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "follow_stats". */
export type Follow_Stats_Order_By = {
  date?: InputMaybe<Order_By>;
  follow_total?: InputMaybe<Order_By>;
  follows_per_day?: InputMaybe<Order_By>;
};

/** select columns of table "follow_stats" */
export enum Follow_Stats_Select_Column {
  /** column name */
  Date = 'date',
  /** column name */
  FollowTotal = 'follow_total',
  /** column name */
  FollowsPerDay = 'follows_per_day'
}

/** aggregate stddev on columns */
export type Follow_Stats_Stddev_Fields = {
  follow_total?: Maybe<Scalars['Float']['output']>;
  follows_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Follow_Stats_Stddev_Pop_Fields = {
  follow_total?: Maybe<Scalars['Float']['output']>;
  follows_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Follow_Stats_Stddev_Samp_Fields = {
  follow_total?: Maybe<Scalars['Float']['output']>;
  follows_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Follow_Stats_Sum_Fields = {
  follow_total?: Maybe<Scalars['numeric']['output']>;
  follows_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Follow_Stats_Var_Pop_Fields = {
  follow_total?: Maybe<Scalars['Float']['output']>;
  follows_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Follow_Stats_Var_Samp_Fields = {
  follow_total?: Maybe<Scalars['Float']['output']>;
  follows_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Follow_Stats_Variance_Fields = {
  follow_total?: Maybe<Scalars['Float']['output']>;
  follows_per_day?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "genesis_neurons_activation" */
export type Genesis_Neurons_Activation = {
  count?: Maybe<Scalars['float8']['output']>;
  neurons?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "genesis_neurons_activation" */
export type Genesis_Neurons_Activation_Aggregate = {
  aggregate?: Maybe<Genesis_Neurons_Activation_Aggregate_Fields>;
  nodes: Array<Genesis_Neurons_Activation>;
};

/** aggregate fields of "genesis_neurons_activation" */
export type Genesis_Neurons_Activation_Aggregate_Fields = {
  avg?: Maybe<Genesis_Neurons_Activation_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Genesis_Neurons_Activation_Max_Fields>;
  min?: Maybe<Genesis_Neurons_Activation_Min_Fields>;
  stddev?: Maybe<Genesis_Neurons_Activation_Stddev_Fields>;
  stddev_pop?: Maybe<Genesis_Neurons_Activation_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Genesis_Neurons_Activation_Stddev_Samp_Fields>;
  sum?: Maybe<Genesis_Neurons_Activation_Sum_Fields>;
  var_pop?: Maybe<Genesis_Neurons_Activation_Var_Pop_Fields>;
  var_samp?: Maybe<Genesis_Neurons_Activation_Var_Samp_Fields>;
  variance?: Maybe<Genesis_Neurons_Activation_Variance_Fields>;
};


/** aggregate fields of "genesis_neurons_activation" */
export type Genesis_Neurons_Activation_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Genesis_Neurons_Activation_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Genesis_Neurons_Activation_Avg_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "genesis_neurons_activation". All fields are combined with a logical 'AND'. */
export type Genesis_Neurons_Activation_Bool_Exp = {
  _and?: InputMaybe<Array<Genesis_Neurons_Activation_Bool_Exp>>;
  _not?: InputMaybe<Genesis_Neurons_Activation_Bool_Exp>;
  _or?: InputMaybe<Array<Genesis_Neurons_Activation_Bool_Exp>>;
  count?: InputMaybe<Float8_Comparison_Exp>;
  neurons?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Genesis_Neurons_Activation_Max_Fields = {
  count?: Maybe<Scalars['float8']['output']>;
  neurons?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Genesis_Neurons_Activation_Min_Fields = {
  count?: Maybe<Scalars['float8']['output']>;
  neurons?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "genesis_neurons_activation". */
export type Genesis_Neurons_Activation_Order_By = {
  count?: InputMaybe<Order_By>;
  neurons?: InputMaybe<Order_By>;
};

/** select columns of table "genesis_neurons_activation" */
export enum Genesis_Neurons_Activation_Select_Column {
  /** column name */
  Count = 'count',
  /** column name */
  Neurons = 'neurons'
}

/** aggregate stddev on columns */
export type Genesis_Neurons_Activation_Stddev_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Genesis_Neurons_Activation_Stddev_Pop_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Genesis_Neurons_Activation_Stddev_Samp_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Genesis_Neurons_Activation_Sum_Fields = {
  count?: Maybe<Scalars['float8']['output']>;
};

/** aggregate var_pop on columns */
export type Genesis_Neurons_Activation_Var_Pop_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Genesis_Neurons_Activation_Var_Samp_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Genesis_Neurons_Activation_Variance_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "investmints" */
export type Investmints = {
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
export type Investmints_Aggregate = {
  aggregate?: Maybe<Investmints_Aggregate_Fields>;
  nodes: Array<Investmints>;
};

/** aggregate fields of "investmints" */
export type Investmints_Aggregate_Fields = {
  avg?: Maybe<Investmints_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Investmints_Max_Fields>;
  min?: Maybe<Investmints_Min_Fields>;
  stddev?: Maybe<Investmints_Stddev_Fields>;
  stddev_pop?: Maybe<Investmints_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Investmints_Stddev_Samp_Fields>;
  sum?: Maybe<Investmints_Sum_Fields>;
  var_pop?: Maybe<Investmints_Var_Pop_Fields>;
  var_samp?: Maybe<Investmints_Var_Samp_Fields>;
  variance?: Maybe<Investmints_Variance_Fields>;
};


/** aggregate fields of "investmints" */
export type Investmints_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Investmints_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "investmints" */
export type Investmints_Aggregate_Order_By = {
  avg?: InputMaybe<Investmints_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Investmints_Max_Order_By>;
  min?: InputMaybe<Investmints_Min_Order_By>;
  stddev?: InputMaybe<Investmints_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Investmints_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Investmints_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Investmints_Sum_Order_By>;
  var_pop?: InputMaybe<Investmints_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Investmints_Var_Samp_Order_By>;
  variance?: InputMaybe<Investmints_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Investmints_Avg_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "investmints" */
export type Investmints_Avg_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "investmints". All fields are combined with a logical 'AND'. */
export type Investmints_Bool_Exp = {
  _and?: InputMaybe<Array<Investmints_Bool_Exp>>;
  _not?: InputMaybe<Investmints_Bool_Exp>;
  _or?: InputMaybe<Array<Investmints_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  amount?: InputMaybe<Coin_Comparison_Exp>;
  block?: InputMaybe<Block_Bool_Exp>;
  height?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  length?: InputMaybe<Bigint_Comparison_Exp>;
  neuron?: InputMaybe<String_Comparison_Exp>;
  resource?: InputMaybe<String_Comparison_Exp>;
  timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  transaction?: InputMaybe<Transaction_Bool_Exp>;
  transaction_hash?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Investmints_Max_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  length?: Maybe<Scalars['bigint']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  resource?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "investmints" */
export type Investmints_Max_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
  neuron?: InputMaybe<Order_By>;
  resource?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Investmints_Min_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  length?: Maybe<Scalars['bigint']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  resource?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "investmints" */
export type Investmints_Min_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
  neuron?: InputMaybe<Order_By>;
  resource?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "investmints". */
export type Investmints_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  amount?: InputMaybe<Order_By>;
  block?: InputMaybe<Block_Order_By>;
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
  neuron?: InputMaybe<Order_By>;
  resource?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  transaction?: InputMaybe<Transaction_Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
};

/** select columns of table "investmints" */
export enum Investmints_Select_Column {
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
export type Investmints_Stddev_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "investmints" */
export type Investmints_Stddev_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Investmints_Stddev_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "investmints" */
export type Investmints_Stddev_Pop_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Investmints_Stddev_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "investmints" */
export type Investmints_Stddev_Samp_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Investmints_Sum_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  length?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "investmints" */
export type Investmints_Sum_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Investmints_Var_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "investmints" */
export type Investmints_Var_Pop_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Investmints_Var_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "investmints" */
export type Investmints_Var_Samp_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Investmints_Variance_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
  length?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "investmints" */
export type Investmints_Variance_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  length?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
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
export type Jsonb_Comparison_Exp = {
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
export type Message_Aggregate = {
  aggregate?: Maybe<Message_Aggregate_Fields>;
  nodes: Array<Message>;
};

/** aggregate fields of "message" */
export type Message_Aggregate_Fields = {
  avg?: Maybe<Message_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Message_Max_Fields>;
  min?: Maybe<Message_Min_Fields>;
  stddev?: Maybe<Message_Stddev_Fields>;
  stddev_pop?: Maybe<Message_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Message_Stddev_Samp_Fields>;
  sum?: Maybe<Message_Sum_Fields>;
  var_pop?: Maybe<Message_Var_Pop_Fields>;
  var_samp?: Maybe<Message_Var_Samp_Fields>;
  variance?: Maybe<Message_Variance_Fields>;
};


/** aggregate fields of "message" */
export type Message_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Message_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "message" */
export type Message_Aggregate_Order_By = {
  avg?: InputMaybe<Message_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Message_Max_Order_By>;
  min?: InputMaybe<Message_Min_Order_By>;
  stddev?: InputMaybe<Message_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Message_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Message_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Message_Sum_Order_By>;
  var_pop?: InputMaybe<Message_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Message_Var_Samp_Order_By>;
  variance?: InputMaybe<Message_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Message_Avg_Fields = {
  index?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "message" */
export type Message_Avg_Order_By = {
  index?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "message". All fields are combined with a logical 'AND'. */
export type Message_Bool_Exp = {
  _and?: InputMaybe<Array<Message_Bool_Exp>>;
  _not?: InputMaybe<Message_Bool_Exp>;
  _or?: InputMaybe<Array<Message_Bool_Exp>>;
  index?: InputMaybe<Bigint_Comparison_Exp>;
  involved_accounts_addresses?: InputMaybe<_Text_Comparison_Exp>;
  transaction?: InputMaybe<Transaction_Bool_Exp>;
  transaction_hash?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** aggregate max on columns */
export type Message_Max_Fields = {
  index?: Maybe<Scalars['bigint']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "message" */
export type Message_Max_Order_By = {
  index?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Message_Min_Fields = {
  index?: Maybe<Scalars['bigint']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "message" */
export type Message_Min_Order_By = {
  index?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "message". */
export type Message_Order_By = {
  index?: InputMaybe<Order_By>;
  involved_accounts_addresses?: InputMaybe<Order_By>;
  transaction?: InputMaybe<Transaction_Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** select columns of table "message" */
export enum Message_Select_Column {
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
export type Message_Stddev_Fields = {
  index?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "message" */
export type Message_Stddev_Order_By = {
  index?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Message_Stddev_Pop_Fields = {
  index?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "message" */
export type Message_Stddev_Pop_Order_By = {
  index?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Message_Stddev_Samp_Fields = {
  index?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "message" */
export type Message_Stddev_Samp_Order_By = {
  index?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Message_Sum_Fields = {
  index?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "message" */
export type Message_Sum_Order_By = {
  index?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Message_Var_Pop_Fields = {
  index?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "message" */
export type Message_Var_Pop_Order_By = {
  index?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Message_Var_Samp_Fields = {
  index?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "message" */
export type Message_Var_Samp_Order_By = {
  index?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Message_Variance_Fields = {
  index?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "message" */
export type Message_Variance_Order_By = {
  index?: InputMaybe<Order_By>;
};

export type Messages_By_Address_Args = {
  addresses?: InputMaybe<Scalars['_text']['input']>;
  limit?: InputMaybe<Scalars['bigint']['input']>;
  offset?: InputMaybe<Scalars['bigint']['input']>;
  types?: InputMaybe<Scalars['_text']['input']>;
};

/** columns and relationships of "modules" */
export type Modules = {
  module_name: Scalars['String']['output'];
};

/** aggregated selection of "modules" */
export type Modules_Aggregate = {
  aggregate?: Maybe<Modules_Aggregate_Fields>;
  nodes: Array<Modules>;
};

/** aggregate fields of "modules" */
export type Modules_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Modules_Max_Fields>;
  min?: Maybe<Modules_Min_Fields>;
};


/** aggregate fields of "modules" */
export type Modules_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Modules_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "modules". All fields are combined with a logical 'AND'. */
export type Modules_Bool_Exp = {
  _and?: InputMaybe<Array<Modules_Bool_Exp>>;
  _not?: InputMaybe<Modules_Bool_Exp>;
  _or?: InputMaybe<Array<Modules_Bool_Exp>>;
  module_name?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Modules_Max_Fields = {
  module_name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Modules_Min_Fields = {
  module_name?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "modules". */
export type Modules_Order_By = {
  module_name?: InputMaybe<Order_By>;
};

/** select columns of table "modules" */
export enum Modules_Select_Column {
  /** column name */
  ModuleName = 'module_name'
}

/** columns and relationships of "neuron_activation_source" */
export type Neuron_Activation_Source = {
  genesis_percent?: Maybe<Scalars['float8']['output']>;
  ibc_receive_percent?: Maybe<Scalars['float8']['output']>;
  neuron_activated?: Maybe<Scalars['bigint']['output']>;
  recieve_percent?: Maybe<Scalars['float8']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** aggregated selection of "neuron_activation_source" */
export type Neuron_Activation_Source_Aggregate = {
  aggregate?: Maybe<Neuron_Activation_Source_Aggregate_Fields>;
  nodes: Array<Neuron_Activation_Source>;
};

/** aggregate fields of "neuron_activation_source" */
export type Neuron_Activation_Source_Aggregate_Fields = {
  avg?: Maybe<Neuron_Activation_Source_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Neuron_Activation_Source_Max_Fields>;
  min?: Maybe<Neuron_Activation_Source_Min_Fields>;
  stddev?: Maybe<Neuron_Activation_Source_Stddev_Fields>;
  stddev_pop?: Maybe<Neuron_Activation_Source_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Neuron_Activation_Source_Stddev_Samp_Fields>;
  sum?: Maybe<Neuron_Activation_Source_Sum_Fields>;
  var_pop?: Maybe<Neuron_Activation_Source_Var_Pop_Fields>;
  var_samp?: Maybe<Neuron_Activation_Source_Var_Samp_Fields>;
  variance?: Maybe<Neuron_Activation_Source_Variance_Fields>;
};


/** aggregate fields of "neuron_activation_source" */
export type Neuron_Activation_Source_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Neuron_Activation_Source_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Neuron_Activation_Source_Avg_Fields = {
  genesis_percent?: Maybe<Scalars['Float']['output']>;
  ibc_receive_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activated?: Maybe<Scalars['Float']['output']>;
  recieve_percent?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "neuron_activation_source". All fields are combined with a logical 'AND'. */
export type Neuron_Activation_Source_Bool_Exp = {
  _and?: InputMaybe<Array<Neuron_Activation_Source_Bool_Exp>>;
  _not?: InputMaybe<Neuron_Activation_Source_Bool_Exp>;
  _or?: InputMaybe<Array<Neuron_Activation_Source_Bool_Exp>>;
  genesis_percent?: InputMaybe<Float8_Comparison_Exp>;
  ibc_receive_percent?: InputMaybe<Float8_Comparison_Exp>;
  neuron_activated?: InputMaybe<Bigint_Comparison_Exp>;
  recieve_percent?: InputMaybe<Float8_Comparison_Exp>;
  week?: InputMaybe<Date_Comparison_Exp>;
};

/** aggregate max on columns */
export type Neuron_Activation_Source_Max_Fields = {
  genesis_percent?: Maybe<Scalars['float8']['output']>;
  ibc_receive_percent?: Maybe<Scalars['float8']['output']>;
  neuron_activated?: Maybe<Scalars['bigint']['output']>;
  recieve_percent?: Maybe<Scalars['float8']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** aggregate min on columns */
export type Neuron_Activation_Source_Min_Fields = {
  genesis_percent?: Maybe<Scalars['float8']['output']>;
  ibc_receive_percent?: Maybe<Scalars['float8']['output']>;
  neuron_activated?: Maybe<Scalars['bigint']['output']>;
  recieve_percent?: Maybe<Scalars['float8']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** Ordering options when selecting data from "neuron_activation_source". */
export type Neuron_Activation_Source_Order_By = {
  genesis_percent?: InputMaybe<Order_By>;
  ibc_receive_percent?: InputMaybe<Order_By>;
  neuron_activated?: InputMaybe<Order_By>;
  recieve_percent?: InputMaybe<Order_By>;
  week?: InputMaybe<Order_By>;
};

/** select columns of table "neuron_activation_source" */
export enum Neuron_Activation_Source_Select_Column {
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
export type Neuron_Activation_Source_Stddev_Fields = {
  genesis_percent?: Maybe<Scalars['Float']['output']>;
  ibc_receive_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activated?: Maybe<Scalars['Float']['output']>;
  recieve_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Neuron_Activation_Source_Stddev_Pop_Fields = {
  genesis_percent?: Maybe<Scalars['Float']['output']>;
  ibc_receive_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activated?: Maybe<Scalars['Float']['output']>;
  recieve_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Neuron_Activation_Source_Stddev_Samp_Fields = {
  genesis_percent?: Maybe<Scalars['Float']['output']>;
  ibc_receive_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activated?: Maybe<Scalars['Float']['output']>;
  recieve_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Neuron_Activation_Source_Sum_Fields = {
  genesis_percent?: Maybe<Scalars['float8']['output']>;
  ibc_receive_percent?: Maybe<Scalars['float8']['output']>;
  neuron_activated?: Maybe<Scalars['bigint']['output']>;
  recieve_percent?: Maybe<Scalars['float8']['output']>;
};

/** aggregate var_pop on columns */
export type Neuron_Activation_Source_Var_Pop_Fields = {
  genesis_percent?: Maybe<Scalars['Float']['output']>;
  ibc_receive_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activated?: Maybe<Scalars['Float']['output']>;
  recieve_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Neuron_Activation_Source_Var_Samp_Fields = {
  genesis_percent?: Maybe<Scalars['Float']['output']>;
  ibc_receive_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activated?: Maybe<Scalars['Float']['output']>;
  recieve_percent?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Neuron_Activation_Source_Variance_Fields = {
  genesis_percent?: Maybe<Scalars['Float']['output']>;
  ibc_receive_percent?: Maybe<Scalars['Float']['output']>;
  neuron_activated?: Maybe<Scalars['Float']['output']>;
  recieve_percent?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "number_of_new_neurons" */
export type Number_Of_New_Neurons = {
  date?: Maybe<Scalars['date']['output']>;
  new_neurons_daily?: Maybe<Scalars['bigint']['output']>;
  new_neurons_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "number_of_new_neurons" */
export type Number_Of_New_Neurons_Aggregate = {
  aggregate?: Maybe<Number_Of_New_Neurons_Aggregate_Fields>;
  nodes: Array<Number_Of_New_Neurons>;
};

/** aggregate fields of "number_of_new_neurons" */
export type Number_Of_New_Neurons_Aggregate_Fields = {
  avg?: Maybe<Number_Of_New_Neurons_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Number_Of_New_Neurons_Max_Fields>;
  min?: Maybe<Number_Of_New_Neurons_Min_Fields>;
  stddev?: Maybe<Number_Of_New_Neurons_Stddev_Fields>;
  stddev_pop?: Maybe<Number_Of_New_Neurons_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Number_Of_New_Neurons_Stddev_Samp_Fields>;
  sum?: Maybe<Number_Of_New_Neurons_Sum_Fields>;
  var_pop?: Maybe<Number_Of_New_Neurons_Var_Pop_Fields>;
  var_samp?: Maybe<Number_Of_New_Neurons_Var_Samp_Fields>;
  variance?: Maybe<Number_Of_New_Neurons_Variance_Fields>;
};


/** aggregate fields of "number_of_new_neurons" */
export type Number_Of_New_Neurons_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Number_Of_New_Neurons_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Number_Of_New_Neurons_Avg_Fields = {
  new_neurons_daily?: Maybe<Scalars['Float']['output']>;
  new_neurons_total?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "number_of_new_neurons". All fields are combined with a logical 'AND'. */
export type Number_Of_New_Neurons_Bool_Exp = {
  _and?: InputMaybe<Array<Number_Of_New_Neurons_Bool_Exp>>;
  _not?: InputMaybe<Number_Of_New_Neurons_Bool_Exp>;
  _or?: InputMaybe<Array<Number_Of_New_Neurons_Bool_Exp>>;
  date?: InputMaybe<Date_Comparison_Exp>;
  new_neurons_daily?: InputMaybe<Bigint_Comparison_Exp>;
  new_neurons_total?: InputMaybe<Numeric_Comparison_Exp>;
};

/** aggregate max on columns */
export type Number_Of_New_Neurons_Max_Fields = {
  date?: Maybe<Scalars['date']['output']>;
  new_neurons_daily?: Maybe<Scalars['bigint']['output']>;
  new_neurons_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type Number_Of_New_Neurons_Min_Fields = {
  date?: Maybe<Scalars['date']['output']>;
  new_neurons_daily?: Maybe<Scalars['bigint']['output']>;
  new_neurons_total?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "number_of_new_neurons". */
export type Number_Of_New_Neurons_Order_By = {
  date?: InputMaybe<Order_By>;
  new_neurons_daily?: InputMaybe<Order_By>;
  new_neurons_total?: InputMaybe<Order_By>;
};

/** select columns of table "number_of_new_neurons" */
export enum Number_Of_New_Neurons_Select_Column {
  /** column name */
  Date = 'date',
  /** column name */
  NewNeuronsDaily = 'new_neurons_daily',
  /** column name */
  NewNeuronsTotal = 'new_neurons_total'
}

/** aggregate stddev on columns */
export type Number_Of_New_Neurons_Stddev_Fields = {
  new_neurons_daily?: Maybe<Scalars['Float']['output']>;
  new_neurons_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Number_Of_New_Neurons_Stddev_Pop_Fields = {
  new_neurons_daily?: Maybe<Scalars['Float']['output']>;
  new_neurons_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Number_Of_New_Neurons_Stddev_Samp_Fields = {
  new_neurons_daily?: Maybe<Scalars['Float']['output']>;
  new_neurons_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Number_Of_New_Neurons_Sum_Fields = {
  new_neurons_daily?: Maybe<Scalars['bigint']['output']>;
  new_neurons_total?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type Number_Of_New_Neurons_Var_Pop_Fields = {
  new_neurons_daily?: Maybe<Scalars['Float']['output']>;
  new_neurons_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Number_Of_New_Neurons_Var_Samp_Fields = {
  new_neurons_daily?: Maybe<Scalars['Float']['output']>;
  new_neurons_total?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Number_Of_New_Neurons_Variance_Fields = {
  new_neurons_daily?: Maybe<Scalars['Float']['output']>;
  new_neurons_total?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
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
export type Old_Precommits = {
  consensus_address: Scalars['String']['output'];
  consensus_pubkey: Scalars['String']['output'];
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "old_precommits" */
export type Old_Precommits_Aggregate = {
  aggregate?: Maybe<Old_Precommits_Aggregate_Fields>;
  nodes: Array<Old_Precommits>;
};

/** aggregate fields of "old_precommits" */
export type Old_Precommits_Aggregate_Fields = {
  avg?: Maybe<Old_Precommits_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Old_Precommits_Max_Fields>;
  min?: Maybe<Old_Precommits_Min_Fields>;
  stddev?: Maybe<Old_Precommits_Stddev_Fields>;
  stddev_pop?: Maybe<Old_Precommits_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Old_Precommits_Stddev_Samp_Fields>;
  sum?: Maybe<Old_Precommits_Sum_Fields>;
  var_pop?: Maybe<Old_Precommits_Var_Pop_Fields>;
  var_samp?: Maybe<Old_Precommits_Var_Samp_Fields>;
  variance?: Maybe<Old_Precommits_Variance_Fields>;
};


/** aggregate fields of "old_precommits" */
export type Old_Precommits_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Old_Precommits_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Old_Precommits_Avg_Fields = {
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "old_precommits". All fields are combined with a logical 'AND'. */
export type Old_Precommits_Bool_Exp = {
  _and?: InputMaybe<Array<Old_Precommits_Bool_Exp>>;
  _not?: InputMaybe<Old_Precommits_Bool_Exp>;
  _or?: InputMaybe<Array<Old_Precommits_Bool_Exp>>;
  consensus_address?: InputMaybe<String_Comparison_Exp>;
  consensus_pubkey?: InputMaybe<String_Comparison_Exp>;
  precommits?: InputMaybe<Numeric_Comparison_Exp>;
};

/** aggregate max on columns */
export type Old_Precommits_Max_Fields = {
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type Old_Precommits_Min_Fields = {
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "old_precommits". */
export type Old_Precommits_Order_By = {
  consensus_address?: InputMaybe<Order_By>;
  consensus_pubkey?: InputMaybe<Order_By>;
  precommits?: InputMaybe<Order_By>;
};

/** select columns of table "old_precommits" */
export enum Old_Precommits_Select_Column {
  /** column name */
  ConsensusAddress = 'consensus_address',
  /** column name */
  ConsensusPubkey = 'consensus_pubkey',
  /** column name */
  Precommits = 'precommits'
}

/** aggregate stddev on columns */
export type Old_Precommits_Stddev_Fields = {
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Old_Precommits_Stddev_Pop_Fields = {
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Old_Precommits_Stddev_Samp_Fields = {
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Old_Precommits_Sum_Fields = {
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type Old_Precommits_Var_Pop_Fields = {
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Old_Precommits_Var_Samp_Fields = {
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Old_Precommits_Variance_Fields = {
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** column ordering options */
export enum Order_By {
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
  /** An object relationship */
  account: Account;
  /** An object relationship */
  block: Block;
  height: Scalars['bigint']['output'];
  id: Scalars['Int']['output'];
  /** An array relationship */
  in: Array<Cyberlinks>;
  /** An aggregate relationship */
  in_aggregate: Cyberlinks_Aggregate;
  neuron: Scalars['String']['output'];
  /** An array relationship */
  out: Array<Cyberlinks>;
  /** An aggregate relationship */
  out_aggregate: Cyberlinks_Aggregate;
  particle: Scalars['String']['output'];
  timestamp: Scalars['timestamp']['output'];
  /** An object relationship */
  transaction: Transaction;
  transaction_hash: Scalars['String']['output'];
};


/** columns and relationships of "particles" */
export type ParticlesInArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Order_By>>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
};


/** columns and relationships of "particles" */
export type ParticlesIn_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Order_By>>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
};


/** columns and relationships of "particles" */
export type ParticlesOutArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Order_By>>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
};


/** columns and relationships of "particles" */
export type ParticlesOut_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Order_By>>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
};

/** aggregated selection of "particles" */
export type Particles_Aggregate = {
  aggregate?: Maybe<Particles_Aggregate_Fields>;
  nodes: Array<Particles>;
};

/** aggregate fields of "particles" */
export type Particles_Aggregate_Fields = {
  avg?: Maybe<Particles_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Particles_Max_Fields>;
  min?: Maybe<Particles_Min_Fields>;
  stddev?: Maybe<Particles_Stddev_Fields>;
  stddev_pop?: Maybe<Particles_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Particles_Stddev_Samp_Fields>;
  sum?: Maybe<Particles_Sum_Fields>;
  var_pop?: Maybe<Particles_Var_Pop_Fields>;
  var_samp?: Maybe<Particles_Var_Samp_Fields>;
  variance?: Maybe<Particles_Variance_Fields>;
};


/** aggregate fields of "particles" */
export type Particles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Particles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "particles" */
export type Particles_Aggregate_Order_By = {
  avg?: InputMaybe<Particles_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Particles_Max_Order_By>;
  min?: InputMaybe<Particles_Min_Order_By>;
  stddev?: InputMaybe<Particles_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Particles_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Particles_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Particles_Sum_Order_By>;
  var_pop?: InputMaybe<Particles_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Particles_Var_Samp_Order_By>;
  variance?: InputMaybe<Particles_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Particles_Avg_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "particles" */
export type Particles_Avg_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "particles". All fields are combined with a logical 'AND'. */
export type Particles_Bool_Exp = {
  _and?: InputMaybe<Array<Particles_Bool_Exp>>;
  _not?: InputMaybe<Particles_Bool_Exp>;
  _or?: InputMaybe<Array<Particles_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  block?: InputMaybe<Block_Bool_Exp>;
  height?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  in?: InputMaybe<Cyberlinks_Bool_Exp>;
  neuron?: InputMaybe<String_Comparison_Exp>;
  out?: InputMaybe<Cyberlinks_Bool_Exp>;
  particle?: InputMaybe<String_Comparison_Exp>;
  timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  transaction?: InputMaybe<Transaction_Bool_Exp>;
  transaction_hash?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Particles_Max_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  particle?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "particles" */
export type Particles_Max_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  neuron?: InputMaybe<Order_By>;
  particle?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Particles_Min_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  particle?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "particles" */
export type Particles_Min_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  neuron?: InputMaybe<Order_By>;
  particle?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "particles". */
export type Particles_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  block?: InputMaybe<Block_Order_By>;
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  in_aggregate?: InputMaybe<Cyberlinks_Aggregate_Order_By>;
  neuron?: InputMaybe<Order_By>;
  out_aggregate?: InputMaybe<Cyberlinks_Aggregate_Order_By>;
  particle?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  transaction?: InputMaybe<Transaction_Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
};

/** select columns of table "particles" */
export enum Particles_Select_Column {
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
export type Particles_Stddev_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "particles" */
export type Particles_Stddev_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Particles_Stddev_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "particles" */
export type Particles_Stddev_Pop_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Particles_Stddev_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "particles" */
export type Particles_Stddev_Samp_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Particles_Sum_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "particles" */
export type Particles_Sum_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Particles_Var_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "particles" */
export type Particles_Var_Pop_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Particles_Var_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "particles" */
export type Particles_Var_Samp_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Particles_Variance_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "particles" */
export type Particles_Variance_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** columns and relationships of "pre_commit" */
export type Pre_Commit = {
  height: Scalars['bigint']['output'];
  proposer_priority: Scalars['bigint']['output'];
  timestamp: Scalars['timestamp']['output'];
  /** An object relationship */
  validator: Validator;
  validator_address: Scalars['String']['output'];
  voting_power: Scalars['bigint']['output'];
};

/** aggregated selection of "pre_commit" */
export type Pre_Commit_Aggregate = {
  aggregate?: Maybe<Pre_Commit_Aggregate_Fields>;
  nodes: Array<Pre_Commit>;
};

/** aggregate fields of "pre_commit" */
export type Pre_Commit_Aggregate_Fields = {
  avg?: Maybe<Pre_Commit_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Pre_Commit_Max_Fields>;
  min?: Maybe<Pre_Commit_Min_Fields>;
  stddev?: Maybe<Pre_Commit_Stddev_Fields>;
  stddev_pop?: Maybe<Pre_Commit_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Pre_Commit_Stddev_Samp_Fields>;
  sum?: Maybe<Pre_Commit_Sum_Fields>;
  var_pop?: Maybe<Pre_Commit_Var_Pop_Fields>;
  var_samp?: Maybe<Pre_Commit_Var_Samp_Fields>;
  variance?: Maybe<Pre_Commit_Variance_Fields>;
};


/** aggregate fields of "pre_commit" */
export type Pre_Commit_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pre_Commit_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "pre_commit" */
export type Pre_Commit_Aggregate_Order_By = {
  avg?: InputMaybe<Pre_Commit_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Pre_Commit_Max_Order_By>;
  min?: InputMaybe<Pre_Commit_Min_Order_By>;
  stddev?: InputMaybe<Pre_Commit_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Pre_Commit_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Pre_Commit_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Pre_Commit_Sum_Order_By>;
  var_pop?: InputMaybe<Pre_Commit_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Pre_Commit_Var_Samp_Order_By>;
  variance?: InputMaybe<Pre_Commit_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Pre_Commit_Avg_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  proposer_priority?: Maybe<Scalars['Float']['output']>;
  voting_power?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "pre_commit" */
export type Pre_Commit_Avg_Order_By = {
  height?: InputMaybe<Order_By>;
  proposer_priority?: InputMaybe<Order_By>;
  voting_power?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "pre_commit". All fields are combined with a logical 'AND'. */
export type Pre_Commit_Bool_Exp = {
  _and?: InputMaybe<Array<Pre_Commit_Bool_Exp>>;
  _not?: InputMaybe<Pre_Commit_Bool_Exp>;
  _or?: InputMaybe<Array<Pre_Commit_Bool_Exp>>;
  height?: InputMaybe<Bigint_Comparison_Exp>;
  proposer_priority?: InputMaybe<Bigint_Comparison_Exp>;
  timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  validator?: InputMaybe<Validator_Bool_Exp>;
  validator_address?: InputMaybe<String_Comparison_Exp>;
  voting_power?: InputMaybe<Bigint_Comparison_Exp>;
};

/** aggregate max on columns */
export type Pre_Commit_Max_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  proposer_priority?: Maybe<Scalars['bigint']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  validator_address?: Maybe<Scalars['String']['output']>;
  voting_power?: Maybe<Scalars['bigint']['output']>;
};

/** order by max() on columns of table "pre_commit" */
export type Pre_Commit_Max_Order_By = {
  height?: InputMaybe<Order_By>;
  proposer_priority?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  validator_address?: InputMaybe<Order_By>;
  voting_power?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Pre_Commit_Min_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  proposer_priority?: Maybe<Scalars['bigint']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  validator_address?: Maybe<Scalars['String']['output']>;
  voting_power?: Maybe<Scalars['bigint']['output']>;
};

/** order by min() on columns of table "pre_commit" */
export type Pre_Commit_Min_Order_By = {
  height?: InputMaybe<Order_By>;
  proposer_priority?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  validator_address?: InputMaybe<Order_By>;
  voting_power?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "pre_commit". */
export type Pre_Commit_Order_By = {
  height?: InputMaybe<Order_By>;
  proposer_priority?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  validator?: InputMaybe<Validator_Order_By>;
  validator_address?: InputMaybe<Order_By>;
  voting_power?: InputMaybe<Order_By>;
};

/** select columns of table "pre_commit" */
export enum Pre_Commit_Select_Column {
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
export type Pre_Commit_Stddev_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  proposer_priority?: Maybe<Scalars['Float']['output']>;
  voting_power?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "pre_commit" */
export type Pre_Commit_Stddev_Order_By = {
  height?: InputMaybe<Order_By>;
  proposer_priority?: InputMaybe<Order_By>;
  voting_power?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Pre_Commit_Stddev_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  proposer_priority?: Maybe<Scalars['Float']['output']>;
  voting_power?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "pre_commit" */
export type Pre_Commit_Stddev_Pop_Order_By = {
  height?: InputMaybe<Order_By>;
  proposer_priority?: InputMaybe<Order_By>;
  voting_power?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Pre_Commit_Stddev_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  proposer_priority?: Maybe<Scalars['Float']['output']>;
  voting_power?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "pre_commit" */
export type Pre_Commit_Stddev_Samp_Order_By = {
  height?: InputMaybe<Order_By>;
  proposer_priority?: InputMaybe<Order_By>;
  voting_power?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Pre_Commit_Sum_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  proposer_priority?: Maybe<Scalars['bigint']['output']>;
  voting_power?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "pre_commit" */
export type Pre_Commit_Sum_Order_By = {
  height?: InputMaybe<Order_By>;
  proposer_priority?: InputMaybe<Order_By>;
  voting_power?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Pre_Commit_Var_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  proposer_priority?: Maybe<Scalars['Float']['output']>;
  voting_power?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "pre_commit" */
export type Pre_Commit_Var_Pop_Order_By = {
  height?: InputMaybe<Order_By>;
  proposer_priority?: InputMaybe<Order_By>;
  voting_power?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Pre_Commit_Var_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  proposer_priority?: Maybe<Scalars['Float']['output']>;
  voting_power?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "pre_commit" */
export type Pre_Commit_Var_Samp_Order_By = {
  height?: InputMaybe<Order_By>;
  proposer_priority?: InputMaybe<Order_By>;
  voting_power?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Pre_Commit_Variance_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  proposer_priority?: Maybe<Scalars['Float']['output']>;
  voting_power?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "pre_commit" */
export type Pre_Commit_Variance_Order_By = {
  height?: InputMaybe<Order_By>;
  proposer_priority?: InputMaybe<Order_By>;
  voting_power?: InputMaybe<Order_By>;
};

/** columns and relationships of "pre_commits_rewards_view" */
export type Pre_Commits_Rewards_View = {
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  max_block?: Maybe<Scalars['bigint']['output']>;
  pre_commit_rewards?: Maybe<Scalars['numeric']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
  sum_precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "pre_commits_rewards_view" */
export type Pre_Commits_Rewards_View_Aggregate = {
  aggregate?: Maybe<Pre_Commits_Rewards_View_Aggregate_Fields>;
  nodes: Array<Pre_Commits_Rewards_View>;
};

/** aggregate fields of "pre_commits_rewards_view" */
export type Pre_Commits_Rewards_View_Aggregate_Fields = {
  avg?: Maybe<Pre_Commits_Rewards_View_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Pre_Commits_Rewards_View_Max_Fields>;
  min?: Maybe<Pre_Commits_Rewards_View_Min_Fields>;
  stddev?: Maybe<Pre_Commits_Rewards_View_Stddev_Fields>;
  stddev_pop?: Maybe<Pre_Commits_Rewards_View_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Pre_Commits_Rewards_View_Stddev_Samp_Fields>;
  sum?: Maybe<Pre_Commits_Rewards_View_Sum_Fields>;
  var_pop?: Maybe<Pre_Commits_Rewards_View_Var_Pop_Fields>;
  var_samp?: Maybe<Pre_Commits_Rewards_View_Var_Samp_Fields>;
  variance?: Maybe<Pre_Commits_Rewards_View_Variance_Fields>;
};


/** aggregate fields of "pre_commits_rewards_view" */
export type Pre_Commits_Rewards_View_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pre_Commits_Rewards_View_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Pre_Commits_Rewards_View_Avg_Fields = {
  max_block?: Maybe<Scalars['Float']['output']>;
  pre_commit_rewards?: Maybe<Scalars['Float']['output']>;
  precommits?: Maybe<Scalars['Float']['output']>;
  sum_precommits?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pre_commits_rewards_view". All fields are combined with a logical 'AND'. */
export type Pre_Commits_Rewards_View_Bool_Exp = {
  _and?: InputMaybe<Array<Pre_Commits_Rewards_View_Bool_Exp>>;
  _not?: InputMaybe<Pre_Commits_Rewards_View_Bool_Exp>;
  _or?: InputMaybe<Array<Pre_Commits_Rewards_View_Bool_Exp>>;
  consensus_pubkey?: InputMaybe<String_Comparison_Exp>;
  max_block?: InputMaybe<Bigint_Comparison_Exp>;
  pre_commit_rewards?: InputMaybe<Numeric_Comparison_Exp>;
  precommits?: InputMaybe<Numeric_Comparison_Exp>;
  sum_precommits?: InputMaybe<Numeric_Comparison_Exp>;
};

/** aggregate max on columns */
export type Pre_Commits_Rewards_View_Max_Fields = {
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  max_block?: Maybe<Scalars['bigint']['output']>;
  pre_commit_rewards?: Maybe<Scalars['numeric']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
  sum_precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type Pre_Commits_Rewards_View_Min_Fields = {
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  max_block?: Maybe<Scalars['bigint']['output']>;
  pre_commit_rewards?: Maybe<Scalars['numeric']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
  sum_precommits?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "pre_commits_rewards_view". */
export type Pre_Commits_Rewards_View_Order_By = {
  consensus_pubkey?: InputMaybe<Order_By>;
  max_block?: InputMaybe<Order_By>;
  pre_commit_rewards?: InputMaybe<Order_By>;
  precommits?: InputMaybe<Order_By>;
  sum_precommits?: InputMaybe<Order_By>;
};

/** select columns of table "pre_commits_rewards_view" */
export enum Pre_Commits_Rewards_View_Select_Column {
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
export type Pre_Commits_Rewards_View_Stddev_Fields = {
  max_block?: Maybe<Scalars['Float']['output']>;
  pre_commit_rewards?: Maybe<Scalars['Float']['output']>;
  precommits?: Maybe<Scalars['Float']['output']>;
  sum_precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Pre_Commits_Rewards_View_Stddev_Pop_Fields = {
  max_block?: Maybe<Scalars['Float']['output']>;
  pre_commit_rewards?: Maybe<Scalars['Float']['output']>;
  precommits?: Maybe<Scalars['Float']['output']>;
  sum_precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Pre_Commits_Rewards_View_Stddev_Samp_Fields = {
  max_block?: Maybe<Scalars['Float']['output']>;
  pre_commit_rewards?: Maybe<Scalars['Float']['output']>;
  precommits?: Maybe<Scalars['Float']['output']>;
  sum_precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Pre_Commits_Rewards_View_Sum_Fields = {
  max_block?: Maybe<Scalars['bigint']['output']>;
  pre_commit_rewards?: Maybe<Scalars['numeric']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
  sum_precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type Pre_Commits_Rewards_View_Var_Pop_Fields = {
  max_block?: Maybe<Scalars['Float']['output']>;
  pre_commit_rewards?: Maybe<Scalars['Float']['output']>;
  precommits?: Maybe<Scalars['Float']['output']>;
  sum_precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Pre_Commits_Rewards_View_Var_Samp_Fields = {
  max_block?: Maybe<Scalars['Float']['output']>;
  pre_commit_rewards?: Maybe<Scalars['Float']['output']>;
  precommits?: Maybe<Scalars['Float']['output']>;
  sum_precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Pre_Commits_Rewards_View_Variance_Fields = {
  max_block?: Maybe<Scalars['Float']['output']>;
  pre_commit_rewards?: Maybe<Scalars['Float']['output']>;
  precommits?: Maybe<Scalars['Float']['output']>;
  sum_precommits?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "pre_commits_total" */
export type Pre_Commits_Total = {
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  pre_commits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "pre_commits_total" */
export type Pre_Commits_Total_Aggregate = {
  aggregate?: Maybe<Pre_Commits_Total_Aggregate_Fields>;
  nodes: Array<Pre_Commits_Total>;
};

/** aggregate fields of "pre_commits_total" */
export type Pre_Commits_Total_Aggregate_Fields = {
  avg?: Maybe<Pre_Commits_Total_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Pre_Commits_Total_Max_Fields>;
  min?: Maybe<Pre_Commits_Total_Min_Fields>;
  stddev?: Maybe<Pre_Commits_Total_Stddev_Fields>;
  stddev_pop?: Maybe<Pre_Commits_Total_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Pre_Commits_Total_Stddev_Samp_Fields>;
  sum?: Maybe<Pre_Commits_Total_Sum_Fields>;
  var_pop?: Maybe<Pre_Commits_Total_Var_Pop_Fields>;
  var_samp?: Maybe<Pre_Commits_Total_Var_Samp_Fields>;
  variance?: Maybe<Pre_Commits_Total_Variance_Fields>;
};


/** aggregate fields of "pre_commits_total" */
export type Pre_Commits_Total_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pre_Commits_Total_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Pre_Commits_Total_Avg_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pre_commits_total". All fields are combined with a logical 'AND'. */
export type Pre_Commits_Total_Bool_Exp = {
  _and?: InputMaybe<Array<Pre_Commits_Total_Bool_Exp>>;
  _not?: InputMaybe<Pre_Commits_Total_Bool_Exp>;
  _or?: InputMaybe<Array<Pre_Commits_Total_Bool_Exp>>;
  consensus_pubkey?: InputMaybe<String_Comparison_Exp>;
  pre_commits?: InputMaybe<Numeric_Comparison_Exp>;
};

/** aggregate max on columns */
export type Pre_Commits_Total_Max_Fields = {
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  pre_commits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type Pre_Commits_Total_Min_Fields = {
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  pre_commits?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "pre_commits_total". */
export type Pre_Commits_Total_Order_By = {
  consensus_pubkey?: InputMaybe<Order_By>;
  pre_commits?: InputMaybe<Order_By>;
};

/** select columns of table "pre_commits_total" */
export enum Pre_Commits_Total_Select_Column {
  /** column name */
  ConsensusPubkey = 'consensus_pubkey',
  /** column name */
  PreCommits = 'pre_commits'
}

/** aggregate stddev on columns */
export type Pre_Commits_Total_Stddev_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Pre_Commits_Total_Stddev_Pop_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Pre_Commits_Total_Stddev_Samp_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Pre_Commits_Total_Sum_Fields = {
  pre_commits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type Pre_Commits_Total_Var_Pop_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Pre_Commits_Total_Var_Samp_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Pre_Commits_Total_Variance_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "pre_commits_view" */
export type Pre_Commits_View = {
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "pre_commits_view" */
export type Pre_Commits_View_Aggregate = {
  aggregate?: Maybe<Pre_Commits_View_Aggregate_Fields>;
  nodes: Array<Pre_Commits_View>;
};

/** aggregate fields of "pre_commits_view" */
export type Pre_Commits_View_Aggregate_Fields = {
  avg?: Maybe<Pre_Commits_View_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Pre_Commits_View_Max_Fields>;
  min?: Maybe<Pre_Commits_View_Min_Fields>;
  stddev?: Maybe<Pre_Commits_View_Stddev_Fields>;
  stddev_pop?: Maybe<Pre_Commits_View_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Pre_Commits_View_Stddev_Samp_Fields>;
  sum?: Maybe<Pre_Commits_View_Sum_Fields>;
  var_pop?: Maybe<Pre_Commits_View_Var_Pop_Fields>;
  var_samp?: Maybe<Pre_Commits_View_Var_Samp_Fields>;
  variance?: Maybe<Pre_Commits_View_Variance_Fields>;
};


/** aggregate fields of "pre_commits_view" */
export type Pre_Commits_View_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pre_Commits_View_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Pre_Commits_View_Avg_Fields = {
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pre_commits_view". All fields are combined with a logical 'AND'. */
export type Pre_Commits_View_Bool_Exp = {
  _and?: InputMaybe<Array<Pre_Commits_View_Bool_Exp>>;
  _not?: InputMaybe<Pre_Commits_View_Bool_Exp>;
  _or?: InputMaybe<Array<Pre_Commits_View_Bool_Exp>>;
  consensus_address?: InputMaybe<String_Comparison_Exp>;
  consensus_pubkey?: InputMaybe<String_Comparison_Exp>;
  precommits?: InputMaybe<Numeric_Comparison_Exp>;
};

/** aggregate max on columns */
export type Pre_Commits_View_Max_Fields = {
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type Pre_Commits_View_Min_Fields = {
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "pre_commits_view". */
export type Pre_Commits_View_Order_By = {
  consensus_address?: InputMaybe<Order_By>;
  consensus_pubkey?: InputMaybe<Order_By>;
  precommits?: InputMaybe<Order_By>;
};

/** select columns of table "pre_commits_view" */
export enum Pre_Commits_View_Select_Column {
  /** column name */
  ConsensusAddress = 'consensus_address',
  /** column name */
  ConsensusPubkey = 'consensus_pubkey',
  /** column name */
  Precommits = 'precommits'
}

/** aggregate stddev on columns */
export type Pre_Commits_View_Stddev_Fields = {
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Pre_Commits_View_Stddev_Pop_Fields = {
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Pre_Commits_View_Stddev_Samp_Fields = {
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Pre_Commits_View_Sum_Fields = {
  precommits?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type Pre_Commits_View_Var_Pop_Fields = {
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Pre_Commits_View_Var_Samp_Fields = {
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Pre_Commits_View_Variance_Fields = {
  precommits?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "pruning" */
export type Pruning = {
  last_pruned_height: Scalars['bigint']['output'];
};

/** aggregated selection of "pruning" */
export type Pruning_Aggregate = {
  aggregate?: Maybe<Pruning_Aggregate_Fields>;
  nodes: Array<Pruning>;
};

/** aggregate fields of "pruning" */
export type Pruning_Aggregate_Fields = {
  avg?: Maybe<Pruning_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Pruning_Max_Fields>;
  min?: Maybe<Pruning_Min_Fields>;
  stddev?: Maybe<Pruning_Stddev_Fields>;
  stddev_pop?: Maybe<Pruning_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Pruning_Stddev_Samp_Fields>;
  sum?: Maybe<Pruning_Sum_Fields>;
  var_pop?: Maybe<Pruning_Var_Pop_Fields>;
  var_samp?: Maybe<Pruning_Var_Samp_Fields>;
  variance?: Maybe<Pruning_Variance_Fields>;
};


/** aggregate fields of "pruning" */
export type Pruning_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pruning_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Pruning_Avg_Fields = {
  last_pruned_height?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pruning". All fields are combined with a logical 'AND'. */
export type Pruning_Bool_Exp = {
  _and?: InputMaybe<Array<Pruning_Bool_Exp>>;
  _not?: InputMaybe<Pruning_Bool_Exp>;
  _or?: InputMaybe<Array<Pruning_Bool_Exp>>;
  last_pruned_height?: InputMaybe<Bigint_Comparison_Exp>;
};

/** aggregate max on columns */
export type Pruning_Max_Fields = {
  last_pruned_height?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type Pruning_Min_Fields = {
  last_pruned_height?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "pruning". */
export type Pruning_Order_By = {
  last_pruned_height?: InputMaybe<Order_By>;
};

/** select columns of table "pruning" */
export enum Pruning_Select_Column {
  /** column name */
  LastPrunedHeight = 'last_pruned_height'
}

/** aggregate stddev on columns */
export type Pruning_Stddev_Fields = {
  last_pruned_height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Pruning_Stddev_Pop_Fields = {
  last_pruned_height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Pruning_Stddev_Samp_Fields = {
  last_pruned_height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Pruning_Sum_Fields = {
  last_pruned_height?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Pruning_Var_Pop_Fields = {
  last_pruned_height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Pruning_Var_Samp_Fields = {
  last_pruned_height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Pruning_Variance_Fields = {
  last_pruned_height?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "pussy_gift_proofs" */
export type Pussy_Gift_Proofs = {
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  details?: Maybe<Scalars['String']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "pussy_gift_proofs" */
export type Pussy_Gift_Proofs_Aggregate = {
  aggregate?: Maybe<Pussy_Gift_Proofs_Aggregate_Fields>;
  nodes: Array<Pussy_Gift_Proofs>;
};

/** aggregate fields of "pussy_gift_proofs" */
export type Pussy_Gift_Proofs_Aggregate_Fields = {
  avg?: Maybe<Pussy_Gift_Proofs_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Pussy_Gift_Proofs_Max_Fields>;
  min?: Maybe<Pussy_Gift_Proofs_Min_Fields>;
  stddev?: Maybe<Pussy_Gift_Proofs_Stddev_Fields>;
  stddev_pop?: Maybe<Pussy_Gift_Proofs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Pussy_Gift_Proofs_Stddev_Samp_Fields>;
  sum?: Maybe<Pussy_Gift_Proofs_Sum_Fields>;
  var_pop?: Maybe<Pussy_Gift_Proofs_Var_Pop_Fields>;
  var_samp?: Maybe<Pussy_Gift_Proofs_Var_Samp_Fields>;
  variance?: Maybe<Pussy_Gift_Proofs_Variance_Fields>;
};


/** aggregate fields of "pussy_gift_proofs" */
export type Pussy_Gift_Proofs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pussy_Gift_Proofs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Pussy_Gift_Proofs_Avg_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "pussy_gift_proofs". All fields are combined with a logical 'AND'. */
export type Pussy_Gift_Proofs_Bool_Exp = {
  _and?: InputMaybe<Array<Pussy_Gift_Proofs_Bool_Exp>>;
  _not?: InputMaybe<Pussy_Gift_Proofs_Bool_Exp>;
  _or?: InputMaybe<Array<Pussy_Gift_Proofs_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  amount?: InputMaybe<Bigint_Comparison_Exp>;
  details?: InputMaybe<String_Comparison_Exp>;
  proof?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Pussy_Gift_Proofs_Max_Fields = {
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  details?: Maybe<Scalars['String']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Pussy_Gift_Proofs_Min_Fields = {
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  details?: Maybe<Scalars['String']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "pussy_gift_proofs". */
export type Pussy_Gift_Proofs_Order_By = {
  address?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  details?: InputMaybe<Order_By>;
  proof?: InputMaybe<Order_By>;
};

/** select columns of table "pussy_gift_proofs" */
export enum Pussy_Gift_Proofs_Select_Column {
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
export type Pussy_Gift_Proofs_Stddev_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Pussy_Gift_Proofs_Stddev_Pop_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Pussy_Gift_Proofs_Stddev_Samp_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Pussy_Gift_Proofs_Sum_Fields = {
  amount?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Pussy_Gift_Proofs_Var_Pop_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Pussy_Gift_Proofs_Var_Samp_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Pussy_Gift_Proofs_Variance_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

export type Query_Root = {
  /** fetch data from the table: "_transaction" */
  _transaction: Array<_Transaction>;
  /** fetch aggregated fields from the table: "_transaction" */
  _transaction_aggregate: _Transaction_Aggregate;
  /** fetch data from the table: "_uptime_temp" */
  _uptime_temp: Array<_Uptime_Temp>;
  /** fetch aggregated fields from the table: "_uptime_temp" */
  _uptime_temp_aggregate: _Uptime_Temp_Aggregate;
  /** fetch data from the table: "account" */
  account: Array<Account>;
  /** fetch aggregated fields from the table: "account" */
  account_aggregate: Account_Aggregate;
  /** fetch data from the table: "account_balance" */
  account_balance: Array<Account_Balance>;
  /** fetch aggregated fields from the table: "account_balance" */
  account_balance_aggregate: Account_Balance_Aggregate;
  /** fetch data from the table: "account_balance" using primary key columns */
  account_balance_by_pk?: Maybe<Account_Balance>;
  /** fetch data from the table: "account" using primary key columns */
  account_by_pk?: Maybe<Account>;
  /** fetch data from the table: "block" */
  block: Array<Block>;
  /** fetch aggregated fields from the table: "block" */
  block_aggregate: Block_Aggregate;
  /** fetch data from the table: "block" using primary key columns */
  block_by_pk?: Maybe<Block>;
  /** fetch data from the table: "contracts" */
  contracts: Array<Contracts>;
  /** fetch aggregated fields from the table: "contracts" */
  contracts_aggregate: Contracts_Aggregate;
  /** fetch data from the table: "contracts" using primary key columns */
  contracts_by_pk?: Maybe<Contracts>;
  /** fetch data from the table: "cyb_cohort" */
  cyb_cohort: Array<Cyb_Cohort>;
  /** fetch aggregated fields from the table: "cyb_cohort" */
  cyb_cohort_aggregate: Cyb_Cohort_Aggregate;
  /** fetch data from the table: "cyb_new_cohort" */
  cyb_new_cohort: Array<Cyb_New_Cohort>;
  /** fetch aggregated fields from the table: "cyb_new_cohort" */
  cyb_new_cohort_aggregate: Cyb_New_Cohort_Aggregate;
  /** fetch data from the table: "cyber_gift" */
  cyber_gift: Array<Cyber_Gift>;
  /** fetch aggregated fields from the table: "cyber_gift" */
  cyber_gift_aggregate: Cyber_Gift_Aggregate;
  /** fetch data from the table: "cyber_gift_proofs" */
  cyber_gift_proofs: Array<Cyber_Gift_Proofs>;
  /** fetch aggregated fields from the table: "cyber_gift_proofs" */
  cyber_gift_proofs_aggregate: Cyber_Gift_Proofs_Aggregate;
  /** fetch data from the table: "cyberlinks" */
  cyberlinks: Array<Cyberlinks>;
  /** An aggregate relationship */
  cyberlinks_aggregate: Cyberlinks_Aggregate;
  /** fetch data from the table: "cyberlinks" using primary key columns */
  cyberlinks_by_pk?: Maybe<Cyberlinks>;
  /** fetch data from the table: "cyberlinks_stats" */
  cyberlinks_stats: Array<Cyberlinks_Stats>;
  /** fetch aggregated fields from the table: "cyberlinks_stats" */
  cyberlinks_stats_aggregate: Cyberlinks_Stats_Aggregate;
  /** fetch data from the table: "daily_amount_of_active_neurons" */
  daily_amount_of_active_neurons: Array<Daily_Amount_Of_Active_Neurons>;
  /** fetch aggregated fields from the table: "daily_amount_of_active_neurons" */
  daily_amount_of_active_neurons_aggregate: Daily_Amount_Of_Active_Neurons_Aggregate;
  /** fetch data from the table: "daily_amount_of_used_gas" */
  daily_amount_of_used_gas: Array<Daily_Amount_Of_Used_Gas>;
  /** fetch aggregated fields from the table: "daily_amount_of_used_gas" */
  daily_amount_of_used_gas_aggregate: Daily_Amount_Of_Used_Gas_Aggregate;
  /** fetch data from the table: "daily_number_of_transactions" */
  daily_number_of_transactions: Array<Daily_Number_Of_Transactions>;
  /** fetch aggregated fields from the table: "daily_number_of_transactions" */
  daily_number_of_transactions_aggregate: Daily_Number_Of_Transactions_Aggregate;
  /** fetch data from the table: "follow_stats" */
  follow_stats: Array<Follow_Stats>;
  /** fetch aggregated fields from the table: "follow_stats" */
  follow_stats_aggregate: Follow_Stats_Aggregate;
  /** fetch data from the table: "genesis_neurons_activation" */
  genesis_neurons_activation: Array<Genesis_Neurons_Activation>;
  /** fetch aggregated fields from the table: "genesis_neurons_activation" */
  genesis_neurons_activation_aggregate: Genesis_Neurons_Activation_Aggregate;
  /** An array relationship */
  investmints: Array<Investmints>;
  /** An aggregate relationship */
  investmints_aggregate: Investmints_Aggregate;
  /** fetch data from the table: "investmints" using primary key columns */
  investmints_by_pk?: Maybe<Investmints>;
  /** fetch data from the table: "message" */
  message: Array<Message>;
  /** fetch aggregated fields from the table: "message" */
  message_aggregate: Message_Aggregate;
  /** execute function "messages_by_address" which returns "message" */
  messages_by_address: Array<Message>;
  /** execute function "messages_by_address" and query aggregates on result of table type "message" */
  messages_by_address_aggregate: Message_Aggregate;
  /** fetch data from the table: "modules" */
  modules: Array<Modules>;
  /** fetch aggregated fields from the table: "modules" */
  modules_aggregate: Modules_Aggregate;
  /** fetch data from the table: "modules" using primary key columns */
  modules_by_pk?: Maybe<Modules>;
  /** fetch data from the table: "neuron_activation_source" */
  neuron_activation_source: Array<Neuron_Activation_Source>;
  /** fetch aggregated fields from the table: "neuron_activation_source" */
  neuron_activation_source_aggregate: Neuron_Activation_Source_Aggregate;
  /** fetch data from the table: "number_of_new_neurons" */
  number_of_new_neurons: Array<Number_Of_New_Neurons>;
  /** fetch aggregated fields from the table: "number_of_new_neurons" */
  number_of_new_neurons_aggregate: Number_Of_New_Neurons_Aggregate;
  /** fetch data from the table: "old_precommits" */
  old_precommits: Array<Old_Precommits>;
  /** fetch aggregated fields from the table: "old_precommits" */
  old_precommits_aggregate: Old_Precommits_Aggregate;
  /** fetch data from the table: "old_precommits" using primary key columns */
  old_precommits_by_pk?: Maybe<Old_Precommits>;
  /** An array relationship */
  particles: Array<Particles>;
  /** An aggregate relationship */
  particles_aggregate: Particles_Aggregate;
  /** fetch data from the table: "particles" using primary key columns */
  particles_by_pk?: Maybe<Particles>;
  /** fetch data from the table: "pre_commit" */
  pre_commit: Array<Pre_Commit>;
  /** fetch aggregated fields from the table: "pre_commit" */
  pre_commit_aggregate: Pre_Commit_Aggregate;
  /** fetch data from the table: "pre_commits_rewards_view" */
  pre_commits_rewards_view: Array<Pre_Commits_Rewards_View>;
  /** fetch aggregated fields from the table: "pre_commits_rewards_view" */
  pre_commits_rewards_view_aggregate: Pre_Commits_Rewards_View_Aggregate;
  /** fetch data from the table: "pre_commits_total" */
  pre_commits_total: Array<Pre_Commits_Total>;
  /** fetch aggregated fields from the table: "pre_commits_total" */
  pre_commits_total_aggregate: Pre_Commits_Total_Aggregate;
  /** fetch data from the table: "pre_commits_view" */
  pre_commits_view: Array<Pre_Commits_View>;
  /** fetch aggregated fields from the table: "pre_commits_view" */
  pre_commits_view_aggregate: Pre_Commits_View_Aggregate;
  /** fetch data from the table: "pruning" */
  pruning: Array<Pruning>;
  /** fetch aggregated fields from the table: "pruning" */
  pruning_aggregate: Pruning_Aggregate;
  /** fetch data from the table: "pussy_gift_proofs" */
  pussy_gift_proofs: Array<Pussy_Gift_Proofs>;
  /** fetch aggregated fields from the table: "pussy_gift_proofs" */
  pussy_gift_proofs_aggregate: Pussy_Gift_Proofs_Aggregate;
  /** An array relationship */
  routes: Array<Routes>;
  /** An aggregate relationship */
  routes_aggregate: Routes_Aggregate;
  /** fetch data from the table: "routes" using primary key columns */
  routes_by_pk?: Maybe<Routes>;
  /** fetch data from the table: "supply" */
  supply: Array<Supply>;
  /** fetch aggregated fields from the table: "supply" */
  supply_aggregate: Supply_Aggregate;
  /** fetch data from the table: "supply" using primary key columns */
  supply_by_pk?: Maybe<Supply>;
  /** fetch data from the table: "test_gift" */
  test_gift: Array<Test_Gift>;
  /** fetch aggregated fields from the table: "test_gift" */
  test_gift_aggregate: Test_Gift_Aggregate;
  /** fetch data from the table: "today_top_txs" */
  today_top_txs: Array<Today_Top_Txs>;
  /** fetch aggregated fields from the table: "today_top_txs" */
  today_top_txs_aggregate: Today_Top_Txs_Aggregate;
  /** fetch data from the table: "top_10_of_active_neurons_week" */
  top_10_of_active_neurons_week: Array<Top_10_Of_Active_Neurons_Week>;
  /** fetch aggregated fields from the table: "top_10_of_active_neurons_week" */
  top_10_of_active_neurons_week_aggregate: Top_10_Of_Active_Neurons_Week_Aggregate;
  /** fetch data from the table: "top_first_txs" */
  top_first_txs: Array<Top_First_Txs>;
  /** fetch aggregated fields from the table: "top_first_txs" */
  top_first_txs_aggregate: Top_First_Txs_Aggregate;
  /** fetch data from the table: "top_leaders" */
  top_leaders: Array<Top_Leaders>;
  /** fetch data from the table: "top_txs" */
  top_txs: Array<Top_Txs>;
  /** fetch aggregated fields from the table: "top_txs" */
  top_txs_aggregate: Top_Txs_Aggregate;
  /** fetch data from the table: "transaction" */
  transaction: Array<Transaction>;
  /** fetch aggregated fields from the table: "transaction" */
  transaction_aggregate: Transaction_Aggregate;
  /** fetch data from the table: "transaction" using primary key columns */
  transaction_by_pk?: Maybe<Transaction>;
  /** fetch data from the table: "tweets_stats" */
  tweets_stats: Array<Tweets_Stats>;
  /** fetch aggregated fields from the table: "tweets_stats" */
  tweets_stats_aggregate: Tweets_Stats_Aggregate;
  /** fetch data from the table: "txs_ranked" */
  txs_ranked: Array<Txs_Ranked>;
  /** fetch aggregated fields from the table: "txs_ranked" */
  txs_ranked_aggregate: Txs_Ranked_Aggregate;
  /** fetch data from the table: "txs_stats" */
  txs_stats: Array<Txs_Stats>;
  /** fetch aggregated fields from the table: "txs_stats" */
  txs_stats_aggregate: Txs_Stats_Aggregate;
  /** fetch data from the table: "uptime" */
  uptime: Array<Uptime>;
  /** fetch aggregated fields from the table: "uptime" */
  uptime_aggregate: Uptime_Aggregate;
  /** fetch data from the table: "validator" */
  validator: Array<Validator>;
  /** fetch aggregated fields from the table: "validator" */
  validator_aggregate: Validator_Aggregate;
  /** fetch data from the table: "validator" using primary key columns */
  validator_by_pk?: Maybe<Validator>;
  /** fetch data from the table: "volts_demand" */
  volts_demand: Array<Volts_Demand>;
  /** fetch aggregated fields from the table: "volts_demand" */
  volts_demand_aggregate: Volts_Demand_Aggregate;
  /** fetch data from the table: "volts_stats" */
  volts_stats: Array<Volts_Stats>;
  /** fetch aggregated fields from the table: "volts_stats" */
  volts_stats_aggregate: Volts_Stats_Aggregate;
};


export type Query_Root_TransactionArgs = {
  distinct_on?: InputMaybe<Array<_Transaction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<_Transaction_Order_By>>;
  where?: InputMaybe<_Transaction_Bool_Exp>;
};


export type Query_Root_Transaction_AggregateArgs = {
  distinct_on?: InputMaybe<Array<_Transaction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<_Transaction_Order_By>>;
  where?: InputMaybe<_Transaction_Bool_Exp>;
};


export type Query_Root_Uptime_TempArgs = {
  distinct_on?: InputMaybe<Array<_Uptime_Temp_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<_Uptime_Temp_Order_By>>;
  where?: InputMaybe<_Uptime_Temp_Bool_Exp>;
};


export type Query_Root_Uptime_Temp_AggregateArgs = {
  distinct_on?: InputMaybe<Array<_Uptime_Temp_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<_Uptime_Temp_Order_By>>;
  where?: InputMaybe<_Uptime_Temp_Bool_Exp>;
};


export type Query_RootAccountArgs = {
  distinct_on?: InputMaybe<Array<Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Order_By>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Query_RootAccount_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Order_By>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Query_RootAccount_BalanceArgs = {
  distinct_on?: InputMaybe<Array<Account_Balance_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Balance_Order_By>>;
  where?: InputMaybe<Account_Balance_Bool_Exp>;
};


export type Query_RootAccount_Balance_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Account_Balance_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Balance_Order_By>>;
  where?: InputMaybe<Account_Balance_Bool_Exp>;
};


export type Query_RootAccount_Balance_By_PkArgs = {
  address: Scalars['String']['input'];
};


export type Query_RootAccount_By_PkArgs = {
  address: Scalars['String']['input'];
};


export type Query_RootBlockArgs = {
  distinct_on?: InputMaybe<Array<Block_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Block_Order_By>>;
  where?: InputMaybe<Block_Bool_Exp>;
};


export type Query_RootBlock_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Block_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Block_Order_By>>;
  where?: InputMaybe<Block_Bool_Exp>;
};


export type Query_RootBlock_By_PkArgs = {
  height: Scalars['bigint']['input'];
};


export type Query_RootContractsArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};


export type Query_RootContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};


export type Query_RootContracts_By_PkArgs = {
  address: Scalars['String']['input'];
};


export type Query_RootCyb_CohortArgs = {
  distinct_on?: InputMaybe<Array<Cyb_Cohort_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyb_Cohort_Order_By>>;
  where?: InputMaybe<Cyb_Cohort_Bool_Exp>;
};


export type Query_RootCyb_Cohort_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyb_Cohort_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyb_Cohort_Order_By>>;
  where?: InputMaybe<Cyb_Cohort_Bool_Exp>;
};


export type Query_RootCyb_New_CohortArgs = {
  distinct_on?: InputMaybe<Array<Cyb_New_Cohort_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyb_New_Cohort_Order_By>>;
  where?: InputMaybe<Cyb_New_Cohort_Bool_Exp>;
};


export type Query_RootCyb_New_Cohort_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyb_New_Cohort_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyb_New_Cohort_Order_By>>;
  where?: InputMaybe<Cyb_New_Cohort_Bool_Exp>;
};


export type Query_RootCyber_GiftArgs = {
  distinct_on?: InputMaybe<Array<Cyber_Gift_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyber_Gift_Order_By>>;
  where?: InputMaybe<Cyber_Gift_Bool_Exp>;
};


export type Query_RootCyber_Gift_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyber_Gift_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyber_Gift_Order_By>>;
  where?: InputMaybe<Cyber_Gift_Bool_Exp>;
};


export type Query_RootCyber_Gift_ProofsArgs = {
  distinct_on?: InputMaybe<Array<Cyber_Gift_Proofs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyber_Gift_Proofs_Order_By>>;
  where?: InputMaybe<Cyber_Gift_Proofs_Bool_Exp>;
};


export type Query_RootCyber_Gift_Proofs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyber_Gift_Proofs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyber_Gift_Proofs_Order_By>>;
  where?: InputMaybe<Cyber_Gift_Proofs_Bool_Exp>;
};


export type Query_RootCyberlinksArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Order_By>>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
};


export type Query_RootCyberlinks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Order_By>>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
};


export type Query_RootCyberlinks_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootCyberlinks_StatsArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Stats_Order_By>>;
  where?: InputMaybe<Cyberlinks_Stats_Bool_Exp>;
};


export type Query_RootCyberlinks_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Stats_Order_By>>;
  where?: InputMaybe<Cyberlinks_Stats_Bool_Exp>;
};


export type Query_RootDaily_Amount_Of_Active_NeuronsArgs = {
  distinct_on?: InputMaybe<Array<Daily_Amount_Of_Active_Neurons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Daily_Amount_Of_Active_Neurons_Order_By>>;
  where?: InputMaybe<Daily_Amount_Of_Active_Neurons_Bool_Exp>;
};


export type Query_RootDaily_Amount_Of_Active_Neurons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Daily_Amount_Of_Active_Neurons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Daily_Amount_Of_Active_Neurons_Order_By>>;
  where?: InputMaybe<Daily_Amount_Of_Active_Neurons_Bool_Exp>;
};


export type Query_RootDaily_Amount_Of_Used_GasArgs = {
  distinct_on?: InputMaybe<Array<Daily_Amount_Of_Used_Gas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Daily_Amount_Of_Used_Gas_Order_By>>;
  where?: InputMaybe<Daily_Amount_Of_Used_Gas_Bool_Exp>;
};


export type Query_RootDaily_Amount_Of_Used_Gas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Daily_Amount_Of_Used_Gas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Daily_Amount_Of_Used_Gas_Order_By>>;
  where?: InputMaybe<Daily_Amount_Of_Used_Gas_Bool_Exp>;
};


export type Query_RootDaily_Number_Of_TransactionsArgs = {
  distinct_on?: InputMaybe<Array<Daily_Number_Of_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Daily_Number_Of_Transactions_Order_By>>;
  where?: InputMaybe<Daily_Number_Of_Transactions_Bool_Exp>;
};


export type Query_RootDaily_Number_Of_Transactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Daily_Number_Of_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Daily_Number_Of_Transactions_Order_By>>;
  where?: InputMaybe<Daily_Number_Of_Transactions_Bool_Exp>;
};


export type Query_RootFollow_StatsArgs = {
  distinct_on?: InputMaybe<Array<Follow_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Follow_Stats_Order_By>>;
  where?: InputMaybe<Follow_Stats_Bool_Exp>;
};


export type Query_RootFollow_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Follow_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Follow_Stats_Order_By>>;
  where?: InputMaybe<Follow_Stats_Bool_Exp>;
};


export type Query_RootGenesis_Neurons_ActivationArgs = {
  distinct_on?: InputMaybe<Array<Genesis_Neurons_Activation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Genesis_Neurons_Activation_Order_By>>;
  where?: InputMaybe<Genesis_Neurons_Activation_Bool_Exp>;
};


export type Query_RootGenesis_Neurons_Activation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Genesis_Neurons_Activation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Genesis_Neurons_Activation_Order_By>>;
  where?: InputMaybe<Genesis_Neurons_Activation_Bool_Exp>;
};


export type Query_RootInvestmintsArgs = {
  distinct_on?: InputMaybe<Array<Investmints_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Investmints_Order_By>>;
  where?: InputMaybe<Investmints_Bool_Exp>;
};


export type Query_RootInvestmints_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Investmints_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Investmints_Order_By>>;
  where?: InputMaybe<Investmints_Bool_Exp>;
};


export type Query_RootInvestmints_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootMessageArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Query_RootMessage_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Query_RootMessages_By_AddressArgs = {
  args: Messages_By_Address_Args;
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Query_RootMessages_By_Address_AggregateArgs = {
  args: Messages_By_Address_Args;
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Query_RootModulesArgs = {
  distinct_on?: InputMaybe<Array<Modules_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Modules_Order_By>>;
  where?: InputMaybe<Modules_Bool_Exp>;
};


export type Query_RootModules_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Modules_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Modules_Order_By>>;
  where?: InputMaybe<Modules_Bool_Exp>;
};


export type Query_RootModules_By_PkArgs = {
  module_name: Scalars['String']['input'];
};


export type Query_RootNeuron_Activation_SourceArgs = {
  distinct_on?: InputMaybe<Array<Neuron_Activation_Source_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Neuron_Activation_Source_Order_By>>;
  where?: InputMaybe<Neuron_Activation_Source_Bool_Exp>;
};


export type Query_RootNeuron_Activation_Source_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Neuron_Activation_Source_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Neuron_Activation_Source_Order_By>>;
  where?: InputMaybe<Neuron_Activation_Source_Bool_Exp>;
};


export type Query_RootNumber_Of_New_NeuronsArgs = {
  distinct_on?: InputMaybe<Array<Number_Of_New_Neurons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Number_Of_New_Neurons_Order_By>>;
  where?: InputMaybe<Number_Of_New_Neurons_Bool_Exp>;
};


export type Query_RootNumber_Of_New_Neurons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Number_Of_New_Neurons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Number_Of_New_Neurons_Order_By>>;
  where?: InputMaybe<Number_Of_New_Neurons_Bool_Exp>;
};


export type Query_RootOld_PrecommitsArgs = {
  distinct_on?: InputMaybe<Array<Old_Precommits_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Old_Precommits_Order_By>>;
  where?: InputMaybe<Old_Precommits_Bool_Exp>;
};


export type Query_RootOld_Precommits_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Old_Precommits_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Old_Precommits_Order_By>>;
  where?: InputMaybe<Old_Precommits_Bool_Exp>;
};


export type Query_RootOld_Precommits_By_PkArgs = {
  consensus_address: Scalars['String']['input'];
};


export type Query_RootParticlesArgs = {
  distinct_on?: InputMaybe<Array<Particles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Particles_Order_By>>;
  where?: InputMaybe<Particles_Bool_Exp>;
};


export type Query_RootParticles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Particles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Particles_Order_By>>;
  where?: InputMaybe<Particles_Bool_Exp>;
};


export type Query_RootParticles_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootPre_CommitArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commit_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commit_Order_By>>;
  where?: InputMaybe<Pre_Commit_Bool_Exp>;
};


export type Query_RootPre_Commit_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commit_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commit_Order_By>>;
  where?: InputMaybe<Pre_Commit_Bool_Exp>;
};


export type Query_RootPre_Commits_Rewards_ViewArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commits_Rewards_View_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commits_Rewards_View_Order_By>>;
  where?: InputMaybe<Pre_Commits_Rewards_View_Bool_Exp>;
};


export type Query_RootPre_Commits_Rewards_View_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commits_Rewards_View_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commits_Rewards_View_Order_By>>;
  where?: InputMaybe<Pre_Commits_Rewards_View_Bool_Exp>;
};


export type Query_RootPre_Commits_TotalArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commits_Total_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commits_Total_Order_By>>;
  where?: InputMaybe<Pre_Commits_Total_Bool_Exp>;
};


export type Query_RootPre_Commits_Total_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commits_Total_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commits_Total_Order_By>>;
  where?: InputMaybe<Pre_Commits_Total_Bool_Exp>;
};


export type Query_RootPre_Commits_ViewArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commits_View_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commits_View_Order_By>>;
  where?: InputMaybe<Pre_Commits_View_Bool_Exp>;
};


export type Query_RootPre_Commits_View_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commits_View_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commits_View_Order_By>>;
  where?: InputMaybe<Pre_Commits_View_Bool_Exp>;
};


export type Query_RootPruningArgs = {
  distinct_on?: InputMaybe<Array<Pruning_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pruning_Order_By>>;
  where?: InputMaybe<Pruning_Bool_Exp>;
};


export type Query_RootPruning_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pruning_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pruning_Order_By>>;
  where?: InputMaybe<Pruning_Bool_Exp>;
};


export type Query_RootPussy_Gift_ProofsArgs = {
  distinct_on?: InputMaybe<Array<Pussy_Gift_Proofs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pussy_Gift_Proofs_Order_By>>;
  where?: InputMaybe<Pussy_Gift_Proofs_Bool_Exp>;
};


export type Query_RootPussy_Gift_Proofs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pussy_Gift_Proofs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pussy_Gift_Proofs_Order_By>>;
  where?: InputMaybe<Pussy_Gift_Proofs_Bool_Exp>;
};


export type Query_RootRoutesArgs = {
  distinct_on?: InputMaybe<Array<Routes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Routes_Order_By>>;
  where?: InputMaybe<Routes_Bool_Exp>;
};


export type Query_RootRoutes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Routes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Routes_Order_By>>;
  where?: InputMaybe<Routes_Bool_Exp>;
};


export type Query_RootRoutes_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootSupplyArgs = {
  distinct_on?: InputMaybe<Array<Supply_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Supply_Order_By>>;
  where?: InputMaybe<Supply_Bool_Exp>;
};


export type Query_RootSupply_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Supply_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Supply_Order_By>>;
  where?: InputMaybe<Supply_Bool_Exp>;
};


export type Query_RootSupply_By_PkArgs = {
  one_row_id: Scalars['Boolean']['input'];
};


export type Query_RootTest_GiftArgs = {
  distinct_on?: InputMaybe<Array<Test_Gift_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Test_Gift_Order_By>>;
  where?: InputMaybe<Test_Gift_Bool_Exp>;
};


export type Query_RootTest_Gift_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Test_Gift_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Test_Gift_Order_By>>;
  where?: InputMaybe<Test_Gift_Bool_Exp>;
};


export type Query_RootToday_Top_TxsArgs = {
  distinct_on?: InputMaybe<Array<Today_Top_Txs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Today_Top_Txs_Order_By>>;
  where?: InputMaybe<Today_Top_Txs_Bool_Exp>;
};


export type Query_RootToday_Top_Txs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Today_Top_Txs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Today_Top_Txs_Order_By>>;
  where?: InputMaybe<Today_Top_Txs_Bool_Exp>;
};


export type Query_RootTop_10_Of_Active_Neurons_WeekArgs = {
  distinct_on?: InputMaybe<Array<Top_10_Of_Active_Neurons_Week_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_10_Of_Active_Neurons_Week_Order_By>>;
  where?: InputMaybe<Top_10_Of_Active_Neurons_Week_Bool_Exp>;
};


export type Query_RootTop_10_Of_Active_Neurons_Week_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Top_10_Of_Active_Neurons_Week_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_10_Of_Active_Neurons_Week_Order_By>>;
  where?: InputMaybe<Top_10_Of_Active_Neurons_Week_Bool_Exp>;
};


export type Query_RootTop_First_TxsArgs = {
  distinct_on?: InputMaybe<Array<Top_First_Txs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_First_Txs_Order_By>>;
  where?: InputMaybe<Top_First_Txs_Bool_Exp>;
};


export type Query_RootTop_First_Txs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Top_First_Txs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_First_Txs_Order_By>>;
  where?: InputMaybe<Top_First_Txs_Bool_Exp>;
};


export type Query_RootTop_LeadersArgs = {
  distinct_on?: InputMaybe<Array<Top_Leaders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_Leaders_Order_By>>;
  where?: InputMaybe<Top_Leaders_Bool_Exp>;
};


export type Query_RootTop_TxsArgs = {
  distinct_on?: InputMaybe<Array<Top_Txs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_Txs_Order_By>>;
  where?: InputMaybe<Top_Txs_Bool_Exp>;
};


export type Query_RootTop_Txs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Top_Txs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_Txs_Order_By>>;
  where?: InputMaybe<Top_Txs_Bool_Exp>;
};


export type Query_RootTransactionArgs = {
  distinct_on?: InputMaybe<Array<Transaction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_Order_By>>;
  where?: InputMaybe<Transaction_Bool_Exp>;
};


export type Query_RootTransaction_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transaction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_Order_By>>;
  where?: InputMaybe<Transaction_Bool_Exp>;
};


export type Query_RootTransaction_By_PkArgs = {
  hash: Scalars['String']['input'];
};


export type Query_RootTweets_StatsArgs = {
  distinct_on?: InputMaybe<Array<Tweets_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Tweets_Stats_Order_By>>;
  where?: InputMaybe<Tweets_Stats_Bool_Exp>;
};


export type Query_RootTweets_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tweets_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Tweets_Stats_Order_By>>;
  where?: InputMaybe<Tweets_Stats_Bool_Exp>;
};


export type Query_RootTxs_RankedArgs = {
  distinct_on?: InputMaybe<Array<Txs_Ranked_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Txs_Ranked_Order_By>>;
  where?: InputMaybe<Txs_Ranked_Bool_Exp>;
};


export type Query_RootTxs_Ranked_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Txs_Ranked_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Txs_Ranked_Order_By>>;
  where?: InputMaybe<Txs_Ranked_Bool_Exp>;
};


export type Query_RootTxs_StatsArgs = {
  distinct_on?: InputMaybe<Array<Txs_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Txs_Stats_Order_By>>;
  where?: InputMaybe<Txs_Stats_Bool_Exp>;
};


export type Query_RootTxs_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Txs_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Txs_Stats_Order_By>>;
  where?: InputMaybe<Txs_Stats_Bool_Exp>;
};


export type Query_RootUptimeArgs = {
  distinct_on?: InputMaybe<Array<Uptime_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Uptime_Order_By>>;
  where?: InputMaybe<Uptime_Bool_Exp>;
};


export type Query_RootUptime_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Uptime_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Uptime_Order_By>>;
  where?: InputMaybe<Uptime_Bool_Exp>;
};


export type Query_RootValidatorArgs = {
  distinct_on?: InputMaybe<Array<Validator_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Validator_Order_By>>;
  where?: InputMaybe<Validator_Bool_Exp>;
};


export type Query_RootValidator_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Validator_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Validator_Order_By>>;
  where?: InputMaybe<Validator_Bool_Exp>;
};


export type Query_RootValidator_By_PkArgs = {
  consensus_address: Scalars['String']['input'];
};


export type Query_RootVolts_DemandArgs = {
  distinct_on?: InputMaybe<Array<Volts_Demand_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Volts_Demand_Order_By>>;
  where?: InputMaybe<Volts_Demand_Bool_Exp>;
};


export type Query_RootVolts_Demand_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Volts_Demand_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Volts_Demand_Order_By>>;
  where?: InputMaybe<Volts_Demand_Bool_Exp>;
};


export type Query_RootVolts_StatsArgs = {
  distinct_on?: InputMaybe<Array<Volts_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Volts_Stats_Order_By>>;
  where?: InputMaybe<Volts_Stats_Bool_Exp>;
};


export type Query_RootVolts_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Volts_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Volts_Stats_Order_By>>;
  where?: InputMaybe<Volts_Stats_Bool_Exp>;
};

/** columns and relationships of "routes" */
export type Routes = {
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
export type Routes_Aggregate = {
  aggregate?: Maybe<Routes_Aggregate_Fields>;
  nodes: Array<Routes>;
};

/** aggregate fields of "routes" */
export type Routes_Aggregate_Fields = {
  avg?: Maybe<Routes_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Routes_Max_Fields>;
  min?: Maybe<Routes_Min_Fields>;
  stddev?: Maybe<Routes_Stddev_Fields>;
  stddev_pop?: Maybe<Routes_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Routes_Stddev_Samp_Fields>;
  sum?: Maybe<Routes_Sum_Fields>;
  var_pop?: Maybe<Routes_Var_Pop_Fields>;
  var_samp?: Maybe<Routes_Var_Samp_Fields>;
  variance?: Maybe<Routes_Variance_Fields>;
};


/** aggregate fields of "routes" */
export type Routes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Routes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "routes" */
export type Routes_Aggregate_Order_By = {
  avg?: InputMaybe<Routes_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Routes_Max_Order_By>;
  min?: InputMaybe<Routes_Min_Order_By>;
  stddev?: InputMaybe<Routes_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Routes_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Routes_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Routes_Sum_Order_By>;
  var_pop?: InputMaybe<Routes_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Routes_Var_Samp_Order_By>;
  variance?: InputMaybe<Routes_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Routes_Avg_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "routes" */
export type Routes_Avg_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "routes". All fields are combined with a logical 'AND'. */
export type Routes_Bool_Exp = {
  _and?: InputMaybe<Array<Routes_Bool_Exp>>;
  _not?: InputMaybe<Routes_Bool_Exp>;
  _or?: InputMaybe<Array<Routes_Bool_Exp>>;
  account?: InputMaybe<Account_Bool_Exp>;
  accountBySource?: InputMaybe<Account_Bool_Exp>;
  alias?: InputMaybe<String_Comparison_Exp>;
  block?: InputMaybe<Block_Bool_Exp>;
  destination?: InputMaybe<String_Comparison_Exp>;
  height?: InputMaybe<Bigint_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  source?: InputMaybe<String_Comparison_Exp>;
  timestamp?: InputMaybe<Timestamp_Comparison_Exp>;
  transaction?: InputMaybe<Transaction_Bool_Exp>;
  transaction_hash?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<_Coin_Comparison_Exp>;
};

/** aggregate max on columns */
export type Routes_Max_Fields = {
  alias?: Maybe<Scalars['String']['output']>;
  destination?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "routes" */
export type Routes_Max_Order_By = {
  alias?: InputMaybe<Order_By>;
  destination?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  source?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Routes_Min_Fields = {
  alias?: Maybe<Scalars['String']['output']>;
  destination?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  timestamp?: Maybe<Scalars['timestamp']['output']>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "routes" */
export type Routes_Min_Order_By = {
  alias?: InputMaybe<Order_By>;
  destination?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  source?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "routes". */
export type Routes_Order_By = {
  account?: InputMaybe<Account_Order_By>;
  accountBySource?: InputMaybe<Account_Order_By>;
  alias?: InputMaybe<Order_By>;
  block?: InputMaybe<Block_Order_By>;
  destination?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  source?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  transaction?: InputMaybe<Transaction_Order_By>;
  transaction_hash?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** select columns of table "routes" */
export enum Routes_Select_Column {
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
export type Routes_Stddev_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "routes" */
export type Routes_Stddev_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Routes_Stddev_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "routes" */
export type Routes_Stddev_Pop_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Routes_Stddev_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "routes" */
export type Routes_Stddev_Samp_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Routes_Sum_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "routes" */
export type Routes_Sum_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Routes_Var_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "routes" */
export type Routes_Var_Pop_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Routes_Var_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "routes" */
export type Routes_Var_Samp_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Routes_Variance_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "routes" */
export type Routes_Variance_Order_By = {
  height?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

export type Subscription_Root = {
  /** fetch data from the table: "_transaction" */
  _transaction: Array<_Transaction>;
  /** fetch aggregated fields from the table: "_transaction" */
  _transaction_aggregate: _Transaction_Aggregate;
  /** fetch data from the table: "_uptime_temp" */
  _uptime_temp: Array<_Uptime_Temp>;
  /** fetch aggregated fields from the table: "_uptime_temp" */
  _uptime_temp_aggregate: _Uptime_Temp_Aggregate;
  /** fetch data from the table: "account" */
  account: Array<Account>;
  /** fetch aggregated fields from the table: "account" */
  account_aggregate: Account_Aggregate;
  /** fetch data from the table: "account_balance" */
  account_balance: Array<Account_Balance>;
  /** fetch aggregated fields from the table: "account_balance" */
  account_balance_aggregate: Account_Balance_Aggregate;
  /** fetch data from the table: "account_balance" using primary key columns */
  account_balance_by_pk?: Maybe<Account_Balance>;
  /** fetch data from the table: "account" using primary key columns */
  account_by_pk?: Maybe<Account>;
  /** fetch data from the table: "block" */
  block: Array<Block>;
  /** fetch aggregated fields from the table: "block" */
  block_aggregate: Block_Aggregate;
  /** fetch data from the table: "block" using primary key columns */
  block_by_pk?: Maybe<Block>;
  /** fetch data from the table: "contracts" */
  contracts: Array<Contracts>;
  /** fetch aggregated fields from the table: "contracts" */
  contracts_aggregate: Contracts_Aggregate;
  /** fetch data from the table: "contracts" using primary key columns */
  contracts_by_pk?: Maybe<Contracts>;
  /** fetch data from the table: "cyb_cohort" */
  cyb_cohort: Array<Cyb_Cohort>;
  /** fetch aggregated fields from the table: "cyb_cohort" */
  cyb_cohort_aggregate: Cyb_Cohort_Aggregate;
  /** fetch data from the table: "cyb_new_cohort" */
  cyb_new_cohort: Array<Cyb_New_Cohort>;
  /** fetch aggregated fields from the table: "cyb_new_cohort" */
  cyb_new_cohort_aggregate: Cyb_New_Cohort_Aggregate;
  /** fetch data from the table: "cyber_gift" */
  cyber_gift: Array<Cyber_Gift>;
  /** fetch aggregated fields from the table: "cyber_gift" */
  cyber_gift_aggregate: Cyber_Gift_Aggregate;
  /** fetch data from the table: "cyber_gift_proofs" */
  cyber_gift_proofs: Array<Cyber_Gift_Proofs>;
  /** fetch aggregated fields from the table: "cyber_gift_proofs" */
  cyber_gift_proofs_aggregate: Cyber_Gift_Proofs_Aggregate;
  /** fetch data from the table: "cyberlinks" */
  cyberlinks: Array<Cyberlinks>;
  /** An aggregate relationship */
  cyberlinks_aggregate: Cyberlinks_Aggregate;
  /** fetch data from the table: "cyberlinks" using primary key columns */
  cyberlinks_by_pk?: Maybe<Cyberlinks>;
  /** fetch data from the table: "cyberlinks_stats" */
  cyberlinks_stats: Array<Cyberlinks_Stats>;
  /** fetch aggregated fields from the table: "cyberlinks_stats" */
  cyberlinks_stats_aggregate: Cyberlinks_Stats_Aggregate;
  /** fetch data from the table: "daily_amount_of_active_neurons" */
  daily_amount_of_active_neurons: Array<Daily_Amount_Of_Active_Neurons>;
  /** fetch aggregated fields from the table: "daily_amount_of_active_neurons" */
  daily_amount_of_active_neurons_aggregate: Daily_Amount_Of_Active_Neurons_Aggregate;
  /** fetch data from the table: "daily_amount_of_used_gas" */
  daily_amount_of_used_gas: Array<Daily_Amount_Of_Used_Gas>;
  /** fetch aggregated fields from the table: "daily_amount_of_used_gas" */
  daily_amount_of_used_gas_aggregate: Daily_Amount_Of_Used_Gas_Aggregate;
  /** fetch data from the table: "daily_number_of_transactions" */
  daily_number_of_transactions: Array<Daily_Number_Of_Transactions>;
  /** fetch aggregated fields from the table: "daily_number_of_transactions" */
  daily_number_of_transactions_aggregate: Daily_Number_Of_Transactions_Aggregate;
  /** fetch data from the table: "follow_stats" */
  follow_stats: Array<Follow_Stats>;
  /** fetch aggregated fields from the table: "follow_stats" */
  follow_stats_aggregate: Follow_Stats_Aggregate;
  /** fetch data from the table: "genesis_neurons_activation" */
  genesis_neurons_activation: Array<Genesis_Neurons_Activation>;
  /** fetch aggregated fields from the table: "genesis_neurons_activation" */
  genesis_neurons_activation_aggregate: Genesis_Neurons_Activation_Aggregate;
  /** An array relationship */
  investmints: Array<Investmints>;
  /** An aggregate relationship */
  investmints_aggregate: Investmints_Aggregate;
  /** fetch data from the table: "investmints" using primary key columns */
  investmints_by_pk?: Maybe<Investmints>;
  /** fetch data from the table: "message" */
  message: Array<Message>;
  /** fetch aggregated fields from the table: "message" */
  message_aggregate: Message_Aggregate;
  /** execute function "messages_by_address" which returns "message" */
  messages_by_address: Array<Message>;
  /** execute function "messages_by_address" and query aggregates on result of table type "message" */
  messages_by_address_aggregate: Message_Aggregate;
  /** fetch data from the table: "modules" */
  modules: Array<Modules>;
  /** fetch aggregated fields from the table: "modules" */
  modules_aggregate: Modules_Aggregate;
  /** fetch data from the table: "modules" using primary key columns */
  modules_by_pk?: Maybe<Modules>;
  /** fetch data from the table: "neuron_activation_source" */
  neuron_activation_source: Array<Neuron_Activation_Source>;
  /** fetch aggregated fields from the table: "neuron_activation_source" */
  neuron_activation_source_aggregate: Neuron_Activation_Source_Aggregate;
  /** fetch data from the table: "number_of_new_neurons" */
  number_of_new_neurons: Array<Number_Of_New_Neurons>;
  /** fetch aggregated fields from the table: "number_of_new_neurons" */
  number_of_new_neurons_aggregate: Number_Of_New_Neurons_Aggregate;
  /** fetch data from the table: "old_precommits" */
  old_precommits: Array<Old_Precommits>;
  /** fetch aggregated fields from the table: "old_precommits" */
  old_precommits_aggregate: Old_Precommits_Aggregate;
  /** fetch data from the table: "old_precommits" using primary key columns */
  old_precommits_by_pk?: Maybe<Old_Precommits>;
  /** An array relationship */
  particles: Array<Particles>;
  /** An aggregate relationship */
  particles_aggregate: Particles_Aggregate;
  /** fetch data from the table: "particles" using primary key columns */
  particles_by_pk?: Maybe<Particles>;
  /** fetch data from the table: "pre_commit" */
  pre_commit: Array<Pre_Commit>;
  /** fetch aggregated fields from the table: "pre_commit" */
  pre_commit_aggregate: Pre_Commit_Aggregate;
  /** fetch data from the table: "pre_commits_rewards_view" */
  pre_commits_rewards_view: Array<Pre_Commits_Rewards_View>;
  /** fetch aggregated fields from the table: "pre_commits_rewards_view" */
  pre_commits_rewards_view_aggregate: Pre_Commits_Rewards_View_Aggregate;
  /** fetch data from the table: "pre_commits_total" */
  pre_commits_total: Array<Pre_Commits_Total>;
  /** fetch aggregated fields from the table: "pre_commits_total" */
  pre_commits_total_aggregate: Pre_Commits_Total_Aggregate;
  /** fetch data from the table: "pre_commits_view" */
  pre_commits_view: Array<Pre_Commits_View>;
  /** fetch aggregated fields from the table: "pre_commits_view" */
  pre_commits_view_aggregate: Pre_Commits_View_Aggregate;
  /** fetch data from the table: "pruning" */
  pruning: Array<Pruning>;
  /** fetch aggregated fields from the table: "pruning" */
  pruning_aggregate: Pruning_Aggregate;
  /** fetch data from the table: "pussy_gift_proofs" */
  pussy_gift_proofs: Array<Pussy_Gift_Proofs>;
  /** fetch aggregated fields from the table: "pussy_gift_proofs" */
  pussy_gift_proofs_aggregate: Pussy_Gift_Proofs_Aggregate;
  /** An array relationship */
  routes: Array<Routes>;
  /** An aggregate relationship */
  routes_aggregate: Routes_Aggregate;
  /** fetch data from the table: "routes" using primary key columns */
  routes_by_pk?: Maybe<Routes>;
  /** fetch data from the table: "supply" */
  supply: Array<Supply>;
  /** fetch aggregated fields from the table: "supply" */
  supply_aggregate: Supply_Aggregate;
  /** fetch data from the table: "supply" using primary key columns */
  supply_by_pk?: Maybe<Supply>;
  /** fetch data from the table: "test_gift" */
  test_gift: Array<Test_Gift>;
  /** fetch aggregated fields from the table: "test_gift" */
  test_gift_aggregate: Test_Gift_Aggregate;
  /** fetch data from the table: "today_top_txs" */
  today_top_txs: Array<Today_Top_Txs>;
  /** fetch aggregated fields from the table: "today_top_txs" */
  today_top_txs_aggregate: Today_Top_Txs_Aggregate;
  /** fetch data from the table: "top_10_of_active_neurons_week" */
  top_10_of_active_neurons_week: Array<Top_10_Of_Active_Neurons_Week>;
  /** fetch aggregated fields from the table: "top_10_of_active_neurons_week" */
  top_10_of_active_neurons_week_aggregate: Top_10_Of_Active_Neurons_Week_Aggregate;
  /** fetch data from the table: "top_first_txs" */
  top_first_txs: Array<Top_First_Txs>;
  /** fetch aggregated fields from the table: "top_first_txs" */
  top_first_txs_aggregate: Top_First_Txs_Aggregate;
  /** fetch data from the table: "top_leaders" */
  top_leaders: Array<Top_Leaders>;
  /** fetch data from the table: "top_txs" */
  top_txs: Array<Top_Txs>;
  /** fetch aggregated fields from the table: "top_txs" */
  top_txs_aggregate: Top_Txs_Aggregate;
  /** fetch data from the table: "transaction" */
  transaction: Array<Transaction>;
  /** fetch aggregated fields from the table: "transaction" */
  transaction_aggregate: Transaction_Aggregate;
  /** fetch data from the table: "transaction" using primary key columns */
  transaction_by_pk?: Maybe<Transaction>;
  /** fetch data from the table: "tweets_stats" */
  tweets_stats: Array<Tweets_Stats>;
  /** fetch aggregated fields from the table: "tweets_stats" */
  tweets_stats_aggregate: Tweets_Stats_Aggregate;
  /** fetch data from the table: "txs_ranked" */
  txs_ranked: Array<Txs_Ranked>;
  /** fetch aggregated fields from the table: "txs_ranked" */
  txs_ranked_aggregate: Txs_Ranked_Aggregate;
  /** fetch data from the table: "txs_stats" */
  txs_stats: Array<Txs_Stats>;
  /** fetch aggregated fields from the table: "txs_stats" */
  txs_stats_aggregate: Txs_Stats_Aggregate;
  /** fetch data from the table: "uptime" */
  uptime: Array<Uptime>;
  /** fetch aggregated fields from the table: "uptime" */
  uptime_aggregate: Uptime_Aggregate;
  /** fetch data from the table: "validator" */
  validator: Array<Validator>;
  /** fetch aggregated fields from the table: "validator" */
  validator_aggregate: Validator_Aggregate;
  /** fetch data from the table: "validator" using primary key columns */
  validator_by_pk?: Maybe<Validator>;
  /** fetch data from the table: "volts_demand" */
  volts_demand: Array<Volts_Demand>;
  /** fetch aggregated fields from the table: "volts_demand" */
  volts_demand_aggregate: Volts_Demand_Aggregate;
  /** fetch data from the table: "volts_stats" */
  volts_stats: Array<Volts_Stats>;
  /** fetch aggregated fields from the table: "volts_stats" */
  volts_stats_aggregate: Volts_Stats_Aggregate;
};


export type Subscription_Root_TransactionArgs = {
  distinct_on?: InputMaybe<Array<_Transaction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<_Transaction_Order_By>>;
  where?: InputMaybe<_Transaction_Bool_Exp>;
};


export type Subscription_Root_Transaction_AggregateArgs = {
  distinct_on?: InputMaybe<Array<_Transaction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<_Transaction_Order_By>>;
  where?: InputMaybe<_Transaction_Bool_Exp>;
};


export type Subscription_Root_Uptime_TempArgs = {
  distinct_on?: InputMaybe<Array<_Uptime_Temp_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<_Uptime_Temp_Order_By>>;
  where?: InputMaybe<_Uptime_Temp_Bool_Exp>;
};


export type Subscription_Root_Uptime_Temp_AggregateArgs = {
  distinct_on?: InputMaybe<Array<_Uptime_Temp_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<_Uptime_Temp_Order_By>>;
  where?: InputMaybe<_Uptime_Temp_Bool_Exp>;
};


export type Subscription_RootAccountArgs = {
  distinct_on?: InputMaybe<Array<Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Order_By>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Subscription_RootAccount_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Account_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Order_By>>;
  where?: InputMaybe<Account_Bool_Exp>;
};


export type Subscription_RootAccount_BalanceArgs = {
  distinct_on?: InputMaybe<Array<Account_Balance_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Balance_Order_By>>;
  where?: InputMaybe<Account_Balance_Bool_Exp>;
};


export type Subscription_RootAccount_Balance_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Account_Balance_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Account_Balance_Order_By>>;
  where?: InputMaybe<Account_Balance_Bool_Exp>;
};


export type Subscription_RootAccount_Balance_By_PkArgs = {
  address: Scalars['String']['input'];
};


export type Subscription_RootAccount_By_PkArgs = {
  address: Scalars['String']['input'];
};


export type Subscription_RootBlockArgs = {
  distinct_on?: InputMaybe<Array<Block_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Block_Order_By>>;
  where?: InputMaybe<Block_Bool_Exp>;
};


export type Subscription_RootBlock_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Block_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Block_Order_By>>;
  where?: InputMaybe<Block_Bool_Exp>;
};


export type Subscription_RootBlock_By_PkArgs = {
  height: Scalars['bigint']['input'];
};


export type Subscription_RootContractsArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};


export type Subscription_RootContracts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Contracts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Contracts_Order_By>>;
  where?: InputMaybe<Contracts_Bool_Exp>;
};


export type Subscription_RootContracts_By_PkArgs = {
  address: Scalars['String']['input'];
};


export type Subscription_RootCyb_CohortArgs = {
  distinct_on?: InputMaybe<Array<Cyb_Cohort_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyb_Cohort_Order_By>>;
  where?: InputMaybe<Cyb_Cohort_Bool_Exp>;
};


export type Subscription_RootCyb_Cohort_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyb_Cohort_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyb_Cohort_Order_By>>;
  where?: InputMaybe<Cyb_Cohort_Bool_Exp>;
};


export type Subscription_RootCyb_New_CohortArgs = {
  distinct_on?: InputMaybe<Array<Cyb_New_Cohort_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyb_New_Cohort_Order_By>>;
  where?: InputMaybe<Cyb_New_Cohort_Bool_Exp>;
};


export type Subscription_RootCyb_New_Cohort_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyb_New_Cohort_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyb_New_Cohort_Order_By>>;
  where?: InputMaybe<Cyb_New_Cohort_Bool_Exp>;
};


export type Subscription_RootCyber_GiftArgs = {
  distinct_on?: InputMaybe<Array<Cyber_Gift_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyber_Gift_Order_By>>;
  where?: InputMaybe<Cyber_Gift_Bool_Exp>;
};


export type Subscription_RootCyber_Gift_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyber_Gift_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyber_Gift_Order_By>>;
  where?: InputMaybe<Cyber_Gift_Bool_Exp>;
};


export type Subscription_RootCyber_Gift_ProofsArgs = {
  distinct_on?: InputMaybe<Array<Cyber_Gift_Proofs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyber_Gift_Proofs_Order_By>>;
  where?: InputMaybe<Cyber_Gift_Proofs_Bool_Exp>;
};


export type Subscription_RootCyber_Gift_Proofs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyber_Gift_Proofs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyber_Gift_Proofs_Order_By>>;
  where?: InputMaybe<Cyber_Gift_Proofs_Bool_Exp>;
};


export type Subscription_RootCyberlinksArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Order_By>>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
};


export type Subscription_RootCyberlinks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Order_By>>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
};


export type Subscription_RootCyberlinks_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootCyberlinks_StatsArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Stats_Order_By>>;
  where?: InputMaybe<Cyberlinks_Stats_Bool_Exp>;
};


export type Subscription_RootCyberlinks_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Stats_Order_By>>;
  where?: InputMaybe<Cyberlinks_Stats_Bool_Exp>;
};


export type Subscription_RootDaily_Amount_Of_Active_NeuronsArgs = {
  distinct_on?: InputMaybe<Array<Daily_Amount_Of_Active_Neurons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Daily_Amount_Of_Active_Neurons_Order_By>>;
  where?: InputMaybe<Daily_Amount_Of_Active_Neurons_Bool_Exp>;
};


export type Subscription_RootDaily_Amount_Of_Active_Neurons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Daily_Amount_Of_Active_Neurons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Daily_Amount_Of_Active_Neurons_Order_By>>;
  where?: InputMaybe<Daily_Amount_Of_Active_Neurons_Bool_Exp>;
};


export type Subscription_RootDaily_Amount_Of_Used_GasArgs = {
  distinct_on?: InputMaybe<Array<Daily_Amount_Of_Used_Gas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Daily_Amount_Of_Used_Gas_Order_By>>;
  where?: InputMaybe<Daily_Amount_Of_Used_Gas_Bool_Exp>;
};


export type Subscription_RootDaily_Amount_Of_Used_Gas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Daily_Amount_Of_Used_Gas_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Daily_Amount_Of_Used_Gas_Order_By>>;
  where?: InputMaybe<Daily_Amount_Of_Used_Gas_Bool_Exp>;
};


export type Subscription_RootDaily_Number_Of_TransactionsArgs = {
  distinct_on?: InputMaybe<Array<Daily_Number_Of_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Daily_Number_Of_Transactions_Order_By>>;
  where?: InputMaybe<Daily_Number_Of_Transactions_Bool_Exp>;
};


export type Subscription_RootDaily_Number_Of_Transactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Daily_Number_Of_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Daily_Number_Of_Transactions_Order_By>>;
  where?: InputMaybe<Daily_Number_Of_Transactions_Bool_Exp>;
};


export type Subscription_RootFollow_StatsArgs = {
  distinct_on?: InputMaybe<Array<Follow_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Follow_Stats_Order_By>>;
  where?: InputMaybe<Follow_Stats_Bool_Exp>;
};


export type Subscription_RootFollow_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Follow_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Follow_Stats_Order_By>>;
  where?: InputMaybe<Follow_Stats_Bool_Exp>;
};


export type Subscription_RootGenesis_Neurons_ActivationArgs = {
  distinct_on?: InputMaybe<Array<Genesis_Neurons_Activation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Genesis_Neurons_Activation_Order_By>>;
  where?: InputMaybe<Genesis_Neurons_Activation_Bool_Exp>;
};


export type Subscription_RootGenesis_Neurons_Activation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Genesis_Neurons_Activation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Genesis_Neurons_Activation_Order_By>>;
  where?: InputMaybe<Genesis_Neurons_Activation_Bool_Exp>;
};


export type Subscription_RootInvestmintsArgs = {
  distinct_on?: InputMaybe<Array<Investmints_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Investmints_Order_By>>;
  where?: InputMaybe<Investmints_Bool_Exp>;
};


export type Subscription_RootInvestmints_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Investmints_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Investmints_Order_By>>;
  where?: InputMaybe<Investmints_Bool_Exp>;
};


export type Subscription_RootInvestmints_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootMessageArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Subscription_RootMessage_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Subscription_RootMessages_By_AddressArgs = {
  args: Messages_By_Address_Args;
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Subscription_RootMessages_By_Address_AggregateArgs = {
  args: Messages_By_Address_Args;
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


export type Subscription_RootModulesArgs = {
  distinct_on?: InputMaybe<Array<Modules_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Modules_Order_By>>;
  where?: InputMaybe<Modules_Bool_Exp>;
};


export type Subscription_RootModules_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Modules_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Modules_Order_By>>;
  where?: InputMaybe<Modules_Bool_Exp>;
};


export type Subscription_RootModules_By_PkArgs = {
  module_name: Scalars['String']['input'];
};


export type Subscription_RootNeuron_Activation_SourceArgs = {
  distinct_on?: InputMaybe<Array<Neuron_Activation_Source_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Neuron_Activation_Source_Order_By>>;
  where?: InputMaybe<Neuron_Activation_Source_Bool_Exp>;
};


export type Subscription_RootNeuron_Activation_Source_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Neuron_Activation_Source_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Neuron_Activation_Source_Order_By>>;
  where?: InputMaybe<Neuron_Activation_Source_Bool_Exp>;
};


export type Subscription_RootNumber_Of_New_NeuronsArgs = {
  distinct_on?: InputMaybe<Array<Number_Of_New_Neurons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Number_Of_New_Neurons_Order_By>>;
  where?: InputMaybe<Number_Of_New_Neurons_Bool_Exp>;
};


export type Subscription_RootNumber_Of_New_Neurons_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Number_Of_New_Neurons_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Number_Of_New_Neurons_Order_By>>;
  where?: InputMaybe<Number_Of_New_Neurons_Bool_Exp>;
};


export type Subscription_RootOld_PrecommitsArgs = {
  distinct_on?: InputMaybe<Array<Old_Precommits_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Old_Precommits_Order_By>>;
  where?: InputMaybe<Old_Precommits_Bool_Exp>;
};


export type Subscription_RootOld_Precommits_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Old_Precommits_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Old_Precommits_Order_By>>;
  where?: InputMaybe<Old_Precommits_Bool_Exp>;
};


export type Subscription_RootOld_Precommits_By_PkArgs = {
  consensus_address: Scalars['String']['input'];
};


export type Subscription_RootParticlesArgs = {
  distinct_on?: InputMaybe<Array<Particles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Particles_Order_By>>;
  where?: InputMaybe<Particles_Bool_Exp>;
};


export type Subscription_RootParticles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Particles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Particles_Order_By>>;
  where?: InputMaybe<Particles_Bool_Exp>;
};


export type Subscription_RootParticles_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootPre_CommitArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commit_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commit_Order_By>>;
  where?: InputMaybe<Pre_Commit_Bool_Exp>;
};


export type Subscription_RootPre_Commit_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commit_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commit_Order_By>>;
  where?: InputMaybe<Pre_Commit_Bool_Exp>;
};


export type Subscription_RootPre_Commits_Rewards_ViewArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commits_Rewards_View_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commits_Rewards_View_Order_By>>;
  where?: InputMaybe<Pre_Commits_Rewards_View_Bool_Exp>;
};


export type Subscription_RootPre_Commits_Rewards_View_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commits_Rewards_View_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commits_Rewards_View_Order_By>>;
  where?: InputMaybe<Pre_Commits_Rewards_View_Bool_Exp>;
};


export type Subscription_RootPre_Commits_TotalArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commits_Total_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commits_Total_Order_By>>;
  where?: InputMaybe<Pre_Commits_Total_Bool_Exp>;
};


export type Subscription_RootPre_Commits_Total_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commits_Total_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commits_Total_Order_By>>;
  where?: InputMaybe<Pre_Commits_Total_Bool_Exp>;
};


export type Subscription_RootPre_Commits_ViewArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commits_View_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commits_View_Order_By>>;
  where?: InputMaybe<Pre_Commits_View_Bool_Exp>;
};


export type Subscription_RootPre_Commits_View_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commits_View_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commits_View_Order_By>>;
  where?: InputMaybe<Pre_Commits_View_Bool_Exp>;
};


export type Subscription_RootPruningArgs = {
  distinct_on?: InputMaybe<Array<Pruning_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pruning_Order_By>>;
  where?: InputMaybe<Pruning_Bool_Exp>;
};


export type Subscription_RootPruning_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pruning_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pruning_Order_By>>;
  where?: InputMaybe<Pruning_Bool_Exp>;
};


export type Subscription_RootPussy_Gift_ProofsArgs = {
  distinct_on?: InputMaybe<Array<Pussy_Gift_Proofs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pussy_Gift_Proofs_Order_By>>;
  where?: InputMaybe<Pussy_Gift_Proofs_Bool_Exp>;
};


export type Subscription_RootPussy_Gift_Proofs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pussy_Gift_Proofs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pussy_Gift_Proofs_Order_By>>;
  where?: InputMaybe<Pussy_Gift_Proofs_Bool_Exp>;
};


export type Subscription_RootRoutesArgs = {
  distinct_on?: InputMaybe<Array<Routes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Routes_Order_By>>;
  where?: InputMaybe<Routes_Bool_Exp>;
};


export type Subscription_RootRoutes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Routes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Routes_Order_By>>;
  where?: InputMaybe<Routes_Bool_Exp>;
};


export type Subscription_RootRoutes_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootSupplyArgs = {
  distinct_on?: InputMaybe<Array<Supply_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Supply_Order_By>>;
  where?: InputMaybe<Supply_Bool_Exp>;
};


export type Subscription_RootSupply_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Supply_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Supply_Order_By>>;
  where?: InputMaybe<Supply_Bool_Exp>;
};


export type Subscription_RootSupply_By_PkArgs = {
  one_row_id: Scalars['Boolean']['input'];
};


export type Subscription_RootTest_GiftArgs = {
  distinct_on?: InputMaybe<Array<Test_Gift_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Test_Gift_Order_By>>;
  where?: InputMaybe<Test_Gift_Bool_Exp>;
};


export type Subscription_RootTest_Gift_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Test_Gift_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Test_Gift_Order_By>>;
  where?: InputMaybe<Test_Gift_Bool_Exp>;
};


export type Subscription_RootToday_Top_TxsArgs = {
  distinct_on?: InputMaybe<Array<Today_Top_Txs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Today_Top_Txs_Order_By>>;
  where?: InputMaybe<Today_Top_Txs_Bool_Exp>;
};


export type Subscription_RootToday_Top_Txs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Today_Top_Txs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Today_Top_Txs_Order_By>>;
  where?: InputMaybe<Today_Top_Txs_Bool_Exp>;
};


export type Subscription_RootTop_10_Of_Active_Neurons_WeekArgs = {
  distinct_on?: InputMaybe<Array<Top_10_Of_Active_Neurons_Week_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_10_Of_Active_Neurons_Week_Order_By>>;
  where?: InputMaybe<Top_10_Of_Active_Neurons_Week_Bool_Exp>;
};


export type Subscription_RootTop_10_Of_Active_Neurons_Week_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Top_10_Of_Active_Neurons_Week_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_10_Of_Active_Neurons_Week_Order_By>>;
  where?: InputMaybe<Top_10_Of_Active_Neurons_Week_Bool_Exp>;
};


export type Subscription_RootTop_First_TxsArgs = {
  distinct_on?: InputMaybe<Array<Top_First_Txs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_First_Txs_Order_By>>;
  where?: InputMaybe<Top_First_Txs_Bool_Exp>;
};


export type Subscription_RootTop_First_Txs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Top_First_Txs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_First_Txs_Order_By>>;
  where?: InputMaybe<Top_First_Txs_Bool_Exp>;
};


export type Subscription_RootTop_LeadersArgs = {
  distinct_on?: InputMaybe<Array<Top_Leaders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_Leaders_Order_By>>;
  where?: InputMaybe<Top_Leaders_Bool_Exp>;
};


export type Subscription_RootTop_TxsArgs = {
  distinct_on?: InputMaybe<Array<Top_Txs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_Txs_Order_By>>;
  where?: InputMaybe<Top_Txs_Bool_Exp>;
};


export type Subscription_RootTop_Txs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Top_Txs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Top_Txs_Order_By>>;
  where?: InputMaybe<Top_Txs_Bool_Exp>;
};


export type Subscription_RootTransactionArgs = {
  distinct_on?: InputMaybe<Array<Transaction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_Order_By>>;
  where?: InputMaybe<Transaction_Bool_Exp>;
};


export type Subscription_RootTransaction_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Transaction_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Transaction_Order_By>>;
  where?: InputMaybe<Transaction_Bool_Exp>;
};


export type Subscription_RootTransaction_By_PkArgs = {
  hash: Scalars['String']['input'];
};


export type Subscription_RootTweets_StatsArgs = {
  distinct_on?: InputMaybe<Array<Tweets_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Tweets_Stats_Order_By>>;
  where?: InputMaybe<Tweets_Stats_Bool_Exp>;
};


export type Subscription_RootTweets_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Tweets_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Tweets_Stats_Order_By>>;
  where?: InputMaybe<Tweets_Stats_Bool_Exp>;
};


export type Subscription_RootTxs_RankedArgs = {
  distinct_on?: InputMaybe<Array<Txs_Ranked_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Txs_Ranked_Order_By>>;
  where?: InputMaybe<Txs_Ranked_Bool_Exp>;
};


export type Subscription_RootTxs_Ranked_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Txs_Ranked_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Txs_Ranked_Order_By>>;
  where?: InputMaybe<Txs_Ranked_Bool_Exp>;
};


export type Subscription_RootTxs_StatsArgs = {
  distinct_on?: InputMaybe<Array<Txs_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Txs_Stats_Order_By>>;
  where?: InputMaybe<Txs_Stats_Bool_Exp>;
};


export type Subscription_RootTxs_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Txs_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Txs_Stats_Order_By>>;
  where?: InputMaybe<Txs_Stats_Bool_Exp>;
};


export type Subscription_RootUptimeArgs = {
  distinct_on?: InputMaybe<Array<Uptime_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Uptime_Order_By>>;
  where?: InputMaybe<Uptime_Bool_Exp>;
};


export type Subscription_RootUptime_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Uptime_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Uptime_Order_By>>;
  where?: InputMaybe<Uptime_Bool_Exp>;
};


export type Subscription_RootValidatorArgs = {
  distinct_on?: InputMaybe<Array<Validator_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Validator_Order_By>>;
  where?: InputMaybe<Validator_Bool_Exp>;
};


export type Subscription_RootValidator_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Validator_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Validator_Order_By>>;
  where?: InputMaybe<Validator_Bool_Exp>;
};


export type Subscription_RootValidator_By_PkArgs = {
  consensus_address: Scalars['String']['input'];
};


export type Subscription_RootVolts_DemandArgs = {
  distinct_on?: InputMaybe<Array<Volts_Demand_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Volts_Demand_Order_By>>;
  where?: InputMaybe<Volts_Demand_Bool_Exp>;
};


export type Subscription_RootVolts_Demand_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Volts_Demand_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Volts_Demand_Order_By>>;
  where?: InputMaybe<Volts_Demand_Bool_Exp>;
};


export type Subscription_RootVolts_StatsArgs = {
  distinct_on?: InputMaybe<Array<Volts_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Volts_Stats_Order_By>>;
  where?: InputMaybe<Volts_Stats_Bool_Exp>;
};


export type Subscription_RootVolts_Stats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Volts_Stats_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Volts_Stats_Order_By>>;
  where?: InputMaybe<Volts_Stats_Bool_Exp>;
};

/** columns and relationships of "supply" */
export type Supply = {
  coins: Scalars['_coin']['output'];
  height: Scalars['bigint']['output'];
  one_row_id: Scalars['Boolean']['output'];
};

/** aggregated selection of "supply" */
export type Supply_Aggregate = {
  aggregate?: Maybe<Supply_Aggregate_Fields>;
  nodes: Array<Supply>;
};

/** aggregate fields of "supply" */
export type Supply_Aggregate_Fields = {
  avg?: Maybe<Supply_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Supply_Max_Fields>;
  min?: Maybe<Supply_Min_Fields>;
  stddev?: Maybe<Supply_Stddev_Fields>;
  stddev_pop?: Maybe<Supply_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Supply_Stddev_Samp_Fields>;
  sum?: Maybe<Supply_Sum_Fields>;
  var_pop?: Maybe<Supply_Var_Pop_Fields>;
  var_samp?: Maybe<Supply_Var_Samp_Fields>;
  variance?: Maybe<Supply_Variance_Fields>;
};


/** aggregate fields of "supply" */
export type Supply_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Supply_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Supply_Avg_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "supply". All fields are combined with a logical 'AND'. */
export type Supply_Bool_Exp = {
  _and?: InputMaybe<Array<Supply_Bool_Exp>>;
  _not?: InputMaybe<Supply_Bool_Exp>;
  _or?: InputMaybe<Array<Supply_Bool_Exp>>;
  coins?: InputMaybe<_Coin_Comparison_Exp>;
  height?: InputMaybe<Bigint_Comparison_Exp>;
  one_row_id?: InputMaybe<Boolean_Comparison_Exp>;
};

/** aggregate max on columns */
export type Supply_Max_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type Supply_Min_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "supply". */
export type Supply_Order_By = {
  coins?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  one_row_id?: InputMaybe<Order_By>;
};

/** select columns of table "supply" */
export enum Supply_Select_Column {
  /** column name */
  Coins = 'coins',
  /** column name */
  Height = 'height',
  /** column name */
  OneRowId = 'one_row_id'
}

/** aggregate stddev on columns */
export type Supply_Stddev_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Supply_Stddev_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Supply_Stddev_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Supply_Sum_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Supply_Var_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Supply_Var_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Supply_Variance_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "test_gift" */
export type Test_Gift = {
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  details?: Maybe<Scalars['json']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};


/** columns and relationships of "test_gift" */
export type Test_GiftDetailsArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "test_gift" */
export type Test_Gift_Aggregate = {
  aggregate?: Maybe<Test_Gift_Aggregate_Fields>;
  nodes: Array<Test_Gift>;
};

/** aggregate fields of "test_gift" */
export type Test_Gift_Aggregate_Fields = {
  avg?: Maybe<Test_Gift_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Test_Gift_Max_Fields>;
  min?: Maybe<Test_Gift_Min_Fields>;
  stddev?: Maybe<Test_Gift_Stddev_Fields>;
  stddev_pop?: Maybe<Test_Gift_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Test_Gift_Stddev_Samp_Fields>;
  sum?: Maybe<Test_Gift_Sum_Fields>;
  var_pop?: Maybe<Test_Gift_Var_Pop_Fields>;
  var_samp?: Maybe<Test_Gift_Var_Samp_Fields>;
  variance?: Maybe<Test_Gift_Variance_Fields>;
};


/** aggregate fields of "test_gift" */
export type Test_Gift_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Test_Gift_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Test_Gift_Avg_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "test_gift". All fields are combined with a logical 'AND'. */
export type Test_Gift_Bool_Exp = {
  _and?: InputMaybe<Array<Test_Gift_Bool_Exp>>;
  _not?: InputMaybe<Test_Gift_Bool_Exp>;
  _or?: InputMaybe<Array<Test_Gift_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  amount?: InputMaybe<Bigint_Comparison_Exp>;
  details?: InputMaybe<Json_Comparison_Exp>;
  proof?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Test_Gift_Max_Fields = {
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Test_Gift_Min_Fields = {
  address?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['bigint']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "test_gift". */
export type Test_Gift_Order_By = {
  address?: InputMaybe<Order_By>;
  amount?: InputMaybe<Order_By>;
  details?: InputMaybe<Order_By>;
  proof?: InputMaybe<Order_By>;
};

/** select columns of table "test_gift" */
export enum Test_Gift_Select_Column {
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
export type Test_Gift_Stddev_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Test_Gift_Stddev_Pop_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Test_Gift_Stddev_Samp_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Test_Gift_Sum_Fields = {
  amount?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Test_Gift_Var_Pop_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Test_Gift_Var_Samp_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Test_Gift_Variance_Fields = {
  amount?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
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
export type Today_Top_Txs = {
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "today_top_txs" */
export type Today_Top_Txs_Aggregate = {
  aggregate?: Maybe<Today_Top_Txs_Aggregate_Fields>;
  nodes: Array<Today_Top_Txs>;
};

/** aggregate fields of "today_top_txs" */
export type Today_Top_Txs_Aggregate_Fields = {
  avg?: Maybe<Today_Top_Txs_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Today_Top_Txs_Max_Fields>;
  min?: Maybe<Today_Top_Txs_Min_Fields>;
  stddev?: Maybe<Today_Top_Txs_Stddev_Fields>;
  stddev_pop?: Maybe<Today_Top_Txs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Today_Top_Txs_Stddev_Samp_Fields>;
  sum?: Maybe<Today_Top_Txs_Sum_Fields>;
  var_pop?: Maybe<Today_Top_Txs_Var_Pop_Fields>;
  var_samp?: Maybe<Today_Top_Txs_Var_Samp_Fields>;
  variance?: Maybe<Today_Top_Txs_Variance_Fields>;
};


/** aggregate fields of "today_top_txs" */
export type Today_Top_Txs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Today_Top_Txs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Today_Top_Txs_Avg_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "today_top_txs". All fields are combined with a logical 'AND'. */
export type Today_Top_Txs_Bool_Exp = {
  _and?: InputMaybe<Array<Today_Top_Txs_Bool_Exp>>;
  _not?: InputMaybe<Today_Top_Txs_Bool_Exp>;
  _or?: InputMaybe<Array<Today_Top_Txs_Bool_Exp>>;
  count?: InputMaybe<Bigint_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Today_Top_Txs_Max_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Today_Top_Txs_Min_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "today_top_txs". */
export type Today_Top_Txs_Order_By = {
  count?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** select columns of table "today_top_txs" */
export enum Today_Top_Txs_Select_Column {
  /** column name */
  Count = 'count',
  /** column name */
  Type = 'type'
}

/** aggregate stddev on columns */
export type Today_Top_Txs_Stddev_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Today_Top_Txs_Stddev_Pop_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Today_Top_Txs_Stddev_Samp_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Today_Top_Txs_Sum_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Today_Top_Txs_Var_Pop_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Today_Top_Txs_Var_Samp_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Today_Top_Txs_Variance_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "top_10_of_active_neurons_week" */
export type Top_10_Of_Active_Neurons_Week = {
  count?: Maybe<Scalars['bigint']['output']>;
  pubkey?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "top_10_of_active_neurons_week" */
export type Top_10_Of_Active_Neurons_Week_Aggregate = {
  aggregate?: Maybe<Top_10_Of_Active_Neurons_Week_Aggregate_Fields>;
  nodes: Array<Top_10_Of_Active_Neurons_Week>;
};

/** aggregate fields of "top_10_of_active_neurons_week" */
export type Top_10_Of_Active_Neurons_Week_Aggregate_Fields = {
  avg?: Maybe<Top_10_Of_Active_Neurons_Week_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Top_10_Of_Active_Neurons_Week_Max_Fields>;
  min?: Maybe<Top_10_Of_Active_Neurons_Week_Min_Fields>;
  stddev?: Maybe<Top_10_Of_Active_Neurons_Week_Stddev_Fields>;
  stddev_pop?: Maybe<Top_10_Of_Active_Neurons_Week_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Top_10_Of_Active_Neurons_Week_Stddev_Samp_Fields>;
  sum?: Maybe<Top_10_Of_Active_Neurons_Week_Sum_Fields>;
  var_pop?: Maybe<Top_10_Of_Active_Neurons_Week_Var_Pop_Fields>;
  var_samp?: Maybe<Top_10_Of_Active_Neurons_Week_Var_Samp_Fields>;
  variance?: Maybe<Top_10_Of_Active_Neurons_Week_Variance_Fields>;
};


/** aggregate fields of "top_10_of_active_neurons_week" */
export type Top_10_Of_Active_Neurons_Week_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Top_10_Of_Active_Neurons_Week_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Top_10_Of_Active_Neurons_Week_Avg_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "top_10_of_active_neurons_week". All fields are combined with a logical 'AND'. */
export type Top_10_Of_Active_Neurons_Week_Bool_Exp = {
  _and?: InputMaybe<Array<Top_10_Of_Active_Neurons_Week_Bool_Exp>>;
  _not?: InputMaybe<Top_10_Of_Active_Neurons_Week_Bool_Exp>;
  _or?: InputMaybe<Array<Top_10_Of_Active_Neurons_Week_Bool_Exp>>;
  count?: InputMaybe<Bigint_Comparison_Exp>;
  pubkey?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Top_10_Of_Active_Neurons_Week_Max_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
  pubkey?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Top_10_Of_Active_Neurons_Week_Min_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
  pubkey?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "top_10_of_active_neurons_week". */
export type Top_10_Of_Active_Neurons_Week_Order_By = {
  count?: InputMaybe<Order_By>;
  pubkey?: InputMaybe<Order_By>;
};

/** select columns of table "top_10_of_active_neurons_week" */
export enum Top_10_Of_Active_Neurons_Week_Select_Column {
  /** column name */
  Count = 'count',
  /** column name */
  Pubkey = 'pubkey'
}

/** aggregate stddev on columns */
export type Top_10_Of_Active_Neurons_Week_Stddev_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Top_10_Of_Active_Neurons_Week_Stddev_Pop_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Top_10_Of_Active_Neurons_Week_Stddev_Samp_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Top_10_Of_Active_Neurons_Week_Sum_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Top_10_Of_Active_Neurons_Week_Var_Pop_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Top_10_Of_Active_Neurons_Week_Var_Samp_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Top_10_Of_Active_Neurons_Week_Variance_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "top_first_txs" */
export type Top_First_Txs = {
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "top_first_txs" */
export type Top_First_Txs_Aggregate = {
  aggregate?: Maybe<Top_First_Txs_Aggregate_Fields>;
  nodes: Array<Top_First_Txs>;
};

/** aggregate fields of "top_first_txs" */
export type Top_First_Txs_Aggregate_Fields = {
  avg?: Maybe<Top_First_Txs_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Top_First_Txs_Max_Fields>;
  min?: Maybe<Top_First_Txs_Min_Fields>;
  stddev?: Maybe<Top_First_Txs_Stddev_Fields>;
  stddev_pop?: Maybe<Top_First_Txs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Top_First_Txs_Stddev_Samp_Fields>;
  sum?: Maybe<Top_First_Txs_Sum_Fields>;
  var_pop?: Maybe<Top_First_Txs_Var_Pop_Fields>;
  var_samp?: Maybe<Top_First_Txs_Var_Samp_Fields>;
  variance?: Maybe<Top_First_Txs_Variance_Fields>;
};


/** aggregate fields of "top_first_txs" */
export type Top_First_Txs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Top_First_Txs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Top_First_Txs_Avg_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "top_first_txs". All fields are combined with a logical 'AND'. */
export type Top_First_Txs_Bool_Exp = {
  _and?: InputMaybe<Array<Top_First_Txs_Bool_Exp>>;
  _not?: InputMaybe<Top_First_Txs_Bool_Exp>;
  _or?: InputMaybe<Array<Top_First_Txs_Bool_Exp>>;
  count?: InputMaybe<Bigint_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Top_First_Txs_Max_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Top_First_Txs_Min_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "top_first_txs". */
export type Top_First_Txs_Order_By = {
  count?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** select columns of table "top_first_txs" */
export enum Top_First_Txs_Select_Column {
  /** column name */
  Count = 'count',
  /** column name */
  Type = 'type'
}

/** aggregate stddev on columns */
export type Top_First_Txs_Stddev_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Top_First_Txs_Stddev_Pop_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Top_First_Txs_Stddev_Samp_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Top_First_Txs_Sum_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Top_First_Txs_Var_Pop_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Top_First_Txs_Var_Samp_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Top_First_Txs_Variance_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "top_leaders" */
export type Top_Leaders = {
  count?: Maybe<Scalars['bigint']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
};

/** Boolean expression to filter rows from the table "top_leaders". All fields are combined with a logical 'AND'. */
export type Top_Leaders_Bool_Exp = {
  _and?: InputMaybe<Array<Top_Leaders_Bool_Exp>>;
  _not?: InputMaybe<Top_Leaders_Bool_Exp>;
  _or?: InputMaybe<Array<Top_Leaders_Bool_Exp>>;
  count?: InputMaybe<Bigint_Comparison_Exp>;
  neuron?: InputMaybe<String_Comparison_Exp>;
};

/** Ordering options when selecting data from "top_leaders". */
export type Top_Leaders_Order_By = {
  count?: InputMaybe<Order_By>;
  neuron?: InputMaybe<Order_By>;
};

/** select columns of table "top_leaders" */
export enum Top_Leaders_Select_Column {
  /** column name */
  Count = 'count',
  /** column name */
  Neuron = 'neuron'
}

/** columns and relationships of "top_txs" */
export type Top_Txs = {
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "top_txs" */
export type Top_Txs_Aggregate = {
  aggregate?: Maybe<Top_Txs_Aggregate_Fields>;
  nodes: Array<Top_Txs>;
};

/** aggregate fields of "top_txs" */
export type Top_Txs_Aggregate_Fields = {
  avg?: Maybe<Top_Txs_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Top_Txs_Max_Fields>;
  min?: Maybe<Top_Txs_Min_Fields>;
  stddev?: Maybe<Top_Txs_Stddev_Fields>;
  stddev_pop?: Maybe<Top_Txs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Top_Txs_Stddev_Samp_Fields>;
  sum?: Maybe<Top_Txs_Sum_Fields>;
  var_pop?: Maybe<Top_Txs_Var_Pop_Fields>;
  var_samp?: Maybe<Top_Txs_Var_Samp_Fields>;
  variance?: Maybe<Top_Txs_Variance_Fields>;
};


/** aggregate fields of "top_txs" */
export type Top_Txs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Top_Txs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Top_Txs_Avg_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "top_txs". All fields are combined with a logical 'AND'. */
export type Top_Txs_Bool_Exp = {
  _and?: InputMaybe<Array<Top_Txs_Bool_Exp>>;
  _not?: InputMaybe<Top_Txs_Bool_Exp>;
  _or?: InputMaybe<Array<Top_Txs_Bool_Exp>>;
  count?: InputMaybe<Bigint_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Top_Txs_Max_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Top_Txs_Min_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "top_txs". */
export type Top_Txs_Order_By = {
  count?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
};

/** select columns of table "top_txs" */
export enum Top_Txs_Select_Column {
  /** column name */
  Count = 'count',
  /** column name */
  Type = 'type'
}

/** aggregate stddev on columns */
export type Top_Txs_Stddev_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Top_Txs_Stddev_Pop_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Top_Txs_Stddev_Samp_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Top_Txs_Sum_Fields = {
  count?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Top_Txs_Var_Pop_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Top_Txs_Var_Samp_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Top_Txs_Variance_Fields = {
  count?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "transaction" */
export type Transaction = {
  /** An object relationship */
  block: Block;
  /** fetch data from the table: "cyberlinks" */
  cyberlinks: Array<Cyberlinks>;
  /** An aggregate relationship */
  cyberlinks_aggregate: Cyberlinks_Aggregate;
  fee: Scalars['jsonb']['output'];
  gas_used?: Maybe<Scalars['bigint']['output']>;
  gas_wanted?: Maybe<Scalars['bigint']['output']>;
  hash: Scalars['String']['output'];
  height: Scalars['bigint']['output'];
  /** An array relationship */
  investmints: Array<Investmints>;
  /** An aggregate relationship */
  investmints_aggregate: Investmints_Aggregate;
  logs?: Maybe<Scalars['jsonb']['output']>;
  memo?: Maybe<Scalars['String']['output']>;
  messages: Scalars['jsonb']['output'];
  /** An array relationship */
  messagesByTransactionHash: Array<Message>;
  /** An aggregate relationship */
  messagesByTransactionHash_aggregate: Message_Aggregate;
  /** An array relationship */
  particles: Array<Particles>;
  /** An aggregate relationship */
  particles_aggregate: Particles_Aggregate;
  raw_log?: Maybe<Scalars['String']['output']>;
  /** An array relationship */
  routes: Array<Routes>;
  /** An aggregate relationship */
  routes_aggregate: Routes_Aggregate;
  signatures: Scalars['_text']['output'];
  signer_infos: Scalars['jsonb']['output'];
  success: Scalars['Boolean']['output'];
};


/** columns and relationships of "transaction" */
export type TransactionCyberlinksArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Order_By>>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
};


/** columns and relationships of "transaction" */
export type TransactionCyberlinks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cyberlinks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cyberlinks_Order_By>>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
};


/** columns and relationships of "transaction" */
export type TransactionFeeArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};


/** columns and relationships of "transaction" */
export type TransactionInvestmintsArgs = {
  distinct_on?: InputMaybe<Array<Investmints_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Investmints_Order_By>>;
  where?: InputMaybe<Investmints_Bool_Exp>;
};


/** columns and relationships of "transaction" */
export type TransactionInvestmints_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Investmints_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Investmints_Order_By>>;
  where?: InputMaybe<Investmints_Bool_Exp>;
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
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


/** columns and relationships of "transaction" */
export type TransactionMessagesByTransactionHash_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Message_Order_By>>;
  where?: InputMaybe<Message_Bool_Exp>;
};


/** columns and relationships of "transaction" */
export type TransactionParticlesArgs = {
  distinct_on?: InputMaybe<Array<Particles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Particles_Order_By>>;
  where?: InputMaybe<Particles_Bool_Exp>;
};


/** columns and relationships of "transaction" */
export type TransactionParticles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Particles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Particles_Order_By>>;
  where?: InputMaybe<Particles_Bool_Exp>;
};


/** columns and relationships of "transaction" */
export type TransactionRoutesArgs = {
  distinct_on?: InputMaybe<Array<Routes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Routes_Order_By>>;
  where?: InputMaybe<Routes_Bool_Exp>;
};


/** columns and relationships of "transaction" */
export type TransactionRoutes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Routes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Routes_Order_By>>;
  where?: InputMaybe<Routes_Bool_Exp>;
};


/** columns and relationships of "transaction" */
export type TransactionSigner_InfosArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "transaction" */
export type Transaction_Aggregate = {
  aggregate?: Maybe<Transaction_Aggregate_Fields>;
  nodes: Array<Transaction>;
};

/** aggregate fields of "transaction" */
export type Transaction_Aggregate_Fields = {
  avg?: Maybe<Transaction_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Transaction_Max_Fields>;
  min?: Maybe<Transaction_Min_Fields>;
  stddev?: Maybe<Transaction_Stddev_Fields>;
  stddev_pop?: Maybe<Transaction_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Transaction_Stddev_Samp_Fields>;
  sum?: Maybe<Transaction_Sum_Fields>;
  var_pop?: Maybe<Transaction_Var_Pop_Fields>;
  var_samp?: Maybe<Transaction_Var_Samp_Fields>;
  variance?: Maybe<Transaction_Variance_Fields>;
};


/** aggregate fields of "transaction" */
export type Transaction_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Transaction_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "transaction" */
export type Transaction_Aggregate_Order_By = {
  avg?: InputMaybe<Transaction_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Transaction_Max_Order_By>;
  min?: InputMaybe<Transaction_Min_Order_By>;
  stddev?: InputMaybe<Transaction_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Transaction_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Transaction_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Transaction_Sum_Order_By>;
  var_pop?: InputMaybe<Transaction_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Transaction_Var_Samp_Order_By>;
  variance?: InputMaybe<Transaction_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Transaction_Avg_Fields = {
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "transaction" */
export type Transaction_Avg_Order_By = {
  gas_used?: InputMaybe<Order_By>;
  gas_wanted?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "transaction". All fields are combined with a logical 'AND'. */
export type Transaction_Bool_Exp = {
  _and?: InputMaybe<Array<Transaction_Bool_Exp>>;
  _not?: InputMaybe<Transaction_Bool_Exp>;
  _or?: InputMaybe<Array<Transaction_Bool_Exp>>;
  block?: InputMaybe<Block_Bool_Exp>;
  cyberlinks?: InputMaybe<Cyberlinks_Bool_Exp>;
  fee?: InputMaybe<Jsonb_Comparison_Exp>;
  gas_used?: InputMaybe<Bigint_Comparison_Exp>;
  gas_wanted?: InputMaybe<Bigint_Comparison_Exp>;
  hash?: InputMaybe<String_Comparison_Exp>;
  height?: InputMaybe<Bigint_Comparison_Exp>;
  investmints?: InputMaybe<Investmints_Bool_Exp>;
  logs?: InputMaybe<Jsonb_Comparison_Exp>;
  memo?: InputMaybe<String_Comparison_Exp>;
  messages?: InputMaybe<Jsonb_Comparison_Exp>;
  messagesByTransactionHash?: InputMaybe<Message_Bool_Exp>;
  particles?: InputMaybe<Particles_Bool_Exp>;
  raw_log?: InputMaybe<String_Comparison_Exp>;
  routes?: InputMaybe<Routes_Bool_Exp>;
  signatures?: InputMaybe<_Text_Comparison_Exp>;
  signer_infos?: InputMaybe<Jsonb_Comparison_Exp>;
  success?: InputMaybe<Boolean_Comparison_Exp>;
};

/** aggregate max on columns */
export type Transaction_Max_Fields = {
  gas_used?: Maybe<Scalars['bigint']['output']>;
  gas_wanted?: Maybe<Scalars['bigint']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  memo?: Maybe<Scalars['String']['output']>;
  raw_log?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "transaction" */
export type Transaction_Max_Order_By = {
  gas_used?: InputMaybe<Order_By>;
  gas_wanted?: InputMaybe<Order_By>;
  hash?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  memo?: InputMaybe<Order_By>;
  raw_log?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Transaction_Min_Fields = {
  gas_used?: Maybe<Scalars['bigint']['output']>;
  gas_wanted?: Maybe<Scalars['bigint']['output']>;
  hash?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  memo?: Maybe<Scalars['String']['output']>;
  raw_log?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "transaction" */
export type Transaction_Min_Order_By = {
  gas_used?: InputMaybe<Order_By>;
  gas_wanted?: InputMaybe<Order_By>;
  hash?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  memo?: InputMaybe<Order_By>;
  raw_log?: InputMaybe<Order_By>;
};

/** Ordering options when selecting data from "transaction". */
export type Transaction_Order_By = {
  block?: InputMaybe<Block_Order_By>;
  cyberlinks_aggregate?: InputMaybe<Cyberlinks_Aggregate_Order_By>;
  fee?: InputMaybe<Order_By>;
  gas_used?: InputMaybe<Order_By>;
  gas_wanted?: InputMaybe<Order_By>;
  hash?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  investmints_aggregate?: InputMaybe<Investmints_Aggregate_Order_By>;
  logs?: InputMaybe<Order_By>;
  memo?: InputMaybe<Order_By>;
  messages?: InputMaybe<Order_By>;
  messagesByTransactionHash_aggregate?: InputMaybe<Message_Aggregate_Order_By>;
  particles_aggregate?: InputMaybe<Particles_Aggregate_Order_By>;
  raw_log?: InputMaybe<Order_By>;
  routes_aggregate?: InputMaybe<Routes_Aggregate_Order_By>;
  signatures?: InputMaybe<Order_By>;
  signer_infos?: InputMaybe<Order_By>;
  success?: InputMaybe<Order_By>;
};

/** select columns of table "transaction" */
export enum Transaction_Select_Column {
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
export type Transaction_Stddev_Fields = {
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "transaction" */
export type Transaction_Stddev_Order_By = {
  gas_used?: InputMaybe<Order_By>;
  gas_wanted?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Transaction_Stddev_Pop_Fields = {
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "transaction" */
export type Transaction_Stddev_Pop_Order_By = {
  gas_used?: InputMaybe<Order_By>;
  gas_wanted?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Transaction_Stddev_Samp_Fields = {
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "transaction" */
export type Transaction_Stddev_Samp_Order_By = {
  gas_used?: InputMaybe<Order_By>;
  gas_wanted?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Transaction_Sum_Fields = {
  gas_used?: Maybe<Scalars['bigint']['output']>;
  gas_wanted?: Maybe<Scalars['bigint']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
};

/** order by sum() on columns of table "transaction" */
export type Transaction_Sum_Order_By = {
  gas_used?: InputMaybe<Order_By>;
  gas_wanted?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Transaction_Var_Pop_Fields = {
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "transaction" */
export type Transaction_Var_Pop_Order_By = {
  gas_used?: InputMaybe<Order_By>;
  gas_wanted?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Transaction_Var_Samp_Fields = {
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "transaction" */
export type Transaction_Var_Samp_Order_By = {
  gas_used?: InputMaybe<Order_By>;
  gas_wanted?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Transaction_Variance_Fields = {
  gas_used?: Maybe<Scalars['Float']['output']>;
  gas_wanted?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "transaction" */
export type Transaction_Variance_Order_By = {
  gas_used?: InputMaybe<Order_By>;
  gas_wanted?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
};

/** columns and relationships of "tweets_stats" */
export type Tweets_Stats = {
  date?: Maybe<Scalars['date']['output']>;
  tweets?: Maybe<Scalars['numeric']['output']>;
  tweets_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** aggregated selection of "tweets_stats" */
export type Tweets_Stats_Aggregate = {
  aggregate?: Maybe<Tweets_Stats_Aggregate_Fields>;
  nodes: Array<Tweets_Stats>;
};

/** aggregate fields of "tweets_stats" */
export type Tweets_Stats_Aggregate_Fields = {
  avg?: Maybe<Tweets_Stats_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Tweets_Stats_Max_Fields>;
  min?: Maybe<Tweets_Stats_Min_Fields>;
  stddev?: Maybe<Tweets_Stats_Stddev_Fields>;
  stddev_pop?: Maybe<Tweets_Stats_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Tweets_Stats_Stddev_Samp_Fields>;
  sum?: Maybe<Tweets_Stats_Sum_Fields>;
  var_pop?: Maybe<Tweets_Stats_Var_Pop_Fields>;
  var_samp?: Maybe<Tweets_Stats_Var_Samp_Fields>;
  variance?: Maybe<Tweets_Stats_Variance_Fields>;
};


/** aggregate fields of "tweets_stats" */
export type Tweets_Stats_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Tweets_Stats_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Tweets_Stats_Avg_Fields = {
  tweets?: Maybe<Scalars['Float']['output']>;
  tweets_per_day?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "tweets_stats". All fields are combined with a logical 'AND'. */
export type Tweets_Stats_Bool_Exp = {
  _and?: InputMaybe<Array<Tweets_Stats_Bool_Exp>>;
  _not?: InputMaybe<Tweets_Stats_Bool_Exp>;
  _or?: InputMaybe<Array<Tweets_Stats_Bool_Exp>>;
  date?: InputMaybe<Date_Comparison_Exp>;
  tweets?: InputMaybe<Numeric_Comparison_Exp>;
  tweets_per_day?: InputMaybe<Bigint_Comparison_Exp>;
};

/** aggregate max on columns */
export type Tweets_Stats_Max_Fields = {
  date?: Maybe<Scalars['date']['output']>;
  tweets?: Maybe<Scalars['numeric']['output']>;
  tweets_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type Tweets_Stats_Min_Fields = {
  date?: Maybe<Scalars['date']['output']>;
  tweets?: Maybe<Scalars['numeric']['output']>;
  tweets_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "tweets_stats". */
export type Tweets_Stats_Order_By = {
  date?: InputMaybe<Order_By>;
  tweets?: InputMaybe<Order_By>;
  tweets_per_day?: InputMaybe<Order_By>;
};

/** select columns of table "tweets_stats" */
export enum Tweets_Stats_Select_Column {
  /** column name */
  Date = 'date',
  /** column name */
  Tweets = 'tweets',
  /** column name */
  TweetsPerDay = 'tweets_per_day'
}

/** aggregate stddev on columns */
export type Tweets_Stats_Stddev_Fields = {
  tweets?: Maybe<Scalars['Float']['output']>;
  tweets_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Tweets_Stats_Stddev_Pop_Fields = {
  tweets?: Maybe<Scalars['Float']['output']>;
  tweets_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Tweets_Stats_Stddev_Samp_Fields = {
  tweets?: Maybe<Scalars['Float']['output']>;
  tweets_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Tweets_Stats_Sum_Fields = {
  tweets?: Maybe<Scalars['numeric']['output']>;
  tweets_per_day?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Tweets_Stats_Var_Pop_Fields = {
  tweets?: Maybe<Scalars['Float']['output']>;
  tweets_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Tweets_Stats_Var_Samp_Fields = {
  tweets?: Maybe<Scalars['Float']['output']>;
  tweets_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Tweets_Stats_Variance_Fields = {
  tweets?: Maybe<Scalars['Float']['output']>;
  tweets_per_day?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "txs_ranked" */
export type Txs_Ranked = {
  height?: Maybe<Scalars['bigint']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** aggregated selection of "txs_ranked" */
export type Txs_Ranked_Aggregate = {
  aggregate?: Maybe<Txs_Ranked_Aggregate_Fields>;
  nodes: Array<Txs_Ranked>;
};

/** aggregate fields of "txs_ranked" */
export type Txs_Ranked_Aggregate_Fields = {
  avg?: Maybe<Txs_Ranked_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Txs_Ranked_Max_Fields>;
  min?: Maybe<Txs_Ranked_Min_Fields>;
  stddev?: Maybe<Txs_Ranked_Stddev_Fields>;
  stddev_pop?: Maybe<Txs_Ranked_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Txs_Ranked_Stddev_Samp_Fields>;
  sum?: Maybe<Txs_Ranked_Sum_Fields>;
  var_pop?: Maybe<Txs_Ranked_Var_Pop_Fields>;
  var_samp?: Maybe<Txs_Ranked_Var_Samp_Fields>;
  variance?: Maybe<Txs_Ranked_Variance_Fields>;
};


/** aggregate fields of "txs_ranked" */
export type Txs_Ranked_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Txs_Ranked_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Txs_Ranked_Avg_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "txs_ranked". All fields are combined with a logical 'AND'. */
export type Txs_Ranked_Bool_Exp = {
  _and?: InputMaybe<Array<Txs_Ranked_Bool_Exp>>;
  _not?: InputMaybe<Txs_Ranked_Bool_Exp>;
  _or?: InputMaybe<Array<Txs_Ranked_Bool_Exp>>;
  height?: InputMaybe<Bigint_Comparison_Exp>;
  neuron?: InputMaybe<String_Comparison_Exp>;
  rank?: InputMaybe<Bigint_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  week?: InputMaybe<Date_Comparison_Exp>;
};

/** aggregate max on columns */
export type Txs_Ranked_Max_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** aggregate min on columns */
export type Txs_Ranked_Min_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  neuron?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  week?: Maybe<Scalars['date']['output']>;
};

/** Ordering options when selecting data from "txs_ranked". */
export type Txs_Ranked_Order_By = {
  height?: InputMaybe<Order_By>;
  neuron?: InputMaybe<Order_By>;
  rank?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  week?: InputMaybe<Order_By>;
};

/** select columns of table "txs_ranked" */
export enum Txs_Ranked_Select_Column {
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
export type Txs_Ranked_Stddev_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Txs_Ranked_Stddev_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Txs_Ranked_Stddev_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Txs_Ranked_Sum_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Txs_Ranked_Var_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Txs_Ranked_Var_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Txs_Ranked_Variance_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "txs_stats" */
export type Txs_Stats = {
  date?: Maybe<Scalars['date']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  msg_type?: Maybe<Scalars['String']['output']>;
  pubkey?: Maybe<Scalars['jsonb']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
};


/** columns and relationships of "txs_stats" */
export type Txs_StatsPubkeyArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "txs_stats" */
export type Txs_Stats_Aggregate = {
  aggregate?: Maybe<Txs_Stats_Aggregate_Fields>;
  nodes: Array<Txs_Stats>;
};

/** aggregate fields of "txs_stats" */
export type Txs_Stats_Aggregate_Fields = {
  avg?: Maybe<Txs_Stats_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Txs_Stats_Max_Fields>;
  min?: Maybe<Txs_Stats_Min_Fields>;
  stddev?: Maybe<Txs_Stats_Stddev_Fields>;
  stddev_pop?: Maybe<Txs_Stats_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Txs_Stats_Stddev_Samp_Fields>;
  sum?: Maybe<Txs_Stats_Sum_Fields>;
  var_pop?: Maybe<Txs_Stats_Var_Pop_Fields>;
  var_samp?: Maybe<Txs_Stats_Var_Samp_Fields>;
  variance?: Maybe<Txs_Stats_Variance_Fields>;
};


/** aggregate fields of "txs_stats" */
export type Txs_Stats_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Txs_Stats_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Txs_Stats_Avg_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "txs_stats". All fields are combined with a logical 'AND'. */
export type Txs_Stats_Bool_Exp = {
  _and?: InputMaybe<Array<Txs_Stats_Bool_Exp>>;
  _not?: InputMaybe<Txs_Stats_Bool_Exp>;
  _or?: InputMaybe<Array<Txs_Stats_Bool_Exp>>;
  date?: InputMaybe<Date_Comparison_Exp>;
  height?: InputMaybe<Bigint_Comparison_Exp>;
  msg_type?: InputMaybe<String_Comparison_Exp>;
  pubkey?: InputMaybe<Jsonb_Comparison_Exp>;
  rank?: InputMaybe<Bigint_Comparison_Exp>;
};

/** aggregate max on columns */
export type Txs_Stats_Max_Fields = {
  date?: Maybe<Scalars['date']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  msg_type?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate min on columns */
export type Txs_Stats_Min_Fields = {
  date?: Maybe<Scalars['date']['output']>;
  height?: Maybe<Scalars['bigint']['output']>;
  msg_type?: Maybe<Scalars['String']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
};

/** Ordering options when selecting data from "txs_stats". */
export type Txs_Stats_Order_By = {
  date?: InputMaybe<Order_By>;
  height?: InputMaybe<Order_By>;
  msg_type?: InputMaybe<Order_By>;
  pubkey?: InputMaybe<Order_By>;
  rank?: InputMaybe<Order_By>;
};

/** select columns of table "txs_stats" */
export enum Txs_Stats_Select_Column {
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
export type Txs_Stats_Stddev_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Txs_Stats_Stddev_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Txs_Stats_Stddev_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Txs_Stats_Sum_Fields = {
  height?: Maybe<Scalars['bigint']['output']>;
  rank?: Maybe<Scalars['bigint']['output']>;
};

/** aggregate var_pop on columns */
export type Txs_Stats_Var_Pop_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Txs_Stats_Var_Samp_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Txs_Stats_Variance_Fields = {
  height?: Maybe<Scalars['Float']['output']>;
  rank?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "uptime" */
export type Uptime = {
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  pre_commits?: Maybe<Scalars['bigint']['output']>;
  uptime?: Maybe<Scalars['numeric']['output']>;
};

/** aggregated selection of "uptime" */
export type Uptime_Aggregate = {
  aggregate?: Maybe<Uptime_Aggregate_Fields>;
  nodes: Array<Uptime>;
};

/** aggregate fields of "uptime" */
export type Uptime_Aggregate_Fields = {
  avg?: Maybe<Uptime_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Uptime_Max_Fields>;
  min?: Maybe<Uptime_Min_Fields>;
  stddev?: Maybe<Uptime_Stddev_Fields>;
  stddev_pop?: Maybe<Uptime_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Uptime_Stddev_Samp_Fields>;
  sum?: Maybe<Uptime_Sum_Fields>;
  var_pop?: Maybe<Uptime_Var_Pop_Fields>;
  var_samp?: Maybe<Uptime_Var_Samp_Fields>;
  variance?: Maybe<Uptime_Variance_Fields>;
};


/** aggregate fields of "uptime" */
export type Uptime_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Uptime_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Uptime_Avg_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
  uptime?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "uptime". All fields are combined with a logical 'AND'. */
export type Uptime_Bool_Exp = {
  _and?: InputMaybe<Array<Uptime_Bool_Exp>>;
  _not?: InputMaybe<Uptime_Bool_Exp>;
  _or?: InputMaybe<Array<Uptime_Bool_Exp>>;
  consensus_address?: InputMaybe<String_Comparison_Exp>;
  consensus_pubkey?: InputMaybe<String_Comparison_Exp>;
  pre_commits?: InputMaybe<Bigint_Comparison_Exp>;
  uptime?: InputMaybe<Numeric_Comparison_Exp>;
};

/** aggregate max on columns */
export type Uptime_Max_Fields = {
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  pre_commits?: Maybe<Scalars['bigint']['output']>;
  uptime?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate min on columns */
export type Uptime_Min_Fields = {
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
  pre_commits?: Maybe<Scalars['bigint']['output']>;
  uptime?: Maybe<Scalars['numeric']['output']>;
};

/** Ordering options when selecting data from "uptime". */
export type Uptime_Order_By = {
  consensus_address?: InputMaybe<Order_By>;
  consensus_pubkey?: InputMaybe<Order_By>;
  pre_commits?: InputMaybe<Order_By>;
  uptime?: InputMaybe<Order_By>;
};

/** select columns of table "uptime" */
export enum Uptime_Select_Column {
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
export type Uptime_Stddev_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
  uptime?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Uptime_Stddev_Pop_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
  uptime?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Uptime_Stddev_Samp_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
  uptime?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Uptime_Sum_Fields = {
  pre_commits?: Maybe<Scalars['bigint']['output']>;
  uptime?: Maybe<Scalars['numeric']['output']>;
};

/** aggregate var_pop on columns */
export type Uptime_Var_Pop_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
  uptime?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Uptime_Var_Samp_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
  uptime?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Uptime_Variance_Fields = {
  pre_commits?: Maybe<Scalars['Float']['output']>;
  uptime?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "validator" */
export type Validator = {
  /** An array relationship */
  blocks: Array<Block>;
  /** An aggregate relationship */
  blocks_aggregate: Block_Aggregate;
  consensus_address: Scalars['String']['output'];
  consensus_pubkey: Scalars['String']['output'];
  /** An array relationship */
  pre_commits: Array<Pre_Commit>;
  /** An aggregate relationship */
  pre_commits_aggregate: Pre_Commit_Aggregate;
};


/** columns and relationships of "validator" */
export type ValidatorBlocksArgs = {
  distinct_on?: InputMaybe<Array<Block_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Block_Order_By>>;
  where?: InputMaybe<Block_Bool_Exp>;
};


/** columns and relationships of "validator" */
export type ValidatorBlocks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Block_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Block_Order_By>>;
  where?: InputMaybe<Block_Bool_Exp>;
};


/** columns and relationships of "validator" */
export type ValidatorPre_CommitsArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commit_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commit_Order_By>>;
  where?: InputMaybe<Pre_Commit_Bool_Exp>;
};


/** columns and relationships of "validator" */
export type ValidatorPre_Commits_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pre_Commit_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Pre_Commit_Order_By>>;
  where?: InputMaybe<Pre_Commit_Bool_Exp>;
};

/** aggregated selection of "validator" */
export type Validator_Aggregate = {
  aggregate?: Maybe<Validator_Aggregate_Fields>;
  nodes: Array<Validator>;
};

/** aggregate fields of "validator" */
export type Validator_Aggregate_Fields = {
  count: Scalars['Int']['output'];
  max?: Maybe<Validator_Max_Fields>;
  min?: Maybe<Validator_Min_Fields>;
};


/** aggregate fields of "validator" */
export type Validator_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Validator_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "validator". All fields are combined with a logical 'AND'. */
export type Validator_Bool_Exp = {
  _and?: InputMaybe<Array<Validator_Bool_Exp>>;
  _not?: InputMaybe<Validator_Bool_Exp>;
  _or?: InputMaybe<Array<Validator_Bool_Exp>>;
  blocks?: InputMaybe<Block_Bool_Exp>;
  consensus_address?: InputMaybe<String_Comparison_Exp>;
  consensus_pubkey?: InputMaybe<String_Comparison_Exp>;
  pre_commits?: InputMaybe<Pre_Commit_Bool_Exp>;
};

/** aggregate max on columns */
export type Validator_Max_Fields = {
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Validator_Min_Fields = {
  consensus_address?: Maybe<Scalars['String']['output']>;
  consensus_pubkey?: Maybe<Scalars['String']['output']>;
};

/** Ordering options when selecting data from "validator". */
export type Validator_Order_By = {
  blocks_aggregate?: InputMaybe<Block_Aggregate_Order_By>;
  consensus_address?: InputMaybe<Order_By>;
  consensus_pubkey?: InputMaybe<Order_By>;
  pre_commits_aggregate?: InputMaybe<Pre_Commit_Aggregate_Order_By>;
};

/** select columns of table "validator" */
export enum Validator_Select_Column {
  /** column name */
  ConsensusAddress = 'consensus_address',
  /** column name */
  ConsensusPubkey = 'consensus_pubkey'
}

/** columns and relationships of "volts_demand" */
export type Volts_Demand = {
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
  volts?: Maybe<Scalars['float8']['output']>;
};

/** aggregated selection of "volts_demand" */
export type Volts_Demand_Aggregate = {
  aggregate?: Maybe<Volts_Demand_Aggregate_Fields>;
  nodes: Array<Volts_Demand>;
};

/** aggregate fields of "volts_demand" */
export type Volts_Demand_Aggregate_Fields = {
  avg?: Maybe<Volts_Demand_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Volts_Demand_Max_Fields>;
  min?: Maybe<Volts_Demand_Min_Fields>;
  stddev?: Maybe<Volts_Demand_Stddev_Fields>;
  stddev_pop?: Maybe<Volts_Demand_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Volts_Demand_Stddev_Samp_Fields>;
  sum?: Maybe<Volts_Demand_Sum_Fields>;
  var_pop?: Maybe<Volts_Demand_Var_Pop_Fields>;
  var_samp?: Maybe<Volts_Demand_Var_Samp_Fields>;
  variance?: Maybe<Volts_Demand_Variance_Fields>;
};


/** aggregate fields of "volts_demand" */
export type Volts_Demand_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Volts_Demand_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Volts_Demand_Avg_Fields = {
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
  volts?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "volts_demand". All fields are combined with a logical 'AND'. */
export type Volts_Demand_Bool_Exp = {
  _and?: InputMaybe<Array<Volts_Demand_Bool_Exp>>;
  _not?: InputMaybe<Volts_Demand_Bool_Exp>;
  _or?: InputMaybe<Array<Volts_Demand_Bool_Exp>>;
  cyberlinks_per_day?: InputMaybe<Bigint_Comparison_Exp>;
  date?: InputMaybe<Date_Comparison_Exp>;
  volts?: InputMaybe<Float8_Comparison_Exp>;
};

/** aggregate max on columns */
export type Volts_Demand_Max_Fields = {
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
  volts?: Maybe<Scalars['float8']['output']>;
};

/** aggregate min on columns */
export type Volts_Demand_Min_Fields = {
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
  date?: Maybe<Scalars['date']['output']>;
  volts?: Maybe<Scalars['float8']['output']>;
};

/** Ordering options when selecting data from "volts_demand". */
export type Volts_Demand_Order_By = {
  cyberlinks_per_day?: InputMaybe<Order_By>;
  date?: InputMaybe<Order_By>;
  volts?: InputMaybe<Order_By>;
};

/** select columns of table "volts_demand" */
export enum Volts_Demand_Select_Column {
  /** column name */
  CyberlinksPerDay = 'cyberlinks_per_day',
  /** column name */
  Date = 'date',
  /** column name */
  Volts = 'volts'
}

/** aggregate stddev on columns */
export type Volts_Demand_Stddev_Fields = {
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
  volts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Volts_Demand_Stddev_Pop_Fields = {
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
  volts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Volts_Demand_Stddev_Samp_Fields = {
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
  volts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Volts_Demand_Sum_Fields = {
  cyberlinks_per_day?: Maybe<Scalars['bigint']['output']>;
  volts?: Maybe<Scalars['float8']['output']>;
};

/** aggregate var_pop on columns */
export type Volts_Demand_Var_Pop_Fields = {
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
  volts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Volts_Demand_Var_Samp_Fields = {
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
  volts?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Volts_Demand_Variance_Fields = {
  cyberlinks_per_day?: Maybe<Scalars['Float']['output']>;
  volts?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "volts_stats" */
export type Volts_Stats = {
  date?: Maybe<Scalars['date']['output']>;
  volts?: Maybe<Scalars['float8']['output']>;
  volts_per_day?: Maybe<Scalars['float8']['output']>;
};

/** aggregated selection of "volts_stats" */
export type Volts_Stats_Aggregate = {
  aggregate?: Maybe<Volts_Stats_Aggregate_Fields>;
  nodes: Array<Volts_Stats>;
};

/** aggregate fields of "volts_stats" */
export type Volts_Stats_Aggregate_Fields = {
  avg?: Maybe<Volts_Stats_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Volts_Stats_Max_Fields>;
  min?: Maybe<Volts_Stats_Min_Fields>;
  stddev?: Maybe<Volts_Stats_Stddev_Fields>;
  stddev_pop?: Maybe<Volts_Stats_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Volts_Stats_Stddev_Samp_Fields>;
  sum?: Maybe<Volts_Stats_Sum_Fields>;
  var_pop?: Maybe<Volts_Stats_Var_Pop_Fields>;
  var_samp?: Maybe<Volts_Stats_Var_Samp_Fields>;
  variance?: Maybe<Volts_Stats_Variance_Fields>;
};


/** aggregate fields of "volts_stats" */
export type Volts_Stats_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Volts_Stats_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Volts_Stats_Avg_Fields = {
  volts?: Maybe<Scalars['Float']['output']>;
  volts_per_day?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "volts_stats". All fields are combined with a logical 'AND'. */
export type Volts_Stats_Bool_Exp = {
  _and?: InputMaybe<Array<Volts_Stats_Bool_Exp>>;
  _not?: InputMaybe<Volts_Stats_Bool_Exp>;
  _or?: InputMaybe<Array<Volts_Stats_Bool_Exp>>;
  date?: InputMaybe<Date_Comparison_Exp>;
  volts?: InputMaybe<Float8_Comparison_Exp>;
  volts_per_day?: InputMaybe<Float8_Comparison_Exp>;
};

/** aggregate max on columns */
export type Volts_Stats_Max_Fields = {
  date?: Maybe<Scalars['date']['output']>;
  volts?: Maybe<Scalars['float8']['output']>;
  volts_per_day?: Maybe<Scalars['float8']['output']>;
};

/** aggregate min on columns */
export type Volts_Stats_Min_Fields = {
  date?: Maybe<Scalars['date']['output']>;
  volts?: Maybe<Scalars['float8']['output']>;
  volts_per_day?: Maybe<Scalars['float8']['output']>;
};

/** Ordering options when selecting data from "volts_stats". */
export type Volts_Stats_Order_By = {
  date?: InputMaybe<Order_By>;
  volts?: InputMaybe<Order_By>;
  volts_per_day?: InputMaybe<Order_By>;
};

/** select columns of table "volts_stats" */
export enum Volts_Stats_Select_Column {
  /** column name */
  Date = 'date',
  /** column name */
  Volts = 'volts',
  /** column name */
  VoltsPerDay = 'volts_per_day'
}

/** aggregate stddev on columns */
export type Volts_Stats_Stddev_Fields = {
  volts?: Maybe<Scalars['Float']['output']>;
  volts_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Volts_Stats_Stddev_Pop_Fields = {
  volts?: Maybe<Scalars['Float']['output']>;
  volts_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Volts_Stats_Stddev_Samp_Fields = {
  volts?: Maybe<Scalars['Float']['output']>;
  volts_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate sum on columns */
export type Volts_Stats_Sum_Fields = {
  volts?: Maybe<Scalars['float8']['output']>;
  volts_per_day?: Maybe<Scalars['float8']['output']>;
};

/** aggregate var_pop on columns */
export type Volts_Stats_Var_Pop_Fields = {
  volts?: Maybe<Scalars['Float']['output']>;
  volts_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Volts_Stats_Var_Samp_Fields = {
  volts?: Maybe<Scalars['Float']['output']>;
  volts_per_day?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Volts_Stats_Variance_Fields = {
  volts?: Maybe<Scalars['Float']['output']>;
  volts_per_day?: Maybe<Scalars['Float']['output']>;
};

export type TransactionsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TransactionsSubscription = { transaction: Array<{ success: boolean, messages: any, height: any, hash: string }> };

export type AccountCountQueryVariables = Exact<{ [key: string]: never; }>;


export type AccountCountQuery = { account_aggregate: { aggregate?: { count: number } | null } };

export type BlockByHeightQueryVariables = Exact<{
  blockId?: InputMaybe<Scalars['bigint']['input']>;
}>;


export type BlockByHeightQuery = { block: Array<{ hash: string, height: any, proposer_address?: string | null, timestamp: any, transactions: Array<{ messages: any, hash: string, height: any, success: boolean }> }> };

export type BlocksQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Block_Bool_Exp>;
}>;


export type BlocksQuery = { block: Array<{ hash: string, height: any, proposer_address?: string | null, timestamp: any, transactions_aggregate: { aggregate?: { count: number } | null } }> };

export type ContractsCountQueryVariables = Exact<{ [key: string]: never; }>;


export type ContractsCountQuery = { contracts_aggregate: { aggregate?: { count: number } | null } };

export type CyberlinksByParticleQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Cyberlinks_Order_By> | Cyberlinks_Order_By>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
}>;


export type CyberlinksByParticleQuery = { cyberlinks: Array<{ timestamp: any, neuron: string, transaction_hash: string, from: string, to: string }> };

export type CyberlinksCountByNeuronQueryVariables = Exact<{
  address?: InputMaybe<Scalars['String']['input']>;
  particles_from?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['timestamp']['input']>;
}>;


export type CyberlinksCountByNeuronQuery = { cyberlinks_aggregate: { aggregate?: { count: number } | null } };

export type CyberlinksCountByParticleQueryVariables = Exact<{
  cid?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<Cyberlinks_Bool_Exp>;
}>;


export type CyberlinksCountByParticleQuery = { cyberlinks_aggregate: { aggregate?: { count: number } | null } };

export type MessagesByAddressCountQueryVariables = Exact<{
  address?: InputMaybe<Scalars['_text']['input']>;
  timestamp?: InputMaybe<Scalars['timestamp']['input']>;
}>;


export type MessagesByAddressCountQuery = { messages_by_address_aggregate: { aggregate?: { count: number } | null } };

export type MessagesByAddressSenseQueryVariables = Exact<{
  address?: InputMaybe<Scalars['_text']['input']>;
  limit?: InputMaybe<Scalars['bigint']['input']>;
  offset?: InputMaybe<Scalars['bigint']['input']>;
  timestamp_from?: InputMaybe<Scalars['timestamp']['input']>;
  types?: InputMaybe<Scalars['_text']['input']>;
  order_direction?: InputMaybe<Order_By>;
}>;


export type MessagesByAddressSenseQuery = { messages_by_address: Array<{ transaction_hash: string, index: any, value: any, type: string, transaction: { success: boolean, memo?: string | null, block: { timestamp: any, height: any } } }> };

export type MessagesByAddressSenseWsSubscriptionVariables = Exact<{
  address?: InputMaybe<Scalars['_text']['input']>;
  limit?: InputMaybe<Scalars['bigint']['input']>;
  offset?: InputMaybe<Scalars['bigint']['input']>;
  timestamp_from?: InputMaybe<Scalars['timestamp']['input']>;
  types?: InputMaybe<Scalars['_text']['input']>;
  order_direction?: InputMaybe<Order_By>;
}>;


export type MessagesByAddressSenseWsSubscription = { messages_by_address: Array<{ transaction_hash: string, index: any, value: any, type: string, transaction: { success: boolean, memo?: string | null, block: { timestamp: any, height: any } } }> };

export type TransactionCountQueryVariables = Exact<{ [key: string]: never; }>;


export type TransactionCountQuery = { transaction_aggregate: { aggregate?: { count: number } | null } };

export type UptimeByAddressQueryVariables = Exact<{
  address?: InputMaybe<Scalars['String']['input']>;
}>;


export type UptimeByAddressQuery = { uptime: Array<{ uptime?: any | null }> };

export type WasmDashboardPageQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type WasmDashboardPageQuery = { contracts: Array<{ address: string, admin: string, code_id: any, creator: string, fees: any, gas: any, label: string, tx: any }>, contracts_aggregate: { aggregate?: { count: number, sum?: { gas?: any | null, fees?: any | null, tx?: any | null } | null } | null } };

export type MessagesByAddressQueryVariables = Exact<{
  address?: InputMaybe<Scalars['_text']['input']>;
  limit?: InputMaybe<Scalars['bigint']['input']>;
  offset?: InputMaybe<Scalars['bigint']['input']>;
  types?: InputMaybe<Scalars['_text']['input']>;
}>;


export type MessagesByAddressQuery = { messages_by_address: Array<{ transaction_hash: string, value: any, type: string, transaction: { success: boolean, height: any, logs?: any | null, memo?: string | null, block: { timestamp: any } } }> };


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
export const AccountCountDocument = gql`
    query accountCount {
  account_aggregate {
    aggregate {
      count(columns: address)
    }
  }
}
    `;

/**
 * __useAccountCountQuery__
 *
 * To run a query within a React component, call `useAccountCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useAccountCountQuery(baseOptions?: Apollo.QueryHookOptions<AccountCountQuery, AccountCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountCountQuery, AccountCountQueryVariables>(AccountCountDocument, options);
      }
export function useAccountCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountCountQuery, AccountCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountCountQuery, AccountCountQueryVariables>(AccountCountDocument, options);
        }
export function useAccountCountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AccountCountQuery, AccountCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AccountCountQuery, AccountCountQueryVariables>(AccountCountDocument, options);
        }
export type AccountCountQueryHookResult = ReturnType<typeof useAccountCountQuery>;
export type AccountCountLazyQueryHookResult = ReturnType<typeof useAccountCountLazyQuery>;
export type AccountCountSuspenseQueryHookResult = ReturnType<typeof useAccountCountSuspenseQuery>;
export type AccountCountQueryResult = Apollo.QueryResult<AccountCountQuery, AccountCountQueryVariables>;
export const BlockByHeightDocument = gql`
    query blockByHeight($blockId: bigint) {
  block(where: {height: {_eq: $blockId}}) {
    hash
    height
    proposer_address
    timestamp
    transactions {
      messages
      hash
      height
      success
    }
  }
}
    `;

/**
 * __useBlockByHeightQuery__
 *
 * To run a query within a React component, call `useBlockByHeightQuery` and pass it any options that fit your needs.
 * When your component renders, `useBlockByHeightQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBlockByHeightQuery({
 *   variables: {
 *      blockId: // value for 'blockId'
 *   },
 * });
 */
export function useBlockByHeightQuery(baseOptions?: Apollo.QueryHookOptions<BlockByHeightQuery, BlockByHeightQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BlockByHeightQuery, BlockByHeightQueryVariables>(BlockByHeightDocument, options);
      }
export function useBlockByHeightLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BlockByHeightQuery, BlockByHeightQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BlockByHeightQuery, BlockByHeightQueryVariables>(BlockByHeightDocument, options);
        }
export function useBlockByHeightSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BlockByHeightQuery, BlockByHeightQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BlockByHeightQuery, BlockByHeightQueryVariables>(BlockByHeightDocument, options);
        }
export type BlockByHeightQueryHookResult = ReturnType<typeof useBlockByHeightQuery>;
export type BlockByHeightLazyQueryHookResult = ReturnType<typeof useBlockByHeightLazyQuery>;
export type BlockByHeightSuspenseQueryHookResult = ReturnType<typeof useBlockByHeightSuspenseQuery>;
export type BlockByHeightQueryResult = Apollo.QueryResult<BlockByHeightQuery, BlockByHeightQueryVariables>;
export const BlocksDocument = gql`
    query blocks($limit: Int, $offset: Int, $where: block_bool_exp) {
  block(where: $where, limit: $limit, offset: $offset, order_by: {height: desc}) {
    hash
    height
    proposer_address
    transactions_aggregate {
      aggregate {
        count
      }
    }
    timestamp
  }
}
    `;

/**
 * __useBlocksQuery__
 *
 * To run a query within a React component, call `useBlocksQuery` and pass it any options that fit your needs.
 * When your component renders, `useBlocksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBlocksQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useBlocksQuery(baseOptions?: Apollo.QueryHookOptions<BlocksQuery, BlocksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BlocksQuery, BlocksQueryVariables>(BlocksDocument, options);
      }
export function useBlocksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BlocksQuery, BlocksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BlocksQuery, BlocksQueryVariables>(BlocksDocument, options);
        }
export function useBlocksSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<BlocksQuery, BlocksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<BlocksQuery, BlocksQueryVariables>(BlocksDocument, options);
        }
export type BlocksQueryHookResult = ReturnType<typeof useBlocksQuery>;
export type BlocksLazyQueryHookResult = ReturnType<typeof useBlocksLazyQuery>;
export type BlocksSuspenseQueryHookResult = ReturnType<typeof useBlocksSuspenseQuery>;
export type BlocksQueryResult = Apollo.QueryResult<BlocksQuery, BlocksQueryVariables>;
export const ContractsCountDocument = gql`
    query contractsCount {
  contracts_aggregate {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useContractsCountQuery__
 *
 * To run a query within a React component, call `useContractsCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useContractsCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useContractsCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useContractsCountQuery(baseOptions?: Apollo.QueryHookOptions<ContractsCountQuery, ContractsCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ContractsCountQuery, ContractsCountQueryVariables>(ContractsCountDocument, options);
      }
export function useContractsCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ContractsCountQuery, ContractsCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ContractsCountQuery, ContractsCountQueryVariables>(ContractsCountDocument, options);
        }
export function useContractsCountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ContractsCountQuery, ContractsCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ContractsCountQuery, ContractsCountQueryVariables>(ContractsCountDocument, options);
        }
export type ContractsCountQueryHookResult = ReturnType<typeof useContractsCountQuery>;
export type ContractsCountLazyQueryHookResult = ReturnType<typeof useContractsCountLazyQuery>;
export type ContractsCountSuspenseQueryHookResult = ReturnType<typeof useContractsCountSuspenseQuery>;
export type ContractsCountQueryResult = Apollo.QueryResult<ContractsCountQuery, ContractsCountQueryVariables>;
export const CyberlinksByParticleDocument = gql`
    query CyberlinksByParticle($limit: Int, $offset: Int, $orderBy: [cyberlinks_order_by!], $where: cyberlinks_bool_exp) {
  cyberlinks(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
    from: particle_from
    to: particle_to
    timestamp
    neuron
    transaction_hash
  }
}
    `;

/**
 * __useCyberlinksByParticleQuery__
 *
 * To run a query within a React component, call `useCyberlinksByParticleQuery` and pass it any options that fit your needs.
 * When your component renders, `useCyberlinksByParticleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCyberlinksByParticleQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      orderBy: // value for 'orderBy'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useCyberlinksByParticleQuery(baseOptions?: Apollo.QueryHookOptions<CyberlinksByParticleQuery, CyberlinksByParticleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CyberlinksByParticleQuery, CyberlinksByParticleQueryVariables>(CyberlinksByParticleDocument, options);
      }
export function useCyberlinksByParticleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CyberlinksByParticleQuery, CyberlinksByParticleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CyberlinksByParticleQuery, CyberlinksByParticleQueryVariables>(CyberlinksByParticleDocument, options);
        }
export function useCyberlinksByParticleSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CyberlinksByParticleQuery, CyberlinksByParticleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CyberlinksByParticleQuery, CyberlinksByParticleQueryVariables>(CyberlinksByParticleDocument, options);
        }
export type CyberlinksByParticleQueryHookResult = ReturnType<typeof useCyberlinksByParticleQuery>;
export type CyberlinksByParticleLazyQueryHookResult = ReturnType<typeof useCyberlinksByParticleLazyQuery>;
export type CyberlinksByParticleSuspenseQueryHookResult = ReturnType<typeof useCyberlinksByParticleSuspenseQuery>;
export type CyberlinksByParticleQueryResult = Apollo.QueryResult<CyberlinksByParticleQuery, CyberlinksByParticleQueryVariables>;
export const CyberlinksCountByNeuronDocument = gql`
    query CyberlinksCountByNeuron($address: String, $particles_from: [String!], $timestamp: timestamp) {
  cyberlinks_aggregate(
    where: {_and: [{neuron: {_eq: $address}}, {particle_from: {_in: $particles_from}}, {timestamp: {_gt: $timestamp}}]}
  ) {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useCyberlinksCountByNeuronQuery__
 *
 * To run a query within a React component, call `useCyberlinksCountByNeuronQuery` and pass it any options that fit your needs.
 * When your component renders, `useCyberlinksCountByNeuronQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCyberlinksCountByNeuronQuery({
 *   variables: {
 *      address: // value for 'address'
 *      particles_from: // value for 'particles_from'
 *      timestamp: // value for 'timestamp'
 *   },
 * });
 */
export function useCyberlinksCountByNeuronQuery(baseOptions?: Apollo.QueryHookOptions<CyberlinksCountByNeuronQuery, CyberlinksCountByNeuronQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CyberlinksCountByNeuronQuery, CyberlinksCountByNeuronQueryVariables>(CyberlinksCountByNeuronDocument, options);
      }
export function useCyberlinksCountByNeuronLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CyberlinksCountByNeuronQuery, CyberlinksCountByNeuronQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CyberlinksCountByNeuronQuery, CyberlinksCountByNeuronQueryVariables>(CyberlinksCountByNeuronDocument, options);
        }
export function useCyberlinksCountByNeuronSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CyberlinksCountByNeuronQuery, CyberlinksCountByNeuronQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CyberlinksCountByNeuronQuery, CyberlinksCountByNeuronQueryVariables>(CyberlinksCountByNeuronDocument, options);
        }
export type CyberlinksCountByNeuronQueryHookResult = ReturnType<typeof useCyberlinksCountByNeuronQuery>;
export type CyberlinksCountByNeuronLazyQueryHookResult = ReturnType<typeof useCyberlinksCountByNeuronLazyQuery>;
export type CyberlinksCountByNeuronSuspenseQueryHookResult = ReturnType<typeof useCyberlinksCountByNeuronSuspenseQuery>;
export type CyberlinksCountByNeuronQueryResult = Apollo.QueryResult<CyberlinksCountByNeuronQuery, CyberlinksCountByNeuronQueryVariables>;
export const CyberlinksCountByParticleDocument = gql`
    query cyberlinksCountByParticle($cid: String, $where: cyberlinks_bool_exp) {
  cyberlinks_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useCyberlinksCountByParticleQuery__
 *
 * To run a query within a React component, call `useCyberlinksCountByParticleQuery` and pass it any options that fit your needs.
 * When your component renders, `useCyberlinksCountByParticleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCyberlinksCountByParticleQuery({
 *   variables: {
 *      cid: // value for 'cid'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useCyberlinksCountByParticleQuery(baseOptions?: Apollo.QueryHookOptions<CyberlinksCountByParticleQuery, CyberlinksCountByParticleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CyberlinksCountByParticleQuery, CyberlinksCountByParticleQueryVariables>(CyberlinksCountByParticleDocument, options);
      }
export function useCyberlinksCountByParticleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CyberlinksCountByParticleQuery, CyberlinksCountByParticleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CyberlinksCountByParticleQuery, CyberlinksCountByParticleQueryVariables>(CyberlinksCountByParticleDocument, options);
        }
export function useCyberlinksCountByParticleSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CyberlinksCountByParticleQuery, CyberlinksCountByParticleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CyberlinksCountByParticleQuery, CyberlinksCountByParticleQueryVariables>(CyberlinksCountByParticleDocument, options);
        }
export type CyberlinksCountByParticleQueryHookResult = ReturnType<typeof useCyberlinksCountByParticleQuery>;
export type CyberlinksCountByParticleLazyQueryHookResult = ReturnType<typeof useCyberlinksCountByParticleLazyQuery>;
export type CyberlinksCountByParticleSuspenseQueryHookResult = ReturnType<typeof useCyberlinksCountByParticleSuspenseQuery>;
export type CyberlinksCountByParticleQueryResult = Apollo.QueryResult<CyberlinksCountByParticleQuery, CyberlinksCountByParticleQueryVariables>;
export const MessagesByAddressCountDocument = gql`
    query MessagesByAddressCount($address: _text, $timestamp: timestamp) {
  messages_by_address_aggregate(
    args: {addresses: $address, limit: "100000000", offset: "0", types: "{}"}
    where: {transaction: {block: {timestamp: {_gt: $timestamp}}}}
  ) {
    aggregate {
      count
    }
  }
}
    `;

/**
 * __useMessagesByAddressCountQuery__
 *
 * To run a query within a React component, call `useMessagesByAddressCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesByAddressCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesByAddressCountQuery({
 *   variables: {
 *      address: // value for 'address'
 *      timestamp: // value for 'timestamp'
 *   },
 * });
 */
export function useMessagesByAddressCountQuery(baseOptions?: Apollo.QueryHookOptions<MessagesByAddressCountQuery, MessagesByAddressCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MessagesByAddressCountQuery, MessagesByAddressCountQueryVariables>(MessagesByAddressCountDocument, options);
      }
export function useMessagesByAddressCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessagesByAddressCountQuery, MessagesByAddressCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MessagesByAddressCountQuery, MessagesByAddressCountQueryVariables>(MessagesByAddressCountDocument, options);
        }
export function useMessagesByAddressCountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MessagesByAddressCountQuery, MessagesByAddressCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MessagesByAddressCountQuery, MessagesByAddressCountQueryVariables>(MessagesByAddressCountDocument, options);
        }
export type MessagesByAddressCountQueryHookResult = ReturnType<typeof useMessagesByAddressCountQuery>;
export type MessagesByAddressCountLazyQueryHookResult = ReturnType<typeof useMessagesByAddressCountLazyQuery>;
export type MessagesByAddressCountSuspenseQueryHookResult = ReturnType<typeof useMessagesByAddressCountSuspenseQuery>;
export type MessagesByAddressCountQueryResult = Apollo.QueryResult<MessagesByAddressCountQuery, MessagesByAddressCountQueryVariables>;
export const MessagesByAddressSenseDocument = gql`
    query MessagesByAddressSense($address: _text, $limit: bigint, $offset: bigint, $timestamp_from: timestamp, $types: _text, $order_direction: order_by) {
  messages_by_address(
    args: {addresses: $address, limit: $limit, offset: $offset, types: $types}
    order_by: {transaction: {block: {timestamp: $order_direction}}}
    where: {transaction: {block: {timestamp: {_gt: $timestamp_from}}}}
  ) {
    transaction_hash
    index
    value
    transaction {
      success
      block {
        timestamp
        height
      }
      memo
    }
    type
  }
}
    `;

/**
 * __useMessagesByAddressSenseQuery__
 *
 * To run a query within a React component, call `useMessagesByAddressSenseQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesByAddressSenseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesByAddressSenseQuery({
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      timestamp_from: // value for 'timestamp_from'
 *      types: // value for 'types'
 *      order_direction: // value for 'order_direction'
 *   },
 * });
 */
export function useMessagesByAddressSenseQuery(baseOptions?: Apollo.QueryHookOptions<MessagesByAddressSenseQuery, MessagesByAddressSenseQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MessagesByAddressSenseQuery, MessagesByAddressSenseQueryVariables>(MessagesByAddressSenseDocument, options);
      }
export function useMessagesByAddressSenseLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessagesByAddressSenseQuery, MessagesByAddressSenseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MessagesByAddressSenseQuery, MessagesByAddressSenseQueryVariables>(MessagesByAddressSenseDocument, options);
        }
export function useMessagesByAddressSenseSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MessagesByAddressSenseQuery, MessagesByAddressSenseQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MessagesByAddressSenseQuery, MessagesByAddressSenseQueryVariables>(MessagesByAddressSenseDocument, options);
        }
export type MessagesByAddressSenseQueryHookResult = ReturnType<typeof useMessagesByAddressSenseQuery>;
export type MessagesByAddressSenseLazyQueryHookResult = ReturnType<typeof useMessagesByAddressSenseLazyQuery>;
export type MessagesByAddressSenseSuspenseQueryHookResult = ReturnType<typeof useMessagesByAddressSenseSuspenseQuery>;
export type MessagesByAddressSenseQueryResult = Apollo.QueryResult<MessagesByAddressSenseQuery, MessagesByAddressSenseQueryVariables>;
export const MessagesByAddressSenseWsDocument = gql`
    subscription MessagesByAddressSenseWs($address: _text, $limit: bigint, $offset: bigint, $timestamp_from: timestamp, $types: _text, $order_direction: order_by) {
  messages_by_address(
    args: {addresses: $address, limit: $limit, offset: $offset, types: $types}
    order_by: {transaction: {block: {timestamp: $order_direction}}}
    where: {transaction: {block: {timestamp: {_gt: $timestamp_from}}}}
  ) {
    transaction_hash
    index
    value
    transaction {
      success
      block {
        timestamp
        height
      }
      memo
    }
    type
  }
}
    `;

/**
 * __useMessagesByAddressSenseWsSubscription__
 *
 * To run a query within a React component, call `useMessagesByAddressSenseWsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMessagesByAddressSenseWsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesByAddressSenseWsSubscription({
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      timestamp_from: // value for 'timestamp_from'
 *      types: // value for 'types'
 *      order_direction: // value for 'order_direction'
 *   },
 * });
 */
export function useMessagesByAddressSenseWsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<MessagesByAddressSenseWsSubscription, MessagesByAddressSenseWsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MessagesByAddressSenseWsSubscription, MessagesByAddressSenseWsSubscriptionVariables>(MessagesByAddressSenseWsDocument, options);
      }
export type MessagesByAddressSenseWsSubscriptionHookResult = ReturnType<typeof useMessagesByAddressSenseWsSubscription>;
export type MessagesByAddressSenseWsSubscriptionResult = Apollo.SubscriptionResult<MessagesByAddressSenseWsSubscription>;
export const TransactionCountDocument = gql`
    query transactionCount {
  transaction_aggregate {
    aggregate {
      count(columns: hash)
    }
  }
}
    `;

/**
 * __useTransactionCountQuery__
 *
 * To run a query within a React component, call `useTransactionCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useTransactionCountQuery(baseOptions?: Apollo.QueryHookOptions<TransactionCountQuery, TransactionCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransactionCountQuery, TransactionCountQueryVariables>(TransactionCountDocument, options);
      }
export function useTransactionCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionCountQuery, TransactionCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransactionCountQuery, TransactionCountQueryVariables>(TransactionCountDocument, options);
        }
export function useTransactionCountSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TransactionCountQuery, TransactionCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TransactionCountQuery, TransactionCountQueryVariables>(TransactionCountDocument, options);
        }
export type TransactionCountQueryHookResult = ReturnType<typeof useTransactionCountQuery>;
export type TransactionCountLazyQueryHookResult = ReturnType<typeof useTransactionCountLazyQuery>;
export type TransactionCountSuspenseQueryHookResult = ReturnType<typeof useTransactionCountSuspenseQuery>;
export type TransactionCountQueryResult = Apollo.QueryResult<TransactionCountQuery, TransactionCountQueryVariables>;
export const UptimeByAddressDocument = gql`
    query uptimeByAddress($address: String) {
  uptime(where: {consensus_address: {_eq: $address}}) {
    uptime
  }
}
    `;

/**
 * __useUptimeByAddressQuery__
 *
 * To run a query within a React component, call `useUptimeByAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useUptimeByAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUptimeByAddressQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useUptimeByAddressQuery(baseOptions?: Apollo.QueryHookOptions<UptimeByAddressQuery, UptimeByAddressQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UptimeByAddressQuery, UptimeByAddressQueryVariables>(UptimeByAddressDocument, options);
      }
export function useUptimeByAddressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UptimeByAddressQuery, UptimeByAddressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UptimeByAddressQuery, UptimeByAddressQueryVariables>(UptimeByAddressDocument, options);
        }
export function useUptimeByAddressSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UptimeByAddressQuery, UptimeByAddressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UptimeByAddressQuery, UptimeByAddressQueryVariables>(UptimeByAddressDocument, options);
        }
export type UptimeByAddressQueryHookResult = ReturnType<typeof useUptimeByAddressQuery>;
export type UptimeByAddressLazyQueryHookResult = ReturnType<typeof useUptimeByAddressLazyQuery>;
export type UptimeByAddressSuspenseQueryHookResult = ReturnType<typeof useUptimeByAddressSuspenseQuery>;
export type UptimeByAddressQueryResult = Apollo.QueryResult<UptimeByAddressQuery, UptimeByAddressQueryVariables>;
export const WasmDashboardPageDocument = gql`
    query wasmDashboardPage($offset: Int, $limit: Int) {
  contracts(limit: $limit, offset: $offset, order_by: {tx: desc}) {
    address
    admin
    code_id
    creator
    fees
    gas
    label
    tx
  }
  contracts_aggregate {
    aggregate {
      sum {
        gas
        fees
        tx
      }
      count(columns: address)
    }
  }
}
    `;

/**
 * __useWasmDashboardPageQuery__
 *
 * To run a query within a React component, call `useWasmDashboardPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useWasmDashboardPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWasmDashboardPageQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useWasmDashboardPageQuery(baseOptions?: Apollo.QueryHookOptions<WasmDashboardPageQuery, WasmDashboardPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WasmDashboardPageQuery, WasmDashboardPageQueryVariables>(WasmDashboardPageDocument, options);
      }
export function useWasmDashboardPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WasmDashboardPageQuery, WasmDashboardPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WasmDashboardPageQuery, WasmDashboardPageQueryVariables>(WasmDashboardPageDocument, options);
        }
export function useWasmDashboardPageSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<WasmDashboardPageQuery, WasmDashboardPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WasmDashboardPageQuery, WasmDashboardPageQueryVariables>(WasmDashboardPageDocument, options);
        }
export type WasmDashboardPageQueryHookResult = ReturnType<typeof useWasmDashboardPageQuery>;
export type WasmDashboardPageLazyQueryHookResult = ReturnType<typeof useWasmDashboardPageLazyQuery>;
export type WasmDashboardPageSuspenseQueryHookResult = ReturnType<typeof useWasmDashboardPageSuspenseQuery>;
export type WasmDashboardPageQueryResult = Apollo.QueryResult<WasmDashboardPageQuery, WasmDashboardPageQueryVariables>;
export const MessagesByAddressDocument = gql`
    query MessagesByAddress($address: _text, $limit: bigint, $offset: bigint, $types: _text) {
  messages_by_address(
    args: {addresses: $address, limit: $limit, offset: $offset, types: $types}
    order_by: {transaction: {block: {height: desc}}}
  ) {
    transaction_hash
    value
    transaction {
      success
      height
      logs
      memo
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
 *      types: // value for 'types'
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