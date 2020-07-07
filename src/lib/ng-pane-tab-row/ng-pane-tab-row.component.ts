/**********************************************************************************************
 *
 * angular-pane-manager - a port of ng-pane-manager to Angular 2+ (ng-pane-tab-row.component.ts)
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
 *********************************************************************************************/

import {Component, ElementRef, HostListener, Input, ViewChild, ViewRef} from '@angular/core';

import {DraggablePaneComponent} from '../drag-n-drop';
import {LayoutNodeFactory} from '../layout-node-factory';
import {NgPaneRendererDirective} from '../ng-pane-renderer.directive';
import {LayoutType, PaneLayout} from '../pane-layout';

@Component({
    selector: 'lib-ng-pane-tab-row',
    template: '<ng-container libNgPaneRenderer></ng-container>',
    styleUrls: ['./ng-pane-tab-row.component.scss'],
})
export class NgPaneTabRowComponent extends DraggablePaneComponent {
    @ViewChild(NgPaneRendererDirective, {static: true})
    private readonly renderer!: NgPaneRendererDirective;

    private _layout: PaneLayout|undefined;
    @Input() factory!: LayoutNodeFactory;

    @Input()
    set layout(val: PaneLayout|undefined) {
        if (this._layout === val) return;

        this._layout = val;

        const oldViews: ViewRef[] = [];
        while (true) {
            const view = this.renderer.viewContainer.detach();
            if (view === null) break;
            oldViews.push(view);
        }

        if (this._layout !== undefined) {
            const layout = this._layout;

            switch (layout.type) {
            case LayoutType.Leaf:
            case LayoutType.Horiz:
            case LayoutType.Vert:
                if (this.childId !== undefined)
                    this.factory.placeTab(this.renderer.viewContainer, this.childId);
                break;
            case LayoutType.Tabbed:
                for (let index = 0; index < layout.children.length; ++index)
                    this.factory.placeTab(this.renderer.viewContainer, {branch: layout, index});
                break;
            }
        }

        oldViews.forEach(e => e.destroy());
    }

    get layout(): PaneLayout|undefined { return this._layout; }

    constructor(public el: ElementRef<HTMLElement>) { super(); }

    @HostListener('mousedown', ['$event'])
    protected onMouseDown(evt: MouseEvent) {
        super.onMouseDown(evt);
    }
}
