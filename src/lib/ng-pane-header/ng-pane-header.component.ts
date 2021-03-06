/*********************************************************************************************
 *
 * angular-pane-manager - a port of ng-pane-manager to Angular 2+ (ng-pane-header.component.ts)
 * Copyright (C) 2019 Opus Logica
 *
 * angular-pane-manager is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * angular-pane-manager is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with angular-pane-manager.  If not, see <https://www.gnu.org/licenses/>.
 *
 ********************************************************************************************/

import {Component, ElementRef} from '@angular/core';

import {ClosablePaneComponent} from '../closable';
import {PaneHeaderMode, PaneHeaderStyle} from '../pane-template';

/**
 * A non-tabbed pane header.
 */
@Component({
    selector: 'lib-ng-pane-header',
    template: `
    <ng-container *ngIf="style">
        <ng-container *ngIf="style.icon | async as icon">
            <img class="lib-ng-pane-header-icon" [src]="icon">
        </ng-container>
        <span class="lib-ng-pane-header-title">{{style.title | async}}</span>
        <ng-container *ngIf="style.closable">
            <div class="lib-ng-pane-header-spacer"></div>
            <button class="lib-ng-pane-header-close"
                    (mousedown)="$event.stopPropagation()"
                    (touchstart)="$event.stopPropagation()"
                    (click)="close()"></button>
        </ng-container>
    </ng-container>`,
})
export class NgPaneHeaderComponent<X> extends ClosablePaneComponent<X, PaneHeaderMode.Visible> {
    /** The header style information for this header */
    public style!: PaneHeaderStyle<PaneHeaderMode.Visible>;

    /**
     * Construct a new pane header.
     * @param el injected for use in computing drag-and-drop hit targets
     */
    public constructor(public readonly el: ElementRef<HTMLElement>) { super(); }
}
