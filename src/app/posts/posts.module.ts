import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListsComponent } from './post-lists/post-lists.component';
import { AngularMaterialModule } from '../angular-material';

@NgModule({
  declarations: [
    PostCreateComponent,
    PostListsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PostsModule {}
