provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment = local.environment
      Project     = local.project
      CreatedBy   = "AndreiLesi"
      ManagedBy   = "terraform"
    }
  }
} 