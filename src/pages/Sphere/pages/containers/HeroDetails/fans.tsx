import { TableEv as Table } from '@cybercongress/gravity';
import { Account, TextTable, NoItems, NumberCurrency } from '../../components';
import { formatNumber } from '../../utils/utils';

function Fans({ data }) {
  // const containerReference = useRef();
  // const [itemsToShow, setItemsToShow] = useState(10);

  // const setNextDisplayedPalettes = useCallback(() => {
  //   setItemsToShow(itemsToShow + 10);
  // }, [itemsToShow, setItemsToShow]);

  // const displayedPalettes = useMemo(
  //   () => data.sort((a, b) => b.balance - a.balance).slice(0, itemsToShow),
  //   [itemsToShow]
  // );

  const delegations = data
    .sort((a, b) => b.balance - a.balance)
    .map((item) => (
      <Table.Row
        paddingX={0}
        paddingY={5}
        display="flex"
        borderBottom="none"
        minHeight="48px"
        height="fit-content"
        key={item.delegation.delegator_address}
      >
        <Table.TextCell>
          <TextTable>
            <Account address={item.delegation.delegator_address} />
          </TextTable>
        </Table.TextCell>
        <Table.TextCell flex={2} textAlign="end">
          <TextTable>
            <NumberCurrency amount={item.balance.amount} />
          </TextTable>
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          <TextTable>
            {item.share * 100 < 0.01
              ? '< 0.01'
              : formatNumber(item.share * 100, 2)}{' '}
            %
          </TextTable>
        </Table.TextCell>
      </Table.Row>
    ));
  return (
    <Table>
      <Table.Head
        style={{
          backgroundColor: '#000',
          borderBottom: '1px solid #ffffff80',
          marginTop: '10px',
          padding: 7,
          paddingBottom: '10px',
        }}
      >
        <Table.TextHeaderCell textAlign="center" flex={2}>
          <TextTable>contract</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>stake</TextTable>
        </Table.TextHeaderCell>
        <Table.TextHeaderCell textAlign="center">
          <TextTable>share</TextTable>
        </Table.TextHeaderCell>
      </Table.Head>
      <Table.Body
        style={{
          backgroundColor: '#000',
          overflowY: 'hidden',
          padding: 7,
        }}
      >
        {/* <div
          style={{
            height: '30vh',
            overflow: 'auto',
          }}
          ref={containerReference}
        >
          <InfiniteScroll
            hasMore={itemsToShow < data.length}
            loader={<Loading />}
            pageStart={0}
            useWindow={false}
            loadMore={setNextDisplayedPalettes}
            getScrollParent={() => containerReference.current}
          > */}
        {delegations.length > 0 ? delegations : <NoItems text="No fans" />}
        {/* </InfiniteScroll>
        </div> */}
      </Table.Body>
    </Table>
  );
}

export default Fans;
