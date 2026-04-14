# NeuroPage

React frontend for the task tracker backend in the repository root.

## Run

1. Start the ASP.NET backend from the repository root:
   `dotnet run`
2. Install frontend dependencies:
   `cd NeuroPage`
   `npm install`
3. Start the React client:
   `npm run dev`

The frontend expects the API at `http://localhost:5260` by default.

## Optional environment variable

Create `NeuroPage/.env` if you want a different backend URL:

```env
VITE_API_BASE_URL=http://localhost:5260
```
