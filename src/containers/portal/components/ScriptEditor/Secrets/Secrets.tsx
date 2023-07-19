import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import ActionBar from './ActionBar';
import Table from 'src/components/Table/Table';
import { ContainerGradientText } from 'src/components';
import InfoCard from '../../infoCard/infoCard';

function Secrets() {
  const { secrets } = useSelector((store: RootState) => store.scripting);
  const [selected, setSelected] = useState<string | null>();

  return (
    <>
      <InfoCard>Here need description what happening </InfoCard>
      <ContainerGradientText
        userStyleContent={{
          padding: '20px 0',
        }}
      >
        <Table
          columns={[
            {
              header: 'Key',
              accessorKey: 'key',
            },
            {
              header: 'Value',
              accessorKey: 'value',
            },
          ]}
          onSelect={(key) => {
            if (!key) {
              setSelected(null);
              return;
            }

            const item = Object.entries(secrets)[key];
            if (item) {
              setSelected(item[0]);
            }
          }}
          selected={Object.entries(secrets).findIndex(
            ([key]) => key === selected
          )}
          data={[
            ...Object.entries(secrets).map(([key, item]) => {
              return {
                key: item.key,
                value: item.value,
              };
            }),
          ]}
        />
      </ContainerGradientText>

      <ActionBar selected={selected} callback={() => setSelected(null)} />
    </>
  );
}

export default Secrets;
