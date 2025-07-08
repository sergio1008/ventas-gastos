import { Component } from '@angular/core';
import { LoadingService } from '../../services/util/loading.service';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ProgressBar } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-bar',
  imports: [ProgressBar, CommonModule],
  templateUrl: './loading-bar.component.html',
  styleUrl: './loading-bar.component.css',
  providers: [MessageService]
})
export class LoadingBarComponent {
  isLoading$: Observable<boolean>;

  constructor(public loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.isLoading$;
  }
}
