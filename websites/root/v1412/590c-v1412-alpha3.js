var Y590c = function() {};

Y590c.OpReturn = dcodeIO.ProtoBuf.loadProtoFile("590c-v1412-alpha3.proto").build('org590c.OpReturn');
Y590c.Oracle = dcodeIO.ProtoBuf.loadProtoFile("oracle-v1412-alpha1.proto").build('org590c.OverlayOracle');

Y590c.PbPost = function(pb) {
  pb.orhex = '590c' + pb.toHex();
  var dBuf = dcodeIO.ByteBuffer.fromHex(pb.orhex);
  pb.orbase64 = dBuf.toBase64();
  pb.orsize = pb.orhex.length / 2;
  // hash160
  pb.orhash160 = Y590c.toHash160AndSha256(pb.orhex);
};

Y590c.PbParsePre = function(hexStr) {
  // 590c[data]
  var r = '';
  if (hexStr.indexOf('590c') == 0) {
    r = hexStr.substring(4);
  }
  return r;
};

Y590c.PbPrint = function(pbobj) {
  console.log(pbobj);
  console.log('hex=' + pbobj.toHex());
  console.log('base64=' + pbobj.toBase64());
  console.log('calculate size = ' + pbobj.calculate());
  console.log('result hex = ' + pbobj.orhex);
  console.log('result size = ' + pbobj.orsize);
};

Y590c.ParseMetaData = function(scriptHex) {
  var r = {};
  var script = bitcoin.Script.fromHex(scriptHex);
  console.log(script);
  if (script.chunks[0] === 106) {
    // OP_RETURN
    var raw = script.chunks[1].toString('hex');
    //console.log(raw);
    // 590c[data]
    var data = Y590c.PbParsePre(raw);
    if (data.length > 0) {
      var dBuf = dcodeIO.ByteBuffer.fromHex(data);
      r = Y590c.OpReturn.decode(dBuf);
      r.orhex = raw;
    }
  }
  return r;
}

Y590c.ParseOracle = function(base64Str) {
  var r = {};
  var dBuf = dcodeIO.ByteBuffer.fromBase64(base64Str);
  var hexRaw = dBuf.toHex().toLowerCase();
  console.log(hex);
  var hex = Y590c.PbParsePre(hexRaw);
  var dBuf2 = dcodeIO.ByteBuffer.fromHex(hex);
  r.oracle = Y590c.Oracle.decode(dBuf2);
  r.oracleSize = hexRaw.length/2;
  r.hash160 = Y590c.toHash160AndSha256(hexRaw);
  return r;
}

Y590c.handleMeta = function(obj) {
  console.log(obj);
  var r = {};
  if (obj.type == Y590c.OpReturn.Type.TAG) {
    r = obj.tag;
  }
  return r;
}

Y590c.createTag = function(tagString, tagInt32, tagBytes) {
  var r = new Y590c.OpReturn(Y590c.OpReturn.Type.TAG);
  var tag = new Y590c.OpReturn.Tag();
  if (tagBytes != null) {
    var dBuf = dcodeIO.ByteBuffer.fromHex(tagBytes);
    tag.tagBytes = dBuf;
  }

  if (tagInt32 != null) {
    tag.tagInt32 = tagInt32;
  }

  if (tagString != null) {
    tag.tagString = tagString;
  }
  r.tag = tag;
  Y590c.PbPost(r);
  Y590c.PbPrint(r);
  return r;
}

Y590c.createOracleFoo = function(tagString, tagInt32) {
  console.log(Y590c.Oracle.Type.FOO);
  var r = new Y590c.Oracle(Y590c.Oracle.Type.FOO);
  var foo = new Y590c.Oracle.Foo();

  if (tagInt32 != null) {
    foo.tagInt32 = tagInt32;
  }

  if (tagString != null) {
    foo.tagString = tagString;
  }
  r.foo = foo;
  Y590c.PbPost(r);
  Y590c.PbPrint(r);
  return r;
}

Y590c.toHash160WithSha256 = function(hash256Hex) {
  // https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/script.js
  var bjsBuffer = bitcoin.Script.fromHex(hash256Hex).toBuffer();
  // https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/crypto.js
  var bf = bitcoin.crypto.ripemd160(bjsBuffer);
  return bf.toString('hex');
}

Y590c.toHash160AndSha256 = function(targetHex) {
  // https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/script.js
  var bjsBuffer = bitcoin.Script.fromHex(targetHex).toBuffer();
  // https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/crypto.js
  // hash160 = ripemd160(sha256(buffer))
  var bf = bitcoin.crypto.hash160(bjsBuffer);
  return bf.toString('hex');
}

Y590c.createFileProof = function(hashType, hash160Sha256Hex, fileSize, tagString, tagInt32) {
  var r = new Y590c.OpReturn(Y590c.OpReturn.Type.FILE_PROOF);
  console.log('RIPEMD160(SHA2_256(v))=' + hash160Sha256Hex);
  var dBufHash = dcodeIO.ByteBuffer.fromHex(hash160Sha256Hex);
  var fr = new Y590c.OpReturn.FileProof(hashType, dBufHash, fileSize);

  if (tagString) {
    fr.tagString = tagString;
  }
  if (tagInt32) {
    fr.tagInt32 = tagInt32;
  }

  r.fileProof = fr;
  r.hash160Hex = hash160Sha256Hex;
  Y590c.PbPost(r);
  Y590c.PbPrint(r);
  return r;
}

Y590c.createFileProofUrlGoogl = function(hashType, hash160Hex, fileSize, googlId) {
  var r = new Y590c.OpReturn(Y590c.OpReturn.Type.FILE_PROOF_URL);
  var dBufHash = dcodeIO.ByteBuffer.fromHex(hash160Hex);
  var fr = new Y590c.OpReturn.FileProofUrl(hashType, dBufHash, fileSize, Y590c.OpReturn.ExtType.GOOGL_ORACLE, googlId);

  r.fileProofUrl = fr;
  r.hash160Hex = hash160Hex;
  Y590c.PbPost(r);
  Y590c.PbPrint(r);
  return r;
}
