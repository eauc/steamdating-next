Feature: Home Page Tests

  Background:
    Given I open Home page

  Scenario: Test Toaster
    When I test the "Toaster"
    Then the "Toaster" appears with a test message

  Scenario: Test Validate Args
    When I test the "ValidateArgs"
    Then the Toaster appears with "Invalid arguments" message

  Scenario: Test Alert
    When I test the "Alert"
    Then the "Alert" appears with a test message
    When I validate the "Alert"
    Then the "Alert" disappears
    And the Toaster appears with the "Alert" validation message

  Scenario: Test Confirm Validate
    When I test the "Confirm"
    Then the "Confirm" appears with a test message
    When I validate the "Confirm"
    Then the "Confirm" disappears
    And the Toaster appears with the "Confirm" validation message

  Scenario: Test Confirm Cancel
    When I test the "Confirm"
    Then the "Confirm" appears with a test message
    When I cancel the "Confirm"
    Then the "Confirm" disappears
    And the Toaster appears with the "Confirm" cancelation message

  Scenario: Test Prompt Validate
    When I test the "Prompt"
    Then the Prompt appears with a test message and a test value
    When I change the value and I validate the Prompt
    Then the "Prompt" disappears
    And the Toaster appears with the Prompt validation message and new value

  Scenario: Test Prompt Cancel
    When I test the "Prompt"
    Then the Prompt appears with a test message and a test value
    When I cancel the "Prompt"
    Then the "Prompt" disappears
    And the Toaster appears with the "Prompt" cancelation message
