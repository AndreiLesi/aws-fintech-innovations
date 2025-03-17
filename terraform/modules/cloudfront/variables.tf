variable "s3_bucket_domain_name" {
  description = "The domain name of the S3 bucket"
  type        = string
}

variable "environment" {
  description = "The environment (dev, staging, prod)"
  type        = string
}

variable "api_gateway_url" {
  description = "The URL of the API Gateway"
  type        = string
} 