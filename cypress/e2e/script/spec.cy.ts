/// <reference types="cypress" />
describe("Script Code Test", () => {
	beforeEach(() => {
		cy.visit("/");
	});
	it("Single Method Script Test", () => {
		cy.get("#loadWorkspaceLabel").selectFile(
			"cypress/fixtures/singleMethod.json"
		);
		cy.fixture("singleMethodResult").then((contents: string) =>
			cy.get("#codeArea").should("have.text", contents)
		);
	});
	it("Single Method, One Variable Script Test", () => {
		cy.get("#loadWorkspaceLabel").selectFile(
			"cypress/fixtures/singleMethodOneVariable.json"
		);
		cy.fixture("singleMethodOneVariableResult").then((contents: string) =>
			cy.get("#codeArea").should("have.text", contents)
		);
	});
	it("Single Method, Multi Variable Script Test", () => {
		cy.get("#loadWorkspaceLabel").selectFile(
			"cypress/fixtures/singleMethodMultiVariable.json"
		);
		cy.fixture("singleMethodMultiVariableResult").then((contents: string) =>
			cy.get("#codeArea").should("have.text", contents)
		);
	});
	it("Command Group Test", () => {
		cy.get("#loadWorkspaceLabel").selectFile(
			"cypress/fixtures/commandGroup.json"
		);
		cy.fixture("commandGroupResult").then((contents: string) =>
			cy.get("#codeArea").should("have.text", contents)
		);
	});
});
