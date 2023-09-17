import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
function FileInputButton({
  caption,
  processFile,
}: {
  caption: string;
  processFile: (file: any) => void;
}) {
  const fileInputRef = React.createRef();

  const handleFileChange = (e) => {
    console.log('---HANDLE handleFileChange', e);

    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }

    e.target.value = null; // Resetting the input value
  };

  const handleClick = () => fileInputRef.current.click();

  return (
    <div>
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button
        icon="import"
        text={caption}
        intent={Intent.NONE}
        onClick={handleClick}
      />
    </div>
  );
}

export default FileInputButton;
