import { makeAutoObservable } from "mobx";

export class ProductsView {
  gridView: boolean = true;
  // rowView: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // set gridViewVal(val: boolean) {
  //   this.gridView = val;
  // }
  // set rowViewVal(val: boolean) {
  //   this.rowView = val;
  // }

  displayGridView() {
    // this.gridViewVal = true;
    // this.rowViewVal = false;

    this.gridView = true;
    // this.rowView = true;
  }

  displayRowView() {
    // this.rowViewVal = true;
    // this.gridViewVal = false;
    this.gridView = false;
    // this.rowView = false;
  }
}
