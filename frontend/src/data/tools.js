import { ROUTES } from '../constants/routes'

export const documentTools = [
  {
    id: 'merge',
    title: 'Merge PDF',
    description: 'Combine multiple PDFs into one file in your chosen order.',
    icon: 'merge',
    path: ROUTES.MERGE_PDF,
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'split',
    title: 'Split PDF',
    description: 'Separate pages or ranges into individual PDF files.',
    icon: 'split',
    path: ROUTES.SPLIT_PDF,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF',
    description: 'Turn JPG, PNG, and other images into a single PDF.',
    icon: 'imageToPdf',
    path: ROUTES.IMAGE_TO_PDF,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Convert DOC and DOCX documents to PDF format.',
    icon: 'wordToPdf',
    path: ROUTES.WORD_TO_PDF,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'compress-image',
    title: 'Compress Image',
    description: 'Reduce JPG, PNG and WEBP file sizes while maintaining quality.',
    icon: 'image',
    path: ROUTES.IMAGE_COMPRESSOR,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'resize-image',
    title: 'Resize Image',
    description: 'Resize image dimensions instantly.',
    icon: 'image',
    path: ROUTES.RESIZE_IMAGE,
    color: 'from-emerald-500 to-green-500',
  },
  {
    id: 'jpg-to-png',
    title: 'JPG to PNG',
    description: 'Convert JPG images to PNG format.',
    icon: 'image',
    path: ROUTES.JPG_TO_PNG,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'png-to-jpg',
    title: 'PNG to JPG',
    description: 'Convert PNG images to JPG format.',
    icon: 'image',
    path: ROUTES.PNG_TO_JPG,
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'pdf-metadata',
    title: 'PDF Metadata',
    description: 'View PDF document properties and information.',
    icon: 'document',
    path: ROUTES.PDF_METADATA,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'reorder-pdf',
    title: 'Reorder PDF Pages',
    description: 'Rearrange pages inside a PDF document.',
    icon: 'document',
    path: ROUTES.REORDER_PDF,
    color: 'from-cyan-500 to-blue-500',
  },
]

export function getToolById(id) {
  return documentTools.find((tool) => tool.id === id)
}

export function getToolByPath(path) {
  return documentTools.find((tool) => tool.path === path)
}
