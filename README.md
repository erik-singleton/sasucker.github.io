# Test - Front End Engineer (v2)

### Intro

This is a front end site that utilizes the Stack Exchange v2 API to provide a more epic StackOverflow.com user experience.

It follows the branding on http://us.battle.net/shop/ as closely as possible; many image assets were utilized to help match the branding. The CSS is mimicked to be as close as possible while trying to maintain DRY principle.

The current flow is:
* User Visits Page
* Before an request, the application checks to see if we have a session active
  * If so, redirect to user page
  * If not, redirect to login page
* From here, the user can explore their own user page, or search for a question
  * Once they click a question, they'll be redirected to the question page where they can:
    * Mark the question as a favorite
    * View questions and answers
* Logout if they wish

### Technologies/Concepts Utilized

#### AngularJs

I decided to use Angular because it's excellent at standard RESTful API consumption, especially with the use of $resource. I'm also familiar with the technology and though I could use this opportunity to further better myself with it.

My Angular design attempts to avoid $scope soup. I also avoid using ng-controller in templates. When declaring controllers, I put any methods utilized on the controller's prototype, so that the functions are only declared once (to avoid memory leaks).

The reason for following this design pattern has to do with the direction that Angular v2 intends to go, and it's cleaner to keep variables out of $scope as much as possible and makes it possible to have two instances of the same controller on the same page.

#### Single Page Application

I chose to go with the SPA route because async requests tend to provide a much more fluid user experience. Fetching JSON data is much faster than fetching a new HTML document and repainting the screen.

#### SASS

I utilize SASS with Compass. My SASS file ended up being larger than anticipated; I felt I should've modularized it further.

### Limitations

* There are some limitations to the implementation's design; mostly due to the time constraint. Currently, if a user attempts to visit their profile before logging in, they'll receive a 400 error; if they then log in and attempt to visit their profile before refreshing the page, they'll continue to receive a 400 error. This is most likely related to the lack of an interceptor to properly handle those errors. I attempted to fix it, and could not in the alloted time.
* The logout button at the top is not conditional; this is due to how I structured the home page. There is one ui-view element in the body where all of the templates are injected; the menu at the top is a part of the base template and does not appear to get redrawn on digest cycles (even with a directive associated with it).
  * I would restructure the page to have 3 ui-views; one for header body and footer.


