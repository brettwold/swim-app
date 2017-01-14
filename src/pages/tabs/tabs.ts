import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { EntriesPage } from '../entries/entries';
import { ContactPage } from '../contact/contact';
import { MeetsPage } from '../meets/meets';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = MeetsPage;
  tab3Root: any = EntriesPage;
  tab4Root: any = ContactPage;

  constructor() {

  }
}
