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

  Scenario Outline: Sort Players list
    Given more Players have been defined
    And I open Players page
    When I sort the Players list by "<by>"
    Then I see the Players sorted by "<by>"
    When I invert the sort order
    Then I see the Players sorted by "<by>" in revert order

    Examples:
    | by      |
    | Faction |
    | Origin  |
