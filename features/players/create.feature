Feature: Players Create

  Scenario: Start Create
    Given I open Players page
    When I start to create Player
    Then I can edit the Player information

  Scenario: Create Valid Player
    Given I open Players page
    When I create a valid Player
    Then I see the new Player in the Players list

  Scenario: Player name is unique
    Given some Players have been defined
    And I open Players page
    When I try to create a Player whose name already exists
    Then I cannot create the invalid Player
