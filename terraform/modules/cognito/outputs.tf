output "user_pool_id" {
  description = "The ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.id
}

output "user_pool_arn" {
  description = "The ARN of the Cognito User Pool"
  value       = aws_cognito_user_pool.main.arn
}

output "client_id" {
  description = "The ID of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.main.id
}

output "identity_pool_id" {
  description = "The ID of the Cognito Identity Pool"
  value       = aws_cognito_identity_pool.main.id
} 