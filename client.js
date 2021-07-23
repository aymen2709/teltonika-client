const net = require('net');
const client = new net.Socket();
var crc = require('crc');


// Change to your server port and address
const port = 7070;
const host = '127.0.0.1';


// Convert hex to text
var hexToString = function (str) {
    return Buffer.from(str, 'hex').toString('utf8');
}


// convert text to hex
var stringToHex = function (str) {
    return Buffer.from(str, 'utf8').toString('hex');
}


/** Encapsulate message to Teltonika codec12 */
var strigToCodec12 = function (input) {
    var l = input.length + 8;
    var dataLength = ('00000000' + l.toString(16)).slice(-8);
    var type = "05"; // This is a command
    var CodecId = "0c"; // codec12
    var CommandeSize = ('00000000' + input.length.toString(16)).slice(-8);
    var commandHex = stringToHex(input);
    // CRC16
    var hexcrc = Buffer.from(CodecId + "01" + type + CommandeSize + commandHex + "01", 'hex');
    var checksum = ('00000000' + crc.crc16(hexcrc).toString(16)).slice(-8);
    return "00000000" + dataLength + CodecId + "01" + type + CommandeSize + commandHex + "01" + checksum;
}






client.on('data', function (data) {
    console.log('Server Says : ' + data);
});

client.on('close', function () {
    console.log('Connection closed');
});


/** connect to remote server */
client.connect(port, host, function () {
    console.log('Connected');
    client.write(Buffer.from('000f333534303138313134383537373131', 'hex'));


    // Simulate normal message
    setInterval(() => {
        let codec12Packet = Buffer.from(strigToCodec12('MEDISAIL&1=2661.00&2=324300.00&3=0&4=0&5=355000.00&6=358.10&7=13.40&8=53.30&9=12467683.00&10=48500.00&11=22000.00&12=51&13=26&14=344500.00&15=394.60&20=4.50&21=-1000000000.00&22=-1000000000.00&23=4.62&24=6.07&25=278.35&26=293.35&27=101300.00&28=278.35&29=-1000000000.00&30=56.80&31=42.00&32=101300.00&33=278.35&34=-0.10&39=9.13&40=6.36&42=1&AYMEN'), 'hex');
        client.write(codec12Packet);
    }, 10000);

    // Simulate corrupted message
    setInterval(() => {
        let codec12Corrupt = Buffer.from(strigToCodec12('MEDISAIL&1=2661.00&2=324300.00&3=0&4=0&5=355000.00&6=358.10&7=13.40&8=53.30&9=12467683.00&10=48500.00&11=22000.00&12=51&13=26&14=344500.00&15=394.60&20=4.50&21=-1000000000.00&22=-1000000000.00&23=4.62&24=6.07&25=278.35&26=293.35&27=101300.00&28=278.35&29=-1000000000.00&30=56.80&31=42.00&32=101300.00&33=278.35��2�����Ʌ&39=9.13&40=6.36&42=1&AYMEN'), 'hex');
        client.write(codec12Corrupt);
    }, 30000);
});
