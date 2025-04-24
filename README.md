# 🛡️ NestJS RBAC System

This project implements a **Role-Based Access Control (RBAC)** system in a NestJS API for three user types: `Client`, `ServiceProvider`, and `SuperAdmin`.

## 🚀 Getting Started

```bash
pnpm i
pnpm run start:dev
pnpm run migration:run
```

Access Swagger Docs at: [http://localhost:3000/api-doc](http://localhost:3000/api-doc)

A PGSQL Database needs to created locally. in the env I have set up its name as 'rbac'
Migration can be run using the command given above, also available in package.json.
It has users table and is used to store users for all roles. That code can be seen in authcontroller and routes can be tested from the swagger. 

For other apis in the user controller, db is not used mostly and it data is mostly hardcoded. 



## 🔐 Roles & Permissions

- `SuperAdmin`: Full access
- `ServiceProvider`: Access to their own tasks/bookings
- `Client`: Restricted access to their own data

### 🔒 Protected Endpoints

| Method | Endpoint                                | Access                        |
|--------|-----------------------------------------|-------------------------------|
| GET    | /user/tasks/:id                         | SuperAdmin or Task Owner      |
| GET    | /user/service-providers                 | Any Authenticated User        |
| GET    | /user/service-providers/bookings        | Authenticated User's(Service Provider) Bookings |

### 🛡️ How It Works

- Roles defined in `Role.enum.ts`
- `@Roles()` decorator to restrict access
- `RolesGuard` enforces route-level role checks
- Uses `AuthGuard('jwt')` for authentication
- 403 responses for unauthorized users

### 🧪 Testing

Use Swagger UI:

- Test access directly from Swagger interface
- For convinience and testing first make all three accounts of superadmin, client and service provider from respective register apis, you'll see in swagger. And then login one by one, put the given accesscode in authentication and you will be able to test.
- Api#1, /user/tasks/:id   --Returns tasks data of given task id only if that task belongs to the user logged in (Client). OR to super admin
- Api#2, /user/service-providers   --//the logic is just that it returns users data to all authenticated users. 
- Api#3, /user/service-providers/bookings  --This returns data of current service provider logged in, and solely for service providers' role as per understading.


