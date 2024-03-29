/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { MatchResults, RouterHistory } from "@stencil-community/router";
export namespace Components {
    interface AppRoot {
    }
    interface CustomButton {
        "color": 'danger' | 'secondary';
        "disabled": boolean;
        "type": 'button' | 'submit' | 'reset';
    }
    interface CustomInput {
        "placeholder": string;
        "type": string;
        "value": string | number;
    }
    interface ExpenseChart {
        "history": RouterHistory;
    }
    interface ExpenseDetails {
        "history": RouterHistory;
        "match": MatchResults;
    }
    interface ExpenseForm {
        "history": RouterHistory;
        "match": MatchResults;
        "mode": 'create' | 'edit';
    }
    interface ExpenseList {
        "history": RouterHistory;
    }
    interface ExpenseListFilters {
        "handleCategorySelect": (event: Event) => void;
        "handleMonthChange": (event: Event) => void;
        "handleYearChange": (event: Event) => void;
        "selectedCategory": string;
        "selectedMonth": string;
        "selectedYear": string;
    }
    interface ExpensePagination {
        "currentPage": number;
        "totalPages": number;
    }
    interface ModeSwitcher {
    }
    interface NavBar {
        "items": { label: string; url: string }[];
    }
}
declare global {
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLCustomButtonElement extends Components.CustomButton, HTMLStencilElement {
    }
    var HTMLCustomButtonElement: {
        prototype: HTMLCustomButtonElement;
        new (): HTMLCustomButtonElement;
    };
    interface HTMLCustomInputElement extends Components.CustomInput, HTMLStencilElement {
    }
    var HTMLCustomInputElement: {
        prototype: HTMLCustomInputElement;
        new (): HTMLCustomInputElement;
    };
    interface HTMLExpenseChartElement extends Components.ExpenseChart, HTMLStencilElement {
    }
    var HTMLExpenseChartElement: {
        prototype: HTMLExpenseChartElement;
        new (): HTMLExpenseChartElement;
    };
    interface HTMLExpenseDetailsElement extends Components.ExpenseDetails, HTMLStencilElement {
    }
    var HTMLExpenseDetailsElement: {
        prototype: HTMLExpenseDetailsElement;
        new (): HTMLExpenseDetailsElement;
    };
    interface HTMLExpenseFormElement extends Components.ExpenseForm, HTMLStencilElement {
    }
    var HTMLExpenseFormElement: {
        prototype: HTMLExpenseFormElement;
        new (): HTMLExpenseFormElement;
    };
    interface HTMLExpenseListElement extends Components.ExpenseList, HTMLStencilElement {
    }
    var HTMLExpenseListElement: {
        prototype: HTMLExpenseListElement;
        new (): HTMLExpenseListElement;
    };
    interface HTMLExpenseListFiltersElement extends Components.ExpenseListFilters, HTMLStencilElement {
    }
    var HTMLExpenseListFiltersElement: {
        prototype: HTMLExpenseListFiltersElement;
        new (): HTMLExpenseListFiltersElement;
    };
    interface HTMLExpensePaginationElement extends Components.ExpensePagination, HTMLStencilElement {
    }
    var HTMLExpensePaginationElement: {
        prototype: HTMLExpensePaginationElement;
        new (): HTMLExpensePaginationElement;
    };
    interface HTMLModeSwitcherElement extends Components.ModeSwitcher, HTMLStencilElement {
    }
    var HTMLModeSwitcherElement: {
        prototype: HTMLModeSwitcherElement;
        new (): HTMLModeSwitcherElement;
    };
    interface HTMLNavBarElement extends Components.NavBar, HTMLStencilElement {
    }
    var HTMLNavBarElement: {
        prototype: HTMLNavBarElement;
        new (): HTMLNavBarElement;
    };
    interface HTMLElementTagNameMap {
        "app-root": HTMLAppRootElement;
        "custom-button": HTMLCustomButtonElement;
        "custom-input": HTMLCustomInputElement;
        "expense-chart": HTMLExpenseChartElement;
        "expense-details": HTMLExpenseDetailsElement;
        "expense-form": HTMLExpenseFormElement;
        "expense-list": HTMLExpenseListElement;
        "expense-list-filters": HTMLExpenseListFiltersElement;
        "expense-pagination": HTMLExpensePaginationElement;
        "mode-switcher": HTMLModeSwitcherElement;
        "nav-bar": HTMLNavBarElement;
    }
}
declare namespace LocalJSX {
    interface AppRoot {
    }
    interface CustomButton {
        "color"?: 'danger' | 'secondary';
        "disabled"?: boolean;
        "onButtonClick"?: (event: CustomEvent<void>) => void;
        "type"?: 'button' | 'submit' | 'reset';
    }
    interface CustomInput {
        "onInputChange"?: (event: CustomEvent<string>) => void;
        "placeholder"?: string;
        "type"?: string;
        "value"?: string | number;
    }
    interface ExpenseChart {
        "history"?: RouterHistory;
    }
    interface ExpenseDetails {
        "history"?: RouterHistory;
        "match"?: MatchResults;
    }
    interface ExpenseForm {
        "history"?: RouterHistory;
        "match"?: MatchResults;
        "mode"?: 'create' | 'edit';
    }
    interface ExpenseList {
        "history"?: RouterHistory;
    }
    interface ExpenseListFilters {
        "handleCategorySelect"?: (event: Event) => void;
        "handleMonthChange"?: (event: Event) => void;
        "handleYearChange"?: (event: Event) => void;
        "selectedCategory"?: string;
        "selectedMonth"?: string;
        "selectedYear"?: string;
    }
    interface ExpensePagination {
        "currentPage"?: number;
        "onNextPage"?: (event: CustomEvent<void>) => void;
        "onPrevPage"?: (event: CustomEvent<void>) => void;
        "totalPages"?: number;
    }
    interface ModeSwitcher {
    }
    interface NavBar {
        "items"?: { label: string; url: string }[];
    }
    interface IntrinsicElements {
        "app-root": AppRoot;
        "custom-button": CustomButton;
        "custom-input": CustomInput;
        "expense-chart": ExpenseChart;
        "expense-details": ExpenseDetails;
        "expense-form": ExpenseForm;
        "expense-list": ExpenseList;
        "expense-list-filters": ExpenseListFilters;
        "expense-pagination": ExpensePagination;
        "mode-switcher": ModeSwitcher;
        "nav-bar": NavBar;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "custom-button": LocalJSX.CustomButton & JSXBase.HTMLAttributes<HTMLCustomButtonElement>;
            "custom-input": LocalJSX.CustomInput & JSXBase.HTMLAttributes<HTMLCustomInputElement>;
            "expense-chart": LocalJSX.ExpenseChart & JSXBase.HTMLAttributes<HTMLExpenseChartElement>;
            "expense-details": LocalJSX.ExpenseDetails & JSXBase.HTMLAttributes<HTMLExpenseDetailsElement>;
            "expense-form": LocalJSX.ExpenseForm & JSXBase.HTMLAttributes<HTMLExpenseFormElement>;
            "expense-list": LocalJSX.ExpenseList & JSXBase.HTMLAttributes<HTMLExpenseListElement>;
            "expense-list-filters": LocalJSX.ExpenseListFilters & JSXBase.HTMLAttributes<HTMLExpenseListFiltersElement>;
            "expense-pagination": LocalJSX.ExpensePagination & JSXBase.HTMLAttributes<HTMLExpensePaginationElement>;
            "mode-switcher": LocalJSX.ModeSwitcher & JSXBase.HTMLAttributes<HTMLModeSwitcherElement>;
            "nav-bar": LocalJSX.NavBar & JSXBase.HTMLAttributes<HTMLNavBarElement>;
        }
    }
}
