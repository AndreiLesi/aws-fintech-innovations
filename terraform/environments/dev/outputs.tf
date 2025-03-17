output "api_gateway_url" {
  description = "The URL of the API Gateway"
  value       = module.api_gateway.invoke_url
}

output "cognito_user_pool_id" {
  description = "The ID of the Cognito User Pool"
  value       = module.cognito.user_pool_id
}

output "cognito_client_id" {
  description = "The ID of the Cognito User Pool Client"
  value       = module.cognito.client_id
}

output "cloudfront_distribution_domain" {
  description = "The domain name of the CloudFront distribution"
  value       = module.cloudfront.cloudfront_distribution_domain_name
}

output "frontend_bucket_name" {
  description = "The name of the S3 bucket for the frontend"
  value       = module.frontend.bucket_name
} 