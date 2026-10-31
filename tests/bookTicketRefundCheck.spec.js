import test, { expect } from "@playwright/test";

/******************************  Variables  ************************************************/

// const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const username = "veyitih946@diarshop.com";
const password = "Rahul@123_FAILURETEST";
let testEventTitle= '';
const seatsCount='50';
const price= '100';
const fuilName = `Test Name ${Date.now()}`;
const email = `TestEmail${Date.now()}@xyz.com `;
const phone = '9789879879';
const dateTime = '2026-11-03T16:42';
let ticketCount = 1;
let seatsAfterBooking =0;
let seatsBeforeBooking =0;

/******************************  Funcions  ************************************************/

// --------------- Login via UI ---------------
async function loginAndGoToBooking(page,username, password){
    // await page.goto(BASE_URL+'/login');
    console.log('process.env.BASE_URL=  '+process.env.BASE_URL);
    await page.goto('/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
  
}

// --------------- Book Ticket for 1st event  ---------------
async function bookTicketAndVerify(page,ticketCount){

await page.getByTestId('nav-events').click(); // Goto event list page
const eventCards = page.locator('article#event-card');
await eventCards.first().waitFor();
const firstCard = eventCards.first(); // get first card
await expect(firstCard).toBeVisible();
testEventTitle = await firstCard.getByRole('link').first().innerText();  // get first card event title
console.log('Event Title is '+testEventTitle);


// If sold out then clear bookings
if(await firstCard.getByTestId('book-now-btn').textContent()==='Sold Out')
{
  await page.locator('#nav-bookings').click(); // goto mybookings
  page.on('dialog',dialog=> dialog.accept()); // popup dialog click ok
  await page.getByRole('button',{name : 'Clear all bookings'}).click();  // click clear all
  // await page.waitForEvent('load');
  await page.waitForLoadState('load');
  await page.pause();
}

/* Start booking */
await page.getByTestId('nav-events').click(); // Goto event list page
await page.reload();
await page.waitForLoadState('load');
await firstCard.getByTestId('book-now-btn').click(); // Click book now in the event card
expect(await page.locator('#ticket-count').textContent()).toEqual('1'); // default quantity check
console.log('ticketCount ' + ticketCount);

for(let i=1; i<= ticketCount-1 ; i++){   // add ticket quantity 
  await page.locator('button:has-text("+")').click();
}

console.log(await page.locator('#ticket-count').textContent() + ' Tickets were added ');

/*  Fill booking form*/
await page.getByPlaceholder('Your full name').fill(fuilName) //fill form fields
await page.getByTestId('customer-email').fill(email);
await page.getByPlaceholder('+91 98765 43210').fill(phone);
await page.getByRole('button',{name:'Confirm Booking'}).click(); //submit

/* Verify booking confirmation */
await expect(page.getByRole('heading',{name:'Booking Confirmed! 🎉'})).toBeVisible();
await expect(await page.locator('.booking-ref')).toBeVisible();    
const bookingRef = (await page.locator('.booking-ref').textContent()).trim(); //Fetch Booking ref 
console.log('Booking ref is '+bookingRef);

/* Verify in My Bookings */
await page.getByRole('button',{name : 'View My Bookings'}).click(); // Goto booking list
const bookingCards = await page.getByTestId('booking-card');
await bookingCards.first().waitFor();
console.log('currentURL is '+ await page.url());
// await expect(page).toHaveURL(BASE_URL+'/bookings');
 await expect(page).toHaveURL('/bookings');
await expect(bookingCards.first()).toBeVisible(); //- Assert the first booking card is visible
await expect(bookingCards.filter({hasText:bookingRef})).toBeVisible(); // Check booking card of same BookingRef is visible
console.log('Booking ref : '+bookingRef+'  in bookings list ');
await bookingCards.filter({hasText:bookingRef}).getByRole('button',{name:'View Details'}).click(); // view details click 
await page.getByText(bookingRef).first().waitFor();
await expect(await page.getByText('Booking Information')).toBeVisible();

/* Validate booking ref */

// Read booking ref from page
const bookingRefInBookingDetails = await page.locator('div.flex span.font-mono').innerText();

// Read event title from h1
const testEventTitleInBookingDetails = await page.locator('h1').innerText();

console.log('Booking ref : '+bookingRefInBookingDetails+ ' and Event title : '+testEventTitleInBookingDetails+'  in bookings details ');

// Assert validation : "first character of booking ref equals first character of event title"
expect(bookingRefInBookingDetails.charAt(0)).toEqual(testEventTitleInBookingDetails.charAt(0));

/* Check refund eligibility */
await page.getByRole('button',{name:'Check eligibility for refund?'}).click();  // Click check eligibility
//- Assert: spinner element is immediately visible
await expect(page.locator('#refund-spinner')).toBeVisible();
await expect(page.getByTestId('refund-spinner')).toHaveText('Checking your refund eligibility…');
//- Assert: spinner is no longer visible within 6 seconds
await expect(page.locator('#refund-spinner')).toBeHidden({timeout:6000});

/*  Validate result */
// - Locate result element by id #refund-result
// - Assert it is visible
await expect(page.getByTestId('refund-result')).toBeVisible();

if(ticketCount === 1){
  // - Assert it contains text Eligible for refund
  // - Assert it contains text Single-ticket bookings qualify for a full refund
    await expect(page.getByTestId('refund-result')).toContainText('Eligible for refund.');  // 1 ticket message for refund
    await expect(page.getByTestId('refund-result')).toContainText('Single-ticket bookings qualify for a full refund'); 
    
  }
else {
  // - Assert result contains Not eligible for refund
  // - Assert result contains Group bookings (3 tickets) are non-refundable  
    await expect(page.getByTestId('refund-result')).toContainText('Not eligible for refund.');  // 3 ticket message for refund
    await expect(page.getByTestId('refund-result')).toContainText('Group bookings (3 tickets) are non-refundable');  // 3 ticket message for refund    
  }  


/*  Tear down - cancel booking */
await page.getByTestId('nav-bookings').click(); // Goto booking list
await bookingCards.first().waitFor();
await expect(bookingCards.first()).toBeVisible(); //- Assert the first booking card is visible
await expect(bookingCards.filter({hasText:bookingRef})).toBeVisible(); // Check booking card of same BookingRef is visible
console.log('Booking ref : '+bookingRef+'  in bookings list ');
await bookingCards.filter({hasText:bookingRef}).getByRole('button',{name:'Cancel Booking'}).click(); //  cancel click 
await page.getByTestId('confirm-dialog-yes').click(); // confirm click
await expect(page.locator('p').getByText('Booking cancelled successfully')).toBeVisible();
await expect(bookingCards.filter({hasText:bookingRef})).toBeHidden();

}

/******************************  Tests  ************************************************/

test("@Smoke Single ticket booking is eligible for refund", async ({ page }) => { 
 
await loginAndGoToBooking(page,username, password);  // login

// Verify  message for refund of 1 ticket
ticketCount =1;
await bookTicketAndVerify(page,ticketCount);

});

test("Group ticket booking is NOT eligible for refund", async ({ page }) => { 

await loginAndGoToBooking(page,username, password);  // login

// Verify  message for refund of 3 ticket
ticketCount =3;
await bookTicketAndVerify(page,ticketCount);


});

