Feature: Rounds Next

  Background:
    Given more Players have been defined
    Given I open Rounds/Next page

  Scenario: Start Next
    Then I can edit the Next Round information

  Scenario: Valid Pairing
    When I pair all available players
    Then I can create the Next Round

  Scenario: Partial Pairing
    When I pair some players
    Then I cannot create the Next Round
    And I see an error with the unpaired players names

  Scenario: Change Player Pairing
    Given some players are paired
    When I select a player who is already paired
    Then the player name is removed from its previous pairing
