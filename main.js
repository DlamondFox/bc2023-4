const xml = require('fast-xml-parser');
const http = require('http');
const fs = require('fs');

const host = 'localhost';
const port = 8000;
const server = http.createServer((req, res) => {
    const xmldata = fs.readFileSync('data.xml');
    const parser = new xml.XMLParser();
    const jsondata = parser.parse(xmldata);

    const currencies = Array.isArray(jsondata.exchange.currency)
        ? jsondata.exchange.currency
        : [jsondata.exchange.currency];
    
    const newxmldata = {
        data: {
            exchange: currencies.map((currency) => ({
                date: currency.exchangedate,
                rate: currency.rate,
            })),
        },
    };

    const builder = new xml.XMLBuilder();
    const xmlstr = builder.build(newxmldata);
    
    res.setHeader('Content-Type', 'text/xml');
    res.end(xmlstr);
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});