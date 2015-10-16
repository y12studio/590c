// devongovett/pdfkit https://github.com/devongovett/pdfkit
PDFDocument = require('pdfkit')
fs = require('fs')

// qr-image  https://www.npmjs.com/package/qr-image
var qr = require('qr-image');

// pixl-xml  https://www.npmjs.com/package/pixl-xml
var XML = require('pixl-xml');

var baseSvg = XML.parse('qr4.min.svg');
// path[0] { d: 'M.965 1.23h97.83v77.443H.964z', fill: '#f9f9f9' }
// console.log(baseSvg.path);

var qrSvgKey = qr.svgObject('590c.org/ppwwqr1#6PYLtMnXvfG3oJde97zRyLYFZCYizPU5T3LwgdYJz1fRhh16bU7u6PPmY7', {
    type: 'svg'
});

//console.log(qr_svg.path)

// https://github.com/devongovett/pdfkit/blob/master/lib/page.coffee#L72-L122
// A4 px: [595.28, 841.89]
// 595.22/72*25.4 => 209.9803{8} mm.
// 842/72*25.4 => 297.0388{8} mm.
doc = new PDFDocument({
    size: 'A4',
    margins: { // by default, all are 72
        top: 2,
        bottom: 2,
        left: 2,
        right: 2
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
doc.pipe(fs.createWriteStream('qr4.pdf'))

// 595/2 = 297
// 842/4 = 210
var itemWidth = 297
var itemHeight = 210
    // svg 200x80 px
doc.save()
for (var i = 0; i < 8; i++) {
    tx = ((i % 2 == 0) ? itemWidth : itemWidth * -1)
    ty = ((i % 2 == 0) ? 0 : itemHeight)
        //console.log(tx + ',' + ty)
    baseSvg.path.forEach(function(p, index, arr) {
        doc.path(p.d).fill(p.fill)
    });
    doc.translate(tx, ty)
}
doc.restore()
doc.save()
qrx = 200
qry = 70
doc.translate(qrx, qry)
for (var i = 0; i < 8; i++) {
    tx = ((i % 2 == 0) ? itemWidth : itemWidth * -1)
    ty = ((i % 2 == 0) ? 0 : itemHeight)
    doc.path(qrSvgKey.path).fill('black', 'non-zero')
    doc.translate(tx, ty)
}
doc.restore()

// doc.font('fonts/DancingScript-Bold.ttf').fontSize(20).text('QR4 Test font:DancingScript', 10, 100)
// doc.font('fonts/SigmarOne.ttf').fontSize(30).text('Font: SigmarOne', 20, 200)
doc.font('fonts/Ultra.ttf').fontSize(10)
mx = 30
my = 150
for (var i = 0; i < 8; i++) {
    row = Math.floor(i / 2)
    tx = mx + ((i % 2 == 0) ? 0 : itemWidth)
    ty = my + itemHeight * row
    doc.text((2501 + i) + ' Bits', tx, ty)
}

doc.end()
