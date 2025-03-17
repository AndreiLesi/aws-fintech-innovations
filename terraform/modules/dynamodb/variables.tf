variable "transactions_table_name" {
  description = "The name of the DynamoDB table for transactions"
  type        = string
}

variable "user_settings_table_name" {
  description = "The name of the DynamoDB table for user settings"
  type        = string
}

variable "environment" {
  description = "The environment (dev, staging, prod)"
  type        = string
  default     = "dev"
} 