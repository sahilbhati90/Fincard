import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { TransferService } from '../../core/services/transfer.service';
import { ToastService } from '../../core/services/toast.service';
import { Card } from '../../shared/components/card/card';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule, Card, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transfer.html',
  styleUrl: './transfer.scss',
})
export class TransferPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly accountService = inject(AccountService);
  private readonly transferService = inject(TransferService);
  private readonly toast = inject(ToastService);

  protected readonly accounts = this.accountService.accounts;
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    fromAccountId: ['', Validators.required],
    toAccountId: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    note: [''],
  });

  ngOnInit(): void {
    this.accountService.loadAccounts().subscribe();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.value.fromAccountId === this.form.value.toAccountId) {
      this.toast.show('Source and destination accounts must be different.', 'warning');
      return;
    }

    const formValue = this.form.getRawValue();
    const senderAccount = this.accounts().find((account) => account.id === formValue.fromAccountId);
    const recipientAccount = this.accounts().find((account) => account.id === formValue.toAccountId);

    if (!senderAccount || !recipientAccount) {
      this.toast.show('Please choose valid accounts.', 'warning');
      return;
    }

    if (formValue.amount > senderAccount.balance) {
      this.toast.show('Insufficient balance in source account.', 'warning');
      return;
    }

    this.submitting.set(true);
    this.transferService
        .create({
          senderItemId: senderAccount.itemId,
          senderAccountId: senderAccount.id,
          recipientAccountId: recipientAccount.id,
          amount: formValue.amount,
          note: formValue.note,
        })
        .pipe(finalize(() => this.submitting.set(false)))
        .subscribe({
          next: () => {
            this.accountService.applyTransfer(senderAccount.id, recipientAccount.id, formValue.amount);
            this.toast.show('Transfer submitted successfully.', 'success');
            this.form.reset({ fromAccountId: '', toAccountId: '', amount: 0, note: '' });
          },
          error: (error: HttpErrorResponse) => {
            const message = error.error?.error || 'Transfer could not be completed.';
            this.toast.show(message, 'danger');
          },
        });
  }
}
