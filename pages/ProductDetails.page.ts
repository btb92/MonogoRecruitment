import { Locator, Page } from '@playwright/test';
import { Consents } from '../components/consents.component';
import { TopMenu } from '../components/top-menu.component';

export class ProductDetails {
    readonly consentsComponent: Consents;
    readonly topMenu: TopMenu;
    readonly addToCartBtn: Locator;
    readonly allLinksLocator: Locator;
    readonly productDetailsAllImg: Locator;
    readonly skusAllImg: Locator;
    readonly articleAllImg: Locator;
    readonly allImg: Locator;

    readonly baseLocator = "div.container>div[id|='container']>.aem-Grid";

    constructor(private page: Page) {
        this.consentsComponent = new Consents(this.page);
        this.topMenu = new TopMenu(this.page);
        this.addToCartBtn = this.page.getByTestId("pdpAddToProduct");
        this.allLinksLocator = this.page.locator(`${this.baseLocator} a`);
        this.productDetailsAllImg = this.page.locator(`${this.baseLocator} [data-testid='product-details'] img`);
        this.skusAllImg = this.page.locator(`${this.baseLocator} [data-testid='all_skus'] img`);
        this.articleAllImg = this.page.locator(`${this.baseLocator} .aem-article-square__base img`);
        this.allImg = this.page.locator(`${this.baseLocator} img`);
    }
}