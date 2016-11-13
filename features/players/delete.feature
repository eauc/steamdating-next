Feature: Players Delete

  Scenario: Delete a Player
    Given some Players have been defined
    And I open Players page
    When I delete a Player
    Then I do not see the deleted Player in the Players list
