import { Locator, Page } from "@playwright/test";

export class Consents {
    ageConfirmBtn: Locator;
    cookiesConfirmBtn: Locator;

    constructor(private page: Page) {
        this.ageConfirmBtn = this.page.locator("div.ageconfirmation__confirmBtn");
        this.cookiesConfirmBtn = this.page.locator("button#onetrust-accept-btn-handler");
    }

    async AcceptAgeConfirmation(): Promise<void> {
        await this.ageConfirmBtn.click();
    }

    async AcceptCookies(): Promise<void> {
        await this.cookiesConfirmBtn.click();
    }
}