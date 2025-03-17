module "s3_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 4.6"

  bucket = var.bucket_name
  force_destroy = true
  
  # S3 bucket-level Public Access Block configuration
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
  
  # S3 website configuration
  website = {
    index_document = "index.html"
    error_document = "index.html"
  }
  
  # CORS configuration
  cors_rule = [
    {
      allowed_methods = var.cors_allowed_methods
      allowed_origins = var.cors_allowed_origins
      allowed_headers = var.cors_allowed_headers
      expose_headers  = var.cors_expose_headers
      max_age_seconds = var.cors_max_age_seconds
    }
  ]
  
  # Bucket policy
  attach_policy = true
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "arn:aws:s3:::${var.bucket_name}/*"
      }
    ]
  })
  
  tags = {
    Name        = var.bucket_name
    Environment = var.environment
  }
} 