import * as React from 'react'

import { Document, Page, pdfjs } from 'react-pdf'

// ensure pdfjs can find its worker script regardless of how react-notion-x is bundled
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

export const Pdf: React.FC<{ file: string }> = ({ file, ...rest }) => {

  const documentRef = React.useRef(null)

  const [numPages, setNumPages] = React.useState(null)

  const [pageWidth, setPageWidth] = React.useState(null)

  function onDocumentLoadSuccess({ numPages }) {
    updatePageWidth()
    setNumPages(numPages)
  }

  function updatePageWidth() {
    setPageWidth(documentRef.current?.offsetWidth)
  }

  React.useEffect(() => {
    window.addEventListener('resize', updatePageWidth)
    return () => {
      window.removeEventListener('resize', updatePageWidth)
    }
  })

  return (
    <div style={{ width: '100%' }} ref={documentRef}>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess} {...rest}>
        {Array.from(new Array(numPages), (_, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} width={pageWidth} />
        ))}
      </Document>
    </div>
  )
}
