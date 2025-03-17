module "cloudfront" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "~> 4.1"

  comment             = "CloudFront distribution for ${var.environment} environment"
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100"
  retain_on_delete    = false
  wait_for_deployment = false
  default_root_object = "index.html"

  # S3 origin
  origin = {
    s3_origin = {
      domain_name = var.s3_bucket_domain_name
      origin_id   = "S3Origin"
      custom_origin_config = {
        http_port              = 80
        https_port             = 443
        origin_protocol_policy = "http-only"
        origin_ssl_protocols   = ["TLSv1.2"]
      }
    }
  }

  default_cache_behavior = {
    target_origin_id       = "S3Origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true
    query_string    = false

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  ordered_cache_behavior = [
    {
      path_pattern           = "/api/*"
      target_origin_id       = "S3Origin"
      viewer_protocol_policy = "redirect-to-https"

      allowed_methods = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
      cached_methods  = ["GET", "HEAD"]
      compress        = true
      query_string    = true

      headers   = ["Authorization"]
      cookies_forward = "all"

      min_ttl     = 0
      default_ttl = 0
      max_ttl     = 0
    }
  ]

  viewer_certificate = {
    cloudfront_default_certificate = true
  }

  geo_restriction = {
    restriction_type = "none"
  }

  custom_error_response = [
    {
      error_code         = 403
      response_code      = 200
      response_page_path = "/index.html"
    },
    {
      error_code         = 404
      response_code      = 200
      response_page_path = "/index.html"
    }
  ]

  tags = {
    Environment = var.environment
  }
} 