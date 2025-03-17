variable "bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
}

variable "environment" {
  description = "The environment (dev, test, prod)"
  type        = string
}

variable "cors_allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "cors_allowed_methods" {
  description = "List of allowed methods for CORS"
  type        = list(string)
  default     = ["GET", "HEAD"]
}

variable "cors_allowed_headers" {
  description = "List of allowed headers for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "cors_expose_headers" {
  description = "List of expose headers for CORS"
  type        = list(string)
  default     = ["ETag"]
}

variable "cors_max_age_seconds" {
  description = "The time in seconds that browser can cache the response for a preflight request"
  type        = number
  default     = 3600
} 