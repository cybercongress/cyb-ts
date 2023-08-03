import React, { useState } from 'react';
import { Document, Page, PageProps, pdfjs } from 'react-pdf';
import styles from './PDF.module.scss';

import 'react-pdf/dist/esm/Page/TextLayer.css';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function PDFRenderer({ url }) {
  const [pdf, setPdf] = useState();

  console.error(url);
  return (
    <Document
      file={url}
      canvasBackground="yellow"
      // canvasBackground="red"
      onLoadSuccess={(pfd) => {
        setPdf(pfd);
      }}
      options={{}}
    >
      <div className={styles.wrapper}>
        {Array.from(new Array(pdf?.numPages), (_, index) => (
          <Page
            // canvasBackground="red"
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderAnnotationLayer={false}
          />
        ))}
      </div>
    </Document>
  );
}

export default PDFRenderer;
