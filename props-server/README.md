# Props Server
This is a service that returns any data as props to be used in UI components

### API Endpoints:

#### GET /api/pageTitle
Returns a JSON object with:
- `content`: The page title
- `timestamp`: The time when the request was processed

Example response:
```json
{
  "content": "Some hardcoded title example",
  "timestamp": "2023-11-01T12:34:56.789Z"
}
```

You can test the endpoint by visiting `http://localhost:3333/api/pageTitle` in your browser.
