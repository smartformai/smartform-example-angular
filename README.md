# Angular contact form — Formspree alternative with AI spam filtering

Contact form for an Angular 17 app, posting JSON to SmartForm AI.

## Setup

1. Get a form ID at https://usesmartform.com/dashboard.
2. Clone, install, configure, run:
   ```bash
   git clone https://github.com/yanghuai123456/smartform-example-angular.git
   cd smartform-example-angular
   npm install
   # edit src/environments/environment.ts → smartformFormId
   npm start
   ```
3. Open http://localhost:4200, submit, check your dashboard.

## The component

`src/app/contact/contact.component.ts` is a standalone Angular component with a reactive form
that POSTs JSON to the SmartForm endpoint.

```ts
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({ selector: 'app-contact', standalone: true, imports: [ReactiveFormsModule], template: `
  <form [formGroup]="form" (ngSubmit)="submit()">
    <input formControlName="name"  placeholder="Name" />
    <input formControlName="email" placeholder="Email" type="email" />
    <textarea formControlName="message" placeholder="Message"></textarea>
    <input type="text" formControlName="_gotcha" tabindex="-1" autocomplete="off"
           style="position:absolute;left:-9999px" aria-hidden="true" />
    <button type="submit">Send</button>
    <p>{{ status() }}</p>
  </form>
` })
export class ContactComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  form = this.fb.group({ name: ['', Validators.required], email: ['', [Validators.required, Validators.email]], message: ['', Validators.required], _gotcha: [''] });
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
```

## How the API works

- `POST {endpoint}/api/v1/f/{form_id}` — JSON or form-data, no API key.
- Response: `{ success, message, submission_id, is_spam, intent, next_url }`.

For the full contract, see https://usesmartform.com/docs.

## Deploy

```bash
npm run build         # static output in ./dist
# Push ./dist to Netlify / Cloudflare Pages / Firebase Hosting / GitHub Pages
```
## Related examples
[Vite + React contact form](https://github.com/yanghuai123456/smartform-example-vite-react) | [Vite + Vue 3 contact form](https://github.com/yanghuai123456/smartform-example-vite-vue) | [Docusaurus contact form](https://github.com/yanghuai123456/smartform-example-docusaurus)


## FAQ

### Why use this instead of Formspree?

Both SmartForm and Formspree let you POST a plain HTML form to a hosted
endpoint with no backend. SmartForm adds an AI spam filter (not just
honeypots), AI intent classification (`sales` / `support` / `inquiry`)
and high-value lead detection, with a free tier that includes the spam
filter. Formspree charges per submission; SmartForm's spam filter is
free on every plan.

### Is there a free tier?

Yes. AI spam filtering is enabled by default on every plan. AI intent
classification and high-value lead detection require a paid plan (Pro
or Business) — the dashboard enforces this and returns HTTP 402 if
you try to enable them on a free workspace.

### Do I need an API key?

No. The form posts directly to a public endpoint using only an 8-char
form ID, which is non-enumerable. The example also includes a hidden
`_gotcha` honeypot field so naive bots cannot submit.

### Does it use Angular reactive forms?
Yes. The example uses `FormBuilder` with a typed `FormGroup` and shows inline submission status from the API response.

## Related examples
[Vite + React contact form](https://github.com/yanghuai123456/smartform-example-vite-react) | [Vite + Vue 3 contact form](https://github.com/yanghuai123456/smartform-example-vite-vue) | [Docusaurus contact form](https://github.com/yanghuai123456/smartform-example-docusaurus)


## License

MIT.

