import json

collection = {
    "info": {
        "name": "Department Expense Approval System",
        "description": "Complete REST API collection for the Department Expense Approval System.",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "1. Department APIs",
            "item": [
                {
                    "name": "Create Department",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "pm.test(\"Status code is 201\", function () {",
                                    "    pm.response.to.have.status(201);",
                                    "});",
                                    "pm.test(\"Response has success=true\", function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    pm.expect(jsonData.success).to.eql(true);",
                                    "    if(jsonData.data && jsonData.data.id) {",
                                    "        pm.collectionVariables.set(\"departmentId\", jsonData.data.id);",
                                    "    }",
                                    "});"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "POST",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"departmentName\": \"Engineering\"\n}"
                        },
                        "url": {
                            "raw": "{{baseUrl}}/api/departments",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "departments"]
                        },
                        "description": "Creates a new department. Fails if name exists."
                    }
                },
                {
                    "name": "Get All Departments",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "pm.test(\"Status code is 200\", function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "GET",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/api/departments",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "departments"]
                        },
                        "description": "Retrieves a list of all departments."
                    }
                },
                {
                    "name": "Get Department By Id",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "pm.test(\"Status code is 200\", function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "GET",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/api/departments/{{departmentId}}",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "departments", "{{departmentId}}"]
                        },
                        "description": "Retrieves a department by its ID."
                    }
                },
                {
                    "name": "Update Department",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "pm.test(\"Status code is 200\", function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "PUT",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"departmentName\": \"Software Engineering\"\n}"
                        },
                        "url": {
                            "raw": "{{baseUrl}}/api/departments/{{departmentId}}",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "departments", "{{departmentId}}"]
                        }
                    }
                },
                {
                    "name": "Delete Department (Will fail if budgets/claims exist)",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "pm.test(\"Status could be 200 or 400\", function () {",
                                    "    pm.expect(pm.response.code).to.be.oneOf([200, 400]);",
                                    "});"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "DELETE",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/api/departments/{{departmentId}}",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "departments", "{{departmentId}}"]
                        }
                    }
                }
            ]
        },
        {
            "name": "2. Department Budget APIs",
            "item": [
                {
                    "name": "Create Budget",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "pm.test(\"Status code is 201\", function () {",
                                    "    pm.response.to.have.status(201);",
                                    "});",
                                    "pm.test(\"Save budget id\", function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    if(jsonData.data && jsonData.data.id) {",
                                    "        pm.collectionVariables.set(\"budgetId\", jsonData.data.id);",
                                    "    }",
                                    "});"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "POST",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"departmentId\": {{departmentId}},\n    \"month\": \"JANUARY\",\n    \"year\": 2026,\n    \"budgetAmount\": 50000.00\n}"
                        },
                        "url": {
                            "raw": "{{baseUrl}}/api/budgets",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "budgets"]
                        }
                    }
                },
                {
                    "name": "Get All Budgets",
                    "request": {
                        "method": "GET",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/api/budgets",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "budgets"]
                        }
                    }
                },
                {
                    "name": "Get Budget By Id",
                    "request": {
                        "method": "GET",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/api/budgets/{{budgetId}}",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "budgets", "{{budgetId}}"]
                        }
                    }
                },
                {
                    "name": "Update Budget Amount",
                    "request": {
                        "method": "PUT",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"departmentId\": {{departmentId}},\n    \"month\": \"JANUARY\",\n    \"year\": 2026,\n    \"budgetAmount\": 60000.00\n}"
                        },
                        "url": {
                            "raw": "{{baseUrl}}/api/budgets/{{budgetId}}",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "budgets", "{{budgetId}}"]
                        }
                    }
                }
            ]
        },
        {
            "name": "3. Expense Claim APIs",
            "item": [
                {
                    "name": "Create Claim",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "pm.test(\"Status code is 201\", function () {",
                                    "    pm.response.to.have.status(201);",
                                    "});",
                                    "pm.test(\"Save claim id\", function () {",
                                    "    var jsonData = pm.response.json();",
                                    "    if(jsonData.data && jsonData.data.id) {",
                                    "        pm.collectionVariables.set(\"claimId\", jsonData.data.id);",
                                    "    }",
                                    "});"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "POST",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"employeeName\": \"John Doe\",\n    \"departmentId\": {{departmentId}},\n    \"expenseCategory\": \"TRAVEL\",\n    \"amount\": 1500.50,\n    \"expenseDate\": \"2026-01-15\",\n    \"description\": \"Client meeting flight\"\n}"
                        },
                        "url": {
                            "raw": "{{baseUrl}}/api/claims",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "claims"]
                        }
                    }
                },
                {
                    "name": "Get All Claims (Filtered & Paginated)",
                    "request": {
                        "method": "GET",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/api/claims?departmentId={{departmentId}}&page=0&size=10&sortBy=expenseDate&sortDir=desc",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "claims"],
                            "query": [
                                {"key": "departmentId", "value": "{{departmentId}}"},
                                {"key": "page", "value": "0"},
                                {"key": "size", "value": "10"},
                                {"key": "sortBy", "value": "expenseDate"},
                                {"key": "sortDir", "value": "desc"}
                            ]
                        }
                    }
                },
                {
                    "name": "Get Claim By Id",
                    "request": {
                        "method": "GET",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/api/claims/{{claimId}}",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "claims", "{{claimId}}"]
                        }
                    }
                },
                {
                    "name": "Update Pending Claim",
                    "request": {
                        "method": "PUT",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"employeeName\": \"John Doe\",\n    \"departmentId\": {{departmentId}},\n    \"expenseCategory\": \"TRAVEL\",\n    \"amount\": 1750.00,\n    \"expenseDate\": \"2026-01-15\",\n    \"description\": \"Client meeting flight + baggage\"\n}"
                        },
                        "url": {
                            "raw": "{{baseUrl}}/api/claims/{{claimId}}",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "claims", "{{claimId}}"]
                        }
                    }
                }
            ]
        },
        {
            "name": "4. Finance Review APIs",
            "item": [
                {
                    "name": "Approve Claim",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "pm.test(\"Status code is 200\", function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "POST",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"recommendedStatus\": \"APPROVED\",\n    \"reviewRemark\": \"Approved, receipts verified.\"\n}"
                        },
                        "url": {
                            "raw": "{{baseUrl}}/api/claims/{{claimId}}/review",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "claims", "{{claimId}}", "review"]
                        }
                    }
                },
                {
                    "name": "Review Already Reviewed Claim (Negative)",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "pm.test(\"Status code is 400\", function () {",
                                    "    pm.response.to.have.status(400);",
                                    "});"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "POST",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"recommendedStatus\": \"REJECTED\",\n    \"reviewRemark\": \"Trying to review again.\"\n}"
                        },
                        "url": {
                            "raw": "{{baseUrl}}/api/claims/{{claimId}}/review",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "claims", "{{claimId}}", "review"]
                        }
                    }
                }
            ]
        },
        {
            "name": "5. Finance Summary APIs",
            "item": [
                {
                    "name": "Get Monthly Finance Summary",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "pm.test(\"Status code is 200\", function () {",
                                    "    pm.response.to.have.status(200);",
                                    "});"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "GET",
                        "header": [],
                        "url": {
                            "raw": "{{baseUrl}}/api/finance-summary?departmentId={{departmentId}}&month=JANUARY&year=2026",
                            "host": ["{{baseUrl}}"],
                            "path": ["api", "finance-summary"],
                            "query": [
                                {"key": "departmentId", "value": "{{departmentId}}"},
                                {"key": "month", "value": "JANUARY"},
                                {"key": "year", "value": "2026"}
                            ]
                        }
                    }
                }
            ]
        }
    ],
    "variable": [
        {
            "key": "baseUrl",
            "value": "http://localhost:8080",
            "type": "string"
        },
        {
            "key": "departmentId",
            "value": "1",
            "type": "string"
        },
        {
            "key": "budgetId",
            "value": "1",
            "type": "string"
        },
        {
            "key": "claimId",
            "value": "1",
            "type": "string"
        }
    ]
}

with open('docs/postman/department-expense-approval-system.postman_collection.json', 'w') as f:
    json.dump(collection, f, indent=4)

env = {
    "id": "e21a20a4-a957-4ba3-ab0f-b42dcdfb2885",
    "name": "Local Dev Environment",
    "values": [
        {
            "key": "baseUrl",
            "value": "http://localhost:8080",
            "type": "default",
            "enabled": True
        }
    ]
}

with open('docs/postman/local-env.postman_environment.json', 'w') as f:
    json.dump(env, f, indent=4)
