---
config:
  theme: dark
---
erDiagram
    USERS ||--o{ ONRAMPS : "has"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ TRADES : "participates in"
    USERS ||--o{ USER_BALANCES : "has"
    USERS ||--o{ USER_TOKENS : "owns"
    SYMBOLS ||--o{ ORDERS : "referenced in"
    SYMBOLS ||--o{ TRADES : "referenced in"
    SYMBOLS ||--o{ USER_TOKENS : "referenced in"
    USERS {
        uuid id PK
        varchar username
        text email
        boolean isAdmin
        text password
        boolean isVerified
        text salt
        text code
        timestamp createdAt
        timestamp updatedAt
    }
    SYMBOLS {
        text name PK
        timestamp createdAt
        timestamp updatedAt
    }
    ONRAMPS {
        serial id PK
        uuid userId FK "references USERS(id)"
        integer amount
        timestamp createdAt
        timestamp updatedAt
    }
    ORDERS {
        serial id PK
        uuid userId FK "references USERS(id)"
        text stockSymbol FK "references SYMBOLS(name)"
        integer quantity
        integer price
        text stockType
        text status
        timestamp createdAt
        timestamp updatedAt
    }
    TRADES {
        serial id PK
        uuid buyerId FK "references USERS(id)"
        uuid sellerId FK "references USERS(id)"
        text stockSymbol FK "references SYMBOLS(name)"
        integer quantity
        integer price
        text stockType
        timestamp createdAt
    }
    USER_BALANCES {
        uuid userId PK, FK "references USERS(id)"
        integer balance
        integer locked
        timestamp updatedAt
    }
    USER_TOKENS {
        serial id PK
        uuid userId FK "references USERS(id)"
        text stockSymbol FK "references SYMBOLS(name)"
        text tokenType
        integer quantity
        timestamp updatedAt
    }
