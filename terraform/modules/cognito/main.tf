# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = var.user_pool_name
  
  # User pool configuration
  username_attributes = ["email"]
  auto_verified_attributes = ["email"]
  
  # Password policy
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
    temporary_password_validity_days = 7
  }
  
  # Schema attributes
  schema {
    name                = "email"
    required            = true
    mutable             = true
    attribute_data_type = "String"
    
    string_attribute_constraints {
      min_length = 7
      max_length = 256
    }
  }
  
  schema {
    name                = "firstName"
    required            = false
    mutable             = true
    attribute_data_type = "String"
    
    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }
  
  schema {
    name                = "lastName"
    required            = false
    mutable             = true
    attribute_data_type = "String"
    
    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }
  
  tags = {
    Environment = var.environment
  }
}

# Cognito User Pool Client
resource "aws_cognito_user_pool_client" "main" {
  name = var.client_name
  user_pool_id = aws_cognito_user_pool.main.id
  
  generate_secret              = false
  refresh_token_validity       = 30
  prevent_user_existence_errors = "ENABLED"
  
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  
  callback_urls = ["http://localhost:3000"]
  logout_urls   = ["http://localhost:3000"]
}

# Cognito Identity Pool
resource "aws_cognito_identity_pool" "main" {
  identity_pool_name = var.identity_pool_name
  allow_unauthenticated_identities = false
  
  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.main.id
    provider_name           = "cognito-idp.${data.aws_region.current.name}.amazonaws.com/${aws_cognito_user_pool.main.id}"
    server_side_token_check = false
  }
  
  tags = {
    Environment = var.environment
  }
}

# IAM Role for authenticated users
resource "aws_iam_role" "authenticated" {
  name = "cognito_authenticated_${var.environment}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.main.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })
}

# IAM Policy for authenticated users
resource "aws_iam_role_policy" "authenticated" {
  name = "authenticated_policy"
  role = aws_iam_role.authenticated.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "mobileanalytics:PutEvents",
          "cognito-sync:*",
          "cognito-identity:*"
        ]
        Resource = "*"
      }
    ]
  })
}

# Attach roles to Identity Pool
resource "aws_cognito_identity_pool_roles_attachment" "main" {
  identity_pool_id = aws_cognito_identity_pool.main.id
  
  roles = {
    "authenticated" = aws_iam_role.authenticated.arn
  }
}

data "aws_region" "current" {} 