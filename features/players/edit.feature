Feature: Players Edit

  Scenario: Edit a Player
    Given some Players have been defined
    And I open Players page
    When I edit a Player
    Then I see the updated Player in the Players list
