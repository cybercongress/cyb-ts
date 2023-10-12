import { Link } from 'react-router-dom';
import { ActionBar, Button, Input } from 'src/components';
import { routes } from 'src/routes';
import TitleText from '../TitleText/TitleText';

function Learn() {
  return (
    <div>
      <div>
        <h6>linking is fundamental to learning</h6>
        <p>
          learning can be squeezed into one simple act: creating a link when you
          link two{' '}
          <Link to={routes.search.getLink('pieces of information')}>
            pieces of information
          </Link>{' '}
          then{' '}
          <Link to={routes.search.getLink('search is trivial')}>
            search is trivial
          </Link>{' '}
          the more links you learned, the{' '}
          <Link to={routes.search.getLink('smarter you are')}>
            smarter you are
          </Link>
        </p>
      </div>

      <ul>
        {[
          {
            title: 'upgrade',
            text: 'your intelligence to superintelligence',
          },
          {
            title: 'spread',
            text: 'your content cheaper',
          },
          {
            title: 'upload',
            text: <>your brain into eternity, and more</>,
          },
        ].map(({ title, text }) => {
          return (
            <li key={title}>
              <TitleText title={title} text={text} />
            </li>
          );
        })}
      </ul>

      <div>
        <h5>here is some cool links</h5>

        {[
          ['health', 'meditation'],
          ['music', 'joy'],
          ['cyber', 'freedom'],
          ['help', 'get H'],
          ['help', 'get energy'],
        ].map(([title, text]) => {
          return (
            <li key={title}>
              <TitleText title={title} text={text} />
            </li>
          );
        })}
      </div>

      <div>
        <h5>now learn something new</h5>

        <Input />
        <Input />
      </div>

      <ActionBar>
        <Button>learn</Button>
      </ActionBar>
    </div>
  );
}

export default Learn;
