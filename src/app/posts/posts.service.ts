import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdate = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
    .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
    .pipe(
      map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      })
    )
    .subscribe(transformedPosts => {
      this.posts = transformedPosts;
      this.postsUpdate.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdate.asObservable();
  }

  // If post id is equal to id that is passed as argument
  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      "http://localhost:3000/api/posts/" + id
      );
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
    .post<{ message: string; postId: string }>(
      "http://localhost:3000/api/posts", post)
    .subscribe(responseData => {
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postsUpdate.next([...this.posts]);
    });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    console.log(post);
    console.log(id);
    // 5ecefa1ef2db1d8cb99fe5c4
    this.http
    .put("http://localhost:3000/api/posts/" + id, post)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdate.next([...this.posts]);
    });
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdate.next([...this.posts]);
    });
  }
}
