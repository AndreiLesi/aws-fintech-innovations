output "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution"
  value       = module.cloudfront.cloudfront_distribution_id
}

output "cloudfront_distribution_arn" {
  description = "The ARN of the CloudFront distribution"
  value       = module.cloudfront.cloudfront_distribution_arn
}

output "cloudfront_distribution_domain_name" {
  description = "The domain name of the CloudFront distribution"
  value       = module.cloudfront.cloudfront_distribution_domain_name
} 