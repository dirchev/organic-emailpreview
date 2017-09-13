# organic-emailpreview v0.1.5

A simple email preview

## DNA

```js
{
  "reactOn": String,    // default "deliverEmail"
  "auth": { // optional - provides HTTP basic auth
    "username": String,
    "password": String
  }
}
```

## Reaction

With chemical:

```js
{
  to: String
  from: String
  subject: String
  html: String
}
```
