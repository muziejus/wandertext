import { describe, it } from "mocha";
import { expect } from "chai";
import { setupApplicationTest } from "ember-mocha";
import { visit, currentURL } from "@ember/test-helpers";

describe("Acceptance | list texts", function() {
  const hooks = setupApplicationTest();

  hooks.beforeEach(async function() {
    this.store = this.owner.lookup("service:store");
    await [
      {
        name: "Over Sea, Under Stone",
        slug: "osus-1965"
      },
      {
        name: "The Dark Is Rising",
        slug: "tdir-1974"
      }
    ].forEach(text => this.store.createRecord("text", text));
  });

  it("can visit /texts", async function() {
    await visit("/texts");
    expect(currentURL()).to.equal("/texts");
  });

  it("includes a “Texts” h2", async function() {
    await visit("/texts");
    expect(this.element.querySelector("h2").textContent).to.equal("Texts");
  });

  it("shows a list of 2 .text-listings", async function() {
    await visit("/texts");
    expect(this.element.querySelectorAll(".text-listing").length).to.equal(2);
  });
});
