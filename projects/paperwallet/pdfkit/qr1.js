// devongovett/pdfkit https://github.com/devongovett/pdfkit
PDFDocument = require('pdfkit')
fs = require('fs')

// qr-image  https://www.npmjs.com/package/qr-image
var qr = require('qr-image');

var qr_svg = qr.image('590c.org/ppwwqr1#6PYLtMnXvfG3oJde97zRyLYFZCYizPU5T3LwgdYJz1fRhh16bU7u6PPmY7', { type: 'svg' });
qr_svg.pipe(require('fs').createWriteStream('qr1.svg'));

// Create a document
doc = new PDFDocument()

// Pipe it's output somewhere
doc.pipe(fs.createWriteStream('qr1.pdf'))

// Embed a font, set the font size, and render some text
doc.fontSize(32).text('QR1', 100, 100)
doc.path('M1 1h7v7h-7zM10 1h1v1h-1zM15 1h5v1h1v1h1v-1h1v2h-1v1h-1v1h-1v-1h-2v-1h2v-1h-1v-1h-4zM21 1h1v1h-1zM23 1h3v1h-3zM27 1h1v1h-1zM31 1h7v7h-7zM2 2v5h5v-5zM11 2h2v2h-2zM14 2h1v2h-1zM28 2h1v1h-1zM32 2v5h5v-5zM3 3h3v3h-3zM9 3h1v1h1v3h-1v1h1v-1h1v1h1v1h-1v1h-2v-1h-1zM17 3h1v1h-1zM27 3h1v1h-1zM33 3h3v3h-3zM13 4h1v1h-1zM23 4h1v4h1v2h-1v2h-1v-1h-1v-1h1v-1h-2v-3h1v2h1v-2h-1v-1h1zM26 4h1v1h-1zM29 4h1v1h-1zM15 5h1v3h-1v-1h-1v1h-1v-2h2zM17 5h1v3h-1zM19 6h1v2h-1zM25 6h1v2h-1zM28 6h1v1h-1zM27 7h1v2h2v2h-1v-1h-3v-1h1zM29 7h1v1h-1zM14 8h1v1h-1zM16 8h1v2h1v1h-2zM1 9h1v1h-1zM3 9h5v1h-1v1h1v1h-1v1h1v1h-5v1h-1v1h-1v-2h1v-1h-1v-1h1v-1h1zM19 9h1v1h-1zM31 9h5v1h1v1h-3v-1h-1v1h1v1h-2v-1h-1zM8 10h2v1h-2zM12 10h3v1h-2v1h-1zM4 11v1h-1v1h2v-2zM10 11h1v1h-1zM15 11h1v3h-2v1h1v1h-3v-3h1v-1h1v1h1zM18 11h1v1h-1zM21 11h1v1h1v1h-3v-1h1zM25 11h2v1h-1v1h1v1h-2v-1h-1v-1h1zM28 11h1v1h-1zM30 11h1v2h1v1h-1v2h-2v2h1v-1h1v-1h1v-1h2v-1h1v2h-2v1h3v1h1v1h-1v1h-2v-2h-3v1h-1v1h-1v1h-1v-1h-3v-1h2v-2h1v-1h-2v-1h1v-1h1v1h1v-2h1zM37 11h1v2h-2v-1h1zM11 12h1v1h-1zM17 12h1v1h1v3h1v1h-2v1h-1v1h1v-1h3v1h-1v2h-1v-1h-2v2h1v2h-1v1h-1v1h2v1h-2v1h-1v-2h-1v-1h1v-1h1v-1h-1v-1h-1v-1h2v-4h1v-1h1v-1h-1v1h-1v-2h1zM27 12h1v1h-1zM9 13h1v1h1v1h-1v4h-1v-1h-2v1h-1v-2h-1v-1h-1v3h-2v-2h1v-2h5v1h-1v1h2v-2h-1v-1h1zM23 13h1v1h-1zM33 13h1v1h-1zM35 13h1v1h-1zM20 14h3v1h1v2h-2v1h-1v-2h1v-1h-2zM24 14h1v1h-1zM36 15h2v2h-2zM15 16h1v1h-1zM11 17h1v2h1v1h-2zM13 17h1v1h-1zM24 17h2v1h-1v1h-1v1h-1v-1h-1v-1h2zM14 18h1v1h-1zM4 19h2v1h-1v1h-2v-1h1zM7 19h2v1h2v1h-2v1h-2v1h1v1h-2v2h1v1h-2v1h-1v-1h-1v-1h2v-4h1v-1h2v-1h-1zM21 19h1v1h-1zM31 19h1v1h1v1h-1v1h-1v1h1v1h-1v1h2v4h1v2h1v-1h1v1h1v-1h1v2h-4v1h2v1h-2v1h-1v1h2v1h-1v1h-2v-1h-1v1h-1v-1h-2v1h-1v-2h3v-1h-1v-1h-2v1h-1v3h-3v-1h-1v-1h2v1h1v-2h-5v1h-1v-1h-1v-1h2v-1h-2v1h-1v-1h-1v-3h1v-2h1v1h1v3h2v-2h4v1h-2v2h2v1h1v-1h3v-3h-1v1h-2v-1h1v-1h1v-3h-2v-1h3v-1h-1v-1h1v-2h2zM37 19h1v5h-1v1h-1v-1h-1v-1h1v-3h1zM1 20h1v1h-1zM22 20h1v1h1v1h-1v1h-3v-2h1v1h1zM24 20h1v1h-1zM2 21h1v1h-1zM11 21h2v1h-2zM25 21h1v1h-1zM27 21h1v2h-1zM33 21h1v1h-1zM9 22h2v1h-1v1h-1zM13 22h1v1h-1zM32 22h1v1h-1zM34 22h1v1h-1zM1 23h2v1h-1v1h1v1h-1v4h-1zM12 23h1v2h-2v-1h1zM14 23h1v1h-1zM19 23h1v1h-1zM23 23h1v1h-1zM25 23h2v1h-2zM33 23h1v1h-1zM3 24h1v1h-1zM8 24h1v1h1v2h-2v-1h-1v-1h1zM20 24h1v1h1v-1h1v1h1v1h2v1h-2v2h-3v-3h-2v-1h1zM34 24h1v1h1v1h-1v2h-1zM37 25h1v1h-1zM11 26h1v1h-1zM13 26h1v2h1v1h-1v1h1v4h-1v-1h-1v1h1v1h-1v1h-4v-4h1v2h1v1h1v-1h-1v-2h1v-1h-3v-2h1v1h3zM30 26v1h-1v1h1v1h1v-2h1v-1zM36 26h1v1h-1zM7 27h1v1h-1zM18 27h2v2h-1v-1h-1zM22 27v1h1v-1zM37 27h1v1h-1zM3 28h1v1h4v1h-5zM25 28h1v1h-1zM36 28h1v1h-1zM15 29h1v1h-1zM20 29h1v1h-1zM30 30v3h3v-3zM1 31h7v7h-7zM17 31v1h1v-1zM25 31h1v1h-1zM31 31h1v1h-1zM2 32v5h5v-5zM3 33h3v3h-3zM21 33v1h1v-1zM15 34h2v1h1v1h-1v2h-1v-2h-2v-1h1zM37 34h1v4h-3v-1h2v-1h-1v-1h1zM31 35v1h1v-1zM13 36h1v1h1v1h-2zM9 37h3v1h-3z')
.fill('non-zero');

// Finalize PDF file
doc.end()
