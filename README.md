# Tecnologias para Docência

Web catalog of bibliographic references. It reads works from a Google Sheets spreadsheet and shows them in a table that can be searched and sorted. The interface is in Portuguese.

## Technology

- **React 16 (Create React App):** builds the page and the search form. The table rows are written directly to the DOM with `innerHTML` instead of being rendered from React state.
- **Google Sheets as the data source:** the `google-spreadsheet` library loads the rows, so the catalog can be edited in a spreadsheet without a dedicated database or backend. Each row has author, title, edition, city, company, year, pages and URL.
- **Google service account:** authenticates the app with the Sheets API.
- **Bootstrap 4 and reactstrap:** provide the form and table components.
- **Electron 9:** `public/electron.js` opens the app in a desktop window, but `package.json` has no script or entry point for it yet.
- **Procfile:** declares `npm start` as the web process for Heroku-style hosting.

## How it works

1. When the page loads, the app authenticates, reads the first worksheet and stores the rows in memory.
2. Search filters those rows by author or title on the client side.
3. Clicking the author or title header sorts the table.

The work type selector and the "Fichamento" and "Metadados" columns are not implemented yet.

## Running locally

You need Node.js, your own Google service account and a spreadsheet shared with that account.

```bash
npm install
npm start
```

Save a new service account key as `src/client_secret.json`, which Git ignores, and update the spreadsheet ID in `src/App.js`. The app does not compile without that file, and the comments in `src/App.js` list the full steps. Then open http://localhost:3000.

Run this project locally only, because the build includes the key in the browser code. A public deployment would need a backend to read the spreadsheet.
