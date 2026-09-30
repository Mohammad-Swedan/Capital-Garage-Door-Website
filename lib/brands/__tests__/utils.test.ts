import { test } from "node:test";
import assert from "node:assert/strict";
import { serviceShortName } from "../../utils";

test("serviceShortName strips a trailing ' Perth'", () => {
  assert.equal(serviceShortName("Garage Door Repairs Perth"), "Garage Door Repairs");
  assert.equal(
    serviceShortName("Garage Door Opener Repair & Installation Perth"),
    "Garage Door Opener Repair & Installation",
  );
});

test("serviceShortName strips a trailing ' in Perth'", () => {
  assert.equal(
    serviceShortName("Emergency Garage Door Repairs in Perth"),
    "Emergency Garage Door Repairs",
  );
});

test("serviceShortName leaves a name with no trailing Perth unchanged", () => {
  assert.equal(serviceShortName("Garage Door Spring Repair"), "Garage Door Spring Repair");
  // Brand and motors pages pass these — they must read exactly as before.
  assert.equal(serviceShortName("Merlin motor service"), "Merlin motor service");
  assert.equal(serviceShortName("Garage Door Motor Installation"), "Garage Door Motor Installation");
});

test("serviceShortName only strips a TRAILING Perth", () => {
  assert.equal(serviceShortName("Perth Windsor Doors door service"), "Perth Windsor Doors door service");
  assert.equal(serviceShortName("Perth Garage Door Repairs"), "Perth Garage Door Repairs");
  assert.equal(serviceShortName("Perth"), "Perth");
});

test("serviceShortName is case-insensitive and trims whitespace", () => {
  assert.equal(serviceShortName("  Roller Doors PERTH  "), "Roller Doors");
  assert.equal(serviceShortName("Roller Door Repairs in perth"), "Roller Door Repairs");
  assert.equal(serviceShortName("Sectional Garage Doors   Perth"), "Sectional Garage Doors");
  assert.equal(serviceShortName("  Garage Door Spring Repair  "), "Garage Door Spring Repair");
});

test("the contact-panel heading never repeats Perth", () => {
  const heading = (name: string) => `Book ${serviceShortName(name)} in Perth`;
  assert.equal(heading("Garage Door Repairs Perth"), "Book Garage Door Repairs in Perth");
  assert.equal(heading("Garage Doors in Perth"), "Book Garage Doors in Perth");
  assert.equal(heading("Garage Door Spring Repair"), "Book Garage Door Spring Repair in Perth");
});
