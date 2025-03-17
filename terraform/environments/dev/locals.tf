locals {
  environment = "dev"
  project     = "financial-dashboard"
  
  # DynamoDB table names
  transactions_table_name = "Transactions-${local.environment}"
  user_settings_table_name = "UserSettings-${local.environment}"
  
  # S3 bucket names
  frontend_bucket_name = "${local.project}-frontend-${local.environment}"
} 