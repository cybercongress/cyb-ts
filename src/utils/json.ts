export const downloadJson = (jsonData: any, fileName: string): void => {
  const jsonStr: string = JSON.stringify(jsonData, null, 2);
  const blob: Blob = new Blob([jsonStr], { type: 'application/json' });
  const url: string = URL.createObjectURL(blob);

  const a: HTMLAnchorElement = document.createElement('a');
  a.href = url;
  a.download = fileName || 'download.json';
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
