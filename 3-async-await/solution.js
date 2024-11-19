const pricesFunction = require('./prices')
const productsFunction = require('./products')
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

class Product {
    constructor(id, name, price){
        this.id = id
        this.name = name
        this.price = price
    }
    print(){
        console.log(`ID: ${this.id} | product: ${this.name} | price: ${this.price.toFixed(2)} $`)
    }
}

class CustomError extends Error{
    constructor(message, origin){
        super(message)
        this.origin = origin
    }
}

const printError = (id, error) => {
    console.error(`
        === ERROR OCCURRED ===
        - ID: ${id}
        - Origin: ${error.origin || 'unknown'}
        - Error Message: ${error.message}
        =======================
    `);
}

const generateId = async(delay) => {
    if(delay){
        await new Promise(resolve => setTimeout(resolve, delay))
    }
    const currentTime = Date.now()
    return currentTime % 100
}

async function solution(allId, allSettledId) {
    
    console.log('Starting Promise.all proccess')
    try {
        const [name, price] = await Promise.all([
            productsFunction(allId),
            pricesFunction(allId)
        ])
        const product = new Product(allId, name, price)
        product.print()

    } catch (error) {
        printError(allId, error)
    }
    console.log('Ending Promise.all proccess\n')

    console.log('Starting Promise.allSettled proccess')

    try {
        const [nameResponse, priceResponse] = await Promise.allSettled([
            productsFunction(allSettledId),
            pricesFunction(allSettledId)
        ])

        if(nameResponse.status === 'rejected'){
            throw new CustomError(nameResponse.reason.message, 'product')
        }
        if(priceResponse.status === 'rejected'){
            throw new CustomError(priceResponse.reason.message, 'price')
        }

        const {value:name} = nameResponse
        const {value:price} = priceResponse

        const product = new Product(allSettledId, name, price)
        product.print()
    } catch (error) {
        printError(allSettledId, error)
    }
    console.log('Ending Promise.allSettled proccess')
} 


(
    async function(){
        const generatedAllId = await generateId()
        const generatedAllSettledId = await generateId(100)
        solution(generatedAllId, generatedAllSettledId)
    }
)()

