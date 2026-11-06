export class ApiUtils{

    constructor(apiContext,loginPayload){  
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    };

    async getToken(){
        // Login using API    
        const loginResponse = await this.apiContext.post(
                                                        "https://rahulshettyacademy.com/api/ecom/auth/login",
                                                        {
                                                            data: this.loginPayload,
                                                        },
                                                    );
        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;
        return token;

    }

    async createOrder(createOrderPayload){

        let response = {};
        response.token = await this.getToken();        
        // Create Order using API
        const createOrderResponse = await this.apiContext.post(
                                                            'https://rahulshettyacademy.com/api/ecom/order/create-order',
                                                            {
                                                                data:createOrderPayload,
                                                                headers:{
                                                                            'Authorization' : response.token ,
                                                                            'Content-Type' : 'application/json',

                                                                        }
                                                            }
                                                        );
        const createOrderResponseJson = await createOrderResponse.json();
        const orderId = createOrderResponseJson.orders[0];
        console.log(createOrderResponseJson);
        console.log('orderId : '+ orderId);
        response.orderId = orderId;
        return response;
    }

   async addToCart(addToCartPayload){

        let response = {};
        response.token = await this.getToken();
        
        // Add To cart using API
        const addToCartResponse = await this.apiContext.post(
                                                            'https://rahulshettyacademy.com/api/ecom/user/add-to-cart',
                                                            {
                                                                data:addToCartPayload,
                                                                headers:{
                                                                            'Authorization' : response.token ,
                                                                            'Content-Type' : 'application/json',

                                                                        }
                                                            }
                                                        );
        const addToCartResponseJson = await addToCartResponse.json();
        const message =addToCartResponseJson.message;
        console.log(addToCartResponseJson);
        response.message = message;
        return response;
    }

}