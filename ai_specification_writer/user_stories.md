# User Stories: CarpoolConnect

Priorities: **MVP** (needed for first release), **High**, **Medium**, **Low**.

### User Story 1
As an employee, I want to sign up with my company email so that I only share rides with verified colleagues.

**Acceptance Criteria**:
- Sign-up is accepted only for email domains registered by a participating company.
- A verification link is sent and the account stays inactive until it is clicked.
- If the company has SSO enabled, the employee can log in with SSO instead of a password.

**Priority**: MVP

### User Story 2
As a driver, I want to register my car and my regular commute so that the system can find passengers who fit my route.

**Acceptance Criteria**:
- Driver can enter car details (model, color, plate, available seats from 1 to 4).
- Driver can set home area, office site, working days, and arrival/departure times.
- Driver can set a maximum detour (e.g. 5, 10, or 15 minutes).

**Priority**: MVP

### User Story 3
As a passenger, I want to enter my home area and work schedule so that I get matched with drivers going my way.

**Acceptance Criteria**:
- Passenger can set pickup area, office site, working days, and preferred arrival/departure times.
- System shows a list of suggested drivers ranked by detour time and schedule fit.
- Each suggestion shows driver first name, rating, pickup time, and estimated cost per trip.

**Priority**: MVP

### User Story 4
As a passenger, I want to request to join a driver's recurring carpool so that my commute is arranged for the whole week.

**Acceptance Criteria**:
- Passenger can send a join request for selected days.
- Driver receives a notification and can accept or decline within 24 hours.
- On acceptance, the trips appear in both users' schedules; on decline or no answer, the passenger is notified and shown other matches.

**Priority**: MVP

### User Story 5
As a driver, I want to receive pickup reminders and see my passengers' pickup points so that I can plan my route.

**Acceptance Criteria**:
- Driver gets a reminder 30 minutes before the first pickup.
- The trip screen lists passengers in pickup order with pickup points on a map.
- Driver can open the route in an external navigation app.

**Priority**: High

### User Story 6
As a passenger, I want to be notified immediately if my driver cancels so that I can still get to work on time.

**Acceptance Criteria**:
- When a driver cancels a trip, all its passengers get a push notification within 1 minute.
- The notification suggests alternative drivers for the same time if any are available.
- If no alternative exists, the passenger is offered the guaranteed ride home/taxi option (if the company enabled it).

**Priority**: High

### User Story 7
As a passenger, I want trip costs to be split and settled automatically so that I don't have to handle cash with colleagues.

**Acceptance Criteria**:
- Cost per trip is calculated from distance and a fuel rate set by the company admin, and split equally among occupants.
- Each user sees a monthly summary of amounts owed and earned.
- Settlement happens through the payment method or payroll deduction chosen by the company.

**Priority**: High

### User Story 8
As a passenger or driver, I want to rate my trip partner after a ride so that the community stays reliable and safe.

**Acceptance Criteria**:
- After a trip ends, both sides are prompted to give a 1–5 star rating with an optional comment.
- Ratings are shown as an average on the user's profile once they have at least 3 ratings.
- A user can block another user, and they will no longer be matched together.

**Priority**: Medium

### User Story 9
As an employee, I want to report a safety problem during or after a trip so that the company can act on it.

**Acceptance Criteria**:
- A "Report" button is available on the trip screen and in the trip history.
- The report is sent to the company admin and platform support with the trip details attached.
- The reporting user receives a confirmation and a case number.

**Priority**: High

### User Story 10
As an HR/facilities manager, I want a dashboard of carpool participation and impact so that I can report on cost savings and CO2 reduction.

**Acceptance Criteria**:
- Dashboard shows active carpoolers, trips per week, average car occupancy, and estimated CO2 saved per site.
- Data can be filtered by date range and office site.
- Reports can be exported as CSV and PDF.

**Priority**: Medium

### User Story 11
As an HR/facilities manager, I want to configure company policies so that the platform fits our sites and budget.

**Acceptance Criteria**:
- Admin can add or remove office sites and allowed email domains.
- Admin can set the fuel rate used for cost sharing and enable or disable the guaranteed ride home with a monthly limit.
- Policy changes apply to new trips and are recorded in an audit log.

**Priority**: MVP

### User Story 12
As a regular carpooler, I want to earn reward points for shared trips so that I stay motivated to keep carpooling.

**Acceptance Criteria**:
- Users earn points for each completed shared trip (driver and passenger).
- Users can see their points balance and a monthly leaderboard for their site.
- Admins can define rewards (e.g. priority parking) that users can redeem with points.

**Priority**: Low

### User Story 13
As a passenger, I want to request a one-off ride for a single day so that I can carpool on days outside my usual schedule.

**Acceptance Criteria**:
- Passenger can post a ride request with date, time window, and pickup area.
- Matching drivers are notified and the first to accept is assigned.
- If no driver accepts 2 hours before the time window, the passenger is notified.

**Priority**: Medium
