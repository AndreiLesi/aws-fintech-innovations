variable "environment" {
  description = "The environment (dev, staging, prod)"
  type        = string
}

variable "transactions_table_name" {
  description = "The name of the DynamoDB table for transactions"
  type        = string
}

variable "user_settings_table_name" {
  description = "The name of the DynamoDB table for user settings"
  type        = string
}

variable "cognito_user_pool_id" {
  description = "The ID of the Cognito User Pool"
  type        = string
}

variable "cognito_client_id" {
  description = "The ID of the Cognito User Pool Client"
  type        = string
}

variable "api_gateway_execution_arn" {
  description = "The execution ARN of the API Gateway"
  type        = string
} 