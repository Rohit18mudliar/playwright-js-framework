import { test, expect , request } from "@playwright/test";

/******************************  Variables  ************************************************/
let BASE_URL = 'https://api.eventhub.rahulshettyacademy.com';
const username1 = "veyitih946@diarshop.com";
const password1 = "Rahul@123";
const username2 = "veyarid165@aganseo.com";
const password2 = "Rahul@123";
let API_URL;
let token;
let apiContext;

/******************************  Funcions  ************************************************/
async function login(page,username, password){
  // - Use request.post() to call POST /api/auth/login - (Refer below API Doc link to construct )- https://api.eventhub.rahulshettyacademy.com/api/docs/#/Auth/post_auth_login)
  // - Pass { email, password } as the request body under the data key
  console.log('Logging in with user '+username);
  BASE_URL = 'https://api.eventhub.rahulshettyacademy.com';
  API_URL = BASE_URL + '/api/auth/login';
  apiContext = await request.newContext();
  console.log('API_URL for login '+API_URL);
  const loginResponse = await apiContext.post(API_URL,{
                                                  data:{
                                                    email: username,
                                                    password: password
                                                  },
                                                  headers:{
                                                    'content-type': 'application/json',
                                                  }
                                                });
 console.log('loginResponse '+await loginResponse.status());
  // - Assert the response is OK (loginRes.ok() is truthy)
  await expect(loginResponse.ok()).toBeTruthy();

  // - Parse the JSON response and extract token — you will use this for all subsequent API calls
  const loginResponseJSON = await loginResponse.json();
  token = loginResponseJSON.token;

await page.addInitScript((value) => {
window.localStorage.setItem("eventhub_token", value);
}, token);
await page.goto('https://eventhub.rahulshettyacademy.com/bookings',{ waitUntil: 'networkidle' });

console.log('token '+ token);
}

/******************************  Tests  ************************************************/
test("@API @Sanity Acessing unauthorised booking should throw error", async ({page}) => {  

// Step 1 — Login as Yahoo user via API  -
 await login(page,username1, password1);

// Step 2 — Fetch events via API to get a valid event ID
// - Use request.get() to call GET /api/events - (Refer below API Doc link to construct )- https://api.eventhub.rahulshettyacademy.com/api/docs/#/Events/get_events)
// - Pass Authorization: Bearer <token> in the request headers
API_URL = BASE_URL + '/api/events';
apiContext =await request.newContext();
const queryString = 'page=1&limit=12';
console.log('API_URL for event call '+API_URL);
const eventResponse = await apiContext.get(API_URL, {
                                                      params: queryString,
                                                      headers: {
                                                                  'Authorization': "Bearer " + token,
                                                                  'Content-Type': "application/json",
                                                                },
                                                    }
                                          );
console.log('eventResponse ' +eventResponse.status());
// - Assert the response is OK
await expect(eventResponse.ok()).toBeTruthy();

// - Parse the JSON, read data[0].id — store this as eventId
const eventResponseJSON = await eventResponse.json();
const eventId = eventResponseJSON.data[0].id;
console.log('eventId '+eventId);

// Clear existing booking
API_URL =  BASE_URL + '/api/bookings';
console.log('API_URL for booking call '+API_URL);
apiContext = await request.newContext();
const cancelBookingResponse = await apiContext.delete(API_URL,{headers:{'authorization':"Bearer "+token,},})
console.log('cancelBookingResponse = ' +cancelBookingResponse.status());

// Step 3 — Create a booking via API as Yahoo user

// - Use request.post() to call POST /api/bookings  - (Refer below API Doc link to construct )-
// https://api.eventhub.rahulshettyacademy.com/api/docs/#/Bookings/post_bookings
// - Pass Authorization: Bearer <token> in headers
// - Pass the booking payload in data:
// - eventId — from Step 2
// - customerName — any name e.g. 'Yahoo User'
// - customerEmail — Yahoo user's email
// - customerPhone — any 10-digit number
// - quantity — 1

API_URL =  BASE_URL + '/api/bookings';
console.log('API_URL for booking call '+API_URL);
apiContext = await request.newContext();
const bookingResponse = await apiContext.post(API_URL,{
                                                    data:{
                                                          "eventId": eventId,
                                                          "customerName": "user one",
                                                          "customerEmail": username1,
                                                          "customerPhone": "9876543210",
                                                          "quantity": 1
                                                        },
                                                    headers:{'authorization':"Bearer "+token,},
                                                  });


console.log('bookingResponse = ' + await bookingResponse.status());
// - Assert the response is OK
await expect(bookingResponse.ok()).toBeTruthy();

// - Parse the JSON and extract data.id — store as yahooBookingId
const bookingResponseJSON = await bookingResponse.json();
const bookingId = bookingResponseJSON.data.id;
console.log('bookingId ' + bookingId);


/************************************************************************************************/
// Step 4 — Login as Gmail user via browser UI

// - Call your loginAs(page, GMAIL_USER) helper
console.log('Logging in with second user ');
 await login(page,username2, password2);

 // Step 5 — Navigate to Yahoo's booking URL as Gmail user

// - Navigate directly to /bookings/${yahooBookingId}
// - Pass { waitUntil: 'networkidle' } as the navigation option so the page fully resolves before asserting
BASE_URL = 'https://eventhub.rahulshettyacademy.com';
API_URL = BASE_URL+`/bookings/${bookingId}`;
console.log('API_URL for accessing unauthorised booking '+API_URL);
await page.goto(API_URL,{ waitUntil: 'networkidle' });

// Step 6 — Validate Access Denied
// - Assert text Access Denied is visible
await expect(page.locator('text=Access Denied')).toBeVisible();

// - Assert text You are not authorized to view this booking is visible
await expect(page.getByText('You are not authorized to view this booking.')).toBeVisible();


});


