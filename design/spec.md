# One app to rule them all



> I have 37 year experience of using governments, 25 years of using computers and 9 years using crypto. I can state that my experience sucks. So I sincerely want to fix this.

## Idea
I started analyse how I use my programs and why. Finally I decided to narrow the scope of search to the following question: Which programs I cant live without? To my surprise the list is quite short: *google search, gmail, drive, youtube, twitter, github, telegram*. Together these seven web apps form my environment. But my experience sucks. All these apps share one particular pattern. They share 3 essential functions which are messages, feeds and contacts. The only app which do not follow this pattern is google search. That explain me a lot: I ask questions and have results which primary unaware of the most important staff for me. Data is fragmented and much of data is locked. I use 6 different icons for essentially the same stuff.

Another thing I realised after nearly 10 years of using crypto is that trading become kinda basic and essential for my survival. So I decided to combine functions of *bisq (otc)* and *1inch (on-chain)* exchanges in one convenient screen with one significant limitation that the medium of exchange will be CYB, because otherwise it will be technically infeasible this to implement. Also brining the OTC market early enough will help the project to grow CYB as the only medium of exchange to be honest is enough for our task.

- state services
- local bank

So I asked a question is that possible to have one consistent experience which will replace all these programs at once? It turns out that the app that will solve all the tasks at once does not have to be complicated. So I decide to start the design of such app from defining philosophic consideration, conceptual semantics and functional bounds. I hope this doc will help not only with initial implementation, but with advancing the idea further.

## Goals

1. Settle the idea that saving the world from greedy corps and corrupt government is real
2. Fix broken meatspace with the help of incentives and gamification
3. Educate on complicated tech using metaphors

## Story

Our character have robot - his name is Cyb. Basically Cyb helps two simple things: discover files and sign messages. But the robot is small. So he can not know a lot. So Cyb robots united and

## My Robot
Gadget which help

- Timeline
- Pocket (energy, power, keys/networks, memory)
- Equipment (state, connections, root, resources, sparks, about)

### Ledger
- CYB (liquid, staked, unstaking, unclaimed rewards)
- ATOM (liquid, staked, unstaking, unclaimed rewards)

### Metamask
- ETH

### Genesis
Genesis launch date will be defined after the final of Game of Links. You can become the part of the history
- gift
- game of links
- vesting

### Game of Links
- EUL (liquid, staked, unstaking, unclaimed rewards)
- GOL (vested, liquid)

### Bootstrap
- euler-6
- custom knowledge graph
- gbm: genesis bootstrap module
- site: url and depth
- archive: keyword
- pornhub: likes, tags
- wiki: complete
- google search: keyword
- gmail: folder
- drive: folder
- youtube: subscription, channel
- twitter: person
- github: stars, subscriptions, trending by tag
- telegram: group, channel

## My files
- My feed
- Public Pin file (Post, Upload file, Cyberlink)
- Private
- Society. Pin citizen (Send mail, Send message, Send token)

### Sparks

- video
- audio
- image
- uri
- text
- code
- doc
- tx
- block
- em
- citizen

### Optimisation

=> Follow backlinks
=> Improve rank

### Discussion

=> Post

### Answers
20. Ux замоОк - Для контента сначала показывть только ответы тех кого фоловит креатор.
=> Follow answers

### Community

=> Cyberlink

### Meta

=> Cyberlink

## Citizens

Intro, avatar, nick, contract

### Timeline

=> New issue
=> New event

### Heroes
Display heros

### Knowledge
Display knowledge graph

### Society
- subscriptions
- subscribers
- interests
- mentions

=> Subscribe

### Achievements
Comprehensive analytics on earning:

- Heroism
- Lordship
- Evangelism
- Hacking
- Mastery

### Genesis
Lifetime record of Genesis contribution

- Vesting
- Gift
- Game of Links

## Brain
Impress and inspire citizens

10 metaphors are mandatory for autonomous ecosystem:

- Port
- Hall of Fame
- Arena
- Government
- University
- Library

- Bazaar
- Tower
- Temple
- Laboratory
- Garden

### Library
Discovery the glory of your knowledge and connect the dots

### Port
Welcome to /the new / united / your | our | World

- Transit
- Tourism
- Residence
- Citizenship

|                 |   Cyber     |  Your Gov   |   
|-----------------|-------------|-------------|
| Borders         |     No      |     Yes     |
| Customs         |     No      |     Yes     |
| Army            |     No      |     Yes     |
| Police          |     No      |     Yes     |
| Laws            |    Code     |    Paper    |
| Contracts       |    Code     |    Paper    |
| Censorship      |     No      |     Yes     |
| Children        |    Yours    |    Their    |
| Taxes           |  Voluntary  |  Compulsory |
| Tax reporting   |  Automated  |    Manual   |
| Transaction tax |    ~0.1%    |     ~50%    |
| Printing tax    |    ~1%      |     100%    |
| Provable voting |    Yes      |      No     |
| Consensus       | Tendermint  |  Democracy  |
| Currency        |    Any      |  Enforced   |
| Security        |Cryptography |Police & Army|
| Decision makers |     Us      |     They    |
| Privacy         |   Respect   |      No     |
| Brainwashing    |     No      |     Yes     |
| Antropocentrism |     No      |     Yes     |

free != freedom

### Hall of Fame
Define your Heroes of the Great Web

- Hall

=> Become Hero of Great Web
=> onClick: Stake, Unstake, Restake

- Incubator
=> Become Hero of Great Web

- Jail
=> onClick: Unstake, Restake

### Arena
Facilitate distribution games

- Game of Links
- Great Vesting
- Gift of Gods

Understand value behind token, forecast indicators, push price, impact supply

### Government
Define your future

Supply GCYB * Price ETH = Cap ETH, Assets ETH
Supply GTHC * Price ETH = Cap ETH, Assets ETH

4 states of proposals

Policies:
- Investments: Staked => Inflation, inflation rate change, inflation max, inflation min,
- Operations: community tax, goal bonded
- Marketing: Load => price, message cost, tx cost

### University
Learn new skills

Understand how the one can develop self after joining the force

Citizen init:
- Get CYB
- Introduce myself
- Cyberlink
- Send confidential mail
- Vote for proposal

- Follow the story
- Follow the discussion
- Send private message


Hero path:
- get in the way
- one month with high uptime
- get basic point of the stake
- become a hero
- become superhero
- become imperator

hipster path:
- create the story
- post to story

hustler path:
- onboard first citizen

hacker path:
- deploy first contract

analytic path:
- stake CYB

### Bazaar
Simplify value exchange

Currently key purpose of bazaar is to create internal and over-the-counter liquidity for CYB. Hence all interface considerations have to be around this goal.

The philosophy behind bazaar is to be as dumb as possible and follows 3 basic principles:cd ..
- must not require arbitrage. Because it's possible thanks to 2of2 scheme with delayed return.
- must not require integrations. Trade details have to be exchanged using encrypted messages.
- must not require administration. Trade directions have to be dynamic without any third party.

The following exchange directions have to be initially supported:
- Physical cash
- Gold and silver
- Electronic payments
- Leading crypto
- Internal tokens

List of tokens is managed by simple shelling game in which proposers stake tokens for every change in the registry.

### Tower
Inspire content creators

Masters with the most rank of created files

The most payed masters What is matter is total value of CYB which came to the account with memo field of the created files by account.

=> Post

### Temple
Inspire evangelists

### Laboratory
Inspire app creation

### Garden
Facilitate use of capps
