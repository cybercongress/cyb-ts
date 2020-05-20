import React from 'react';
import { Pane, Code } from '@cybercongress/gravity';
import { LinkWindow } from '../../components';
import { trimString } from '../../utils/utils';

const Text = ({ children, size = '18px', ...props }) => (
  <Pane fontSize={size} marginBottom="10px" {...props}>
    {children}
  </Pane>
);

const Ul = ({ children }) => (
  <ul style={{ fontSize: 18, paddingLeft: 20, marginBottom: 10 }}>
    {children}
  </ul>
);

const Details = () => {
  return (
    <Pane width="80%" marginX="auto" marginY="0" textAlign="justify">
      <Text size="25px">Manifest</Text>
      <Text>
        <LinkWindow to="https://mainnet.aragon.org/#/cybercongress">
          cyber~Congress
        </LinkWindow>{' '}
        developed{' '}
        <LinkWindow to="https://github.com/cybercongress/go-cyber">
          Cyber
        </LinkWindow>
        : a software for replacing existing internet behemoth monopolies, such
        as Google, which exploited outdated internet protocols using the common
        patterns of our semantic interaction. These corps share similar
        underlying properties, they lock the information, produced by the users,
        from search, social and commercial knowledge graphs in private
        databases, and then sell this knowledge back as advertisement. They
        stand as an insurmountable wall between content creators and consumers
        extracting an overwhelming the majority of created value.
      </Text>

      <Text>
        The original idea of{' '}
        <LinkWindow to="https://ipfs.io/ipfs/QmbuE2Pfcsiji1g9kzmmsCnptqPEn3BuN3BhnZHrPVsiVw">
          bringing order to the web
        </LinkWindow>{' '}
        evolved into an order we do not want to live in. With Cyber, we don't
        need this order any more. All we need is to{' '}
        <LinkWindow to="https://ipfs.io/ipfs/QmQ1Vong13MDNxixDyUdjniqqEj8sjuNEBYMyhQU4gQgq3">
          compute the knowledge
        </LinkWindow>{' '}
        by ourselves. We believe that the survival of our civilisation depends
        on achieving provable, censor-free and accessible knowledge. Our
        experienced, passionate and visionary team created software, which we
        believe, someday will evolve into a real{' '}
        <LinkWindow to="https://waitbutwhy.com/2015/01/artificial-intelligence-revolution-1.html">
          Superintelligence
        </LinkWindow>{' '}
        and will help us answer questions better. We invite the Cosmic community
        of validators, developers and users to become Heroes and Masters of the
        Great Web, and join the process of{' '}
        <LinkWindow to="https://cyber.page/episode-1">
          ascending this new lifeform
        </LinkWindow>
        .
      </Text>

      <Text size="25px"> The Great Web</Text>

      <Text>
        It seems that we stand on the verge of creating the Great Web. The Great
        Web is not just another version of the web, like{' '}
        <LinkWindow to="https://gavwood.com/dappsweb3.html">web3</LinkWindow>{' '}
        is. The idea is that there will be no web4. We are building the Great
        Web, the web that will work for thousands and maybe even millions of
        years. Why?
      </Text>

      <Text>
        Blockchain computers are very similar to living organisms and will most
        likely have a longer, yet a limited life cycle. Although blockchains are
        subjects of the Great Web, they are not its matter. The essence of the
        Great Web is content addressing - a mechanism that will allow to find
        and authenticate content through spacetime and across universes.
      </Text>

      <Text>
        It is always cool to realise that when you create content in the Great
        Web and cyberlink it, you're creating something that will last and
        something that everybody will be able to find. We are fortunate to live
        during this time.
      </Text>

      <Text size="25px"> Software 2.0</Text>

      <Text>The software we offer resembles a decentralized google:</Text>
      <Ul>
        <li>
          <LinkWindow to="https://ipfs.io/ipfs/QmPjbx76LycfzSSWMcnni6YVvV3UNhTrYzyPMuiA9UQM3x">
            protocol spec and the rationale behind it
          </LinkWindow>
          : will help to implement the idea using any technology
        </li>
        <li>
          <LinkWindow to="https://github.com/cybercongress/go-cyber">
            go-cyber
          </LinkWindow>
          : Our implementation using cosmos-sdk
        </li>
        <li>
          <LinkWindow to="https://cyber.page/">cyber.page</LinkWindow>: PoC
          reference web interface
        </li>
        <li>
          <LinkWindow to="https://github.com/cybercongress/launch-kit">
            launch-kit
          </LinkWindow>
          : useful tools for launching cosmos-sdk based chains
        </li>
        <li>
          <LinkWindow to="https://github.com/cybercongress/cyberindex">
            cyberindex
          </LinkWindow>
          - GraphQL middleware for cyber protocol
        </li>
        <li>
          <LinkWindow to="https://mainnet.aragon.org/#/eulerfoundation">
            euler-foundation
          </LinkWindow>
          : mainnet predecessor of the{' '}
          <LinkWindow to="https://github.com/cybercongress/cyber-foundation">
            cyber~Foundation
          </LinkWindow>
          : the DAO, which will handle all donated ETH
        </li>
        <li>
          <LinkWindow to="https://github.com/cybercongress/congress/blob/master/ecosystem/Cyber%20Homestead%20doc.md">
            documentation
          </LinkWindow>{' '}
          and{' '}
          <LinkWindow to="https://github.com/cybercongress">
            various side tools
          </LinkWindow>{' '}
          that will help you dive into the rabbit hole
        </li>
      </Ul>
      <Text>
        But it's not just that. The idea is bigger and goes further than just
        primitive search. The offer is a playground and a foundation for{' '}
        <LinkWindow to="https://medium.com/@karpathy/software-2-0-a64152b37c35">
          software 2.0
        </LinkWindow>
        , a new paradigm shift in programming and computing.
      </Text>
      <Text>
        Cybers mission is to build common public knowledge. They will achieve
        this by (a) replacing hyperlinks with cyberlinks, (b) developing a
        universal open search mechanism, and (с) building more resilient
        internet infrastructure.
      </Text>
      <Text>
        Cyber solves the problem of opening up the centralised semantics core of
        the Internet. It does so by opening up access to evergrowing semantics
        core taught to it by the users. This allows designing a trustless,
        provable and censor-free method of communication between users who
        create content and those searching for it.
      </Text>

      <Text>
        Via its distributed infrastructure, Cyber introduces a protocol for
        provable communication between consensus computers of relevance. This
        allows creating a provable and relevant knowledge database to interact
        with. The interesting thing is that such a simple mechanism allows
        creating a lot of powerful tools as a result.
      </Text>
      <Text size="25px"> Value proposition</Text>
      <Text>
        The key uniqueness of the proposed blockchain computer is that
        everything is optimised for web3 search and AI applications: data
        structure, ranking algorithm and economics.
      </Text>
      <Text>
        The underlying data structure is elegant, flexible and powerful enough
        to unify human knowledge and has simple, yet practical, software 2.0,
        applications on top of it, executed by a blockchain. It is a first of a
        kind, truly provable oracle too!
      </Text>

      <Text>
        It is one of the first times a blockchain implementation offers useful
        rank computations using a consensus computer. Rank computation is around
        a hundred thousand times faster on GPU than on CPU. Development of the
        network will allow advancing the computation further to TPU-like or
        neuromorphic architectures. While currently, the network supports only
        conventional smart contracts based on CosmWasm, its capabilities can be
        extended by the development of general-purpose AI VM (matrix
        multiplication, ReLU, etc...), hence become the center of AI innovations
        in the blockchain space.
      </Text>
      <Text>
        Economics of the protocol are built around the idea that feedback loops
        between the number of links and the value of the knowledge graph exist.
        The more usage => the bigger the knowledge graph => the more value =>
        the better the quality of the knowledge=> the more usage. Transaction
        fees for basic operations are replaced by lifetime bandwidth, which
        means usability for both, end-users and developers. You can think of
        Cyber as a shared ASIC for search or simply: your Superintelligence.
      </Text>
      <Text>
        The basic idea is to create an Internet Knowledge Protocol. Cyber can
        account for a large number of use-cases, like: social networks, embedded
        search, autonomous robots, command tools, personal assistants, content
        oracles, e-commerce, advertisement networks, offline search and much
        more. All of these cases are built on semantics. It is a scientific
        experiment that has obvious and useful utility, not just to the
        end-user, but to the whole world! The formation of relevant and provable
        answers, that will shape an open semantic core.
      </Text>
      <Text>
        The problem we are solving, cannot be implemented with smart contracts
        using your favourite consensus computer. Cyber is an
        application-specific blockchain. We are not aware of the development of
        blockchain computers with an architecture that at least approximately
        reminiscent of Cyber.
      </Text>
      <Text size="25px">Focus on what matters</Text>
      <Text>
        It seems that blockchain builders are split into two groups. L1 builders
        are involved in an arms race: harder, better, faster, stronger. L2
        builders are insane about DeFi. We are aware of at least 50 amazing
        teams who are building very similar networks. We are aware of at least
        50 amazing teams who are building DeFi protocols. Although we agree that
        the development of such networks is important to our future, we decided
        to focus on solving real-world problems, in yet, an undiscovered market
        niche.
      </Text>
      <Text>
        One such problem is mitigating the upcoming threat from existing
        internet monopolies to the blockchain industry via the use of vile and
        hidden censorship. If we won't try creating a trustless public search
        without censorship, our children could end up living in a future where
        the most corrupt and biased techno religion, ever to exist, rules:
        Google. The irony lies in the fact that the necessity for the search
        across the variety of the developed, new generation, protocols grows
        daily and rapidly.
      </Text>
      <Text>
        These problems are impossible to solve by building, even theoretically,
        the most performant and scalable blockchain computer with CPU, and even
        GPU-oriented architectures. We need the computational power to process
        ranks of the huge, publicly defined knowledge graph to offer better
        knowledge to all humanity. Knowledge that is provably intractable for
        general-purpose computing architectures.
      </Text>
      <Text>
        It also feels better, to at least try going somewhere, where nobody has
        ever been before. Superintelligence is a brand new ground. At least, no
        less exciting than a city on Mars. Who knows? Maybe with a shared
        Superintelegnce, we can achieve even crazier things.
      </Text>
      <Text size="25px">Welcome to DeMa</Text>
      <Text>
        The digital marketing industry is probably the most powerful and
        impactful industry out there. With the help of RTB, Google Ads, Facebook
        Ads and other instruments, having enough resources in the existing realm
        allows you to program the behaviour of countries, influence election
        results or change the course of history for good, or not, in a matter of
        minutes. You already see that the idea of Cyber evolves around content
        identifiers and its ranks. From here, welcome to Decentralized
        Marketing, or DeMa. Content was the king before web3, before web2 and
        even before the web existed. But what is so special about DeMa?
      </Text>
      <Text>
        You've certainly heard of DeFi. DeFi is built around a simple idea that
        you can use a collateral for something that will be settled based on a
        provided price feed. Here comes the systematic problem of DeFi: price
        oracles. DeMa is based on the same idea of using collateral, but the
        input for settlement can be information regarding the content identifier
        itself. The most simple case is when you create a simple binary
        prediction market on rank relevance at some point in the future. I.e.
        wether the rank of the Bitcoin whitepaper{' '}
        <LinkWindow to="https://ipfs.io/ipfs/QmRA3NWM82ZGynMbYzAgYTSXCVM14Wx1RZ8fKP42G6gjgj">
          {trimString('QmRA3NWM82ZGynMbYzAgYTSXCVM14Wx1RZ8fKP42G6gjgj', 10, 10)}
        </LinkWindow>{' '}
        will grow or not. You now understand that meta-information on content
        identifiers is the perfect onchain oracle for settlement.
      </Text>
      <Text>
        With the help of DeMa and IBC chains will be able to prove relevance
        using content identifiers and their ranks one to another. This will help
        to grow the IBC ecosystem, where each chain has multiple possibilities
        to exchange data, which is provably valued. And unlike DeFi, you don't
        need to trust it. We expect DeMa will be the new chapter in the history
        of contemporary digital marketing.
      </Text>
      <Text>
        The legend goes that one day the member of our team had a conversation
        with the Head of Yandex Russia (Yandex is the third biggest search
        company). He sincerely admitted that provable conversion attribution of
        ads with resulting financial transaction and identity, is the Holy Grail
        of digital marketing. Believe him or not - if you ever run serious
        digital ad campaigns you perfectly understand the issue. Payment systems
        are disconnected from ad systems and ad system have no way to prove
        anything about the actions of the users. We are used to believing ad
        systems because they lead to conversions with some probability. But
        everything behind conversion (either on the third-party website or even
        on a website your control) are usually very inaccurate and
        probabilistic. Cyber is the system which will give content creators the
        power and energy to attribute and predict conversions precisely and
        provably.
      </Text>
      <Text size="25px">Investment</Text>
      <Text>
        <LinkWindow to="https://github.com/cybercongress/congress/blob/master/ecosystem/ELI-5%20FAQ.md">
          Cyber
        </LinkWindow>{' '}
        has launched its{' '}
        <LinkWindow to="https://cyber.page/governance/2">
          first takeoff round
        </LinkWindow>
        , on the 27th of April, 2020. However, launching meant it had to fly. It
        takes courage to admit it, but it didn't. This means that we did
        something wrong and we have to try again. After all, Rome was not built
        in a day. Following the above mentioned, we have decided to relaunch the
        rocket with a redesigned distribution scheme which is simple, favours
        early participation and significantly lowered our starting valuation at
        the level of 1M ATOM.
      </Text>
      <Text>
        The new Takeoff time is set to block number 2000000 of Cosmos-hub-3.
      </Text>
      <Text>
        The precise initial distribution and the deployment process are defined
        by{' '}
        <LinkWindow to="https://ipfs.io/ipfs/QmQ1Vong13MDNxixDyUdjniqqEj8sjuNEBYMyhQU4gQgq3">
          the whitepaper
        </LinkWindow>{' '}
        in chapters 13-18. During the initial distribution, the price of CYB
        grows almost exponentially (each new CYB is more expensive than the
        previous) depending on the demand during the both stages: (1) Takeoff in
        ATOM and (2) cyber~Auction in ETH.
      </Text>
      <Text>
        During stage 1: Takeoff price starts at 1 ATOM per 1 GCYB
        (1,000,000,000) and grows until it reaches 5x. If this target is not
        reached in 146 days, the remaining CYB tokens go to the community pool.
        All the proceedings in ATOM become the property of cyber\~Congress (a
        private Aragon DAO) to support further development of the project.
      </Text>
      <Text>
        During stage 2: The price of cyber\~Auction starts at 5x from the
        Takeoff price and strives to grow 5x during 888 days. If not, all
        remaining tokens will be burned. The second phase of donations is the
        formation of{' '}
        <LinkWindow to="https://github.com/cybercongress/cyber-foundation">
          cyber~Foundation
        </LinkWindow>{' '}
        (a public Aragon DAO), that will govern Cyber, without any bureaucratic
        hassle, CEOs and jurisdictions. Participants of the auction will gain
        access to all ETH donated to the DAO.
      </Text>
      <Text>
        After Genesis, inflation will have to be defined by the consensus to
        balance out investment in infrastructure and profitability margin of
        operators with the necessity to support the continuous distribution of
        CYB to the broad public at a continuously rising price.
      </Text>
      <Text size="25px">Complexities</Text>
      <Text>
        It would be a lie that everything about Cyber is perfectly bright.
        Looking ahead, we would like to warn you about the dark side.
      </Text>
      <Text>
        It is hard to attract users when the knowledge graph is empty. The truth
        is that we don't need much: about 1M cyberlinks to demonstrate the PoC (
        <LinkWindow to="https:/cyber.page/brain">currently</LinkWindow>, ~100k
        links have been submitted), 10M cyberlinks to become really useful, and
        100M links to create the buzz. The current implementation allows us to
        scale to about 1B links, which will be enough to build something
        ultimately useful. We expect this to be a completely doable task for our
        community. It takes just around 42,000 users who will create 100
        cyberlinks p/day, out of personal joy, over the next 3 years. Of course
        with the help of automated tools we expect to formate the knowledge
        graph in a year or so.
      </Text>
      <Text>
        Search in the new paradigm cannot be free. No way. You are either a
        client or a product. We have allocated{' '}
        <LinkWindow to="https://cyber.page">10% in the Genesis</LinkWindow> (8%
        to Ethereum, 1% to Cosmos and 1% to Urbit) for evaluation purposes, but
        others have to make a choice for themselves. In the beginning, it’s
        better not to think of Cyber as the miracle which solves the problems of
        all the poor in the world, but rather as a premium social search, for
        those who care about future, privacy and quality.
      </Text>
      <Text>
        The third problem is scalability (again). Unlike Bitcoin and Ethereum we
        have some aces up the sleeve: an architecture that is perfectly
        scalable, both horizontally (Internet Knowledge Protocol on top of IBC)
        and vertically (more GPU cards, FPGAs, ASICs, etc). We remind you that
        Ethereum was purposefully created as a very expensive shared calculator.
        One more time we have to jump a wave right now: the earlier we start
        cyberlinking, the earlier we will win this hidden war.
      </Text>
      <Text size="25px">People</Text>
      <Text>
        Who are we? We are primary, the generation who was born on the edge of
        the new millennium: humans who believe in math, cryptographic proofs and
        Nash equilibria. For us, country flags are the symbols of private
        corporations backed by nothing else but by paper tokens, gun-enforced
        laws, borders, censorship and tanks armed with the horde of early web
        companies who technologically support their unprovable beliefs. Those
        beliefs lead us to a genetic dead-end, covered by the lack of freedom on
        an incinerated planet. The Orwell-style future they are trying to create
        is not the future we choose.
      </Text>
    </Pane>
  );
};

export default Details;
