import { Locator, Page } from '@playwright/test';
import { Consents } from '../components/consents.component';
import { TopMenu } from '../components/top-menu.component';

export class CartNCheckout {
    readonly consentsComponent: Consents;
    readonly topMenu: TopMenu;
    readonly checkoutBtn: Locator;
    readonly allItemsParentDivs: Locator;
    readonly removeItemButtons: Locator;
    readonly confirmDeleteBtn: Locator;
    readonly emptyCartContainer: Locator;

    constructor(private page: Page) {
        this.consentsComponent = new Consents(this.page);
        this.topMenu = new TopMenu(this.page);
        this.checkoutBtn = this.page.getByTestId('loginCheckoutButton');
        this.allItemsParentDivs = this.page.locator("[data-testId='regular-cart-list']>div");
        this.removeItemButtons = this.page.locator("[data-testid='main-section'] [data-testid='cartRemoveButton']");
        this.confirmDeleteBtn = this.page.locator("xpath=//*[contains(@class,'Dialog-module-isShown')]//button[@data-testid='remove-item-submit-button']");
        this.emptyCartContainer = this.page.getByTestId("emptyCartContainer");
    }

    async WaitForCheckoutButton(): Promise<void> {
        await this.checkoutBtn.waitFor({ state: 'visible' });
    }

    async CheckIfItemIsInCart(itemName: string): Promise<boolean> {
        await this.WaitForCheckoutButton();
        var elementsToCheck = await this.allItemsParentDivs.all();
        for (var locator of elementsToCheck) {
            const elementText = await locator.textContent();
            if (elementText && elementText.includes(itemName)) {
                return true;
            }
        }
        return false;
    }

    async RemoveNthItem(itemToRemove: number = 0): Promise<void> {
        await this.WaitForCheckoutButton();
        await this.removeItemButtons.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
        var allRemoveButtonsList = await this.removeItemButtons.all();
        if (allRemoveButtonsList.length == 0)
            return;
        await this.removeItemButtons.nth(itemToRemove).click();
        await this.confirmDeleteBtn.click();
    }
}