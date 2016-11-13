Feature: Players Filter & Sort

  Scenario Outline: Filter Players list
    Given more Players have been defined
    And I open Players page
    When I filter the Players list with "<filter>"
    Then I see the matching Players with the matching columns first

    Examples:
    | filter |
    | toto   |
    | lyon   |
    | kha    |
    | abs    |

  Scenario: Sort Players list
    Given more Players have been defined
    And I open Players page
    When I sort the Players list by "Faction"
    Then I see the Players sorted by "Faction"
    When I invert the sort order
    Then I see the Players sorted by "Faction" in revert order
