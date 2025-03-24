$api_key = "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"
$url = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli"

$headers = @{
    "Authorization" = "Bearer $api_key"
}

$body = @{
    "inputs" = "O mercado financeiro está em alta hoje."
    "parameters" = @{
        "candidate_labels" = @("economia", "política", "esportes")
    }
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ContentType "application/json"

$response | ConvertTo-Json -Depth 10
