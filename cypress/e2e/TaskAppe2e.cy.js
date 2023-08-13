/// <reference types="cypress" />

describe("TaskApp e2e", () => {
    beforeEach(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test
        cy.visit('http://localhost:3000');
      })
    it("the user can add a new task", async () => {
        cy.get('#new_task').click()
        
        cy.get('#div_content').type("new Task for @carlos");
        
        cy.get("#ok_button").click();

        cy.wait(300);
   
        cy.contains('new Task for <span class="green text-success">@carlos</span>').should("exist");

    });

   
});

