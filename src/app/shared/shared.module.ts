import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { RouterModule } from '@angular/router';
import { ExternalLinkDirective } from './directives/external-link/external-link.directive';
import { LoaderComponent } from './components/loader/loader.component';
import { HttpClientModule } from '@angular/common/http';
import { RestApiService } from './services/rest-api/rest-api.service';
import { SharepointService } from './services/sharepoint/sharepoint.service';
import { PageContentService } from './services/page-content/page-content.service';
import { LyncPresenceDirective } from './directives/lync-presence/lync-presence.directive';


@NgModule({
  declarations: [
    ExternalLinkDirective,
    LoaderComponent,
    LyncPresenceDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [
    RestApiService, SharepointService, PageContentService
  ],
  exports: [
    ExternalLinkDirective,
    LoaderComponent,
    LyncPresenceDirective
  ]
})
export class SharedModule { }
