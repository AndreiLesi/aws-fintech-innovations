# API Gateway
module "api_gateway" {
  source = "../../modules/api_gateway"
  
  name        = "${local.project}-${local.environment}"
  description = "API Gateway for the Financial Dashboard"
  stage_name  = local.environment
  environment = local.environment
  
  # Cognito configuration
  cognito_user_pool_id = module.cognito.user_pool_id
  cognito_client_id    = module.cognito.client_id
  
  # Lambda function ARNs
  get_transactions_lambda_invoke_arn    = module.lambda.get_transactions_lambda_invoke_arn
  create_transaction_lambda_invoke_arn  = module.lambda.create_transaction_lambda_invoke_arn
  get_profile_lambda_invoke_arn         = module.lambda.get_profile_lambda_invoke_arn
  get_market_data_lambda_invoke_arn     = module.lambda.get_market_data_lambda_invoke_arn
}

# Cognito
module "cognito" {
  source = "../../modules/cognito"
  
  user_pool_name     = "${local.project}-users"
  client_name        = "${local.project}-client"
  identity_pool_name = "${local.project}-identity-pool"
  environment        = local.environment
}

# DynamoDB
module "dynamodb" {
  source = "../../modules/dynamodb"
  
  transactions_table_name = local.transactions_table_name
  user_settings_table_name = local.user_settings_table_name
}

# Lambda Functions
module "lambda" {
  source = "../../modules/lambda"
  
  environment = local.environment
  api_gateway_execution_arn = module.api_gateway.execution_arn
  
  transactions_table_name = module.dynamodb.transactions_table_name
  user_settings_table_name = module.dynamodb.user_settings_table_name
  
  cognito_user_pool_id = module.cognito.user_pool_id
  cognito_client_id = module.cognito.client_id
}

# S3 and CloudFront for Frontend
module "frontend" {
  source = "../../modules/s3"
  
  bucket_name = local.frontend_bucket_name
  environment = local.environment
}

module "cloudfront" {
  source = "../../modules/cloudfront"
  
  s3_bucket_domain_name = module.frontend.bucket_domain_name
  environment = local.environment
  api_gateway_url = module.api_gateway.invoke_url
} 