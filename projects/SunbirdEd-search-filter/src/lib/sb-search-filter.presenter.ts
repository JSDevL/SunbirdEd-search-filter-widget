import {OnDestroy, OnInit} from '@angular/core';

export interface SbSearchFilterPresenter extends OnInit, OnDestroy {
  onFormConfigLoaded(config: any);
  onForm
}
