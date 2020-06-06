import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostListsComponent } from './posts/post-lists/post-lists.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './posts/auth/login/login.component';
import { SignupComponent } from './posts/auth/signup/signup.component';
import { AuthGuard } from './posts/auth/auth.guard';

const routes: Routes = [
  { path: '', component: PostListsComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {

}
