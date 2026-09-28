import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main style="font: 16px/1.4 system-ui; max-width: 480px; margin: 40px auto;">
      <h1>Contact</h1>
      <form [formGroup]="form" (ngSubmit)="submit()" style="display: grid; gap: 12px;">
        <input formControlName="name"     placeholder="Name" />
        <input formControlName="email"    placeholder="Email" type="email" />
        <textarea formControlName="message" placeholder="Message" style="min-height: 100px;"></textarea>
        <input type="text" formControlName="_gotcha" tabindex="-1" autocomplete="off"
               style="position:absolute; left: -9999px;" aria-hidden="true" />
        <button type="submit" style="background: #7c3aed; color: #fff; border: 0; padding: 8px 10px;">Send</button>
        <p>{{ status() }}</p>
      </form>
    </main>
  `,
})
export class ContactComponent {
  private fb   = inject(FormBuilder);
  private http = inject(HttpClient);

  form = this.fb.group({
    name:     ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    message:  ['', Validators.required],
    _gotcha:  [''],
  });
  status = signal('');

  submit() {
    if (this.form.invalid) return;
    this.status.set('Sending…');
    this.http.post(`https://api.usesmartform.com/api/v1/f/${environment.smartformFormId}`, this.form.value, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    }).subscribe({
      next: (b: any) => this.status.set(`Sent! submission_id=${b.submission_id} intent=${b.intent}`),
      error: (e: any) => this.status.set(`Error: ${e.message}`),
    });
  }
}
