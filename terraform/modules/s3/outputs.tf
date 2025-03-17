output "bucket_name" {
  description = "The name of the S3 bucket"
  value       = module.s3_bucket.s3_bucket_id
}

output "bucket_arn" {
  description = "The ARN of the S3 bucket"
  value       = module.s3_bucket.s3_bucket_arn
}

output "bucket_domain_name" {
  description = "The domain name of the S3 bucket"
  value       = module.s3_bucket.s3_bucket_bucket_regional_domain_name
}

output "website_endpoint" {
  description = "The website endpoint of the S3 bucket"
  value       = module.s3_bucket.s3_bucket_website_endpoint
} 