# TODO: Patient/Doctor Default Passwords + LocalStorage

- [ ] Step 1: Update existing mock doctor passwords (`doctor123` → `doc123`) in `src/data/mockData.jsx`
- [ ] Step 2: Implement localStorage persistence in `src/data/dataStore.jsx`:
  - Load doctors/patients/appointments from `localStorage` on init; fallback to `mockData.jsx`
  - Save state back to `localStorage` after every mutating operation
  - Set `password: 'pat123'` in `addPatient()`
  - Set `password: 'doc123'` in `addDoctor()`
- [ ] Step 3: Restore logged-in user from `localStorage` on app load in `src/App.jsx`
- [ ] Step 4: Verify/build the app

