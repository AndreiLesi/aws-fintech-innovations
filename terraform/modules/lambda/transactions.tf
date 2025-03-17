module "get_transactions_lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 6.0"

  function_name = "financial-dashboard-get-transactions-${var.environment}"
  description   = "Get transactions Lambda function for the Financial Dashboard"
  handler       = "get_transactions.lambda_handler"
  runtime       = "python3.9"
  
  source_path = "${local.lambda_src_path}/transactions"
  
  create_role = false
  lambda_role = module.lambda_role.iam_role_arn
  
  layers = [
    module.lambda_layer_utils.lambda_layer_arn
  ]
  
  environment_variables = {
    TRANSACTIONS_TABLE = var.transactions_table_name
  }
  
  # CloudWatch Logs configuration
  cloudwatch_logs_retention_in_days = 30
  cloudwatch_logs_tags = {
    Environment = var.environment
    Function    = "get-transactions"
  }
  
  tags = {
    Environment = var.environment
    Function    = "get-transactions"
  }
}

module "create_transaction_lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 6.0"

  function_name = "financial-dashboard-create-transaction-${var.environment}"
  description   = "Create transaction Lambda function for the Financial Dashboard"
  handler       = "create_transaction.lambda_handler"
  runtime       = "python3.9"
  
  source_path = "${local.lambda_src_path}/transactions"
  
  create_role = false
  lambda_role = module.lambda_role.iam_role_arn
  
  layers = [
    module.lambda_layer_utils.lambda_layer_arn
  ]
  
  environment_variables = {
    TRANSACTIONS_TABLE = var.transactions_table_name
  }
  
  # CloudWatch Logs configuration
  cloudwatch_logs_retention_in_days = 30
  cloudwatch_logs_tags = {
    Environment = var.environment
    Function    = "create-transaction"
  }
  
  tags = {
    Environment = var.environment
    Function    = "create-transaction"
  }
}

# Lambda permissions for API Gateway
resource "aws_lambda_permission" "get_transactions" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.get_transactions_lambda.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_execution_arn}/*/*"
}

resource "aws_lambda_permission" "create_transaction" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.create_transaction_lambda.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_execution_arn}/*/*"
} 