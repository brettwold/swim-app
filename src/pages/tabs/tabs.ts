import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { EntriesPage } from '../entries/entries';
import { ContactPage } from '../contact/contact';
import { MeetsPage } from '../meets/meets';
import { QualifyingPage } from '../qualifying/qualifying';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = QualifyingPage;
  tab3Root: any = MeetsPage;
  tab4Root: any = EntriesPage;
  tab5Root: any = ContactPage;

  constructor() {

  }
}
