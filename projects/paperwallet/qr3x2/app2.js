var bitcore = require('bitcore');
var Bip38 = require('bip38');
var bip38 = new Bip38()
var math = require('mathjs');
var request = require('request');
var format = require('string-format');
// devongovett/pdfkit https://github.com/devongovett/pdfkit
PDFDocument = require('pdfkit')
fs = require('fs')

// fast test mode = false
var bip38RealMode = true

// qr-image  https://www.npmjs.com/package/qr-image
var qr = require('qr-image');

// pixl-xml  https://www.npmjs.com/package/pixl-xml
var XML = require('pixl-xml');

var svgFront = XML.parse('qr32f2.min.svg');
var svgBack = XML.parse('qr32b2.min.svg');

// path[0] { d: 'M.965 1.23h97.83v77.443H.964z', fill: '#f9f9f9' }
// console.log(baseSvg.path);

var qrSvgKey = qr.svgObject('590c.org/ppwwqr1#6PYLtMnXvfG3oJde97zRyLYFZCYizPU5T3LwgdYJz1fRhh16bU7u6PPmY7', {
    type: 'svg'
});

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
    layout: 'landscape', // can be 'landscape'
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
doc.pipe(fs.createWriteStream('qr32-2.pdf'))

// 3x2 A4
// 594/3 = 198
// 840/2 = 420
var itemWidth = 420
var itemHeight = 198
var patterNum = 6
    // svg 200x80 px
var pkarr = []
var addrarr = []
var svgaddrarr = []
var y12seqarr = []
var passarr = []
var bip38arr = []
var svgbip38arr = []
    // generate bitcoin privatekey and address
for (var i = 0; i < patterNum; i++) {
    var pk = new bitcore.PrivateKey()
    pkarr.push(pk)
        //var address = privateKey.toAddress();
    var addr = pk.toAddress().toString()
    addrarr.push(addr)
        // BIP 0021 - Bitcoin Wiki https://en.bitcoin.it/wiki/BIP_0021
        // bitcoin:175tWpb8K1S7NmH4Zx6rewF9WQrcZv245W
    var svg = qr.svgObject('bitcoin:' + addr, {
            type: 'svg'
        })
        // Size option not working for SVG · Issue #19 · alexeyten/qr-image  https://github.com/alexeyten/qr-image/issues/19
    svgaddrarr.push(svg)
        //console.log(svg)
    // BTCUSD/BTCTWD/USDTWD
    seq = 'BTC-268-8709-32.47-151022-' + (1001 + i)
    y12seqarr.push(seq)
    bip38pass = 'Secret' + math.randomInt(10000, 99999) + 'T' + math.randomInt(100, 999)
    passarr.push(bip38pass)
    // test-fast
    bip38str = bip38RealMode ? bip38encode(pk,addr,bip38pass):'6PYNKZ1EAgYgmQfmNVamxyXVWHzK5s6DGhwP4J5o44cvXdoY7sRzhtpUeo'
    bip38arr.push(bip38str)
    var svgBip38 = qr.svgObject(bip38str, {
        type: 'svg'
    })
    svgbip38arr.push(svgBip38)
}

function bip38encode(key, addr, pass) {
    var privateKeyWif = key.toWIF()
    var encrypted = bip38.encrypt(privateKeyWif, pass, addr)
    return encrypted
}

function qrSvgArray(svgarr, opt) {
    doc.save()
    doc.translate(opt.rx, opt.ry)
    for (var i = 0; i < patterNum; i++) {
        tx = ((i % 2 == 0) ? itemWidth : itemWidth * -1)
        ty = ((i % 2 == 0) ? 0 : itemHeight)
        var svgQr = svgarr[i]
            // fix https://github.com/alexeyten/qr-image/issues/19
        doc.save()
        doc.path(svgQr.path).scale(opt.scale).fill('black', 'non-zero')
        doc.restore()
            // keep translate ratio
        doc.translate(tx, ty)
    }
    doc.restore()
}

function textArray(textarr, opt) {
    // doc.font('fonts/DancingScript-Bold.ttf').fontSize(20).text('QR4 Test font:DancingScript', 10, 100)
    // doc.font('fonts/SigmarOne.ttf').fontSize(30).text('Font: SigmarOne', 20, 200)
    // Oswald-Regular
    doc.save()
    doc.font(opt.ttf).fontSize(opt.size)
    for (var i = 0; i < patterNum; i++) {
        row = Math.floor(i / 2)
        tx = opt.rx + ((i % 2 == 0) ? 0 : itemWidth)
        ty = opt.ry + itemHeight * row
        doc.text(textarr[i], tx, ty)
    }
    doc.restore()
}

function patternArray(ptsvg) {
    doc.save()
    for (var i = 0; i < patterNum; i++) {
        tx = ((i % 2 == 0) ? itemWidth : itemWidth * -1)
        ty = ((i % 2 == 0) ? 0 : itemHeight)
            //console.log(tx + ',' + ty)
        ptsvg.path.forEach(function(p, index, arr) {
            doc.path(p.d).fill(p.fill)
        });
        doc.translate(tx, ty)
    }
    doc.restore()
}

function pageFront() {
    patternArray(svgFront)
        // address qr
    qrSvgArray(svgaddrarr, {
        rx: 60,
        ry: 25,
        scale: 1.8
    })

    textArray(addrarr, {
        ttf: 'fonts/Cousine-Bold.ttf',
        size: 12,
        rx: 60,
        ry: 10
    })

    textArray(y12seqarr, {
        ttf: 'fonts/Oswald-Regular.ttf',
        size: 8,
        rx: 250,
        ry: 175
    })
}

function lsArrMv(arr){
    // landscape twp page print
    rarr = math.range(0, patterNum);
    // [0,1,2,3,4,5] to [1,0,3,2,5,4]
    arr.forEach(function(p, index, arr) {
        if(index%2==0){
            rarr[index+1]=p
        }else{
            rarr[index-1]=p
        }
    });
    return rarr
}

function pageBack() {
    // landscape print 0/2/4 move to 1/3/5
    // pattern not to lsArrMv()
    patternArray(svgBack)
    qrSvgArray(lsArrMv(svgbip38arr), {
        rx: 60,
        ry: 65,
        scale: 1.5
    })

    textArray(lsArrMv(bip38arr), {
        ttf: 'fonts/Cousine-Bold.ttf',
        size: 8,
        rx: 60,
        ry: 130
    })

    // bip38 passphrase
    textArray(lsArrMv(passarr), {
        ttf: 'fonts/Cousine-Bold.ttf',
        size: 12,
        rx: 160,
        ry: 110
    })

    textArray(lsArrMv(y12seqarr), {
        ttf: 'fonts/Oswald-Regular.ttf',
        size: 8,
        rx: 290,
        ry: 170
    })

}

pageFront()
doc.addPage()
pageBack()
doc.end()
