import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateTransferPayload {
  senderItemId: string;
  senderAccountId: string;
  recipientAccountId: string;
  recipientEmail?: string;
  amount: number;
  note?: string;
}

export interface CreateTransferResponse {
  success: boolean;
  message: string;
  transferId: number;
  amount: number;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class TransferService {
  private readonly http = inject(HttpClient);

  create(payload: CreateTransferPayload): Observable<CreateTransferResponse> {
    return this.http.post<CreateTransferResponse>('/api/transfers/create', payload);
  }
}
