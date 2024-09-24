import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import useAdviserTexts from 'src/features/adviser/useAdviserTexts';

const currentCommit = document.head
  .querySelector('meta[name="commit-version"]')
  ?.getAttribute('content');
const currentBranch = document.head
  .querySelector('meta[name="branch"]')
  ?.getAttribute('content');

async function getLastCommitSHA() {
  const response = await axios.get(
    `https://api.github.com/repos/cybercongress/cyb-ts/commits`,
    {
      params: {
        sha: currentBranch,
        per_page: 1,
      },
    }
  );

  return response.data[0].sha;
}

function NewVersionChecker() {
  const [lastCommit, setLastCommit] = useState<string>();

  useEffect(() => {
    getLastCommitSHA().then(setLastCommit);

    // check every 3 minutes
    const interval = setInterval(() => {
      getLastCommitSHA().then(setLastCommit);
    }, 3 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const newVersionAvailable =
    lastCommit && currentCommit && lastCommit !== currentCommit;

  const text = useMemo(() => {
    if (!newVersionAvailable) {
      return null;
    }

    return (
      <div>
        New version available!{' '}
        <a onClick={() => window.location.reload()}>reload app</a>
      </div>
    );
  }, [newVersionAvailable]);

  useAdviserTexts({
    defaultText: text,
    priority: true,
  });

  return null;
}

export default NewVersionChecker;
