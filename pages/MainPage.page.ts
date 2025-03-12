import { Page } from '@playwright/test';
import { Consents } from '../components/consents.component';
import { TopMenu } from '../components/top-menu.component';

export class MainPage {
    readonly consentsComponent: Consents;
    readonly topMenu: TopMenu;

    constructor(private page: Page) {
        this.consentsComponent = new Consents(this.page);
        this.topMenu = new TopMenu(this.page);
    }
}