# DeskFlow — IT Help Desk Ticket Tracker

DeskFlow is a responsive, browser-based help desk ticket tracker. It demonstrates how an IT support team can capture requests, prioritize issues, and follow each ticket through resolution.

## Features

- Create tickets with a title, requester, category, description, priority, and assignee.
- Track statuses: **Open**, **In Progress**, and **Resolved**.
- View dashboard totals and status counts.
- Search tickets by ID, title, requester, category, assignee, or description.
- Filter tickets by status and priority.
- Open a ticket to review details, update its status or priority, or delete it.
- Keep ticket data after refresh with browser local storage.
- Responsive desktop and mobile layout.

## Run locally

No build tools, package installation, or backend are required.

1. Clone or download this repository.
2. Open `index.html` in a modern browser.

Or run a small local web server from the project folder:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Dashboard layout, ticket table, and dialogs |
| `styles.css` | Responsive styling |
| `app.js` | Ticket creation, search, filtering, updates, deletion, and persistence |

## Data and privacy

This is a front-end portfolio demonstration. Ticket data is saved in the current browser's local storage. It is not sent to a server, synchronized across devices, or shared with other users. The initial tickets are sample data to make the dashboard useful on first launch. Use fictional information when demonstrating the project.

To reset the demo data, open the browser developer console on the DeskFlow page and run:

```js
localStorage.removeItem("deskflow-tickets-v1");
location.reload();
```

## Manual test checklist

- [ ] Create a ticket with the required title and requester.
- [ ] Confirm it appears in All tickets and Open.
- [ ] Search by title, requester, and ticket ID.
- [ ] Filter by High, Medium, and Low priority.
- [ ] Change a ticket to In Progress and confirm the dashboard count updates.
- [ ] Change priority and save.
- [ ] Mark a ticket Resolved and confirm its count updates.
- [ ] Refresh the page and confirm changes persist.
- [ ] Delete a ticket and confirm it is removed.
- [ ] Check the page at desktop and mobile widths.

## Technologies

HTML5 · CSS3 · Vanilla JavaScript · Browser Local Storage

## Potential next steps

- Add authentication and role-based access.
- Connect a backend database and REST API.
- Add comments, attachments, ticket history, and SLA tracking.
- Add email notifications and reporting.

---

**Portfolio note:** DeskFlow is a learning project, not a production service-management platform. A real deployment would require a backend, access controls, backups, and server-side data protection.