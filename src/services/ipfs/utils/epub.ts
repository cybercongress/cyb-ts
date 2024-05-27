/* eslint-disable no-bitwise */
/* eslint-disable import/prefer-default-export */
export function checkIfEPUB(uint8Array: Uint8Array) {
  // Check ZIP signature
  if (
    uint8Array[0] !== 0x50 ||
    uint8Array[1] !== 0x4b ||
    uint8Array[2] !== 0x03 ||
    uint8Array[3] !== 0x04
  ) {
    console.log('Not a zip file');

    return false;
  }

  // Helper function to find local file headers
  function findLocalFileHeader(start: number) {
    const headerSignature = [0x50, 0x4b, 0x03, 0x04];
    for (let i = start; i < uint8Array.length - headerSignature.length; i++) {
      if (
        uint8Array[i] === headerSignature[0] &&
        uint8Array[i + 1] === headerSignature[1] &&
        uint8Array[i + 2] === headerSignature[2] &&
        uint8Array[i + 3] === headerSignature[3]
      ) {
        return i;
      }
    }
    return -1;
  }

  // Read ZIP file entries
  let index = 0;
  while (index !== -1) {
    index = findLocalFileHeader(index);
    if (index === -1) {
      break;
    }

    const fileNameLength =
      uint8Array[index + 26] + (uint8Array[index + 27] << 8);
    const extraFieldLength =
      uint8Array[index + 28] + (uint8Array[index + 29] << 8);
    const fileNameStart = index + 30;
    const fileNameEnd = fileNameStart + fileNameLength;
    // const fileName = new TextDecoder().decode(
    //   uint8Array.slice(fileNameStart, fileNameEnd)
    // );
    const fileName = Buffer.from(
      uint8Array.slice(fileNameStart, fileNameEnd)
    ).toString('utf8');

    if (fileName === 'mimetype') {
      const mimetypeStart = fileNameEnd + extraFieldLength;
      const mimetypeEnd = mimetypeStart + 20; // "application/epub+zip".length = 20
      // const mimetype = new TextDecoder().decode(
      //   uint8Array.slice(mimetypeStart, mimetypeEnd)
      // );
      const mimetype = Buffer.from(
        uint8Array.slice(mimetypeStart, mimetypeEnd)
      ).toString('utf8');
      if (mimetype.trim() !== 'application/epub+zip') {
        console.log('is not epub');

        return false;
      }
    }

    if (fileName === 'META-INF/container.xml') {
      const containerStart = fileNameEnd + extraFieldLength;
      const containerLength =
        uint8Array[index + 18] + (uint8Array[index + 19] << 8);
      // const containerXML = new TextDecoder().decode(
      //   uint8Array.slice(containerStart, containerStart + containerLength)
      // );
      const containerXML = Buffer.from(
        uint8Array.slice(containerStart, containerStart + containerLength)
      ).toString('utf8');
      const parser = new DOMParser();
      const containerDoc = parser.parseFromString(
        containerXML,
        'application/xml'
      );
      if (containerDoc.querySelector('parsererror')) {
        console.log('has no meta-inf');

        return false;
      }
    }

    index = fileNameEnd + extraFieldLength;
  }

  return true;
}
