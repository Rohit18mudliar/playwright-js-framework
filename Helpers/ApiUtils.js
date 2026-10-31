export class ApiUtils{

    constructor(apiContext,loginPayload){  // Common values in constructor for reusability
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
        console.log(token);
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

}