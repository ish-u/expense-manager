# Expense Manager

A Simple Expense Manager that helps Users track their Expenses.

## Demo

### [Demo Link](https://expense-manager-0.netlify.app/)

### ![img](demo/demo.gif)

## Run Locally

### Clone the project

```bash
  git clone https://github.com/ish-u/expense-manager.git
  cd expense-manager
```

### Setup Server

- Install Packages

  ```bash
  cd server
  npm i
  ```

- Obtain the **URI** for your Cluster and [OpenStackExchange](https://openexchangerates.org/) API KEY :-

  - [Set Up Atlas](https://docs.atlas.mongodb.com/getting-started/?tck=docs_driver_nodejs)
  - [Connect to Cluster](https://docs.mongodb.com/drivers/node/quick-start/)
  - Generate `YOUR SECRET KEY` using `require('crypto).randomBytes(64).toString('hex')`
  - Set Up `.env` file with the following variables

    ```
    DB_CONNECTION={YOUR CLUSTER URI}
    ACCESS_TOKEN_SECRET={YOUR SECRET KEY}
    CURRENCY_API_TOKEN={YOUR OPENSTACKEXCHANGE API KEY}
    ```

- Run the Server using

  ```bash
  npm run dev
  ```

- The Server will be live at `http://localhost:5000`

### Setup Client

- Install Packages

  ```bash
  cd client
  npm install
  ```

- Set Up `.env` file as following:

  ```
  VUE_APP_API=http://localhost:5000/api
  ```

- Run the Client using either

  ```
  npm run serve
  ```

- The Application will be live at `http://localhost:8080/`

## API Reference

- Base URL - `http://localhost:5000/`
- ### Sign In

  ```http
  POST /api/signin
  ```

  - Header

    ```JSON
    "Content-Type": "application/json"
    ```

  - Body
    ```JSON
    "username": username,
    "password": password,
    ```
  - Response

    - Success

      - Status Code :`200`
      - Data
        ```JSON
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlVzxXIwMiIsImlhdCI6MTYyNzIwODk4M30.d3KdCfAYrv2yircz9fBUwObJZHM9_4aVFKmbfR2Hx3Y"
        }
        ```

    - Error
      - Status Code `701`

- ### Sign Up

  ```http
  POST /api/signin
  ```

  - Header

    ```JSON
    "Content-Type": "application/json"
    ```

  - Body

    ```JSON
    "name": name,
    "username": username,
    "email": email,
    "password": password,
    ```

  - Response
    - Success
      - Status Code :`200`
    - Error
      - Status Code `701`

- ### Get Dashboard Data

  ```http
  GET /dashboard
  ```

  - Header

    ```JSON
    authorization: "Bearer " + TOKEN,
    ```

  - Body

    ```JSON
        "name": name,
        "username": username,
        "email": email,
        "password": password,
    ```

    - | URL Parameter       | Type     | Description                            |
      | :------------------ | :------- | :------------------------------------- |
      | `reqCurrnecySymbol` | `string` | **Required**. Currency of Total Amount |

  - Response
    - Success
      - Status Code : `200`
      - Data
      ```JSON
      {
          "transactions": [
          {
              "_id": "60fd15d984af3d003be4a248",
              "username": "User02",
              "DateTime": "2021-07-25T12:58:00.000Z",
              "Amount": 5000,
              "Currency": "INR",
              "Description": "Food",
              "Category": "Food",
              "__v": 0
          },
          {
              "_id": "60fd21d60e4eb50f65ab60cb",
              "username": "User02",
              "DateTime": "2021-07-03T08:28:00.000Z",
              "Amount": 500,
              "Currency": "INR",
              "Description": "Food",
              "Category": "Food",
              "__v": 0
          }
          ],
          "totalAmount": 5500,
          "currencySymbols": [
              {
                  "ID": "ALL",
                  "Symbol": "Lek"
              },
              {
                  "ID": "XCD",
                  "Symbol": "$"
              },
              {
                  "ID": "EUR",
                  "Symbol": "€"
              },
              {
                  "ID": "BBD",
                  "Symbol": "$"
              },
              {
              "ID": "BTN",
              "Symbol": null
              },
              ...
              ],
          "exchangeRates": {
              "AED": 3.6732,
              "AFN": 79.608879,
              "ALL": 103.828805,
              "ARS": 96.34195,
              ...
              "ZWL": 322
          }
      }
      ```
    - Error
      - Status Code :`701`

- ### Get Expense Data (Transactions)

  ```http
  GET /getExpense
  ```

  - Header

    ```JSON
    authorization: "Bearer " + TOKEN,
    ```

  - Response
    - Success
      - Status Code : `200`
      - Data
        ```JSON
        {
            "_id": "60fd15d984af3d003be4a248",
            "username": "User02",
            "DateTime": "2021-07-25T12:58:00.000Z",
            "Amount": 5000,
            "Currency": "INR",
            "Description": "Food",
            "Category": "Food",
            "**v": 0
        },
        {
            "_id": "60fd21d60e4eb50f65ab60cb",
            "username": "User02",
            "DateTime": "2021-07-03T08:28:00.000Z",
            "Amount": 500,
            "Currency": "INR",
            "Description": "Food",
            "Category": "Food",
            "**v": 0
        }
        ```
    - Error
      - Status Code : `701`

- ### Save Expense Data (a Transactions)

  ```http
  POST /saveExpense
  ```

  - Header

    ```JSON
    "Content-Type": "application/json",
    authorization: "Bearer " + TOKEN,
    ```

  - Body

    ```JSON
    "date": Date,
    "time": Time,
    "Amount": Amount,
    "Currency": Currency,
    "Category": Category,
    "Description": Description,
    ```

  - Response
    - Success
      - Status Code : `200`
    - Error
      - Status Code : `701`

- ### Edit Expense Data (a Transactions)

  ```http
  POST /updateExpense
  ```

  - Header

    ```JSON
    "Content-Type": "application/json",
    authorization: "Bearer " + TOKEN,
    ```

  - Body

    ```JSON
    "date": Date,
    "time": Time,
    "Amount": Amount,
    "Currency": Currency,
    "Category": Category,
    "Description": Description,
    ```

  - | URL Parameter | Type     | Description                                    |
    | :------------ | :------- | :--------------------------------------------- |
    | `id`          | `string` | **Required**. ID of the Document to be Updated |

  - Response
    - Success
      - Status Code : `200`
    - Error
      - Status Code : `701`

- ### Delete Expense Data (a Transactions)

  ```http
  POST /deleteExpense
  ```

  - Header

    ```JSON
    "Content-Type": "application/json",
    authorization: "Bearer " + TOKEN,
    ```

  - | URL Parameter | Type     | Description                                    |
    | :------------ | :------- | :--------------------------------------------- |
    | `id`          | `string` | **Required**. ID of the Document to be Deleted |

  - Response
    - Success
      - Status Code : `200`
    - Error
      - Status Code : `701`

- ### Get Report

  ```http
  GET /getReport
  ```

  - Header

    ```JSON
    authorization: "Bearer " + TOKEN,
    ```

  - Response
    - Success
      - Status Code : `200`
      - Data
        ```JSON
        {
            "categoryMoney": {
                "Fuel": 667.165031198157,
                "Home": 2624.850141334595,
                "Food": 500
            },
            "weekMoney": {
                "26": "1750.00",
                "27": "1374.85",
                "28": "567.17",
                "29": "100.00",
                "30": 0
            },
            "range": [
                "Thu Jul 01 2021",
                "Sat Jul 31 2021"
            ]
        }
        ```
        _Currency - USD_
    - Error
      - Status Code : `701`
