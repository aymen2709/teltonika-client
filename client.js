const net = require('net');
const client = new net.Socket();
var crc = require('crc');

const port = 3000;
const host = '0.0.0.0';

/* const port = 7070;
const host = '127.0.0.1'; */


/** Function to convert hex to string */
var hexToString = function (str) {
    return Buffer.from(str, 'hex').toString('utf8');
}

/** Function to convert string to hex */
var stringToHex = function (str) {
    return Buffer.from(str, 'utf8').toString('hex');
}

var strigToCodec12 = function (input) {
    var l = input.length + 8;
    var dataLength = ('00000000' + l.toString(16)).slice(-8);
    var type = "05"; // This is a command
    var CodecId = "0c"; // codec12
    var CommandeSize = ('00000000' + input.length.toString(16)).slice(-8);
    var commandHex = stringToHex(input);

    // CRC16
    var hexcrc = Buffer.from(CodecId + "01" + type + CommandeSize + commandHex + "01", 'hex');
    var checksum =  ('00000000' + crc.crc16(hexcrc).toString(16)).slice(-8);

    return "00000000" + dataLength + CodecId + "01" + type + CommandeSize + commandHex + "01" + checksum;
}






client.on('data', function (data) {
    console.log('Server Says : ' + data);
});

client.on('close', function () {
    console.log('Connection closed');
});

client.connect(port, host, function () {
    console.log('Connected');
    client.write(Buffer.from('000f333534303138313134383537373131', 'hex'));

    setTimeout(() => {
        client.write(Buffer.from('00000000000000900C010600000088494E493A323031392F372F323220373A3232205254433A323031392F372F323220373A3533205253543A32204552523A312053523A302042523A302043463A302046473A3020464C3A302054553A302F302055543A3020534D533A30204E4F4750533A303A3330204750533A31205341543A302052533A332052463A36352053463A31204D443A30010000C78F', 'hex'))
    }, 3000);

    setInterval(() => {
        let codec12Packet = Buffer.from(strigToCodec12('dddddddddddddddddddddddddd hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh gggggggggggggggggggggggggggggggggggggg ffffffffffffffffffffffffffffffffffffffffffffffff ffffffffffffffffffffffffffffffffffffffffff hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh gggggggggggggggggggggggggggggggggggggggggggggggggg fffffffffffffffffffffffffffffffffffffffffffffffffffffff 123456789000000000000000000000000000000011111111111111111111111111111000000000000 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb cccccccccccccccccccccccccc dddddddddddddddddddddddddd hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh gggggggggggggggggggggggggggggggggggggg ffffffffffffffffffffffffffffffffffffffffffffffff ffffffffffffffffffffffffffffffffffffffffff hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh gggggggggggggggggggggggggggggggggggggggggggggggggg fffffffffffffffffffffffffffffffffffffffffffffffffffffff 123456789000000000000000000000000000000011111111111111111111111111111000000000000 AYMEN: FROM A SIMULATED DEVICE'), 'hex');
        client.write(codec12Packet);
    }, 10000);
});
