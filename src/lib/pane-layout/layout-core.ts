/********************************************************************************
 *
 * angular-pane-manager - a port of ng-pane-manager to Angular 2+ (layout-core.ts)
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
 *******************************************************************************/

import {BranchLayout} from './branch-layout';
import {ChildLayoutBase, LayoutBase, LayoutGravity, LayoutType} from './layout-base';
import {ChildLayoutId} from './layout-util';

/** A layout node of any kind */
export type PaneLayout<X> = RootLayout<X>|BranchLayout<X>|LeafLayout<X>;
/** A layout node containing children */
export type StemLayout<X> = RootLayout<X>|BranchLayout<X>;
/** A non-root layout node */
export type ChildLayout<X> = BranchLayout<X>|LeafLayout<X>;

/**
 * A root layout node, which contains one child and cannot be contained by any
 * other node type.
 *
 * This node is used to ensure that any other nodes can have a valid child ID.
 */
export class RootLayout<X> extends LayoutBase<X> {
    /** The type of the layout.  Used for type checking. */
    public readonly type: LayoutType.Root = LayoutType.Root;

    /**
     * Construct a new root layout node.
     * @param layout the child layout
     */
    public constructor(public readonly layout: ChildLayout<X>|undefined) { super(); }

    /**
     * If this represents an empty container, place the given child into it.
     * @param child the child to place
     */
    protected tryEmplaceEmpty(child: ChildLayout<X>): PaneLayout<X>|undefined {
        if (this.layout === undefined) { return new RootLayout(child); }

        return undefined;
    }

    /**
     * Return the ID of this node's child.
     */
    public childId(): ChildLayoutId<X> { return {stem: this, index: 0}; }

    /**
     * Does nothing, but is provided for completeness.  Adding this definition
     * ensures `.intoRoot()` exists for any `PaneLayout`.
     */
    public intoRoot(): RootLayout<X> { return this; }

    /**
     * Find a child matching the given predicate.
     * @param pred predicate to match elements against
     */
    public findChild(pred: (c: ChildLayout<X>) => boolean): ChildLayoutId<X>|undefined {
        if (this.layout === undefined) { return undefined; }

        if (pred(this.layout)) { return this.childId(); }

        return this.layout.findChild(pred);
    }

    /**
     * Remove the child of this node.
     * @param index the index of the child to remove.  Must be `undefined` or 0
     */
    public withoutChild(index: number|undefined): {
        /** The resulting layout */
        layout: RootLayout<X>;
        /** The removed child */
        removed: ChildLayout<X>;
    } {
        if (this.layout === undefined) {
            throw new Error('cannot remove child of empty root layout');
        }

        if (index !== undefined && index !== 0) {
            throw new Error(`invalid root child index ${index} - must be 0`);
        }

        return {layout: new RootLayout(undefined), removed: this.layout};
    }

    /**
     * Find any occurrences (by reference) of a node in the current tree and
     * replace them with another node.
     * @param find the node to search for
     * @param replace the node to replace the search node with
     */
    public transposeDeep(find: PaneLayout<X>, replace: PaneLayout<X>): PaneLayout<X>|undefined {
        if (Object.is(this, find)) { return replace; }

        const newLayout = this.layout !== undefined ? this.layout.transposeDeep(find, replace)
                                                    : undefined;

        if (newLayout === undefined) { return undefined; }

        if (newLayout.type === LayoutType.Root) {
            throw new Error('invalid transposition - child attempted to become root');
        }

        return new RootLayout(newLayout);
    }

    /**
     * Recursively simplify this node tree.
     */
    public simplifyDeep(): PaneLayout<X>|undefined {
        const newLayout = this.layout !== undefined ? this.layout.simplifyDeep() : undefined;

        if (newLayout === undefined) { return undefined; }

        if (newLayout.type === LayoutType.Root) {
            throw new Error('invalid simplification - child attempted to become root');
        }

        return new RootLayout(newLayout);
    }
}

/**
 * A leaf node, which contains user content but no other nodes.
 */
export class LeafLayout<X> extends ChildLayoutBase<X> {
    /** The type of the layout.  Used for type checking. */
    public readonly type: LayoutType.Leaf = LayoutType.Leaf;

    /**
     * Construct a new leaf node.
     * @param id the unique string identifier for this leaf node
     * @param template the name of the template to render this leaf node with
     * @param gravity the gravity of this leaf node
     * @param group the group of this leaf node
     */
    public constructor(public readonly id: string,
                       public readonly template: string,
                       public readonly extra: X,
                       gravity?: LayoutGravity,
                       group?: string) {
        super(gravity, group);
    }

    /**
     * Returns undefined, since leaves cannot be empty containers.
     * @param child the child to place
     */
    protected tryEmplaceEmpty(_child: ChildLayout<X>): PaneLayout<X>|undefined { return undefined; }

    /**
     * Wrap this leaf node in a root node.
     */
    public intoRoot(): RootLayout<X> { return new RootLayout(this); }

    /**
     * Returns undefined, since leaves have no child IDs.
     * @param pred predicate to match elements against
     */
    public findChild(_pred: (c: ChildLayout<X>) => boolean): ChildLayoutId<X>|undefined {
        return undefined;
    }

    /**
     * Find any occurrences (by reference) of a node in the current tree and
     * replace them with another node.
     * @param find the node to search for
     * @param replace thenode to replace the search node with
     */
    public transposeDeep(find: PaneLayout<X>, replace: PaneLayout<X>): PaneLayout<X>|undefined {
        return Object.is(this, find) ? replace : undefined;
    }

    /**
     * Recursively simplify this node tree.
     */
    public simplifyDeep(): PaneLayout<X>|undefined { return undefined; }
}
