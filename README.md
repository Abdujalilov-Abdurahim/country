# World Countries

Small React + TypeScript app that displays country data, maps and quizzes.

Features
- Browse countries by continent
- Country detail pages with flags, population and statistics
- Search and favorites (stored in localStorage)
- Interactive world map and comparison tool
- Small quiz section for learning flags/capitals

Quick start
1. Install dependencies:

```bash
npm install
```

2. Run in dev mode:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

Scripts
- `dev`: starts the Vite dev server
- `build`: TypeScript build and Vite production build
- `lint`: run `oxlint`

Notes & recommendations
- API requests are cached in-memory for 10 minutes to reduce network usage.
- Error handling has been improved in the `src/services/countriesApi.ts` file — components now receive errors and should surface them to users where appropriate.
- Consider adding React Query or SWR for more robust caching and background updates.

Contributing
- Fork the repository, make changes, and open a pull request.
- Keep changes focused and add tests for non-trivial logic.

License
- This project is provided as-is.
