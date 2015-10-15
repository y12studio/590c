// devongovett/pdfkit https://github.com/devongovett/pdfkit
PDFDocument = require('pdfkit')
fs = require('fs')

// qr-image  https://www.npmjs.com/package/qr-image
var qr = require('qr-image');

var qrSvgKey = qr.svgObject('590c.org/ppwwqr1#6PYLtMnXvfG3oJde97zRyLYFZCYizPU5T3LwgdYJz1fRhh16bU7u6PPmY7', { type: 'svg' });
var qrSvgWif = qr.svgObject('590c.org/ppwwqr1#KwYgW8gcxj1JWJXhPSu4Fqwzfhp5Yfi42mdYmMa4XqK7NJxXUSK7', { type: 'svg' });
//console.log(qr_svg.path)
// Create a document
doc = new PDFDocument()

// Pipe it's output somewhere
doc.pipe(fs.createWriteStream('qr2.pdf'))

// Embed a font, set the font size, and render some text
doc.fontSize(32).text('QR1', 100, 100)
doc.translate(100, 0).path(qrSvgKey.path).fill('non-zero')
doc.translate(200, 0).path(qrSvgWif.path).fill('non-zero')
// Finalize PDF file
doc.end()
