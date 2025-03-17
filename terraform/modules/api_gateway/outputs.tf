output "invoke_url" {
  description = "The URL to invoke the API Gateway"
  value       = module.api_gateway.api_endpoint
}

output "execution_arn" {
  description = "The execution ARN of the API Gateway"
  value       = module.api_gateway.api_execution_arn
}

output "api_id" {
  description = "The ID of the API Gateway"
  value       = module.api_gateway.api_id
}

output "stage_id" {
  description = "The ID of the API Gateway stage"
  value       = module.api_gateway.stage_id
}