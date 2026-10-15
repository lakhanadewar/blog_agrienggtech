---
title: "How to Automate API Testing in Java Using REST Assured"
description: "Learn the given-when-then pattern, serialization, deserialization, and full lifecycle testing with hands-on examples"
pubDate: 2026-04-13
updatedDate: 2026-08-31
author: "Lakhan Adewar"
tags: ["api-testing", "software-testing", "restassured", "java", "test-automation"]
heroImage: "./image-1.png"
heroAlt: ""
canonicalURL: "https://medium.com/@lakhanadewar/how-to-automate-api-testing-in-java-using-rest-assured-ae714e16ca01"
originalURL: "https://medium.com/@lakhanadewar/how-to-automate-api-testing-in-java-using-rest-assured-ae714e16ca01"
---

Learn the given-when-then pattern, serialization, deserialization, and full lifecycle testing with hands-on examples

_APIs are everywhere and yet automated API testing remains one of the most underappreciated skills in software quality assurance. Here’s how to change that._

### Why Automated API Testing Can’t Be Skipped

When an API returns bad data, the consuming application processes it as though it’s correct. There’s no human on the receiving end to catch a transposed ISBN digit, a malformed URL, or a price off by a cent. Cascading failures follow and they’re notoriously hard to diagnose.

Manual verification doesn’t scale. Imagine eyeballing a JSON response with a title, author, ISBN-10, ISBN-13, publisher, pricing, and a dozen URLs reliably, hundreds of times. Automated tests do this thoroughly, consistently, and in milliseconds.

### What Is REST Assured?

REST Assured is an open-source Java library with a fluent DSL for making HTTP requests and asserting on responses. Instead of verbose HTTP client boilerplate, you write this:

```
given()
    .queryParam("id", 2)
.when()
    .get(endpoint)
.then()
    .statusCode(200)
    .body("name", equalTo("Crossback Training Tank"));
```

It reads almost like plain English which is the point.

**Setup:** Maven project with three dependencies:

-   rest-assured requests and assertions
-   junit test framework
-   jackson-databind JSON serialization/deserialization

### The Given-When-Then Pattern

REST Assured uses the BDD-style given-when-then structure:

-   **Given** prerequisites: headers, auth, params, body
-   **When** the action: GET, POST, PUT, DELETE
-   **Then** expected outcome: status code, headers, body assertions

Clean separation of concerns, readable by non-developers.

### The Four Components of Every API Request

Every request has:

1.  **Endpoint** the target URL
2.  **Method** GET / POST / PUT / DELETE
3.  **Headers** metadata (auth tokens, Content-Type, Accept)
4.  **Data** query params (appended to URL) or request body (for create/update)

### Making Requests: GET, POST, PUT, DELETE

**GET a single resource:**

```
given()
    .queryParam("id", 2)
.when()
    .get(baseUrl + "product/read_one.php")
.then()
    .statusCode(200)
    .body("name", equalTo("Crossback Training Tank"));
```

**POST to create a resource:**

```
given()
    .body(newProduct)
.when()
    .post(baseUrl + "product/create.php")
.then()
    .statusCode(200);
```

**PUT to update:**

```
given()
    .body(updatedProduct)
.when()
    .put(baseUrl + "product/update.php")
.then()
    .statusCode(200);
```

**DELETE:**

```
given()
    .body("{ \"id\": 20 }")
.when()
    .delete(baseUrl + "product/delete.php")
.then()
    .statusCode(200);
```

### Serialization: Modeling Request Bodies with Java Records

Instead of raw JSON strings, use Java records:

```
public record Product(String name, String description, double price, int categoryId) {}
```

Jackson automatically serializes this to JSON. Your tests stay clean and type-safe.

### Verifying Responses: Status Codes, Headers, and Body

REST Assured uses Hamcrest matchers for assertions:

```
.then()
    .statusCode(200)
    .header("Content-Type", containsString("application/json"))
    .body("name",  equalTo("Crossback Training Tank"))
    .body("price", equalTo(149.99f));
```

**Essential Hamcrest matchers:**

Matcher Use equalTo(value)Exact match notNullValue()Field exists greaterThan(n)Numeric comparison containsString(s)Substring hasSize(n)Collection size everyItem(matcher) Apply to every element

### Complex Response Bodies: Arrays and Nested Objects

For a collection endpoint returning an array:

```
.body("records.name", everyItem(notNullValue()))
.body("records.price", everyItem(greaterThan(0f)))
.body("records.size()", greaterThan(0))
```

everyItem() is particularly powerful one assertion covers every element in the array.

### Deserialization: Mapping Responses to Java Objects

Deserializing responses into POJOs lets you assert with a single line:

```
Product product = given()
    .queryParam("id", 2)
.when()
    .get(endpoint)
.as(Product.class);

assertEquals(expectedProduct, product);
```

One assertion covers every field. Use this when you need to verify the whole object; stick to targeted Hamcrest assertions when you only care about specific fields.

### Full Resource Lifecycle: The Complete CRUD Test

A production-grade test suite covers the full lifecycle:

1.  **Create** a resource
2.  **Update** it
3.  **Read** it back
4.  **Delete** it

**Key principle:** Always verify expected values against the database first. The database is your source of truth never assert on values from a previous API response.

### What’s Next

The patterns here apply across virtually every REST API you’ll encounter. As your suites grow, you’ll build intuition for what to verify, how strictly, and how to structure tests for long-term maintainability.

The complete source code for these examples is available at: [Github](https://github.com/LinkedInLearning/java-automated-api-testing-with-rest-assured-5989068)

_This article is based on the LinkedIn Learning course “_**_Java Automated API Testing with REST Assured._**_” For the full course including video walkthroughs and exercises, visit_ [_LinkedIn Learning_](https://www.linkedin.com/learning/java-automated-api-testing-with-rest-assured)_._
