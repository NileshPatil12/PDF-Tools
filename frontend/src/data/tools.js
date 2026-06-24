import { ROUTES } from '../constants/routes'

export const pdfTools = [
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
]

export function getToolById(id) {
  return pdfTools.find((tool) => tool.id === id)
}

export function getToolByPath(path) {
  return pdfTools.find((tool) => tool.path === path)
}
