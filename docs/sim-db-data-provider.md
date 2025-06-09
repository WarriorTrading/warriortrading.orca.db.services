# Account Service Provider

## DB Table Name

   orca_sim_account

### Table Fields

| Field Name   | Data Type | Description                                                  |
| ------------ | --------- | ------------------------------------------------------------ |
| id   | string    | User's account id                                            |
| user_id      | string    | User's ID                                                    |
| status       | int       | Account's status.1:Active 2:Frozen                        |
| original_payment       | long       | Account's original balance,unit $0.0001,if original balance is 150.72 the record value equals 1507200|
| cost      | long      | The accumulated trade cost after each trade, buy: avg price * qty; sell: - avg price * qty |
| frozen_payment | long      | Account's freeze balance. unit $0.0001,if the freezed payment is 80.72, the record value equals to 807200                    |
| created_at   | long      | The timestamp of account's created time(accurate to milliseconds),if created time is 2025-05-06 14:45:12 292, timestamp is 1746513912292|
| updated_at   |long			 | The timestamp of account's latest updated time(accurate to milliseconds), if update time is 2025-05-06 14:58:26 400, timestamp is 1746514706400|

### NOTE
   available_payment = original_payment - cost - frozen_payment

## Allowed Methods:
Find/Get/Create/Patch

## Account Find

- **Service Path**
   /accounts   
- **Service Example**
   /accounts?user_id=1234&status=1   
- **Service Method Type**
    GET
- **Description**   
   Find the user's current active account info.
- **Input Params**
  - user_id
  - status (if this param is empty, search all accounts)
  - limit (pageSize)
  - skip (offset)
- **Return Data Fields**
  - total
  - limit 
  - skip
  - data []
     - id
     - user_id
     - status
     - original_payment
     - cost
     - frozen_payment
     - created_at
     - updated_at

## Account Get

- **Service Path**
  /accounts/{id}
- **Service Example**
  /accounts/1
- **Service Method Type**
    GET  
- **Description**
   Get the user's account information by account id.
- **Input Params**
  - id
- **Return Data Fields**
  - id
  - user_id
  - status
  - original_payment
  - cost
  - frozen_payment
  - created_at
  - updated_at

## Account Create

- **Service Path**
  /accounts
- **Service Example**
  /accounts
  {
      "id": "1234", 
      "user_id": "U12", 
      "original_payment": 100501100
  }  
- **Service Method Type**
  POST    
- **Description**
  Create a new account according to provided info
- **Input Params**
  - id  
  - user_id
  - original_payment  
- **Return Data Fields**
  - id 
  - user_id 
  - status
  - original_payment
  - cost
  - frozen_payment
  - created_at
  - updated_at    

## Account Patch

- **Service Path**
  /accounts/{id}
- **Service Example**
  /accounts/1234
  {
      "id": "1234", 
      "user_id": "U12", 
      "cost": 140000, 
      "frozen_payment": 8425000
  }  
- **Service Method Type**
  PATCH    
- **Description**
  Update an existed account according to new info
- **Input Params**
  - account_id
  - the account's fields to be updated(such as status)
- **Return Data Fields**
  - id
  - user_id
  - status
  - original_payment
  - cost
  - frozen_payment
  - created_at
  - updated_at  

# DB Order Service Provider

## DB Table Name

   orca_sim_order

### Table Fields

| Field Name   | Data Type | Description                                                  |
| ------------ | --------- | ------------------------------------------------------------ |
| id | string    |   account's order id primary key   |
| user_id      | string    | User's ID                                                    |
| account_id   | string    | User's account id                                            |
| symbol       | string       | The order's related symbol code.                      |
| exchange_code       | string       | The order's exchange organization code,such as NSDQ,default is empty|
| side      | int      | The order's trading side 1:buy 2:sell                        |
| order_type      | int      | The order's type code 1:market order 2:limit order     |
| trade_type      | int      | The order's trader type code 1:day 2:gtc 3:ioc, default is day|
| status      | int    |  The order's status
|             |          |  1：NEW Order has been accepted but not yet processed
|             |          |  2: VALIDATED Order is validated successfully and waits for being matched.
|             |          |  3: FILLED Order has been completely matched.
|             |          |  4: REJECTED Order has been rejected due to validation failure.
|             |          |  5: EXPIRED order's processing time exceeds the trading hours.
|             |          |  6: CANCELLED Order has been cancelled.
| is_cancelling      | bool    |  true for cancelling, default: false
| price | long      | The order's ask/bid price. unit $0.0001,such as $105.73, the record value is 1057300 |
| avg_exec_price | long      | The order's average execution price for matched qty. unit $0.0001,such as $102.73, the record value is 1027300 |
| qty      | int      | The order's trade quantity, such as 50 |
| filled_qty      | int      | The order's matched quantity, such as 20 |
| cost      | long      | buy: avg price * qty; sell: - avg price * qty |
| frozen_payment      | long      | The frozen account's balance of this order,unit:$0.0001 |
| frozen_qty      | int      | The frozen quantity of this order |
| rejection_reason      | string      | The order's rejection reason |
| created_at   | long      | The timestamp of order's created time(accurate to milliseconds) |
| updated_at   |long			 | The timestamp of order's latest updated time(accurate to milliseconds)|

 
## Allowed Methods:
Find/Get/Create/Patch

 ## Order Find

- **Service Path**
   /orders
- **Service Example**
   /orders?account_id=1234&status=1&symbol=AAPL      
- **Service Method Type**
    GET
- **Description**   
   Find the user account's orders according to condition，the results is ordered by created_at column desc
- **Input Params**
  - account_id
  - status (order's status, if not provided, find account's all orders)
  - symbol
  - side
  - startTime (Such as 1746720000000, it is 2025-05-09 00:00:00)
  - endTime (Such as 1746806399000, it is 2025-05-09 23:59:59)
  - limit (pageSize)
  - skip (offset)
- **Return Data Fields**
  - total
  - limit 
  - skip
  - data []
     - id
     - user_id
     - account_id
     - symbol
     - exchange_code
     - side
     - order_type
     - trade_type
     - status
     - is_cancelling
     - price
     - avg_exec_price
     - quantity
     - filled_qty
     - frozen_payment
     - frozen_qty
     - rejection_reason
     - created_at
     - updated_at

  
  
  ## Order Get

- **Service Path**
   /orders/{id}
- **Service Example**
   /orders/212  
- **Service Method Type**
   GET
- **Description**   
   Find the user account's order according to order id.
- **Input Params**
  - id  
- **Return Data Fields**
  - id
  - user_id
  - account_id
  - symbol
  - exchange_code
  - side
  - order_type
  - trade_type
  - status
  - is_cancelling
  - price
  - avg_exec_price
  - qty
  - filled_qty
  - frozen_payment
  - frozen_qty
  - rejection_reason
  - created_at
  - updated_at

## Order Create

- **Service Path**
  /orders
- **Service Example**
  /orders  
  {
      "id": "212", 
      "user_id": "U12",
      "account_id":"A11",
      "symbol":"AAPL",
      "exchange_code":"NSNQ",
      "side":1,
      "order_type":2,
      "trade_type":1,
      "price":1070100,
      "qty":100
  } 

- **Service Method Type**
  POST    
- **Description**
  Create a new order info
- **Input Params**
  - id
  - user_id
  - account_id
  - symbol
  - exchange_code
  - side
  - order_type
  - trade_type
  - price
  - qty
- **Return Data Fields**
  - id
  - user_id
  - account_id
  - symbol
  - exchange_code
  - side
  - order_type
  - trade_type
  - status
  - is_cancelling
  - price
  - avg_exec_price
  - qty
  - filled_quantity
  - frozen_payment
  - frozen_qty
  - rejection_reason
  - created_at
  - updated_at

## Order Patch

- **Service Path**
  /orders/{id}
- **Service Example**
  /orders/212
  {
      "id": "212", 
      "is_cancelling":true
  }   
- **Service Method Type**
  PATCH    
- **Description**
  Update an existed order according to new info
- **Input Params**
  - order_id
  - the order's fields to be updated(such as status,avg_exec_price,filled_qty,frozen_payment,frozen_qty,rejection_reason)
- **Return Data Fields**
  - id
  - user_id
  - account_id
  - symbol
  - exchange_code
  - side
  - order_type
  - trade_type
  - status
  - is_cancelling
  - price
  - avg_exec_price
  - qty
  - filled_quantity
  - frozen_payment
  - frozen_qty
  - rejection_reason
  - created_at
  - updated_at

# DB Position Service Provider
## DB Table Name

   orca_sim_position

### Table Fields

| Field Name   | Data Type | Description                                                  |
| ------------ | --------- | ------------------------------------------------------------ |
| id | string    |   account's position id primary key   |
| user_id      | string    | User's ID                                                    |
| account_id   | string    | User's account id                                            |
| symbol       | string       | The position's related symbol code.                      |
| position_type       | int       | The position's type 1:Long Position 2:Short Position  |
| avg_price | long      | The position's average trade price for matched qty. unit $0.0001,such as $102.73, the record value is 1027300 |
| qty      | int      | The position's current qty, such as 50 |
| total_qty      | int      | The order's accumulative trade orders' qty today |
| realized_pl      | decimal      | The order's realized Profit & Loss amount |
| frozen_qty      | int      | The position's frozen quantity |
| executions      | string      | The position's execution list string, including each order's id, price and qty |
| created_at   | long      | The timestamp of position's created time(accurate to milliseconds) |
| updated_at   |long			 | The timestamp of position's latest updated time(accurate to milliseconds)|
| closed_at   |long			 | The timestamp of position's closed time(accurate to milliseconds), default is 0, means opened|

## Allowed Methods:
Find/Get/Create/Patch

## Position Find

- **Service Path**
   /positions
- **Service Example**
  /positions?account_id=U12&symbol=AAPL   
- **Service Method Type**
  GET
- **Description**   
   Find the user account's positions according to condition,the results is ordered by created_at column
- **Input Params**
  - account_id
  - symbol (if not provided, find all positions)
  - limit (pageSize)
  - skip (offset)
- **Return Data Fields**
  - total
  - limit 
  - skip
  - data []
      - id
      - user_id
      - account_id
      - symbol
      - position_type
      - avg_price
      - qty
      - total_qty
      - frozen_qty
      - realized_pl
      - executions  
      - created_at
      - updated_at
      - closed_at
  
## Position Get

- **Service Path**
   /positions/{id}
- **Service Example**
  /positions/151   
- **Service Method Type**
   GET
- **Description**   
   Find the position info according to position id.
- **Input Params**
  - id  
- **Return Data Fields**
   - id
   - user_id
   - account_id
   - symbol
   - position_type
   - avg_price
   - qty
   - total_qty
   - frozen_qty
   - realized_pl
   - executions  
   - created_at
   - updated_at
   - closed_at

## Position Create

- **Service Path**
  /positions
- **Service Example**
  /positions  
  {
      "id": "151", 
      "user_id": "U12",
      "account_id":"A11",
      "symbol":"AAPL",
      "position_type":1,
      "avg_price":1507200,
      "qty":50,
      "executions":"[{\"order_id\":\"1001\",\"price\":150720,\"qty\":50,\"side\":1}]",
      "total_qty":50,
      "frozen_qty":0,
      "realized_pl":0
  }   
- **Service Method Type**
  POST    
- **Description**
  Create a new position info
- **Input Params**
  - id
  - user_id
  - account_id
  - symbol
  - position_type
  - avg_price
  - qty
- **Return Data Fields**
   - id
   - user_id
   - account_id
   - symbol
   - position_type
   - avg_price
   - qty
   - total_qty
   - frozen_qty
   - realized_pl
   - executions  
   - created_at
   - updated_at
   - closed_at    

## Position Patch

- **Service Path**
  /positions/{id} 
- **Service Example**
  /positions/151  
  {
      "id": "151", 
      "user_id": "U12",
      "account_id":"A11",
      "symbol":"AAPL",
      "executions":"[{\"order_id\":\"276A2D6734B94B1E80E888409EBBC96C\",\"price\":116650,\"qty\":20,\"side\":1}]",
      "total_qty":80,
      "frozen_qty":0,
      "realized_pl":130.54
  }     
- **Service Method Type**
    PATCH    
- **Description**
  Update an existed position according to new info
- **Input Params**
  - position_id
  - the order's fields to be updated(such as qty,executions,total_qty,frozen_qty,realized_pl)
- **Return Data Fields**
   - id
   - user_id
   - account_id
   - symbol
   - position_type
   - avg_price
   - qty
   - total_qty
   - frozen_qty
   - realized_pl
   - executions  
   - created_at
   - updated_at
   - closed_at  