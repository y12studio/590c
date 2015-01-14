var Blockchain = require('./blockchain')

exports.foo = function(){

    var txCount = 0
    var blockCount = 0
    var bheight = []

    console.log('Create new blockchain api endpoint.')
    var blockchain = new Blockchain();

    blockchain.subscribeBlocks(function(msg){
        console.log(msg)
        txCount = 0
        blockCount++
        bheight.push(msg.height)
    })

    blockchain.subscribeUnconfirmed(function(msg){
        console.log(bheight.join() + '/txCount=' + txCount++)
        if(txCount%20==0){
            //blockchain.pingBlock()
        }
    })
}


exports.world = function() {
    console.log('Hello World')
}
