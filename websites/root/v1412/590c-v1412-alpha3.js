var Y590c = function() {};

Y590c.OpReturn = dcodeIO.ProtoBuf.loadProtoFile("590c-v1412-alpha3.proto").build('org590c.OpReturn');

Y590c.PbPost = function(pbobj) {
    pbobj.orhex = '590c' + pbobj.toHex();
    pbobj.orsize = pbobj.orhex.length / 2;
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
