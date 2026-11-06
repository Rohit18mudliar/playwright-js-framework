export function generatePhoneNumber() {
  const firstDigit = Math.floor(Math.random() * 4) + 6; // random digit 6-9
  let remaining = "";
  for (let i = 0; i < 9; i++) {
    remaining += Math.floor(Math.random() * 10); // random digit 0-9
  }
  return firstDigit + remaining;
}
console.log(generatePhoneNumber()); // eg. 7218366838


export function getRandomFutureDateTimeFormatted(  minDaysAhead = 1,  maxDaysAhead = 30,) {
  const daysAhead = Math.floor(Math.random() * (maxDaysAhead - minDaysAhead + 1)) + minDaysAhead;
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  futureDate.setHours(Math.floor(Math.random() * 24));
  futureDate.setMinutes(Math.floor(Math.random() * 60));
  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, "0");
  const day = String(futureDate.getDate()).padStart(2, "0");
  const hours = String(futureDate.getHours()).padStart(2, "0");
  const minutes = String(futureDate.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
console.log(getRandomFutureDateTimeFormatted());  //eg. 2026-11-22T22:19


function futureDateValue() {
  const date = new Date();
  date.setDate(date.getDate() + 7); // 7 days in the future
  return date.toISOString().slice(0, 16); // Formats as YYYY-MM-DDTHH:mm for datetime-local inputs
}
console.log(futureDateValue()); //eg. 2026-11-12T06:43
