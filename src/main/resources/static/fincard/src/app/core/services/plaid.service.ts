import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

interface LinkTokenResponse {
  link_token: string;
}

interface ExchangeTokenResponse {
  access_token: string;
  item_id: string;
  institution_name: string;
  message: string;
}

interface PlaidLinkSuccessMetadata {
  institution?: {
    name?: string;
  };
}

interface PlaidLinkHandler {
  open(): void;
  exit(): void;
}

interface PlaidLinkOptions {
  token: string;
  onSuccess(publicToken: string, metadata: PlaidLinkSuccessMetadata): void;
  onExit(error: unknown): void;
}

declare global {
  interface Window {
    Plaid?: {
      create(options: PlaidLinkOptions): PlaidLinkHandler;
    };
  }
}

@Injectable({ providedIn: 'root' })
export class PlaidService {
  private readonly http = inject(HttpClient);

  connectBank(): Observable<ExchangeTokenResponse> {
    return this.createLinkToken().pipe(
      switchMap(({ link_token }) => this.openPlaidLink(link_token)),
      switchMap((publicToken) => this.exchangePublicToken(publicToken)),
    );
  }

  private createLinkToken(): Observable<LinkTokenResponse> {
    return this.http.post<LinkTokenResponse>('/api/plaid/create-link-token', {});
  }

  private exchangePublicToken(publicToken: string): Observable<ExchangeTokenResponse> {
    return this.http.post<ExchangeTokenResponse>('/api/plaid/exchange-public-token', {
      public_token: publicToken,
    });
  }

  private openPlaidLink(linkToken: string): Observable<string> {
    return new Observable<string>((observer) => {
      if (!window.Plaid) {
        observer.error(new Error('Plaid Link script is not loaded.'));
        return;
      }

      const handler = window.Plaid.create({
        token: linkToken,
        onSuccess: (publicToken) => {
          observer.next(publicToken);
          observer.complete();
        },
        onExit: (error) => {
          if (error) {
            observer.error(error);
          } else {
            observer.complete();
          }
        },
      });

      handler.open();

      return () => handler.exit();
    });
  }
}
