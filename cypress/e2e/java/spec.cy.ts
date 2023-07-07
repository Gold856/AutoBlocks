/// <reference types="cypress" />
describe("Java Code Test", () => {
	beforeEach(() => {
		cy.visit("/");
	});
	it("Single Method Java Test", () => {
		cy.get("#loadWorkspaceLabel").selectFile(
			"cypress/fixtures/singleMethod.json"
		);
		cy.fixture("java/singleMethodResult").then((contents: string) =>
			cy.get("#codeArea").should("have.text", contents)
		);
	});
	it("Single Method, One Variable Java Test", () => {
		cy.get("#loadWorkspaceLabel").selectFile(
			"cypress/fixtures/singleMethodOneVariable.json"
		);
		cy.fixture("java/singleMethodOneVariableResult").then((contents: string) =>
			cy.get("#codeArea").should("have.text", contents)
		);
	});
	it("Single Method, Multi Variable Java Test", () => {
		cy.get("#loadWorkspaceLabel").selectFile(
			"cypress/fixtures/singleMethodMultiVariable.json"
		);
		cy.fixture("java/singleMethodMultiVariableResult").then(
			(contents: string) => cy.get("#codeArea").should("have.text", contents)
		);
	});
	it("Disconnected Command Group Test", () => {
		cy.get("#loadWorkspaceLabel").selectFile(
			"cypress/fixtures/disconnectedCommandGroup.json"
		);
		cy.fixture("java/disconnectedCommandGroupResult").then((contents: string) =>
			cy.get("#codeArea").should("have.text", contents)
		);
	});
	it("Connected Command Group Test", () => {
		cy.get("#loadWorkspaceLabel").selectFile(
			"cypress/fixtures/oneCommandInCommandGroup.json"
		);
		cy.fixture("java/oneCommandInCommandGroupResult").then((contents: string) =>
			cy.get("#codeArea").should("have.text", contents)
		);
	});
	it("Raw Text 1st Block Test", () => {
		cy.get("#loadWorkspaceLabel").selectFile(
			"cypress/fixtures/rawText1st.json"
		);
		cy.fixture("java/rawText1stResult").then((contents: string) =>
			cy.get("#codeArea").should("have.text", contents)
		);
	});
	it("Raw Text 2nd Block Test", () => {
		cy.get("#loadWorkspaceLabel").selectFile(
			"cypress/fixtures/rawText2nd.json"
		);
		cy.fixture("java/rawText2ndResult").then((contents: string) =>
			cy.get("#codeArea").should("have.text", contents)
		);
	});
	it("Raw Text Last Block Test", () => {
		cy.get("#loadWorkspaceLabel").selectFile(
			"cypress/fixtures/rawTextLast.json"
		);
		cy.fixture("java/rawTextLastResult").then((contents: string) =>
			cy.get("#codeArea").should("have.text", contents)
		);
	});
	it("Reject Invalid Variable Name Test", () => {
		cy.get("#loadWorkspaceLabel").selectFile(
			"cypress/fixtures/invalidVariableName.json"
		);
		cy.fixture("java/invalidVariableNameResult").then((contents: string) =>
			cy.get("#codeArea").should("have.text", contents)
		);
	});
});
