output "get_transactions_lambda_invoke_arn" {
  description = "The invoke ARN of the get transactions Lambda function"
  value       = module.get_transactions_lambda.lambda_function_invoke_arn
}

output "create_transaction_lambda_invoke_arn" {
  description = "The invoke ARN of the create transaction Lambda function"
  value       = module.create_transaction_lambda.lambda_function_invoke_arn
}

output "get_profile_lambda_invoke_arn" {
  description = "The invoke ARN of the get profile Lambda function"
  value       = module.get_profile_lambda.lambda_function_invoke_arn
}

output "get_market_data_lambda_invoke_arn" {
  description = "The invoke ARN of the get market data Lambda function"
  value       = module.get_market_data_lambda.lambda_function_invoke_arn
}

output "lambda_role_arn" {
  description = "The ARN of the IAM role used by Lambda functions"
  value       = module.lambda_role.iam_role_arn
}

# Lambda layer outputs
output "utils_layer_arn" {
  description = "ARN of the utils Lambda layer"
  value       = module.lambda_layer_utils.lambda_layer_arn
} 