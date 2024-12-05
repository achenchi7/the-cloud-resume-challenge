provider "aws" {
  region = "us-east-1"
}


/* Dynamodb resource*/
resource "aws_dynamodb_table" "visit-count-table-tr2" {
  name = "visitor-count-terraform2"
  hash_key = "id"
  billing_mode = "PROVISIONED"
  read_capacity = 5
  write_capacity = 5

  attribute {
    name = "id"
    type = "S"
  }
  
  tags = {
    key = "project"
    value = "crc"
  }
}

resource "aws_dynamodb_table_item" "table-items" {
  table_name = aws_dynamodb_table.visit-count-table-tr2.name
  hash_key = aws_dynamodb_table.visit-count-table-tr2.hash_key

  
  item = <<ITEM
{
  "id" : { "S" : "visitors-count" },
  "visitors" : { "N" : "1" }
}
ITEM
}

output "encoded_item" {
  value = jsonencode({
    id       = { "S" : "visitors-count" },
    visitors = { "N" : "1" }
  })
}

/*Lambda resource provisioning*/


resource "aws_iam_role" "lambda-role" {
  name               = "lambda-exec-role"
  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "sts:AssumeRole",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        }
      }
    ]
  })
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

resource "aws_iam_policy" "iam_policy_for_lambda" {
  name        = "tr-iam-policy-lambda"
  path        = "/"
  description = "This is an IAM policy for managing the lambda role"
  policy      = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem"
        ],
        "Resource": "arn:aws:dynamodb:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*"
      }

    ]
  })
}

resource "aws_iam_policy_attachment" "lambda-attach-policy-to-role" {
    name = "policy-attachment"
    policy_arn = aws_iam_policy.iam_policy_for_lambda.arn
    roles      = [aws_iam_role.lambda-role.name]
}

data "archive_file" "python-code" {
  type = "zip"
  source_dir = "${path.module}/lambda/"
  output_path = "${path.module}/lambda_func.zip"
}

resource "aws_lambda_function" "crc-lambda-func" {
    function_name = "page-count-function"
    filename = data.archive_file.python-code.output_path
    role = aws_iam_role.lambda-role.arn
    handler = "lambda_function.lambda_handler"
    runtime = "python3.9"
    depends_on = [ aws_iam_policy_attachment.lambda-attach-policy-to-role ]
    environment {
      variables = {
        databasename = "visitor-count-tr2"
      }
    }
}

/* API Gateway resource provisioning */


resource "aws_apigatewayv2_api" "visitor-count-crc-terraform" {
    name = "page-count-api-terraform"
    protocol_type = "HTTP"
    description = "POST API to update visitor count"

    cors_configuration {
      allow_credentials = false
      allow_headers = []
      allow_origins = [
        "https://jullyachenchi.com"
      ]
      allow_methods = [
        "GET",
        "POST"]
      max_age = 100
    } 
}

resource "aws_apigatewayv2_stage" "api-stage" {
    api_id = aws_apigatewayv2_api.visitor-count-crc-terraform.id
    name = "api-stage"
    auto_deploy = true
}




resource "aws_apigatewayv2_integration" "visitor-count-api-intergration" {
    api_id = aws_apigatewayv2_api.visitor-count-crc-terraform.id
    integration_uri = aws_lambda_function.crc-lambda-func.invoke_arn
    integration_type = "AWS_PROXY"
    integration_method = "POST"
}

resource "aws_apigatewayv2_route" "visitor-count-api-route" {
  api_id    = aws_apigatewayv2_api.visitor-count-crc-terraform.id
  route_key = "GET /countVisitors"
  target    = "integrations/${aws_apigatewayv2_integration.visitor-count-api-intergration.id}"
}

resource "aws_apigatewayv2_route" "visitor-count-api-route2" {
  api_id    = aws_apigatewayv2_api.visitor-count-crc-terraform.id
  route_key = "POST /countVisitors"
  target    = "integrations/${aws_apigatewayv2_integration.visitor-count-api-intergration.id}"
}

# Setting permission to invoke lambda function from
resource "aws_lambda_permission" "api-gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.crc-lambda-func.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.visitor-count-crc-terraform.execution_arn}/*"
}


output "apigw-public-url" {
  value = "${aws_apigatewayv2_stage.api-stage.invoke_url}/countVisitors"
}

