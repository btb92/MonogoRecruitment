import { Locator, Page } from "@playwright/test";

export class TopMenu {
    readonly itemsInBasket: Locator;
    readonly cartCheckoutBtn: Locator;

    constructor(private page: Page) {
        this.itemsInBasket = this.page.locator("li[data-testid='miniCart'] div[class|='IconLabeled-module-label']");
        this.cartCheckoutBtn = this.page.getByTestId("miniCartCheckoutButton");
    }

    async ClickMenuByOrder(elementToClick: string): Promise<void> {
        await this.page.locator(`a[data-testid='headerItem-${elementToClick}']`).click();
        await this.page.mouse.move(0, 0);
    }

    async ClickMenuByName(elementNameToClick: string): Promise<void> {
        await this.page.locator(`//li[contains(@class,'navigation__item')]//a[contains(text(),'${elementNameToClick}')]`).click();
        await this.page.mouse.move(0, 0);
    }

    /**
     * @returns Liczbę elementów w koszyku jako string, dla braku elementu, bądż null'a wartości textContent zwraca pusty string
     */
    async ItemsInBasketCount(): Promise<string> {
        await this.itemsInBasket.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
        if (await this.itemsInBasket.count() > 0) {
            var countLabelValue = await this.itemsInBasket.textContent();
            return countLabelValue ? countLabelValue : "";
        } else {
            return "";
        }
    }

    async MiniCartCheckout(): Promise<void> {
        await this.cartCheckoutBtn.click();
    }
}