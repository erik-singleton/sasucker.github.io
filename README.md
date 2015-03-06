# Test - Front End Engineer (v2)

### Intro

This is a front end site that utilizes the Stack Exchange v2 API to provide a more epic StackOverflow.com user experience.

The current flow is:
* User Visits Page
* Before an request, the application checks to see if we have a session active
** If so, redirect to user page
** If not, redirect to login page
* From here, the user can explore their own user page, or search for a question
** Once they click a question, they'll be redirected to the question page where they can:
*** Mark the question as a favorite
*** View questions and answers
* Logout if they wish


