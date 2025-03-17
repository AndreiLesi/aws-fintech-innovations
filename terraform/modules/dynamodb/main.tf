module "dynamodb_transactions_table" {
  source  = "terraform-aws-modules/dynamodb-table/aws"
  version = "~> 4.0"

  name      = var.transactions_table_name
  hash_key  = "userId"
  range_key = "id"
  
  billing_mode = "PAY_PER_REQUEST"
  
  attributes = [
    {
      name = "userId"
      type = "S"
    },
    {
      name = "id"
      type = "S"
    },
    {
      name = "date"
      type = "S"
    }
  ]
  
  global_secondary_indexes = [
    {
      name               = "DateIndex"
      hash_key           = "userId"
      range_key          = "date"
      projection_type    = "ALL"
    }
  ]
  
  point_in_time_recovery_enabled = true
  
  tags = {
    Name        = var.transactions_table_name
    Environment = var.environment
  }
}

module "dynamodb_user_settings_table" {
  source  = "terraform-aws-modules/dynamodb-table/aws"
  version = "~> 4.0"

  name     = var.user_settings_table_name
  hash_key = "userId"
  
  billing_mode = "PAY_PER_REQUEST"
  
  attributes = [
    {
      name = "userId"
      type = "S"
    }
  ]
  
  point_in_time_recovery_enabled = true
  
  tags = {
    Name        = var.user_settings_table_name
    Environment = var.environment
  }
} 