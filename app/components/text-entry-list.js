import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { capitalize } from "@ember/string";

export default class TextEntryListComponent extends Component {
  @tracked sorts = [];

  @tracked columns = [];

  @tracked rows = [];

  constructor(...args) {
    super(...args);
    this._buildColumns(this.args.text);
    this._buildRows(this.args.text);
  }

  _buildColumns(text) {
    this.columns.pushObject({
      valuePath: "attestedName",
      name: "Attested Name",
      cellComponent: "table-edit"
    });
    text.entryProperties.forEach(propObj => {
      const name = propObj.inputLabel || capitalize(propObj.name);
      const valuePath = `eProp${propObj.name}`;
      const cellComponent = propObj.readOnly ? "table-readonly" : "table-edit";
      this.columns.pushObject({ valuePath, name, cellComponent });
    });
    this.columns.pushObject({
      valuePath: "createdOn",
      name: "Created On",
      cellComponent: "table-date"
    });
    text.entrySort.forEach(valuePath => {
      this.sorts.pushObject({ valuePath, isAscending: true });
    });
  }

  _buildRows({ entries }) {
    entries.forEach(entry => {
      const row = { id: entry.id };
      this.columns.forEach(({ valuePath }) => {
        if (valuePath.startsWith("eProp")) {
          row[valuePath] = entry.properties[valuePath.replace(/^eProp/, "")];
        } else {
          row[valuePath] = entry[valuePath];
        }
      });
      this.rows.pushObject(row);
    });
  }
}
