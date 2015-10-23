var bitcore = require('bitcore');
var Bip38 = require('bip38');
var bip38 = new Bip38()
var math = require('mathjs');
var request = require('request');
var format = require('string-format');
// Moment.js http://momentjs.com/docs/#/displaying/
var moment = require('moment');
// devongovett/pdfkit https://github.com/devongovett/pdfkit
PDFDocument = require('pdfkit')
fs = require('fs')

// fast test mode = false
var bip38RealMode = true

// qr-image  https://www.npmjs.com/package/qr-image
var qr = require('qr-image');

// pixl-xml  https://www.npmjs.com/package/pixl-xml
var XML = require('pixl-xml');

var conf = {
    svgfront: 'qr32f5.min.svg',
    svgback: 'qr32b5.min.svg',
    pdf: 'qr32-5.pdf',
    pricebtcusd: 279,
    priceusdtwd: 32.34
}

var svgFront = XML.parse(conf.svgfront);
var svgBack = XML.parse(conf.svgback);
var qrcolorarr = ['#240B3B', '#173B0B', '#3B0B0B', '#0A2229', '#3B0B17', '#1C1C1C']
var passcolorarr = ['#B40404', '#298A08', '#0B614B', '#08298A', '#380B61', '#8A0868', '#2E2E2E', '#B40431', '#8000FF']
    // path[0] { d: 'M.965 1.23h97.83v77.443H.964z', fill: '#f9f9f9' }
    // console.log(baseSvg.path);

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
doc.pipe(fs.createWriteStream(conf.pdf))

// 3x2 A4
// 594/3 = 198 - 4 = 194
// 840/2 = 420 - 4 = 416
var itemWidth = 416
var itemHeight = 194
var patterNum = 6
var pgmarginx = 5
var pgmarginy = 6
    // svg 200x80 px
var pkarr = []
var addrarr = []
var svgaddrarr = []
var y12seqarr = []
var priceseqarr = []
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
    seqnum = 10001 + i
    seq = format('{0}-Y12TW {1}', moment().format('YYYYMMDDHH'), seqnum)
    priceseq = format('BTCUSD{0}  USDTWD{1}  {2}', conf.pricebtcusd, conf.priceusdtwd, seqnum)
    y12seqarr.push(seq)
    priceseqarr.push(priceseq)
    bip38pass = 'Y12 ' + math.randomInt(1000, 9999) + ' ' + math.randomInt(1000, 9990) + ' ' + math.randomInt(1000, 9999)
    passarr.push(bip38pass)
        // test-fast
    bip38str = bip38RealMode ? bip38encode(pk, addr, bip38pass) : '6PYNKZ1EAgYgmQfmNVamxyXVWHzK5s6DGhwP4J5o44cvXdoY7sRzhtpUeo'
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
    doc.translate(opt.pgmx, opt.pgmy)
    doc.translate(opt.rx, opt.ry)

    for (var i = 0; i < patterNum; i++) {
        color = opt.rancolor ? math.pickRandom(opt.colorarr) : '#424242'
        tx = ((i % 2 == 0) ? itemWidth : itemWidth * -1)
        ty = ((i % 2 == 0) ? 0 : itemHeight)
        var svgQr = svgarr[i]
            // fix https://github.com/alexeyten/qr-image/issues/19
        doc.save()
        doc.path(svgQr.path).scale(opt.scale).fill(color, 'non-zero')
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
    doc.translate(opt.pgmx, opt.pgmy)
    doc.font(opt.ttf).fontSize(opt.size)

    for (var i = 0; i < patterNum; i++) {
        rx = opt.ran ? opt.rx + math.randomInt(0, opt.ranx) : opt.rx
        ry = opt.ran ? opt.ry + math.randomInt(0, opt.rany) : opt.ry
        color = opt.rancolor ? math.pickRandom(opt.colorarr) : opt.color
        doc.fillColor(color)
        row = Math.floor(i / 2)
        tx = rx + ((i % 2 == 0) ? 0 : itemWidth)
        ty = ry + itemHeight * row
        doc.text(textarr[i], tx, ty)
    }
    doc.restore()
}

function patternArray(ptsvg, opt) {
    doc.save()
    doc.translate(opt.pgmx, opt.pgmy)
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
    pgx = pgmarginx
    pgy = pgmarginy
    patternArray(svgFront, {
            pgmx: pgx,
            pgmy: pgy
        })
        // address qr
    qrSvgArray(svgaddrarr, {
        pgmx: pgx,
        pgmy: pgy,
        rancolor: true,
        colorarr: qrcolorarr,
        rx: 60,
        ry: 40,
        scale: 1.5
    })

    textArray(addrarr, {
        pgmx: pgx,
        pgmy: pgy,
        ttf: 'fonts/Cousine-Bold.ttf',
        color: '#DF013A',
        size: 10,
        rx: 60,
        ry: 20
    })

    textArray(y12seqarr, {
        pgmx: pgx,
        pgmy: pgy,
        ttf: 'fonts/Oswald-Regular.ttf',
        size: 8,
        rx: 280,
        ry: 160
    })
}

function lsArrMv(arr) {
    // landscape twp page print
    rarr = math.range(0, patterNum);
    // [0,1,2,3,4,5] to [1,0,3,2,5,4]
    arr.forEach(function(p, index, arr) {
        if (index % 2 == 0) {
            rarr[index + 1] = p
        } else {
            rarr[index - 1] = p
        }
    });
    return rarr
}

// 20151023 print double-sided test (mjprintone), pageBack need to fix the marginy issue
// test1 marginy -2 / result :
// DoubleSidedFix
var DSF = {
    NORMAL: 0,
    MJPRINT: -2
}

function pageBack() {
    // landscape print 0/2/4 move to 1/3/5
    // pattern not to lsArrMv()
    //
    pgmyfix = DSF.MJPRINT

    pgx = pgmarginx
    pgy = pgmarginy + pgmyfix
    patternArray(svgBack, {
        pgmx: pgx,
        pgmy: pgy
    })

    qrSvgArray(lsArrMv(svgbip38arr), {
        pgmx: pgx,
        pgmy: pgy,
        rancolor: true,
        colorarr: qrcolorarr,
        rx: 50,
        ry: 40,
        scale: 1.5
    })

    textArray(lsArrMv(bip38arr), {
        pgmx: pgx,
        pgmy: pgy,
        ttf: 'fonts/Cousine-Bold.ttf',
        color: '#DF013A',
        size: 8,
        rx: 50,
        ry: 20
    })

    // bip38 passphrase
    textArray(lsArrMv(passarr), {
        pgmx: pgx,
        pgmy: pgy,
        ttf: 'fonts/Cousine-Bold.ttf',
        color: '#D358F7',
        size: 12,
        ran: true,
        rancolor: true,
        colorarr: passcolorarr,
        rx: 130,
        ry: 40,
        ranx: 80,
        rany: 70
    })

    textArray(lsArrMv(priceseqarr), {
        pgmx: pgx,
        pgmy: pgy,
        ttf: 'fonts/Oswald-Regular.ttf',
        color: 'green',
        size: 8,
        rx: 230,
        ry: 160
    })

}

pageFront()
doc.addPage()
pageBack()
doc.end()
