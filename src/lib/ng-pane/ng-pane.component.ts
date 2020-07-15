/**************************************************************************************
 *
 * angular-pane-manager - a port of ng-pane-manager to Angular 2+ (ng-pane.component.ts)
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
 *************************************************************************************/

import {Component, ComponentRef, HostBinding, ViewChild} from '@angular/core';

import {NgPaneLeafComponent} from '../ng-pane-leaf/ng-pane-leaf.component';
import {NgPaneRendererDirective} from '../ng-pane-renderer.directive';
import {NgPaneSplitComponent} from '../ng-pane-split/ng-pane-split.component';
import {NgPaneTabbedComponent} from '../ng-pane-tabbed/ng-pane-tabbed.component';
import {PaneHeader, PaneHeaderType} from '../pane-factory';
import {ChildLayoutId} from '../pane-layout/module';

/**
 * The outer container for a pane, containing the pane contents and a header.
 */
@Component({
    selector: 'lib-ng-pane',
    template: '<ng-container libNgPaneRenderer></ng-container>',
    styleUrls: ['./ng-pane.component.scss'],
})
export class NgPaneComponent {
    /** Provides a view container to render into */
    @ViewChild(NgPaneRendererDirective, {static: true})
    public readonly renderer!: NgPaneRendererDirective;

    /** The ratio to use if this is a child of a split branch */
    @HostBinding('style.flex-grow') public ratio: number|undefined;
    /** The pane visibility if this is a child of a tabbed branch */
    @HostBinding('class.lib-ng-pane-hidden') public hidden: boolean = false;

    /** The ID of the pane associated with this component */
    public childId!: ChildLayoutId;
    /** The header for this pane */
    public header: PaneHeader = {type: PaneHeaderType.None};
    /** The content of this pane */
    public content: ComponentRef<NgPaneSplitComponent|NgPaneLeafComponent|NgPaneTabbedComponent>|
        undefined;
}