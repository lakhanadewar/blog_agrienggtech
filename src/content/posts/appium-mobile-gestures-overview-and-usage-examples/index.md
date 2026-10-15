---
title: "Appium Mobile Gestures: Overview and Usage Examples"
description: "Using UiAutomator2 Backend to Automate Mobile Gestures Touch actions are the most complex and advanced way to implement Android gestures. However, some basic gestures like swipe, fling, and pinch,…"
pubDate: 2023-02-05
author: "Lakhan Adewar"
tags: ["mobile-app-testing", "training", "touch-gestures-guide", "appium-mobile"]
heroImage: "./image-1.png"
heroAlt: ""
canonicalURL: "https://medium.com/@lakhanadewar/appium-mobile-gestures-overview-and-usage-examples-4f5b277932d2"
originalURL: "https://medium.com/@lakhanadewar/appium-mobile-gestures-overview-and-usage-examples-4f5b277932d2"
---

> Using UiAutomator2 Backend to Automate Mobile Gestures Touch actions are the most complex and advanced way to implement Android gestures. However, some basic gestures like swipe, fling, and pinch, commonly used in Android apps, have shortcuts with only high-level options available for configuration.

**longClickGesture:** Performs a long click action on the specified element or coordinates.

**Arguments**:

-   elementId: ID of the element to be clicked. If missing, both x and y coordinates must be provided. If both are given, x and y are parsed as relative offsets from the element’s top-left corner.
-   x: X-offset coordinate.
-   y: Y-offset coordinate.
-   duration: Click duration in milliseconds. Default is 500. Must not be negative.

**Examples**:

```
//java
((JavascriptExecutor) driver).executeScript("mobile: longClickGesture", ImmutableMap.of(
    "elementId", ((RemoteWebElement) element).getId()
));
```

```
#python
driver.execute_script('mobile: longClickGesture', {'x': 100, 'y': 100, 'duration': 1000})
```

**doubleClickGesture**: Performs a double click action on the specified element or coordinates.

**Arguments**:

-   elementId: ID of the element to be clicked. If missing, both x and y coordinates must be provided. If both are given, x and y are parsed as relative offsets from the element’s top-left corner.
-   x: X-offset coordinate.
-   y: Y-offset coordinate.

**Examples**:

```
//java
((JavascriptExecutor) driver).executeScript("mobile: doubleClickGesture", ImmutableMap.of(
    "elementId", ((RemoteWebElement) element).getId()
));
```

```
#python
driver.execute_script('mobile: doubleClickGesture', {'x': 100, 'y': 100})
```

**clickGesture**: Performs a click action on the specified element or coordinates. Available in Appium UiAutomator2 driver v1.71.0. Recommended as a workaround for cases where native tap fails even though coordinates are correct.

**Arguments**:

-   elementId: ID of the element to be clicked. If missing, both x and y coordinates must be provided. If both are given, x and y are parsed as relative offsets from the element’s top-left corner.
-   x: X-offset coordinate.
-   y: Y-offset coordinate.

**Examples**:

```
//java
driver.executeScript("mobile: clickGesture", ImmutableMap.of(
    "elementId", ((RemoteWebElement) element).getId()
));
```

```
#python
driver.execute_script('mobile: clickGesture', {'x': 100, 'y': 100})
```

**dragGesture**: This gesture drags an element to a specified location. It has the following arguments: elementId, startX, startY, endX, endY, and speed. If elementId is missing, startX and startY must be provided, otherwise the start coordinates are treated as offsets from the top left corner of the element.

```
// Java
((JavascriptExecutor) driver).executeScript("mobile: dragGesture", ImmutableMap.of(
    "elementId", ((RemoteWebElement) element).getId(),
    "endX", 100,
    "endY", 100
));
```

**flingGesture**: This gesture performs a fling gesture on an element/area. The supported arguments are: elementId, left, top, width, height, direction, and speed. The returned value is a boolean indicating if the object can still scroll in the specified direction.

**Returned value**

The returned value is a boolean one and equals to true if the object can still scroll in the given direction

**Examples**

```
// Java
boolean canScrollMore = (Boolean) ((JavascriptExecutor) driver).executeScript("mobile: flingGesture", ImmutableMap.of(
    "elementId", ((RemoteWebElement) element).getId(),
    "direction", "down",
    "speed", 500
));
```

**pinchOpenGesture**: This gesture performs a pinch-open gesture on an element/area. The supported arguments are: elementId, left, top, width, height, percent, and speed. The percent argument specifies the size of the pinch as a percentage of the pinch area size.

```
// Java
((JavascriptExecutor) driver).executeScript("mobile: pinchOpenGesture", ImmutableMap.of(
    "elementId", ((RemoteWebElement) element).getId(),
    "percent", 0.75
));
```

**pinchCloseGesture**: This gesture performs a pinch-close gesture on an element/area. The supported arguments are: elementId, left, top, width, height, percent, and speed. The percent argument specifies the size of the pinch as a percentage of the pinch area size.

**Examples**

```
// Java
((JavascriptExecutor) driver).executeScript("mobile: pinchCloseGesture", ImmutableMap.of(
    "elementId", ((RemoteWebElement) element).getId(),
    "percent", 0.75
));
```

```
# Python
can_scroll_more = driver.execute_script('mobile: pinchCloseGesture', {
    'elementId': element.id,
    'percent': 0.75
})
```

**swipeGesture**: This gesture performs a swipe gesture on an element/area. The supported arguments are: elementId, left, top, width, height, direction, and speed. The direction argument specifies the direction of the swipe (up, down, left, or right).

**Examples**

```
// Java
((JavascriptExecutor) driver).executeScript("mobile: swipeGesture", ImmutableMap.of(
    "left", 100, "top", 100, "width", 200, "height", 200,
    "direction", "left",
    "percent", 0.75
));
```
