module "get_profile_lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 6.0"

  function_name = "financial-dashboard-get-profile-${var.environment}"
  description   = "Get user profile Lambda function for the Financial Dashboard"
  handler       = "get_profile.lambda_handler"
  runtime       = "python3.9"
  
  source_path = "${local.lambda_src_path}/user"
  
  create_role = false
  lambda_role = module.lambda_role.iam_role_arn
  
  layers = [
    module.lambda_layer_utils.lambda_layer_arn
  ]
  
  environment_variables = {
    USER_SETTINGS_TABLE = var.user_settings_table_name
  }
  
  # CloudWatch Logs configuration
  cloudwatch_logs_retention_in_days = 30
  cloudwatch_logs_tags = {
    Environment = var.environment
    Function    = "get-profile"
  }
  
  tags = {
    Environment = var.environment
    Function    = "get-profile"
  }
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "get_profile" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.get_profile_lambda.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_gateway_execution_arn}/*/*"
} 