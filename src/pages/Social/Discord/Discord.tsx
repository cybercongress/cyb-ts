import { LinkWindow } from 'src/components/link/link';
import discordIcon from './discord-icon.svg';

function Discord() {
  return (
    <LinkWindow to="https://discord.com/invite/ARwv74ZyGH">
      <img src={discordIcon} alt="Discord" />
      <span>Discord</span>
    </LinkWindow>
  );
}

export default Discord;
