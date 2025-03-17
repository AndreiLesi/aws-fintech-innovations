variable "name" {
  description = "The name of the API Gateway"
  type        = string
}

variable "description" {
  description = "The description of the API Gateway"
  type        = string
}

variable "stage_name" {
  description = "The name of the API Gateway stage"
  type        = string
}

variable "environment" {
  description = "The environment (dev, staging, prod)"
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

variable "get_transactions_lambda_invoke_arn" {
  description = "The invoke ARN of the get transactions Lambda function"
  type        = string
}

variable "create_transaction_lambda_invoke_arn" {
  description = "The invoke ARN of the create transaction Lambda function"
  type        = string
}

variable "get_profile_lambda_invoke_arn" {
  description = "The invoke ARN of the get profile Lambda function"
  type        = string
}

variable "get_market_data_lambda_invoke_arn" {
  description = "The invoke ARN of the get market data Lambda function"
  type        = string
} 