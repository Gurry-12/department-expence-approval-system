# Postman Collection: Department Expense Approval System

This directory contains the complete, ready-to-import Postman Collection and Environment file for testing the Department Expense Approval System API.

## Included Files

1. `department-expense-approval-system.postman_collection.json`: The complete API collection structured into modules.
2. `local-env.postman_environment.json`: A simple local development environment file containing default variables like `{{baseUrl}}`.

## Import Steps

1. Open Postman.
2. Click the **Import** button in the top left corner.
3. Drag and drop both JSON files (`.postman_collection.json` and `.postman_environment.json`) into the Postman window.
4. Select the newly imported **Local Dev Environment** from the environment dropdown in the top right corner.

## Variable Usage

The collection uses Collection Variables to dynamically pass IDs between requests. This means you do not need to manually copy and paste IDs.

*   `{{baseUrl}}`: The root URL of the backend (Default: `http://localhost:8080`).
*   `{{departmentId}}`: Automatically populated when you create a new Department.
*   `{{budgetId}}`: Automatically populated when you create a new Department Budget.
*   `{{claimId}}`: Automatically populated when you create a new Expense Claim.

## Execution Order

The collection is designed to be executed from top to bottom. Follow this logical sequence to test the entire lifecycle:

1. **Department APIs**: Run "Create Department" first. This will save the `departmentId`.
2. **Department Budget APIs**: Run "Create Budget". It will use the generated `departmentId` and allocate a budget for January 2026.
3. **Expense Claim APIs**: Run "Create Claim". This acts as an employee submitting an expense for the previously created department.
4. **Finance Review APIs**: Run "Approve Claim". This will transition the claim from `PENDING` to `APPROVED` and deduct the amount from the department's monthly budget.
5. **Finance Summary APIs**: Run "Get Monthly Finance Summary". This will return an aggregated breakdown showing the updated Remaining Budget and Claim Counts.

## Testing Sequence & Automation

Every request in this collection includes built-in JavaScript tests under the **Tests** tab. These scripts perform the following:
*   Assert standard HTTP Status Codes (200 OK, 201 Created, 400 Bad Request).
*   Verify the response structure matches the `GlobalResponse` pattern (`success=true`).
*   Automatically extract `id` fields from the JSON payload and save them to Collection Variables.

**Negative Scenarios included:**
*   Attempting to delete a department that has active budgets (expected failure).
*   Attempting to review a claim that has already been reviewed (expected failure).
*   *Note: You can easily duplicate the "Create Claim" request and modify the `amount` to be larger than the allocated budget to test the "Approve Beyond Budget" negative scenario.*

You can run the entire test suite automated by selecting the Collection in Postman and clicking **Run collection**.
