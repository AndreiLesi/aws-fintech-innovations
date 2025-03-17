variable "user_pool_name" {
  description = "The name of the Cognito User Pool"
  type        = string
}

variable "client_name" {
  description = "The name of the Cognito User Pool Client"
  type        = string
}

variable "identity_pool_name" {
  description = "The name of the Cognito Identity Pool"
  type        = string
}

variable "environment" {
  description = "The environment (dev, staging, prod)"
  type        = string
} 