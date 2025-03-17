# CloudWatch Alarms for Lambda errors
module "lambda_error_alarm" {
  source  = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"
  version = "~> 5.0"
  
  for_each = {
    get_transactions = module.get_transactions_lambda.lambda_function_name
    create_transaction = module.create_transaction_lambda.lambda_function_name
    get_profile      = module.get_profile_lambda.lambda_function_name
    get_market_data  = module.get_market_data_lambda.lambda_function_name
  }
  
  alarm_name          = "lambda-errors-${each.value}"
  alarm_description   = "This alarm monitors errors in the ${each.value} Lambda function"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  threshold           = 0
  period              = 60
  namespace           = "AWS/Lambda"
  metric_name         = "Errors"
  statistic           = "Sum"
  
  dimensions = {
    FunctionName = each.value
  }
  
  alarm_actions = []  # Add SNS topic ARN here if needed
  
  tags = {
    Environment = var.environment
    Function    = each.key
  }
} 