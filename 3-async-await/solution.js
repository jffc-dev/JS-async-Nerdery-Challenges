/*
INSTRUCTIONS

1. using async/await API consume products and prices methods
2. don't use .then(), .catch() or .finally() here
3. both, products and prices methods expect a positive integer id
4. use Promise.all() and Promise.allSettled() to consume both methods in parallel
5. to generate the id do the following: invoke Date.now(), and take the last two digits, this will be your id
6. log the results with console.log(), the format is up to you, but it must include id, product and price

Example:
{
 id:100,
 product:'paper',
 price:1
}

7. both methods include some conditions to fail, at the end you should console.log() the errors, the format is up to you
8. add any needed adjustment to solution() function
9. as extra challenge: add Promise.race() and Promise.any(), and try to get the idea of what happens
*/

const fetchPrices = require('./prices.js');
const fetchProducts = require('./products.js');

async function solution() {
    // You generate your id value here
    const id = Date.now().toString().slice(-2);

    // You use Promise.all() here
    const requests = Promise.all([fetchProducts(id), fetchPrices(id)]);

    try {
        const [product, price] = await requests;

        const object = {
            id: id,
            product: product,
            price: price
        };

        console.log('Promise.all() fetched:');
        console.log(object);
    } catch(error) {
        console.log(`Promise.all() error: ${error}`);
    }

    // You use Promise.allSettled() here
    const requestsSettled = Promise.allSettled([fetchPrices(id), fetchProducts(id)]);

    // Log the results, or errors, here
    const results = await requestsSettled;

    const settledObject = new Object();
    settledObject.id = id;
    
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            settledObject[keyName(index)] = result.value;
        } else if (result.status === 'rejected') {
            console.log(`Ecountered allSettled error: ${result.reason}`);
        }
    });

    console.log('Promise.allSettled() fetched:');
    console.log(settledObject);
}

function keyName(index) {
    switch (+index) {
    case 0:
        return 'price';
    case 1:
        return 'product';
    default:
        return 'N/A';
    }
}

solution();
