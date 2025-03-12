import { test, expect } from '@playwright/test';
import { MainPage } from '../pages/MainPage.page';
import { Shop } from '../pages/Shop.page';
import { ProductDetails } from '../pages/ProductDetails.page';
import { CartNCheckout } from '../pages/CartnCheckout.page';
import { polishData } from '../test-data/polish_test.data';
import { englishData } from '../test-data/english_test.data';

const testConfigs = [polishData, englishData];
for (const config of testConfigs) {

  test.describe(`Shop Tests in ${config.language}`, () => {

    test.beforeEach(async ({ page }) => {
      await page.goto(config.url);
      const mainPage = new MainPage(page);
      await mainPage.consentsComponent.AcceptCookies();
      await mainPage.consentsComponent.AcceptAgeConfirmation();
      await mainPage.topMenu.ClickMenuByName(config.tabName);
    })

    test(`Add item to cart`, async ({ page }) => {
      //Arrange
      const expectedBasketItemsCount = "1";
      const skuName = config.skuName;
      const productNameToFind = config.productNameToFind;
      const shopPage = new Shop(page);
      const productDetailsPage = new ProductDetails(page);
      const cartNCheckoutPage = new CartNCheckout(page);

      // Act
      await shopPage.ClickProductBySKU(skuName);
      await productDetailsPage.addToCartBtn.click();
      await productDetailsPage.topMenu.MiniCartCheckout();

      // Assert
      await cartNCheckoutPage.WaitForCheckoutButton();
      expect(await productDetailsPage.topMenu.ItemsInBasketCount()).toEqual(expectedBasketItemsCount);
      expect(await cartNCheckoutPage.CheckIfItemIsInCart(productNameToFind)).toBeTruthy();

    });

    test(`Removing cart item test`, async ({ page }) => {
      //Arrange
      const skuName = config.skuName;
      const shopPage = new Shop(page);
      const productDetailsPage = new ProductDetails(page);
      const cartNCheckoutPage = new CartNCheckout(page);

      // Act
      await shopPage.ClickProductBySKU(skuName);
      await productDetailsPage.addToCartBtn.click();
      await productDetailsPage.topMenu.MiniCartCheckout();
      await cartNCheckoutPage.WaitForCheckoutButton();
      await cartNCheckoutPage.RemoveNthItem();

      //Assert
      var elementsToCheck = await cartNCheckoutPage.emptyCartContainer.all();
      for (let element of elementsToCheck)
        expect(element).toBeVisible();
    });


    test(`Valid all links and pictures`, async ({ page }) => {
      //Arrange
      const skuName = config.skuName;
      const shopPage = new Shop(page);
      const productDetailsPage = new ProductDetails(page);

      // Act
      await shopPage.ClickProductBySKU(skuName);
      await productDetailsPage.addToCartBtn.waitFor({ state: 'visible' });


      //Assert
      await test.step('Checking all links respnse', async () => {
        const brokenLinks: string[] = [];
        const originUrl = new URL(await page.url()).origin;
        const allLinks = await productDetailsPage.allLinksLocator.evaluateAll(els => els.map(el => el.getAttribute("href")));

        for (let item of allLinks) {
          const itemUrl = originUrl + item;
          if (itemUrl) {
            const response = await page.request.get(itemUrl);
            const status = response.status();
            //console.log("Sprawdzany link:" + itemUrl + " Status:" + status);
            if (status != 200) {
              brokenLinks.push(itemUrl);
            }
          }
        }
        expect.soft(brokenLinks.length).toBe(0);
      });

      await test.step('Checking all product details images response', async () => {
        const brokenLinks: string[] = [];
        const productDetailsImages = await productDetailsPage.productDetailsAllImg.evaluateAll(els => els.map(el => el.getAttribute("src")));

        for (let item of productDetailsImages) {
          const itemUrl = item;
          if (itemUrl) {
            const response = await page.request.get(itemUrl);
            const status = response.status();
            //console.log("Sprawdzany link:" + itemUrl + " Status:" + status);
            if (status != 200) {
              brokenLinks.push(itemUrl);
            }
          }
        }
        expect.soft(brokenLinks.length).toBe(0);
      });

      await test.step('Checking all skus images response', async () => {
        const brokenLinks: string[] = [];
        const productTeaserImages = await productDetailsPage.skusAllImg.evaluateAll(els => els.map(el => el.getAttribute("src")));

        for (let item of productTeaserImages) {
          const itemUrl = item;
          if (itemUrl) {
            const response = await page.request.get(itemUrl);
            const status = response.status();
            //console.log("Sprawdzany link:" + itemUrl + " Status:" + status);
            if (status != 200) {
              brokenLinks.push(itemUrl);
            }
          }
        }

        expect.soft(brokenLinks.length).toBe(0);
      });

      await test.step('Checking all article images response', async () => {
        const brokenLinks: string[] = [];
        const originUrl = new URL(await page.url()).origin;

        const productArticleImages = await productDetailsPage.articleAllImg.evaluateAll(els => els.map(el => el.getAttribute("src")))
        for (let item of productArticleImages) {
          const itemUrl = originUrl + item;
          if (itemUrl) {
            const response = await page.request.get(itemUrl);
            const status = response.status();
            //console.log("Sprawdzany link:" + itemUrl + " Status:" + status);
            if (status != 200) {
              brokenLinks.push(itemUrl);
            }
          }
        }
        expect.soft(brokenLinks.length).toBe(0);
      });

      await test.step('Checking all images natural width', async () => {
        const allImages = await productDetailsPage.allImg.all();

        for (let i of allImages) {
          await i.scrollIntoViewIfNeeded();
          await expect(i).not.toHaveJSProperty('naturalWidth', 0);
        }
      });
    });

  });
};
