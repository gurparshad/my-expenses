# Expense Application

This is a fullstack application built in express js and stencil js. which helps users to track there expenses.

## Video Demo
https://drive.google.com/file/d/1K0RvtcimUc02x8Fr9laD7FAKlSKq4CO8/view?usp=sharing


## Key Features 
- User can create an expense by adding description, amount, date and category.
- Update an expense
- Delete an expense
- List of expenses
- Chart view of expense
- Month, year and category filter.
- Pagination
- Dark and Light Mode
- Good coding practices 

## Steps to run the application

- Clone the repo by running the command "git clone https://github.com/gurparshad/my-expenses.git"
- For simplicity both the backend and frontend are in single repository. Both are required to run separatly.
  
### Setup and start backend
  - Switch to backend directory
  - Create a .env file and copy the data from example.env file.
  - Open the terminal run the following commands
  - Run "npm install" to install the required packages
  - Run "npm run start" to start the project
  - The application will start at http://localhost:3000 incase its not in use by any other application.
  - You can alos find the swagger documentation at http://localhost:3000/api-docs/#/
 
### Setup and start Frontend
  - Switch to frontend directory
  - Create a .env file and copy the data from example.env file.
  - Open the terminal run the following commands
  - Run "npm install" to install the required packages
  - Run "npm run start" to start the project
  - The application will start at http://localhost:3333 incase its not in use by any other application.

 ## Tech stack 
 ### Frontend
   - Html
   - CSS, CSS Variables
   - Stencil js
   - Typescript
   - Prettier
   - Eslint
   - Axios
   - Chart js
   - Flatpickr
   - Ionicons

### Backend
  - Typescript
  - Express js
  - Swagger
  - Prettier
  - Eslint

## Further improvments
As time was limited, some other improvements would be 
- Better UI
- Custom date filter
- implement Docker
- Dialog box before deleting a expense.
- Instead of alert a success message compnnet after deleteion, creation and update.
- Expense Categories can be fetched from the API, currently they are constants.
- Loading component.
- New expenses go at the bottom of the list, bring new once on the top.
- Also currently it does not show the expenses after 2024. if user add future expense, its not visible in the list.
- Last but not the least Test case :)
