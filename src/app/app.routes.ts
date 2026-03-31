import { Routes } from '@angular/router';
import { Body } from './body/body';
import { Characters } from './characters/characters';
import { Locations } from './locations/locations';
import { About } from './about/about';
import { TierList } from './tier-list/tier-list';

export const routes: Routes = [
     { 'path': '', 'component': Body },
     {'path': 'characters', 'component': Characters },
     {'path': 'locations', 'component': Locations },
     {'path': 'about', 'component': About },
     {'path': 'tierlist', 'component': TierList},
];
