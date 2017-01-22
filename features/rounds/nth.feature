Feature: Rounds Nth

  Background:
    Given some Rounds have been defined

  Scenario Outline: Filter Games
    Given I open Rounds/1 page
    When I filter the Round with "<filter>"
    Then I see the matching Games

    Examples:
    | filter |
    | to     |
    | te     |

  Scenario Outline: Sort Games
    Given I open Rounds/1 page
    When I sort the Round by "<by>"
    Then I see the Round sorted by "<by>"
    When I invert the Round sort order
    Then I see the Round sorted by "<by>" in reverse order

    Examples:
    | by      |
    | Player2  |
    | Table   |
