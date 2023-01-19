describe("babbler testing", () => {
  it("Should login to the page with Alex user", () => {
    indexedDB.deleteDatabase("firebaseLocalStorageDb");
    cy.clearAllLocalStorage();
    cy.clearAllCookies();

    cy.visit("/");

    cy.get("#email").type("test@test.se");

    cy.get("#password").type("123123");

    cy.get("button").click();
  });
  it("Should click on a user and open Direct message", () => {
    cy.visit("/");

    cy.get("#email").type("test@test.se");

    cy.get("#password").type("123123");

    cy.get("button").click();

    cy.get("#combo-box-demo")
      .type("Pelle")
      .then(() => {
        cy.get("#combo-box-demo").type("{downArrow}{enter}");
      });
    // cy.get("#Pelle").type("{downArrow}{enter}");
  });
  it("Should click on a user in the left side menu", () => {
    cy.visit("/");

    cy.get("#Stina").click();
  });
  it("Should click on a room in the left menu", () => {
    cy.visit("/");

    cy.get("#testing").click();
  });
  it("Should write a message in testing room", () => {
    cy.visit("/");

    cy.get("#testing").click();

    cy.get("#msgSend").type("Testing");

    cy.get("#msgBtn").click();
  });
  it("Should go to profile page from dropdown menu", () => {
    cy.visit("/");

    cy.get("#basic-button").click();

    cy.get("#profLink").click();
  });
  it("Should create a room", () => {
    cy.visit("/");

    cy.wait(2000);

    const roomString = "cypressroom";

    cy.get("#addRoom").click();

    cy.get("#name")
      .type(roomString)
      .then(() => {
        cy.wait(500);
        cy.get("#name").type("{enter}");
        cy.wait(500);
      });
  });
  it("Should remove room thas was created", () => {
    cy.visit("/");

    cy.get("#cypressroom").click();

    cy.get("#deleteRoomBtn").click();
  });
});

export {};
