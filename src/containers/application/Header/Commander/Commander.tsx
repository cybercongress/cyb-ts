import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { encodeSlash, replaceSlash } from '../../../../utils/utils';
import { Input } from '../../../../components';

function Commander() {
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  console.log(searchParams);

  const query = '';

  function submit(event) {
    event.preventDefault();

    const value = event.target.search.value;
    if (!value) {
      return;
    }

    navigate(`/search/${replaceSlash(value)}`);
  }

  return (
    <form
      style={{
        width: '52%',
        transform: 'translate(-50%, -80%)',
        // background: 'rgb(0 0 0 / 79%)',
        marginRight: '-50%',
        left: '50%',
        position: 'absolute',
        top: '50%',
        padding: '0px 20px',
        zIndex: '1',
      }}
      onSubmit={submit}
    >
      <Input
        color="pink"
        name="search"
        style={{ textAlign: 'center', fontSize: 24 }}
        // className="search-input"
        autoComplete="off"
      />
    </form>
  );
}

export default Commander;
