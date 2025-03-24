# Postman Authentication Scripts

## JWT Token Handling for Legal Practice Management API

The Postman collection handles authentication through JWT tokens. Here's how to properly authenticate with the API:

### Token Generation Scripts

When you log in, the collection will automatically store the raw tokens in environment variables:

#### Admin Login Script:

```javascript
var jsonData = JSON.parse(responseBody);
pm.environment.set("adminToken", jsonData.accessToken);
```

#### Attorney Login Script:

```javascript
var jsonData = JSON.parse(responseBody);
pm.environment.set("attorneyToken", jsonData.accessToken);
```

## Setting Up Authorization in Postman

Since the API requires tokens to be sent with the "Bearer " prefix, you need to configure Postman to add this prefix automatically:

### Method 1: Configure Collection Authorization (Recommended)

1. In Postman, click on the collection name ("Legal Practice Management API")
2. Go to the "Authorization" tab
3. Set Type to "Bearer Token"
4. In the Token field, enter `{{adminToken}}` or `{{attorneyToken}}`
5. Postman will automatically add the "Bearer " prefix to your token

### Method 2: Configure Individual Request Authorization

1. Click on any individual request
2. Go to the "Authorization" tab
3. Set Type to "Bearer Token"
4. In the Token field, enter `{{adminToken}}` or `{{attorneyToken}}`
5. Postman will automatically add the "Bearer " prefix to your token

### Method 3: Manually Add Bearer Prefix in Headers

If you prefer to set headers manually, add this header to your requests:
```
Authorization: Bearer {{adminToken}}
```
or
```
Authorization: Bearer {{attorneyToken}}
```

Note: You must manually add the "Bearer " prefix in this case.

## Testing Workflow

1. Run the "Login as Admin" or "Login as Attorney" request first
2. The token will be stored in `adminToken` or `attorneyToken` environment variables
3. Ensure your Authorization is set up to use Bearer authentication with these variables
4. Proceed with other API requests

## Troubleshooting Authorization Issues

If you encounter "Unauthorized" responses (401 errors):

1. Verify that you've successfully obtained a token by running the login request
2. Check that your Authorization is set to "Bearer Token" type
3. Confirm that you're using the correct variable (`adminToken` or `attorneyToken`)
4. Ensure the "Bearer " prefix is being added (either by Postman or manually in the header)
5. Try regenerating your token by running the login request again
6. Verify that the API server is running and accessible at the specified baseUrl