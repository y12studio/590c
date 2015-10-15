// devongovett/pdfkit https://github.com/devongovett/pdfkit
PDFDocument = require('pdfkit')
fs = require('fs')

// qr-image  https://www.npmjs.com/package/qr-image
var qr = require('qr-image');

// pixl-xml  https://www.npmjs.com/package/pixl-xml
var XML = require('pixl-xml');

var baseSvg = XML.parse('qr3base.min.svg');
// path[0] { d: 'M.965 1.23h97.83v77.443H.964z', fill: '#f9f9f9' }
// console.log(baseSvg.path);

var qrSvgKey = qr.svgObject('590c.org/ppwwqr1#6PYLtMnXvfG3oJde97zRyLYFZCYizPU5T3LwgdYJz1fRhh16bU7u6PPmY7', {
    type: 'svg'
});
var qrSvgWif = qr.svgObject('590c.org/ppwwqr1#KwYgW8gcxj1JWJXhPSu4Fqwzfhp5Yfi42mdYmMa4XqK7NJxXUSK7', {
    type: 'svg'
});
//console.log(qr_svg.path)
// Create a document
doc = new PDFDocument({
    size: [595.28, 841.89],
    margin: 10
})

// https://github.com/devongovett/pdfkit/blob/master/lib/page.coffee#L72-L122
// A4 px: [595.28, 841.89]
// 595.22/72*25.4 => 209.9803{8} mm.
// 842/72*25.4 => 297.0388{8} mm.
doc = new PDFDocument({
    size: 'A4',
    margins: { // by default, all are 72
        top: 36,
        bottom: 36,
        left: 36,
        right: 36
    },
    layout: 'portrait', // can be 'landscape'
    info: {
        Title: 'titleA',
        Author: 'authorA', // the name of the author
        Subject: 'subjectA', // the subject of the document
        Keywords: 'pdf;javascript', // keywords associated with the document
        CreationDate: '15/10/2015', // the date the document was created (added automatically by PDFKit)
        ModDate: '15/10/2015' // the date the document was last modified
    }
})

//console.log(doc)
// Pipe it's output somewhere
doc.pipe(fs.createWriteStream('qr3.pdf'))

var itemWidth = 200
// svg 200x80 px
doc.save()
for (var i = 0; i < 4; i++) {
    if (i % 2 != 0) {
        doc.translate(itemWidth, 0)
    } else {
        if (i == 0) {
            doc.translate(10, 10)
        } else {
            doc.translate(itemWidth*-1, (80 + 20) * i/2)
        }
    }
    baseSvg.path.forEach(function(p, index, arr) {
        doc.path(p.d).fill(p.fill)
    });
}
doc.restore()
doc.save()
doc.translate(50, 10).path(qrSvgKey.path).fill('black', 'non-zero')
doc.translate(200, 0).path(qrSvgWif.path).fill('black', 'non-zero')
doc.restore()
// Finalize PDF file
doc.fontSize(24).text('QR3 Test with baseSvg and qrSvg.', 10, 100)
doc.end()
