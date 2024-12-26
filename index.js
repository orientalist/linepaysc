const crypto = require('crypto');
const axios = require('axios');

// LINE PAY 配置設定
const LINE_PAY_URL = '';
const CHANNEL_ID = '';
const CHANNEL_SECRET = '';
const CALLBACK_URL = 'https://victor.ai.com';  // 這是你的後端收到支付確認的回調地址

const product = {
    'la222': 750,
    'la125': 1250,
    'rosewood': 1980
};

exports.handler = async (event) => {

    let SVID = event.queryStringParameters.svid;
    let HASH = event.queryStringParameters.hash;

    const url=await main(SVID,HASH);

    
    const response = {
        statusCode: 301,
        headers: {
            Location: url
        }
    };
    return response;
};

const main = async (svid,hash) => {
    let surveyData = await decryptor(hash, svid);
    surveyData = JSON.parse(surveyData);

    const price = { products: [], totalPrice: 0 };
    const products = surveyData.result.filter(r => r.label === 'product');
    products.forEach((p,i) => {
        if (p.answer[0] !== '0' && p.answer[0] !== undefined) {
            p.answer[0] = Number.parseInt(p.answer[0]);
            const subTotal = product[p.alias] * p.answer[0];
            price.totalPrice += subTotal;
            price.products.push({  name: p.subject, price: product[p.alias], quantity: p.answer[0] });
        }
    });

    const randomId=crypto.randomUUID().toString();

    const order = {
        amount: price.totalPrice, currency: "TWD", orderId: randomId, packages: [
            {
                id: '1',
                amount: price.totalPrice,
                products: price.products
            }
        ],
        redirectUrls: {
            confirmUrl: `${CALLBACK_URL}/confirm`,
            cancelUrl: `${CALLBACK_URL}/cancel`
        }
    };
    const nonce = crypto.randomUUID().toString(); // Node.js v14.17.0 and later
    const jsonData = JSON.stringify(order);


    const hmac = crypto.createHmac('sha256', CHANNEL_SECRET);
    hmac.update(`${CHANNEL_SECRET}/v3/payments/request${jsonData}${nonce}`);
    const signature = hmac.digest('base64');

    try {
        const response = await axios.post(LINE_PAY_URL, order, {
            headers: {
                'Content-Type': 'application/json',
                'X-LINE-ChannelId': CHANNEL_ID,
                'X-LINE-Authorization-Nonce': nonce,
                'X-LINE-Authorization': signature,
            }
        });

        if (response.data.returnCode === '0000') {
            console.log(response.data.info.paymentUrl.web);
            return response.data.info.paymentUrl.web;
            //res.redirect(response.data.info.paymentUrl.web);
        } else {
            console.log(response);
            //res.status(400).send({ error: 'Payment request failed', message: response.data.returnMessage });
        }
    } catch (error) {
        console.log(error);
    }
}

const decryptor = async function (hash, svid) {
    let SURVEYCAKE_DOMAIN = "";
    let VERSION = "v0";


    let hash_key = "";
    let iv_key = "";

    let resp = await axios.get(`https://${SURVEYCAKE_DOMAIN}/webhook/${VERSION}/${svid}/${hash}`);
    console.log('***********************');
    //console.log(resp.data);
    console.log('***********************');


    let data = resp.data;

    const decipher = crypto.createDecipheriv(
        'AES-128-CBC',
        hash_key,
        iv_key
    );

    let json = decipher.update(
        data,
        'base64',
        'utf8'
    );

    json += decipher.final('utf8');

    return json;
};