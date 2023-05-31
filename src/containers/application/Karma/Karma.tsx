import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from 'src/contexts/queryClient';
import { Tooltip } from 'src/components';
import IconsNumber from 'src/components/IconsNumber/IconsNumber';
import styles from './Karma.module.scss';

const useGetKarma = (address: string) => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['karma', address],
    queryFn: async () => {
      try {
        const response = await queryClient!.karma(address);

        return response.karma;
      } catch (error) {
        console.error('error', error);
        return null;
      }
    },
    enabled: Boolean(queryClient && address),
  });

  return { data };
};

function Karma({ address }: { address: string }) {
  const { data } = useGetKarma(address);

  if (!data) {
    return null;
  }

  return (
    <div className={styles.containerKarma}>
      <Tooltip tooltip="Karma measure the brightness of cyberlinks and particles created by you">
        <IconsNumber value={data} type="karma" />
      </Tooltip>
    </div>
  );
}

export default Karma;
