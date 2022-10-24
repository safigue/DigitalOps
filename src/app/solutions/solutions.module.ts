import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//Modules
import { CoreModule } from '../core/core.module';
import { SolutionsRoutingModule } from './solutions-routing.module';
import { SharedModule } from '../shared/shared.module';


//Components
import { SolutionsComponent } from './pages/solutions/solutions.component';
import { SearchComponent } from './components/search/search.component';
import { SolutionListingComponent } from './components/solution-listing/solution-listing.component';
import { SolutionDetailsComponent } from './components/solution-details/solution-details.component';
import { SolutionCardComponent } from './components/solution-card/solution-card.component';
import { NgxTextOverflowClampModule } from "ngx-text-overflow-clamp";

@NgModule({
  declarations: [SolutionsComponent, SearchComponent, SolutionListingComponent, SolutionDetailsComponent, SolutionCardComponent],
  imports: [
    CommonModule,
    SolutionsRoutingModule,
    SharedModule,
    RouterModule,
    CoreModule,
    FormsModule,
    NgxTextOverflowClampModule
  ]
})
export class SolutionsModule { }
