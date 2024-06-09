# Auth0 Authentication

The VA Partners application has its entire authentication and authorization system handled through
Auth0. The current plan we have setup through Auth0 is completely free, and does not require a
credit card to be on file. As of writing this documentation, the free plan offers 7,500 users (more
that enough for this application), and the majority of the same features that the paid plan offers.
If you are interested in pricing, you can find details here: [https://auth0.com/pricing](https://auth0.com/pricing).

### User Management

Auth0 offers a number of ways to store users. There are two viable options we have for user storage,
either through Google OAuth2, or through Auth0's own internal username/password database.
You can view the development database settings [here](https://manage.auth0.com/dashboard/us/dev-edn8nssry67zy267/connections/database/con_8o8tJEp7ZUsfCoT4/settings).

You can have both of these enabled at the same time. There are pros and cons for each, but its
worth noting now that we have chosen to use **username/password** only.

#### Username/Password Connection

The username/password connection stores user's credentials in Auth0 directly. Every signup requires
an email address provided along with the password. Username can optionally be required, but we don't
have it setup to use that; email addresses should be fine unique identifiers. The user's passwords
are stored encrypted in Auth0 so they can never be reversed to plain-text. If a user forgets their
password they will need to reset it, they cannot retrieve it.

When a user is created, they will receive an email from Auth0 asking them to verify their email
address. This is not required; I have not seen any true benefit to it.

### Application Metadata

There are a few ways in Auth0 to handle authorization, but the simplest route is to use application
metadata. App metadata is a field stored directly on the users object, and it cannot be modified by
the user (unlike user metadata). App metadata is simply a JSON object, and it's returned
automatically when users are retrieved through the Management API. 

To manage roles and permissions, we will be storing all these details in the application metadata
on the user. When the user is created, metadata will be empty and the user's defaul role with be
**TODO**. From there, the admin who created the user will be able to set the user's roles through
the UI. When this happens, we will use the Management API and update the user's app metadata to
reflect these changes. Next time that user logs in, they should have th update roles attached to
thier profile.
