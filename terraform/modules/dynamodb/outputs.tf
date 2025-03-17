output "transactions_table_name" {
  description = "The name of the DynamoDB table for transactions"
  value       = module.dynamodb_transactions_table.dynamodb_table_id
}

output "transactions_table_arn" {
  description = "The ARN of the DynamoDB table for transactions"
  value       = module.dynamodb_transactions_table.dynamodb_table_arn
}

output "user_settings_table_name" {
  description = "The name of the DynamoDB table for user settings"
  value       = module.dynamodb_user_settings_table.dynamodb_table_id
}

output "user_settings_table_arn" {
  description = "The ARN of the DynamoDB table for user settings"
  value       = module.dynamodb_user_settings_table.dynamodb_table_arn
} 