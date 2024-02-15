import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

export interface Form {
  id?: string | null | undefined;
  name?: string | null | undefined;
  title?: string | null | undefined;
  description?: string | null | undefined;
  active?: boolean | null | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private currentGetFormsRequest: Observable<Form[]> | null = null;

  constructor(
    private httpClient: HttpClient,
  ) { }

  getForms(force = false): Observable<Form[]> {
    if (!this.currentGetFormsRequest || force) {
      this.currentGetFormsRequest = this.httpClient.get<Form[]>('/api/v1/forms')
      .pipe(
        shareReplay(undefined, 10 * 1000), // cache for 10 seconds
        tap((forms) => {
          setTimeout(() => {
            this.currentGetFormsRequest = null;
          }, 9 * 1000);
        })
      );
    }
    return this.currentGetFormsRequest;
  }

  createForm(form: Form): Observable<Form> {
    const {
      name,
      title,
      description,
    } = form;

    return this.httpClient.post<Form>('/api/v1/forms', {
      name,
      title,
      description,
    });
  }

  updateForm(id: string, form: Form): Observable<Form> {
    const {
      name,
      title,
      description,
    } = form;

    return this.httpClient.put<Form>(`/api/v1/forms/${id}`, {
      name,
      title,
      description,
    });
  }
}
