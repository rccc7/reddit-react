1. To install the nextjs with tailwind follow the instructions here:
https://tailwindcss.com/docs/guides/nextjs#
But with a slight modification in which we define the react-version (12.3)
 and add the example parameeter to download with the tailwindcss template: 
	npx create-next-app -e with-tailwindcss reddit-react
	cd reddit-react
	npm uninstall next
	npm i next@12.3

2. Install VSCode GraphQL extension to add syntax highligting and validation for graphql
3. Install heroicons, see more info at: https://github.com/tailwindlabs/heroicons
    npm install @heroicons/react
4. Install next-auth. See instructions at: https://next-auth.js.org/getting-started/example
	npm install next-auth
5. To use the reddit provider follow the instructions at: https://next-auth.js.org/providers/reddit
	to create a new reddit app and enable the auth functionality. The fields to fill are:
	Name: educational react clone
	redirect uri: http://localhost:3000/api/auth/callback/reddit --> which is gonna be updated when deploying to vercel
	Once created the applciation copy the webapp ID and secret values and paste them
	 in the env.local config file.
	The next step is to wrap the entire app (_app.tsx) inside the SessionProvider provider, which
	allows us to use the session and hooks from next-auth.
6. Configure the supabase database:
	- Go to supabase.com, signIn and/or create an account. In this case we're going 
	to sign In with github account.
	- Set up the postgres DB:
		- Create a new project an name it reddit-react and assign it a string password.
		- Create the post, comment, vote, and subreddit tables.
7. Configure StepZen to access database through graphql:
	- Go to stepzen.com and create a free account by signing in with github as well.
	- Follow the instructions to install the required dependencies:
		npm install -g stepzen
	- To login with the new account use the following command:
		stepzen login -a wertheim
		* when asked for the admin password, enter the admin key that stepzen provides.
	- Use the provided API Key when needed (go to StepZen account to get the API key)
	- Create the folder stepzen at the root of this project.
	- Initialize StepZen:
		ct stepzen
		stepzen init
		👆🏻👆🏻👆🏻 (when asked: "What would you like your endpoint to be called?" 
		|--> Accept the sugestion by pressing enter)
		This command created the file stepzen.config.json inside the stepzen diectory.

	- For more detailed information go to this link: https://stepzen.com/docs/quick-start/install-and-setup
	- Now, in order to implement the PostgreSQL backend run the following command
	inside the stepzen directory::
		stepzen import postgresql
		👆👆👆 This command starts creating a GraphQL API that connects the
		 data from your PostgreSQL database. For more info go to https://stepzen.com/docs/quick-start/with-database-postgresql
		 The folder postgresql and index.graphql file inside that folder, which contains the graphql types 
		 (based on the tables already registered on supabase), inside that folfer were automatically created.
		 The file index.graphql was also created automatically.
	- To fill the required information go to supabase - settings - Database ->
		 Then in that view scroll down to "Connection Info" and copy the
		  credentials described there:	Host, db name, port, user, password.
	- To deploy and run the generated GraphQL schema for your database to StepZen
	run the following command:
		setpzen start
	- Now that we deployed to setpZen we can test our graphql queries at: http://localhost:5001/api/wistful-horse
	which is a graphiql like interface
8. Configure apolloclient for nextjs. We can follow the specific instructions for nextjs at: https://www.apollographql.com/blog/apollo-client/next-js/next-js-getting-started/
	-Create the file apollo-client.js at the root level. Inside this file we could use
	the example detailed in the link above 👆👆👆
	- Install apollo client as well as graphql:
		npm install @apollo/client graphql
	- Obtain the API key (after having installed and configured stepzen 
    as described lines above) we execute the command
    	 stepzen whoami --apikey 
    then copy the api key and paste in the env.local file by assigning to the NEXT_PUBLIC_STEPZEN_KEY variable
9. Configure the NEXTAUTH_SECRET AND NEXTAUTH_URL variables in the env.local file.
10. Install react-hook form. For more info go to: https://react-hook-form.com/
	npm install react-hook-form
11. Edit the postgresql/index.graphql file and remove or comment the created_at parameter 
at insertPost mutation because we don't need to send that info.
 11.1 Create the folder graphql at the root of the project inside which we'll create the
 queries.ts and mutations.ts files.
12. Install react hot toast : https://react-hot-toast.com/docs
	npm install react-hot-toast
13. Create the file typings.d.ts in which we'll define the typescript types to be used along The
application. These types will be compatible with the graphql types defined in their corresponding graphql files.
14. Install react-timeago to show how long the user posted a reddit
		npm i react-timeago
	If necessary, in case that when importing the depenncy (import TimeAgo from 'react-timeago'), 
	the 'react-timeago' is red underlined,  install the corresponding developer dependency types definitions
		npm i --save-dev @types/react-timeago`
15. Install loaders UI ball (for more info go to: https://uiball.com/loaders/)
	npm install @uiball/loaders
16. Create the repository reddit-react in github, then add the project to the repository:
	git remote add origin https://github.com/rccc7/reddit-react.git
	git add .
