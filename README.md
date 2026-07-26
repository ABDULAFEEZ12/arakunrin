# ARÁKÙNRIN

Africa's premier institution for lifelong male formation.
Forming Boys. Forging Men. Building Legacies.

## Setup

```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

## Notes

- Styling is hand-authored in `static/css/custom.css` — there is no Tailwind
  build step in this version of the project. `tailwind.config.js` and the
  `tailwindcss` devDependency are no longer used and can be removed if you
  don't need them elsewhere.
- Pages: Home, About, Our Work, The Gathering, Gallery, Partners, Contact.
