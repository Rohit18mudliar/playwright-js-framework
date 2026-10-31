import { expect } from "@playwright/test";

export const BASE_URL = 'https://eventhub.rahulshettyacademy.com';


export async function login(page,username, password){
    await page.goto(BASE_URL+'/login');
    await page.getByRole('textbox', { name: 'Email' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
  
}

