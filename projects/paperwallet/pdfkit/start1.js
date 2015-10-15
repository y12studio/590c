PDFDocument = require('pdfkit')
fs = require('fs')

// Create a document
doc = new PDFDocument()

// Pipe it's output somewhere
doc.pipe(fs.createWriteStream('start1.pdf'))

// Embed a font, set the font size, and render some text
doc.fontSize(40).text('Some text @ page1', 100, 100)

// Add another page
doc.addPage()
   .fontSize(25)
   .text('Here is some vector graphics...', 100, 100)

// Draw a triangle
doc.save()
   .moveTo(100, 150)
   .lineTo(100, 250)
   .lineTo(200, 250)
   .fill("#FF3300")

doc.path('M 0,20 L 100,160 Q 130,200 150,120 C 190,-40 200,200 300,150 L 400,90')
      .stroke()

// Add some text with annotations
doc.addPage()
   .fillColor("blue")
   .text('Here is a link!', 100, 100)
   .underline(100, 100, 160, 27, {color: "#0000FF"})
   .link(100, 100, 160, 27, 'http://google.com/')

// Finalize PDF file
doc.end()
