# Deployment Guide

This guide provides instructions for deploying the Financial Dashboard application to AWS.

## Prerequisites

Before deploying the application, ensure you have the following prerequisites installed and configured:

- **AWS CLI**: Installed and configured with appropriate credentials
- **Terraform**: Version 1.0.0 or later
- **Node.js and npm**: Version 14.x or later
- **Git**: For version control

## Deployment Process Overview

The deployment process consists of the following steps:

1. Clone the repository
2. Deploy the infrastructure using Terraform
3. Build the frontend application
4. Deploy the frontend to S3
5. Verify the deployment

## Detailed Deployment Steps

### 1. Clone the Repository

First, clone the repository to your local machine:

1. Open a terminal window
2. Navigate to your desired directory
3. Clone the repository
4. Navigate to the project directory

### 2. Deploy the Infrastructure

Deploy the AWS infrastructure using Terraform:

1. Navigate to the Terraform directory for your desired environment
2. Initialize Terraform
3. Review the deployment plan
4. Apply the Terraform configuration
5. Note the outputs for later use

### 3. Configure the Frontend

Configure the frontend application with the deployed infrastructure details:

1. Navigate to the frontend directory
2. Create an environment file
3. Add the necessary configuration values from the Terraform outputs

### 4. Build the Frontend

Build the frontend application for production:

1. Install dependencies
2. Build the application

### 5. Deploy the Frontend

Deploy the built frontend to the S3 bucket:

1. Upload the build files to the S3 bucket
2. Ensure proper cache settings

### 6. Verify the Deployment

Verify that the application is working correctly:

1. Access the application using the CloudFront URL
2. Test user registration and login
3. Verify that the dashboard and other features are working correctly

## Automated Deployment

For convenience, an automated deployment script is provided:

1. Make the deployment script executable
2. Run the deployment script
3. Follow the prompts to complete the deployment

The script will:
- Check for required tools and AWS credentials
- Deploy the infrastructure using Terraform
- Update the frontend environment variables
- Build the frontend application
- Deploy the frontend to S3
- Display the deployment information

## Environment-Specific Deployments

The application supports multiple deployment environments:

### Development Environment

The development environment is used for testing new features:

1. Use the `dev` environment configuration
2. Deploy with development-specific settings
3. Enable additional logging and debugging

### Production Environment

The production environment is used for the live application:

1. Use the `prod` environment configuration
2. Deploy with production-specific settings
3. Enable additional security measures

## Troubleshooting

If you encounter issues during deployment, try the following troubleshooting steps:

### Infrastructure Deployment Issues

1. Check Terraform logs for errors
2. Verify AWS credentials
3. Ensure sufficient permissions

### Frontend Deployment Issues

1. Check S3 bucket permissions
2. Verify CloudFront distribution status
3. Check for build errors

### Application Issues

1. Check CloudWatch Logs for Lambda function errors
2. Verify Cognito user pool configuration
3. Test API endpoints directly

## Cleanup

To remove all deployed resources when they are no longer needed:

1. Navigate to the Terraform directory
2. Run the destroy command
3. Confirm the destruction

This will remove all AWS resources created for the application, including S3 buckets, Lambda functions, DynamoDB tables, and CloudFront distributions. 