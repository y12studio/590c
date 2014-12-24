var Y590c = function() {};

Y590c.OpReturn = dcodeIO.ProtoBuf.loadProtoFile("590c-v1412-alpha4.proto").build('org590c.OpReturn');

Y590c.PbPost = function(pb) {
  var r = {};
  r.hex = '590c' + pb.toHex();
  var dBuf = dcodeIO.ByteBuffer.fromHex(r.hex);
  r.base64 = dBuf.toBase64();
  r.size = r.hex.length / 2;
  // hash160
  r.hash160 = Y590c.toHash160AndSha256(r.hex);
  return r;
};

Y590c.PbParsePre = function(hexStr) {
  // 590c[data]
  var r = '';
  if (hexStr.indexOf('590c') == 0) {
    r = hexStr.substring(4);
  }
  return r;
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
      r.pb = Y590c.OpReturn.decode(dBuf);
      r.hex = raw;
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
  r.oracleSize = hexRaw.length / 2;
  r.hash160 = Y590c.toHash160AndSha256(hexRaw);
  return r;
}

Y590c.createTag = function(tagString, tagInt32, tagBytes) {
  var pbr = {};
  var or = new Y590c.OpReturn(Y590c.OpReturn.Type.TAG);
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
  or.tag = tag;
  pbr.result = Y590c.PbPost(or);
  pbr.pb = or;
  return pbr;
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

Y590c.helloTx = function($resource, txHex, cbSuccess , cbError){
    var reshbTx = $resource('https://mainnet.helloblock.io/v1/transactions/:tx');
    var cb = {};

    helloSuccess = function(v) {
        console.log(v);
        v.data.transaction.outputs.every(function(element, index, array) {
            console.log(element);
            if (element.value == 0 && element.scriptPubKey.indexOf('6a') == 0) {
                // parse OP_RETURN
                var obj = Y590c.ParseMetaData(element.scriptPubKey);
                cbSuccess(obj);
                return false;
            }
            return true;
        });
    };

    helloError = function(error) {
        console.log('callback helloblock error!');
        console.log(error);
        cbError(error);
    };
    var p = {
        'tx': txHex
    };
    reshbTx.get(p, helloSuccess, helloError);
}
