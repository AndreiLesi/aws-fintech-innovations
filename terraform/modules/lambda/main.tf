locals {
  lambda_src_path = "${path.module}/../../../src/lambda"
}

# Lambda layer for utility functions
module "lambda_layer_utils" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 6.0"

  create_layer = true
  layer_name   = "financial-dashboard-utils-layer-${var.environment}"
  description  = "Lambda layer with utility functions for the Financial Dashboard"
  
  compatible_runtimes = ["python3.9"]
  
  source_path = "${local.lambda_src_path}/layers"
}

# IAM role for Lambda functions
module "lambda_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-assumable-role"
  version = "~> 5.52"

  create_role = true
  role_name   = "financial-dashboard-lambda-role-${var.environment}"
  role_requires_mfa = false
  
  custom_role_policy_arns = [
    module.lambda_policy_dynamodb.arn,
    module.lambda_policy_logs.arn
  ]
  
  trusted_role_services = ["lambda.amazonaws.com"]
}

# IAM policy for Lambda to access DynamoDB
module "lambda_policy_dynamodb" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-policy"
  version = "~> 5.52"

  name        = "financial-dashboard-lambda-dynamodb-policy-${var.environment}"
  description = "IAM policy for Lambda to access DynamoDB"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Effect   = "Allow"
        Resource = [
          "arn:aws:dynamodb:*:*:table/${var.transactions_table_name}",
          "arn:aws:dynamodb:*:*:table/${var.transactions_table_name}/index/*",
          "arn:aws:dynamodb:*:*:table/${var.user_settings_table_name}"
        ]
      }
    ]
  })
}

# IAM policy for Lambda to access CloudWatch Logs
module "lambda_policy_logs" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-policy"
  version = "~> 5.52"

  name        = "financial-dashboard-lambda-logs-policy-${var.environment}"
  description = "IAM policy for Lambda to write logs to CloudWatch"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
} 