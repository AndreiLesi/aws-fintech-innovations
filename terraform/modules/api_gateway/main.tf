module "api_gateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "~> 5.0"

  name          = var.name
  description   = var.description
  protocol_type = "HTTP"

  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  # Domain
  create_domain_name = false

  # Default stage
  create_stage = true

  # Routes and integrations
  routes = {
    # Transactions routes
    "GET /transactions" = {
      integration = {
        uri                    = var.get_transactions_lambda_invoke_arn
        payload_format_version = "2.0"
        timeout_milliseconds   = 12000
      }
      authorization_type = "JWT"
      authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
    }

    "POST /transactions" = {
      integration = {
        uri                    = var.create_transaction_lambda_invoke_arn
        payload_format_version = "2.0"
        timeout_milliseconds   = 12000
      }
      authorization_type = "JWT"
      authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
    }

    # User profile routes
    "GET /user/profile" = {
      integration = {
        uri                    = var.get_profile_lambda_invoke_arn
        payload_format_version = "2.0"
        timeout_milliseconds   = 12000
      }
      authorization_type = "JWT"
      authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
    }
    
    "POST /user/profile" = {
      integration = {
        uri                    = var.get_profile_lambda_invoke_arn
        payload_format_version = "2.0"
        timeout_milliseconds   = 12000
      }
      authorization_type = "JWT"
      authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
    }

    # Market data routes
    "GET /market/data" = {
      integration = {
        uri                    = var.get_market_data_lambda_invoke_arn
        payload_format_version = "2.0"
        timeout_milliseconds   = 12000
      }
      authorization_type = "JWT"
      authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
    }
  }

  tags = {
    Name        = var.name
    Environment = var.environment
  }
}

# Cognito authorizer
resource "aws_apigatewayv2_authorizer" "cognito" {
  api_id           = module.api_gateway.api_id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-authorizer"

  jwt_configuration {
    audience = [var.cognito_client_id]
    issuer   = "https://cognito-idp.${data.aws_region.current.name}.amazonaws.com/${var.cognito_user_pool_id}"
  }
}

data "aws_region" "current" {} 